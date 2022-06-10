<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 品牌
                </el-breadcrumb-item>
                <el-breadcrumb-item>品牌管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                    <el-form-item label="商品名称：" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                     <el-form-item label="商品分类：" prop="name">
                            <el-cascader
                                v-model="selectProductCateValue"
                                :options="productCateOptions">
                            </el-cascader>
                    </el-form-item>
                    <el-form-item label="商品品牌：" prop="name">
                        <el-select v-model="form.brand_id" placeholder="商品品牌" class="handle-select mr10" clearable>
                                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in brand_lists"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品图片：" prop="logo">
                        <single-upload v-model="form.logo"  v-on:getRealUrl="testData" :dataFunc="'getRealUrl'"></single-upload>
                    </el-form-item>
                    <el-form-item label="商品库存：">
                        <el-input-number v-model="form.goods_number" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item label="商品售价：">
                        <el-input-number v-model="form.counter_price" :min="0"  :precision="2" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="市场价：">
                        <el-input-number v-model="form.retail_price" :min="0"  :precision="2" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="是否显示：">
                        <el-radio-group v-model="form.is_show">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="计量单位：">
                        <el-input v-model="form.goods_unit"></el-input>
                    </el-form-item>
                    <el-form-item label="排序：">
                        <el-input-number v-model="form.sort_order" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item label="品牌介绍：">
                        <el-input type="textarea" rows="5" v-model="form.simple_desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../common/bus';
import SingleUpload from '../common/SingleUpload.vue';
import {BrandAdd,BrandEdit,CategoryWithCHildren,BrandListIdName} from '../../api/index';
export default {
    name: 'baseform',
    components:{SingleUpload},
    data() {
        return {
            id:0,
            productCateOptions:[],
            selectProductCateValue:[],
            brand_lists:[],
            form: {
                id:0,
                name: '',
                simple_desc: '',
                is_show:1,
                logo:"",
                bigPic:"",
                realLogoUrl:"",
                realBigPicUrl:"",
                floor_price:0,
                sort_order:0,
                brand_id:null,
                counter_price:0,
                retail_price:0,
                goods_number:0,
            },
             rules: {
                name: [{ required: true, message: '请填写品牌名称', trigger: 'blur' }],
                logo: [{ required: true, message: '请上传品牌LOGO', trigger: 'blur' }],
                bigPic: [{ required: true, message: '请上传品牌专区大图', trigger: 'blur' }],
                floor_price: [{ required: true, message: '请输入最低价', trigger: 'blur' }],
            },
        };
    },
    //实例被激活时使用，用于重复激活一个实例的时候
    activated(){
        this.getProductCateList();
        this.getBrandLists();
        this.id = this.$route.query.id;
        if(this.id){
            this.getEdit(this.id);
        }
    
    },
    methods: {
        getBrandLists(){
            let self = this;
            BrandListIdName().then(res => {
                console.log(res);
                self.brand_lists = res.data;
            });
        },
        getProductCateList() {
            let self = this;
            CategoryWithCHildren().then(response => {
                let list = response.data;
                this.productCateOptions = [];
                for (let i = 0; i < list.length; i++) {
                        let children = [];
                        if (list[i].children != null && list[i].children.length > 0) {
                            for (let j = 0; j < list[i].children.length; j++) {
                                children.push({label: list[i].children[j].name, value: list[i].children[j].id});
                            }
                    }
                    this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
                }
            });
      },
        getEdit(id){
            let self = this;
            BrandEdit("/goods/brand/getBrand",{id:id}).then(res => {
                console.log(res);
                if(res.errno != 0){
                    slef.$message.error(res.errmsg);
                    return;
                }
                let data = res.data;
                self.form = {
                    id:data.id,
                    name: data.name,
                    simple_desc: data.simple_desc,
                    is_show:data.is_show,
                    logo:data.pic_url,
                    bigPic:data.list_pic_url,
                    realLogoUrl:"",
                    realBigPicUrl:"",
                    floor_price:data.floor_price,
                    sort_order:data.sort_order,
                }
            })
        },
        onSubmit() {
            let slef = this;
            this.$refs.form.validate(valid => {
                if (valid) {
                    BrandAdd("/goods/brand/createOrUpdate",this.form).then(res => {
                        console.log(res);
                        if(res.errno != 0){
                            slef.$message.error("操作失败");
                            return;
                        }
                        slef.$message.success("操作成功");
                        //创建或者编辑成功关闭当前标签页
                        bus.$emit("close_current_tags");
                    })
                } 
            });
        },
        testData(data){
            console.log("testData---->parent");
            console.log(data)
            this.form.realLogoUrl = data;
        },
        testDataTwo(data){
            console.log("testDataTwo---->parent");
            console.log(data)
            this.form.realBigPicUrl = data;
        }
    }
};
</script>