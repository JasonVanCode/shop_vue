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
                    <el-form-item label="品牌名称：" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌LOGO：" prop="logo">
                        <single-upload v-model="form.logo"  v-on:getRealUrl="testData" :dataFunc="'getRealUrl'"></single-upload>
                    </el-form-item>
                    <el-form-item label="品牌专区大图：" prop="bigPic">
                        <single-upload v-model="form.bigPic"  v-on:getRealUrlTwo="testDataTwo" :dataFunc="'getRealUrlTwo'"></single-upload>
                    </el-form-item>
                    <el-form-item label="是否显示：">
                        <el-radio-group v-model="form.is_show">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="最低价：" prop="floor_price">
                        <el-input-number v-model="form.floor_price" :precision="2" :step="0.1" ></el-input-number>
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
import {BrandAdd,BrandEdit} from '../../api/index';
export default {
    name: 'baseform',
    components:{SingleUpload},
    data() {
        return {
            id:0,
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
      this.id = this.$route.query.id;
      if(this.id){
          this.getEdit(this.id);

      }
    },
    methods: {
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