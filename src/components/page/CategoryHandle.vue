<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 分类
                </el-breadcrumb-item>
                <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                    <el-form-item label="分类名称：" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="上级分类：">
                      <el-select v-model="form.parent_id" placeholder="请选择" clearable>
                        <el-option
                        v-for="item in topLists"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                    <el-form-item label="LOGO：" prop="icon_url">
                        <single-upload v-model="form.icon_url"  v-on:getRealUrl="testData" :dataFunc="'getRealUrl'"></single-upload>
                    </el-form-item>
                    <el-form-item label="分类专区图：" prop="wap_banner_url">
                        <single-upload v-model="form.wap_banner_url"  v-on:getRealUrlTwo="testDataTwo" :dataFunc="'getRealUrlTwo'"></single-upload>
                    </el-form-item>
                    <el-form-item label="是否显示：">
                        <el-radio-group v-model="form.is_show">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="排序：">
                        <el-input-number v-model="form.sort_order" :min="0"></el-input-number>
                    </el-form-item>
                    <el-form-item label="关键词：">
                        <el-input v-model="form.front_name"></el-input>
                    </el-form-item>
                         <el-form-item label="分类描述：">
                        <el-input type="textarea" rows="5" v-model="form.front_desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存</el-button>
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
import {BrandAdd,BrandEdit,CategoryListIdName,CategoryAdd} from '../../api/index';
export default {
    name: 'baseform',
    components:{SingleUpload},
    data() {
        return {
            id:0,
            topLists:[],
            form: {
                id:0,
                name: '',
                front_name: '',
                front_desc: '',
                is_show:1,
                sort_order:0,
                parent_id:0,
                wap_banner_url:"",
                real_wap_banner_url:"",
                icon_url:"",
                real_icon_url:"",
            },
             rules: {
                name: [{ required: true, message: '请填写品牌名称', trigger: 'blur' }],
                icon_url: [{ required: true, message: '请上传分类LOGO', trigger: 'blur' }],
                wap_banner_url: [{ required: true, message: '请上传分类专区大图', trigger: 'blur' }],
            },
        };
    },
    //实例被激活时使用，用于重复激活一个实例的时候
    activated(){
      this.id = this.$route.query.id;
      this.getTopLists();
      if(this.id){
          this.getEdit(this.id);

      }
    },
    mounted(){
     this.id = this.$route.query.id;
      this.getTopLists();
      if(this.id){
          this.getEdit(this.id);

      }
    },
    methods: {
        getTopLists(){
            let self = this;
            CategoryListIdName("/goods/category/listIdName").then(res => {
                console.log(res);
                if(res.data && res.data.length > 0){
                    self.topLists = res.data;                   
                    self.topLists.unshift({id:0,name:"无上级分类"})
                }
            });
        },
        getEdit(id){
            let self = this;
            BrandEdit("/goods/category/getCategory",{id:id}).then(res => {
                console.log(res);
                if(res.errno != 0){
                    slef.$message.error(res.errmsg);
                    return;
                }
                let data = res.data;
                self.form = {
                    id:data.id,
                    name: data.name,
                    front_name: data.front_name,
                    front_desc: data.front_desc,
                    is_show:data.is_show,
                    sort_order:data.sort_order,
                    parent_id:data.parent_id,
                    wap_banner_url:data.wap_banner_url,
                    icon_url:data.icon_url,
                }
            })
        },
        onSubmit() {
            let slef = this;
            this.$refs.form.validate(valid => {
                if (valid) {
                    CategoryAdd("/goods/category/createOrUpdate",this.form).then(res => {
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
            this.form.real_icon_url = data;
        },
        testDataTwo(data){
            console.log("testDataTwo---->parent");
            console.log(data)
            this.form.real_wap_banner_url = data;
        }
    }
};
</script>