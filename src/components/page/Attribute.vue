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
                <el-input v-model="name" placeholder="用户名" class="handle-input mr10"></el-input>
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
                <el-table-column label="分类名称"  align="center">
                    {{cateInfo.name}}
                </el-table-column>
                <el-table-column prop="name" label="属性"  align="center"></el-table-column>
                <el-table-column label="排序"  align="center" prop="sort_order"></el-table-column>
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
        </div>

            <!-- 分配属性 -->
           <el-dialog title="属性分配" :visible.sync="visible" width="35%">
            <el-form label-width="80px" :rules="rules" :model="formData" ref="attr">
              <el-form-item label="属性名："  prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input-number v-model="formData.sort_order" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
       
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {AttributeList,AttributeAdd,AttributeDel} from '../../api/index';

// import moment from 'moment'
export default {
    name: 'basetable',
    data() {
        return {
            name:null,
            tableData: [],
            multipleSelection: [],
            delList: [],
            id: -1,
            cateId:null,
            cateInfo:{},
            visible:false,
            formData:{
                id:0,
                name : "",
                sort_order:0,
                attribute_category_id:0,
            },
            rules:{
                name: [{ required: true, message: '请输入属性名', trigger: 'blur' }],
            }
            };
    },
    created() {
        this.cateId = this.$route.query.cateId;
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            let self = this;
            AttributeList("/goods/category/attribute",{cateId:self.cateId,name:self.name}).then(res => {
                if(res.errno != 0){
                    self.$message.error(`数据获取失败`);
                    return;
                }
                self.cateInfo = res.data.category_info;
                self.tableData = res.data.attribute_lists;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
        //新增品牌
        add(){
            this.formData = {
                id:0,
                name : "",
                sort_order:0,
                attribute_category_id: parseInt(this.cateId),
            };
            this.visible = true;
        },
        // 删除操作
        handleDelete(index, row) {
            let self = this;
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    AttributeDel("/goods/attribute/del",{id:String(row.id)}).then(res => {
                        // if(res.errno != 0){
                        //     self.$message.error(res.errmsg);
                        //     return;
                        // }
                        // self.$message.success("删除成功");
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
                   AttributeDel("/goods/attribute/del",{id:ids.join(",")}).then(res => {
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
                this.formData = {
                id:row.id,
                name : row.name,
                sort_order:row.sort_order,
                attribute_category_id: parseInt(row.attribute_category_id),
            };
            this.visible = true;

        },
        save(){
            let self = this;
             self.$refs.attr.validate(valid => {
                if(valid){
                    AttributeAdd("/goods/attribute/createOrUpdate",self.formData).then(res => {
                        console.log(res);
                        if(res.errno != 0){
                            self.$message.error(res.errmsg);
                            return;
                        }
                        self.getData();
                        self.visible = false;  
                        self.$message.success("操作成功");
                    });
               
                }
             })
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
