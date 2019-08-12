<template>
    <div>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <el-tree
        class="filter-tree"
        :data="menuInfoList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        @node-contextmenu="updateMenu"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>

      <!--弹出框-->
      <el-dialog :title="tableName" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="formEntity" label-width="200px" size="mini">
          <el-button type="primary" @click="toAdd()" icon="el-icon-plus" plain circle></el-button>
          <el-button type="primary" @click="toUpdate()" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" @click="toDelete()" icon="el-icon-delete" circle></el-button>
          <el-button type="warning" icon="el-icon-star-off" circle></el-button>
          <el-divider></el-divider>

          <template v-if="dialogFormVisible02">
            <el-form-item label="当前菜单ID：">
              {{formEntity.id}}
            </el-form-item>
            <el-form-item label="当前菜单等级：">
              {{formEntity.leval}}
            </el-form-item>
            <el-form-item label="当前菜单名称：">
              {{formEntity.menuName}}
            </el-form-item>
            <el-form-item label="当前菜单URL：">
              {{formEntity.url}}
            </el-form-item>
          </template>

          <template>
            <el-form-item :hidden="addHidden" v-if="formEntity.leval!==4" label="新添加子菜单名称">
              <el-input v-model="form.menuNameadd"></el-input>
            </el-form-item>
            <el-form-item :hidden="addHidden" label="菜单访问URL">
              <el-input  v-model="form.urladd"></el-input>
            </el-form-item>
            <el-form-item :hidden="updateHidden" label="修改菜单名称">
              <el-input v-model="form.menuName"></el-input>
            </el-form-item>
            <el-form-item :hidden="updateHidden" label="菜单访问URL">
              <el-input v-model="form.url"></el-input>
            </el-form-item>
          </template>

          <el-form-item :hidden="deleteHidden" label="">
            你确定删除此条数据吗？
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
</template>

<script>
    export default {
      name: "menuList",
      watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
      },
      data(){
        return{
          checkbox: false,
          filterText: '',
          menuInfoList: [],
          defaultProps: {
            children: 'menuInfoList',
            label: 'menuName',
            code: 'leval',
            isLeaf: 'leaf'
          },
          form:{},
          formEntity:{},
          tableName: '',
          dialogFormVisible:false,
          dialogFormVisible02: true,
          c: true,
          addHidden:true,
          updateHidden:true,
          deleteHidden:true
        }
      },
      mounted(){
        this.getMenuList();
      },
      methods:{
        getMenuList(){
          this.$axios.post(this.domain.serverpath+"getMenuList").then((response)=>{
            this.menuInfoList = response.data;
          });
        },
        updateMenu(event,data,node,ha){  //共四个参数，依次为：event、传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。

          this.updateHidden = true
          this.addHidden = true
          this.formEntity = data
          this.tableName = '权限详情'
          this.dialogFormVisible = true
        },
        filterNode(value, data) {
          console.log(data)
          if (!value) return true;
          return data.menuName.indexOf(value) !== -1;
        },
        save(){
          //点击保存按钮时
          let uurl = "";
          if(this.addHidden==false){
            uurl = this.domain.serverpath + "addMenu"
            this.form.menuName=this.formEntity.menuNameadd;
            this.form.parentId = this.formEntity.id
            this.form.leval = this.formEntity.leval+1
            this.form.url=this.form.urladd;
          }
          if(this.updateHidden==false){
            uurl = this.domain.serverpath + "updateMenu"
          }
          if(this.deleteHidden==false){
            uurl = this.domain.serverpath + "deleteMenu"
          }
          console.log(this.form)
          this.dialogFormVisible=false
          this.$axios.post(uurl,this.form).then((response) => {
            if(response.data.code==200){
              this.getMenuList();
              this.$message({
                message: response.data.success,
                type: 'success'
              });
            }else {
              this.$message.error(response.data.error);
            }
          }).catch((err) => {
            this.$message.error('您无此操作权限！');
          })
        },
        close(){
          //点击关闭按钮时
          this.form={};
          this.dialogFormVisible=false;
        },
        toDelete(){
          //点击删除图标时
          this.tableName = '权限删除'
          if(this.formEntity.leval!=4){
            alert("对不起,只能删除4级权限...")
          }else {
            this.form=this.formEntity
            this.updateHidden=true;
            this.deleteHidden=false;
            this.addHidden=true;
          }
        },
        toUpdate(){
          //点击修改图标时
          this.tableName = '权限修改'
          this.form=this.formEntity
          this.updateHidden=false;
          this.deleteHidden=true;
          this.addHidden=true;
        },
        toAdd(){    //点击添加图标时
          this.tableName = '权限添加'
          this.form = {}
          this.dialogFormVisible02 = false
          this.deleteHidden=true
          this.initCRUD();
        },
        initCRUD(){   //初始化菜单权限显示
          if(this.formEntity.leval==4){
            alert("对不起,4级权限不能添加子权限")
            this.dialogFormVisible02 = true
          }else {
            this.form = {}
            this.updateHidden=true;
            this.deleteHidden=true;
            this.addHidden=false;
          }
        }
      }
    }
</script>

<style scoped>

</style>
