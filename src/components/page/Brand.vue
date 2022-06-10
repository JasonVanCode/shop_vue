<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 品牌列表
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
                <el-table-column prop="name" label="品牌名称"  align="center"></el-table-column>
                <el-table-column label="排序"  align="center" prop="sort_order"></el-table-column>
                <el-table-column  label="是否显示"  align="center">
                     <template slot-scope="scope">
                            <el-switch
                            v-model="scope.row.is_show"
                            @change="changeStatus(scope.row)"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                            </el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="相关"  align="center">
                    <template slot-scope="scope">
                        <span>商品：</span>
                        <el-button
                        size="mini"
                        type="text"
                        >{{scope.row.goods_counts}}
                        </el-button>&nbsp;
                        <span>评价：</span>
                        <el-button
                        size="mini"
                        type="text"
                       >{{scope.row.comments_counts}}
                    </el-button>
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
    </div>
</template>

<script>
import { UserList,UserAdd,UserDel,UserStatusChange,RoleListIdName,UserAddRole,BrandList} from '../../api/index';

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
            BrandList("/goods/brand/index",{page:self.query.page,size:self.query.size,name:self.query.name}).then(res => {
                console.log(res);
                if(res.errno != 0){
                    self.$message.error(`删除了${str}`);
                    return;
                }
                res.data.data.map(v => {
                     v.is_show = v.is_show == 1 ?true:false;
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
        //新增品牌
        add(){
            this.$router.push('/brandHandle');
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
            console.log(row);
            this.$router.push({
                path: `/brandHandle`,
                query: {
                    id: row.id,
                },
            });
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
