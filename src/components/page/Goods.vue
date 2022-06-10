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
                <el-input v-model="query.name" placeholder="商品名" class="handle-input mr10" style="width:180px;"></el-input>
                <el-input v-model="query.goods_no" placeholder="商品货号" class="handle-input mr10" style="width:180px;"></el-input>
                <el-select v-model="query.brand_id" placeholder="商品品牌" class="handle-select mr10" clearable>
                    <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in brand_lists"></el-option>
                </el-select>
                <el-select v-model="query.cat_id" placeholder="商品分类" class="handle-select mr10" clearable>
                    <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in cat_lists"></el-option>
                </el-select>
                  <el-select v-model="query.is_on_sale" placeholder="上架状态" class="handle-select mr10" clearable>
                        <el-option label="在售" :value="1"></el-option>
                        <el-option label="下架" :value="0"></el-option>
                </el-select>
                <!-- <el-input v-model="query.name" placeholder="上架状态" class="handle-input mr10" style="width:180px;"></el-input> -->
                <!-- <el-input v-model="query.name" placeholder="审核状态" class="handle-input mr10" style="width:180px;"></el-input> -->
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
                <el-table-column label="商品图片"  align="center">
                     <template slot-scope="scope"><img style="height: 80px" :src="scope.row.primary_pic_url"></template>
                </el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.name}}</p>
                        <p>品牌：{{scope.row.brand_id}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="价格/货号" width="120" align="center">
                <template slot-scope="scope">
                    <p>价格：￥{{scope.row.retail_price}}</p>
                    <p>货号：{{scope.row.goods_sn}}</p>
                </template>
                </el-table-column>
                <el-table-column label="标签" width="140" align="center">
                    <template slot-scope="scope">
                        <p>上架：
                        <el-switch
                            @change="handlePublishStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.is_on_sale">
                        </el-switch>
                        </p>
                        <p>新品：
                        <el-switch
                            @change="handleNewStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.is_new">
                        </el-switch>
                        </p>
                        <p>热门：
                        <el-switch
                            @change="handleHotStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.is_hot">
                        </el-switch>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="排序"  align="center" prop="sort_order"></el-table-column>
                <el-table-column label="销量" width="100" align="center" prop="sell_volume">
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
import { UserDel,UserStatusChange,BrandList,GoodsList,GoodsStatusChange} from '../../api/index';

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
                goods_no:null,
                brand_id:null,
                cat_id:null,
                is_on_sale:null,
            },
            tableData: [],
            brand_lists:[],
            cat_lists:[],
            multipleSelection: [],
            delList: [],
            id: -1,
            };
    },
    created() {
        this.getData();
    },
    methods: {
        //更新上架下架的状态
        handlePublishStatusChange(index,row){
            console.log();
            this.updateStatus(1,row);
        },
        //更新是否新产品状态
        handleNewStatusChange(index,row){
            this.updateStatus(2,row);
        },
        //更新是否热门状态
        handleHotStatusChange(index,row){
            this.updateStatus(3,row);
        },
        updateStatus(type,row){
            let self = this;
            let data = {
                        id:row.id,
                        is_on_sale:row.is_on_sale,
                        is_new:row.is_new,
                        is_hot:row.is_hot,
                        type:type
                    };
            GoodsStatusChange(data).then(res => {
                if(res.errno != 0){
                    self.$message.error("获取数据失败");
                    return;
                }
                self.$message.success("修改成功");
            });
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            let self = this;
            GoodsList({
                page:self.query.page,
                size:self.query.size,
                name:self.query.name,
                goods_no:self.query.goods_no,
                brand_id:self.query.brand_id,
                cat_id:self.query.cat_id,
                is_on_sale:self.query.is_on_sale,
                }).then(res => {
                    console.log(res);
                    if(res.errno != 0){
                        self.$message.error("获取数据失败");
                        return;
                    }
                    let tableData =  res.data.data.data;
                    self.brand_lists = res.data.brand_lists;
                    self.cat_lists = res.data.cat_lists;
                    self.tableData = tableData
                    console.log(res.data);
                    self.query.page = res.data.data.currentPage;
                    self.query.size = res.data.data.pageSize;
                    self.query.total = res.data.data.count;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.query.page = 1;
            console.log(this.query);
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

