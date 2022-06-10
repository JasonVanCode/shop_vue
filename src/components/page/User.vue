<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addUser()">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="编号" width="55" align="center">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="账号"  align="center"></el-table-column>
                <el-table-column label="昵称"  align="center" prop="nickname"></el-table-column>
                <el-table-column prop="address" label="最后登录"  align="center"></el-table-column>
                <el-table-column  label="是否启用"  align="center">
                     <template slot-scope="scope">
                            <el-switch
                            v-model="scope.row.status"
                            @change="changeStatus(scope.row)"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                            </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="注册时间"  align="center">
                    <template slot-scope="scope">
                         {{$moment(scope.row.created_time).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                   <el-table-column label="修改时间"  align="center">
                    <template slot-scope="scope">
                         {{$moment(scope.row.update_time).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                          <el-button
                            type="text"
                            @click="changeRole(scope.row)"
                        >分配角色</el-button>
                        <el-button
                            type="text"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.size"
                    :total="query.total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="!formData.id?'新增角色':'编辑角色'" :visible.sync="editVisible" width="30%">
            <el-form ref="user" :model="formData" label-width="70px" :rules="rules">
                <el-form-item label="账号：" prop="username">
                    <el-input v-model="formData.username"></el-input>
                </el-form-item>
                 <el-form-item label="昵称："  prop="nickname">
                    <el-input v-model="formData.nickname"></el-input>
                </el-form-item>
                <el-form-item label="密码："  prop="password">
                    <el-input v-model="formData.password" type="password"></el-input>
                </el-form-item>
                    <el-form-item label="确认密码："  prop="rePassword">
                    <el-input v-model="formData.rePassword" type="password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色 -->
           <el-dialog title="角色分配" :visible.sync="roleVisible" width="30%">
            <el-form label-width="70px" :rules="roleRules" :model="roleFormData" ref="role">
                <el-form-item label="角色：" prop="roleIds">
                      <el-select v-model="roleFormData.roleIds" placeholder="请选择" clearable multiple>
                        <el-option
                        v-for="item in roleLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRole">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { UserList,UserAdd,UserDel,UserStatusChange,RoleListIdName,UserAddRole} from '../../api/index';

// import moment from 'moment'
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                name: '',
                page: 1,
                size: 10,
                total:0,
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            roleVisible:false,
            pageTotal: 0,
            form:{},
            formData: {
                id:null,
                username:null,
                nickname:null,
                password:null,
                rePassword:null,
            },
             rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                rePassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
            },
            roleFormData:{
                id:null,
                roleIds:[]
            },
            roleRules:{
                 roleIds:[{ required: true, message: '请选择角色', trigger: 'blur' }],       
            },
            idx: -1,
            id: -1,
            roleLists:[],
            };
    },
    created() {
        this.getData();
        this.getRoleLists();
    },
    methods: {
        getRoleLists(){
            let self = this;
            RoleListIdName("/role/listIdName").then(res => {
                console.log(res);
                if(res.errno == 0 ){
                    self.roleLists = res.data;
                    console.log(self.roleLists);
                }
            });
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            let self = this;
            UserList("/user/index",{page:self.query.page,size:self.query.size,name:self.query.name}).then(res => {
                console.log(res);
                if(res.errno != 0){
                    self.$message.error(`删除了${str}`);
                    return;
                }
                res.data.data.map(v => {
                     v.status = v.status == 1 ?true:false;
                });
                self.tableData = res.data.data
                self.$set(self.query, 'page', res.data.currentPage);
                self.$set(self.query, 'size', res.data.pageSize);
                self.$set(self.query, 'total', res.data.count);
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        //新增用户
        addUser(){
            let self = this;
            self.formData =  {
                id:null,
                username:null,
                nickname:null,
                password:null,
                rePassword:null,
            },
            console.log("self.formData",self.formData);
            self.editVisible = true;
        },
        // 删除操作
        handleDelete(index, row) {
            let self = this;
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    UserDel("/user/del",{id:String(row.id)}).then(res => {
                        if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        self.$message.success("删除成功");
                    })
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            let self = this;
            const length = self.multipleSelection.length;
            if (length == 0){
                 self.$message.error("请选择要删除的数据");
                return
            }
            let ids = []
            self.multipleSelection.map(v => {
                ids.push(v.id);
            });
            self.$confirm('是否要删除数据？', '提示', {
                type: 'warning'
            }).then(() => {
                   UserDel("/user/del",{id:ids.join(",")}).then(res => {
                        if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        self.multipleSelection = [];
                        self.getData();
                        self.$message.success("删除成功");
                    })
            });
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            console.log(row);
            // this.form = row;
            this.formData =  {
                id:row.id,
                username:row.username,
                nickname:row.nickname,
                password:null,
                rePassword:null,
            },
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            let self = this;
            self.$refs.user.validate(valid => {
                if(valid){
                    UserAdd("/user/add",self.formData).then(res => {
                        console.log(res);
                        if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        self.getData();
                        self.editVisible = false;
                    });
                }
             })
        },

        changeStatus(row){
            let self = this;
            // 二次确认删除
            let status = row.status == 1?0:1;
            this.$confirm('是否修改账号状态？', '提示', {
                type: 'warning'
            }).then(() =>{
                UserStatusChange("/user/changeStatus",{id:row.id,status:status}).then(res => {
                     if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        row.status = row.status == 1?0:1;
                        self.$message.success("修改成功");
                });
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
        },
        //分配角色
        changeRole(row){
            let self = this;
            let roleIds = row.role.split(",").map(Number);
            self.roleFormData.id = row.id;
            self.roleFormData.roleIds = roleIds;
            self.roleVisible = true;  
        },
        saveRole(){
             let self = this;
             self.$refs.role.validate(valid => {
                if(valid){
                    let data = {id:self.roleFormData.id,roleIds:self.roleFormData.roleIds.join(",")};
                    UserAddRole("/user/changeRole",data).then(res => {
                        if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        self.getData();
                        self.roleVisible = false;  
                        self.$message.success("修改成功");
                    });
               
                }
             })
        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
