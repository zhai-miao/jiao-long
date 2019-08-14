<template>
    <div>

      <!--搜索框开始-->
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="角色名称">
            <el-input v-model="formInline.roleName" placeholder="输入角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addRole" style="margin-right: -150px">添加角色</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--搜索框结束-->

      <el-table
        ref="multipleTable"
        :data="roleData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="id"
          label="角色编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          show-overflow-tooltip>

          <!--划入详情框开始-->
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>角色名称: {{ scope.row.roleName }}</p>
              <p>角色描述: {{ scope.row.miaoShu}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
              </div>
            </el-popover>
          </template>
          <!--划入详情框结束-->

        </el-table-column>
        <el-table-column
          prop="miaoShu"
          label="用户描述"
          width="300"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          type="date"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          type="date"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="danger" @click="delById(scope.row.id)">删除</el-button>
            <el-button type="warning" @click="updateRole(scope.row)">编辑角色权限</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <div style="float: left;margin-left: 350px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[3, 5, 10, 20]"
            :current-page=currentPage
            :page-size=pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
          </el-pagination>
        </div>
      </div>

      <!--弹出框开始-->
      <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="角色ID" :label-width="formLabelWidth">
            <el-input v-model="form.id" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form.roleName" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="form.miaoShu" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="权限管理" :label-width="formLabelWidth">
            <el-tree
              :data="menuInfoList"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[2, 3]"
              ref="tree"
              :props="defaultProps">
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRole">确 定</el-button>
        </div>
      </el-dialog>
      <!--弹出框结束-->

    </div>
</template>

<script>
    export default {
      name: "roleList",
      data() {
        return {
          userid:this.toAes.get("userid"),
          username:this.toAes.get("username"),
          roleData: [],
          multipleSelection: [],
          total: 20,
          pageSize:3,
          currentPage:1,
          formInline: {
            roleName: "",
          },
          RoleList: {
            id: '',
            roleName: '',
            miaoShu: '',
            createTime: '',
            updateTime: '',
          },
          menuInfoList: [],
          menuList: {},
          arrMids: [],
          defaultProps: {
            children: 'menuInfoList',
            label: 'menuName',
            code: 'leval'
          },
          MenuName: '',
          dialogTableVisible: false,
          dialogFormVisible: false,
          form: {
            id: '',
            roleName: '',
            miaoShu: '',
            delivery: false
          },
          formLabelWidth: '120px',
        }
      },
      mounted(){
        let mypage = {}
        mypage.pageSize = 3
        mypage.currentPage = 1
        this.getRoleList(mypage);
        this.Cookies.get("");
        this.getMenuList();
      },
      methods: {
        getRoleList(mypage){
          this.$axios.post(this.domain.serverpath+"RoleList",mypage).then((response)=>{
            this.$data.roleData = response.data.content;
            this.total = response.data.totalElements;
            this.pageSize = response.data.size;
            this.currentPage = response.data.number+1;
          });
        },
        getMenuList(){
          this.$axios.post(this.domain.serverpath+"getMenuList").then((response)=>{
            this.menuInfoList = response.data;
          });
        },
        updateRole(fromData){     //修改
          this.arrMids = []
          this.arrMids=fromData.menuIds
          this.form = fromData
          this.dialogFormVisible = true
          setTimeout(()=>{
            this.$refs.tree.setCheckedKeys(this.arrMids); //获取值
          })
        },
        addRole(){                //添加
          this.arrMids = []
          setTimeout(()=>{
            this.$refs.tree.setCheckedKeys(this.arrMids); //获取值
          })
          this.form = {id:0}
          this.dialogFormVisible = true
        },
        saveRole(){
          var url = "addRole";
          if(this.form.id!=0){
            url = "updateRole";
          }
          /*this.$delete(this.form,'updateTime')    //用于移出某些字段
          this.$delete(this.form,'createTime')*/
          /*let mypage = {}
          mypage.dataRole = this.form
          mypage.arrMids = [].concat(this.$refs.tree.getHalfCheckedKeys(),this.$refs.tree.getCheckedKeys())   //存储选中的权限的ID值*/
          this.$set(this.form, 'menuIds',[].concat(this.$refs.tree.getHalfCheckedKeys(),this.$refs.tree.getCheckedKeys()))
          this.dialogFormVisible = false
          this.$axios.post(this.domain.serverpath+url,this.form).then((response)=>{
            if(response.data == 1){
              this.$message({
                message: '恭喜你,操作成功...',
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = this.currentPage
              this.getRoleList(mypage);
            }else {
              this.$message.error('对不起,操作失败...');
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }
          }).catch((error)=>{
            this.$message({
              message: '对不起,您没有相关权限...',
              type: 'error',
              duration: 3000
            });
            let mypage = {}
            mypage.pageSize = this.pageSize
            mypage.currentPage = 1
            this.getUserList(mypage);
          });
        },
        delById(id){    //通过ID值单删角色信息
          let mypage = {}
          mypage.id = id
          this.$axios.post(this.domain.serverpath+"delRoleById",mypage).then((response)=>{
            if(response.data > 0){
              this.$message({
                message: '恭喜你,删除角色成功...',
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getRoleList(mypage);
            }else {
              this.$message.error('对不起,删除角色失败...');
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getRoleList(mypage);
            }
          }).catch((error)=>{
            this.$message({
              message: '对不起,您没有相关权限...',
              type: 'error',
              duration: 3000
            });
            let mypage = {}
            mypage.pageSize = this.pageSize
            mypage.currentPage = 1
            this.getRoleList(mypage);
          })
        },
        onSubmit(){     /*模糊查询*/
          let mypage = {}
          mypage.pageSize = this.pageSize
          mypage.currentPage = 1
          mypage.roleName = this.formInline.roleName
          this.$axios.post(this.domain.serverpath+"mohuRole",mypage).then((response)=>{
            this.$data.roleData = response.data.content;
            this.total = response.data.totalElements;
            this.pageSize = 3;
            this.currentPage = 1;
          });
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          let mypage = {}
          mypage.pageSize = val
          mypage.currentPage = 1
          this.getRoleList(mypage);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          let mypage = {}
          mypage.pageSize = this.pageSize
          mypage.currentPage = val
          this.getRoleList(mypage);
        }
      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
