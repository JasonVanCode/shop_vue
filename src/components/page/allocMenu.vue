<template>
<div>
<div class="crumbs">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>
            <i class="el-icon-lx-calendar"></i> 角色
        </el-breadcrumb-item>
        <el-breadcrumb-item>菜单分配</el-breadcrumb-item>
    </el-breadcrumb>
</div>
 <div class="container">
  <el-card class="box-card" shadow="never">
      <el-tree
        ref="tree"
        :data="data"
        default-expand-all
        show-checkbox
        node-key="id"
        :props="defaultProps">
    </el-tree>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">重制</el-button>
    </div>
  </el-card>
 </div>
</div>
</template>

<script>
import { MenuTreeLists,RoleInfo,RoleAlloc} from '../../api/index';

  export default {
    name: "allocMenu",
    data() {
      return {
        menuTreeList: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        roleId:null,
        data: [],
        roleInfo:{},
        oldCheckedIds:[]
      };
    },
    created() {
      this.roleId = this.$route.query.id;
      this.treeList();
      if(this.roleId > 0){
        this.getRoleInfo()
      }
    //   this.getRoleMenu(this.roleId);
    },
    methods: {
        getRoleInfo(){
            let self = this;
            RoleInfo("/role/getRole",{id:this.roleId}).then(res => {
                self.roleInfo = res.data;
                if(res.errno != 0 || self.roleInfo.id != self.roleId){
                    self.$message.error('该角色信息不存在');
                    return;
                }
                self.oldCheckedIds = self.roleInfo.url.split(",");
                self.$refs.tree.setCheckedKeys(self.oldCheckedIds);
            });
        },
        treeList(){
            let self = this;
            MenuTreeLists("/menu/getAllocMenuLists").then(res => {
                console.log(res);
                self.data = res.data;
            });
        },
        handleSave(){
            let self = this;
            //判断角色
            if(self.roleId != self.roleInfo.id){
                self.$message.error('该角色信息不存在');
                return;
            }
            let saveMenuIds = self.$refs.tree.getCheckedKeys()
            if(saveMenuIds.length == 0){
                self.$message.error('请选择菜单');
                return;
            }
            let ids = saveMenuIds.join(",");
            RoleAlloc("/role/allocMenus",{ids:ids,roleId:parseInt(self.roleId)}).then(res => {
                console.log(res); 
                if(res.errno != 0){
                    self.$message.error(res.errmsg);
                    return;
                }
                self.$message.success("添加成功");
                setTimeout(function(){
                    self.$router.push('/role');
                }, 2000 )
            });
        },
        handleClear(){
            this.$refs.tree.setCheckedKeys(this.oldCheckedIds);
        }
    }
  }
</script>