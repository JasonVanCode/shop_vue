<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品分类列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
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
            >
                <el-table-column prop="id" label="编号" width="55" align="center">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="分类名称"  align="center"></el-table-column>
                <el-table-column label="级别"  align="center" prop="sort_order">
                     <template slot-scope="scope">
                          {{getLevel(scope.row)}}
                    </template>
                ></el-table-column>
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
                <el-table-column label="设置" width="200" align="center">
                    <!-- @click="handleShowNextLevel(scope.$index, scope.row)" -->
                     <!-- @click="handleTransferProduct(scope.$index, scope.row)" -->
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleShowNextLevel(scope.row)"
                    >{{scope.row.parent_id == 0?'查看下级':'查看上级'}}
                    </el-button>
                     <el-button
                    size="mini"
                    :disabled="scope.row.parent_id == 0"
                    @click="handleShowAttribute(scope.row)"
                    >查看属性
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
import { CategoryList,CategoryDel,UserStatusChange} from '../../api/index';

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
                pid:0,
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
            CategoryList("/goods/category/index",{page:self.query.page,size:self.query.size,name:self.query.name,pid:self.query.pid}).then(res => {
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
            this.$router.push('/categoryHandle');
        },
        // 删除操作
        handleDelete(index, row) {
            let self = this;
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    CategoryDel("/goods/category/del",{id:row.id}).then(res => {
                        if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        self.$message.success("删除成功");
                    })
                })
                .catch(() => {});
        },
        // 编辑操作
        handleEdit(index, row) {
            console.log(row);
            this.$router.push('/categoryHandle?id='+row.id);
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
        handleShowNextLevel(row){
            //分类只有2层
            this.$set(this.query, 'pid', row.parent_id == 0 ?row.id:0);
            this.$set(this.query, 'page',1);
            this.getData();
        },
        getLevel(row){
            switch (row.level) {
                case "L1":
                    return "一级";
                case "L2":
                    return "二级";
                default:
                    return "";
            }
        },
        handleShowAttribute(row){
            this.$router.push("/attribute?cateId="+row.id);
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
