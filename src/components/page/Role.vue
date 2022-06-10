<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色列表
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
                <el-button type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
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
                <el-table-column prop="name" label="角色名称"  align="center"></el-table-column>
                <el-table-column  prop="description" label="描述"  align="center"></el-table-column>
                <el-table-column prop="num_of_users" label="用户数"  align="center"></el-table-column>
                    <el-table-column label="添加时间"  align="center">
                    <template slot-scope="scope">
                         {{$moment(scope.row.created_time).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
                   <el-table-column label="修改时间"  align="center">
                    <template slot-scope="scope">
                         {{$moment(scope.row.update_time).format('YYYY-MM-DD HH:mm:ss')}}
                    </template>
                </el-table-column>
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
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="changeMenu(scope.row)"
                        >分配菜单</el-button>
                        <el-button
                            type="text"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                  
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
            <el-form ref="user" :model="formData" label-width="100px" :rules="rules">
                <el-form-item label="角色名称：" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                 <el-form-item label="描述：">
                     <el-input
                        type="textarea"
                        :rows="8"
                        placeholder="请输入内容"
                        v-model="formData.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否启用："  prop="status">
                    <el-radio v-model="formData.status" :label="1">是</el-radio>
                    <el-radio v-model="formData.status" :label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { RoleList,RoleAdd,RoleStatusChange,RoleDel} from '../../api/index';

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
            pagination:{
                page:1,
                size:10,
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
                name:null,
                description:null,
                status:null,
            },
             rules: {
                name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
            },
            roleFormData:{
                roleId:null
            },
            roleRules:{
                 roleId:[{ required: true, message: '请选择角色', trigger: 'blur' }],       
            },
            idx: -1,
            id: -1,
            };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            let self = this;
            RoleList("/role/index",{page:self.query.page,size:self.query.size,name:self.query.name}).then(res => {
                console.log(res);
                if(res.errno != 0){
                    self.$message.error("获取数据失败");
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
        add(){
            let self = this;
            self.formData =  {
                id:null,
                name:null,
                description:null,
                status:1,
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
                    RoleDel("/role/del",{id:String(row.id)}).then(res => {
                        if(res.errno != 0){
                            self.$message.error("删除失败");
                            console.log(res.errmsg);
                            return;
                        }
                        self.getData();
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
                   RoleDel("/role/del",{id:ids.join(",")}).then(res => {
                        if(res.errno != 0){
                            console.log(res.errmsg);
                            self.$message.error("删除失败");
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
            this.formData =  {
                id:row.id,
                name:row.name,
                description:row.description,
                status:row.status == true?1:0,
            },
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            let self = this;
            self.$refs.user.validate(valid => {
                if(valid){
                    RoleAdd("/role/createOrUpdate",self.formData).then(res => {
                        console.log(res);
                        if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        self.$message.success("添加成功");
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
                RoleStatusChange("/role/changeStatus",{id:row.id,status:status}).then(res => {
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
        //分配
        changeMenu(row){
            this.$router.push('/allocMenu?id='+row.id);
        }
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
