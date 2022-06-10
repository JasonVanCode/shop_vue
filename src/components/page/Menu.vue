<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜单列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="菜单名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="编号" width="55" align="center">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="菜单名称"  align="center"></el-table-column>
                <el-table-column label="菜单级数"  align="center">

                    <template slot-scope="scope">{{levelFilter(scope.row.level)}}</template>
                </el-table-column>
                <el-table-column label="前端图标"  align="center">
                    <template slot-scope="scope"><i :class="scope.row.icon"></i></template>
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
                   <el-table-column label="设置"  align="center">
                    <template slot-scope="scope">  
                        <el-button
                            type="text"
                            @click="getLevelMenuList(scope.row)"
                        >{{scope.row.parent_id == 0?"查看下级":"查看上级"}}</el-button>
                    </template>
                </el-table-column>
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
             
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                        > <router-link target="_blank" :to="{path:'/icon'}">图标</router-link></el-button>
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
        <el-dialog :title="!formData.id?'新增菜单':'编辑菜单'" :visible.sync="editVisible" width="40%">
            <el-form ref="user" :model="formData" label-width="100px" :rules="rules">
                <el-form-item label="菜单名称：" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单：">
                      <el-select v-model="formData.parent_id" placeholder="请选择" clearable>
                        <el-option
                        v-for="item in topMenuLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否显示："  >
                    <el-radio v-model="formData.status" :label="1">是</el-radio>
                    <el-radio v-model="formData.status" :label="0">否</el-radio>
                </el-form-item>
                 <el-form-item label="前端图标：" v-if="formData.parent_id == 0" prop="icon">
                    <el-input v-model="formData.icon" ></el-input><i :class="formData.icon"></i>    
                </el-form-item>
                <el-form-item label="排序：" >
                     <el-input-number v-model="formData.sort" :min="0" label="描述文字"></el-input-number>
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
import { MenuList,MenuListIdName,MenuAdd,MenuDel} from '../../api/index';

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
                level:1,
                parent_id:0,
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            formData: {
                id:null,
                name:null,
                status:1,
                sort:0,
                parent_id:0,
                icon:"",
            },
             rules: {
                name: [{ required: true, message: '请填写菜单名', trigger: 'blur' }],
                icon: [{ required: true, message: '请填写图标', trigger: 'blur' }],
            },
            topMenuLists:[],
            idx: -1,
            id: -1,
            };
    },
    created() {
        this.getData();
        this.getTopMenuLists();
    },
    methods: {
        getTopMenuLists(){
            let self = this;
            MenuListIdName("menu/listIdName").then(res => {
                console.log(res);
                self.topMenuLists = res.data;
                self.topMenuLists.unshift({id:0,name:"无上级菜单"});
            });
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            let self = this;
            MenuList("/menu/index",{
                    page:self.query.page,
                    size:self.query.size,
                    name:self.query.name,
                    level:self.query.level,
                    parent_id:self.query.parent_id
                }).then(res => {
                if(res.errno != 0){
                    self.$message.error("获取数据失败");
                    return;
                }
                res.data.data.map(v => {
                     v.status = v.status == 1 ?true:false;
                });
                self.tableData = res.data.data;
                console.log(self.tableData);
                self.$set(self.query, 'page', res.data.currentPage);
                self.$set(self.query, 'size', res.data.pageSize);
                self.$set(self.query, 'total', res.data.count);
            });
        },
        getLevelMenuList(row){
            let self = this;
            self.$set(self.query, 'page', 1);
            self.$set(self.query, 'size', 10);
            if(row.parent_id == 0 ){
                self.$set(self.query, 'parent_id', row.id);
            }else{
                self.$set(self.query, 'parent_id', 0);
            }
            self.getData();
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        //新增
        add(){
            let self = this;
            self.formData = {
                id:null,
                name:null,
                status:1,
                sort:0,
                parent_id:0,
                icon:"",
            };
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
                    MenuDel("/menu/del",{id:row.id}).then(res => {
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
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            console.log(row);
            this.formData =  {
                id:row.id,
                name:row.name,
                status:row.status == true?1:0,
                sort:row.sort_id,
                parent_id:row.parent_id,
                icon:row.icon
            },
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            let self = this;
            self.$refs.user.validate(valid => {
                if(valid){
                    MenuAdd("/menu/createOrUpdate",self.formData).then(res => {
                        console.log(res);
                        if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        self.$message.success("添加成功");
                        self.editVisible = false;
                        self.getData();
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
        levelFilter(value) {
            if (value === 1) {
                return '一级';
            } else if (value === 2) {
                return '二级';
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
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
