<template>
    <div>
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="用户姓名">
            <el-input v-model="formInline.name" placeholder="输入用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="formInline.sex" placeholder="选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间查询">
            <el-input v-model="formInline.createDate" type="date"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addUser" style="margin-right: -150px">添加</el-button>
            <el-button type="primary" @click="delAll" style="margin-left: 150px">批删</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        ref="multipleTable"
        :data="userData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="用户头像"
          width="60">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.photoUrl"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>
                <img :src="scope.row.photoUrl" height="40px" width="80px">
              </p>
              <p>用户名: {{ scope.row.userName }}</p>
              <p>登录名: {{ scope.row.loginName }}</p>
              <p>性  别: <span v-if="scope.row.sex==1">男</span>
                <span v-if="scope.row.sex==0">女</span></p>
              <p>电  话: {{ scope.row.tel}}</p>
              <p>状  态: <span v-if="scope.row.delStatus==1">有效</span>
                <span v-if="scope.row.delStatus==0">无效</span></p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.userName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="用户昵称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="roleInfo.roleName"
          label="绑定角色"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sex==1">男</span>
            <span v-if="scope.row.sex==0">女</span>
          </template>
        </el-table-column>
        <el-table-column
          label="删除状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.delStatus==1">有效</span>
            <span v-if="scope.row.delStatus==0">无效</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话"
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
            <el-button type="warning" @click="updateById(scope.row)">修改</el-button>
            <el-button type="danger" @click="delById(scope.row.id)">删除</el-button>
            <el-popover
              placement="right"
              width="300"
              trigger="click">
                <el-select v-model="roleName" filterable placeholder="请选择绑定角色"><!--scope.row.roleInfo.roleName-->
                  <el-option
                    v-for="item in RoleList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-button type="danger" @click="CutRole(scope.row.id)">切换角色</el-button>
              <el-button slot="reference" @click="BindRole(scope.row.roleInfo)">角色绑定</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <div style="float: left">
          <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
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
      <!--弹出框-->
      <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户ID" :label-width="formLabelWidth">
            <el-input v-model="form.id" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input v-model="form.userName" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" :label-width="formLabelWidth">
            <el-input v-model="form.loginName" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="用户电话" :label-width="formLabelWidth">
            <el-input v-model="form.tel" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>


          <el-form-item v-if="dialogFormVisible02">
            <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetForm('form')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-form-item>


          <el-form-item label="删除状态" :label-width="formLabelWidth">
            <label><input type="radio" v-model="form.delStatus" value="1"></input>有效</label>
            <label><input type="radio" v-model="form.delStatus" value="0"></input>失效</label>
          </el-form-item>
          <el-form-item label="用户性别"  :label-width="formLabelWidth">
            <label><input type="radio" v-model="form.sex" value="1"></input>男</label>
            <label><input type="radio" v-model="form.sex" value="0"></input>女</label>
          </el-form-item>
          <el-form-item label="创建时间"  :label-width="formLabelWidth">
            <el-date-picker
              v-model="form.createTime"
              type="date"
              placeholder="选择日期"
              :label-width="formLabelWidth">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="用户头像">
            <el-upload
              class="avatar-uploader"
              :headers=this.headers
              action="http://localhost:10000/api/server/toUpLoad"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUser">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      name: "userList",
      data() {
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.form.checkPass !== '') {
              this.$refs.form.validateField('checkPass');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          headers:{
            token:window.localStorage.getItem("token"),
            Cookie:{}
          },
          userid:localStorage.getItem("userid"),
          username:localStorage.getItem("username"),
          userData: [],
          delarr: [],
          multipleSelection: [],
          total: 20,
          pageSize:3,
          currentPage:1,
          imageUrl: '',
          formInline: {
            name: "",
            sex: "",
            createDate: ""
          },
          RoleList: {
            id: '',
            roleName: '',
            miaoShu: '',
            createTime: '',
            updateTime: '',
          },
          roleName: '',
          dialogTableVisible: false,
          dialogFormVisible: false,
          dialogFormVisible02: false,
          form: {
            id: '',
            userName: '',
            loginName: '',
            tel: '',
            delStatus: '',
            home: '',
            address: '',
            sex: '',
            createTime: '',
            photoUrl: '',
            password: '',
            checkPass: '',
            delivery: false
          },
          formLabelWidth: '120px',
          rules: {
            password: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass2, trigger: 'blur' }
            ]
          }
        }
      },
      mounted(){
        let mypage = {}
        mypage.pageSize = 3
        mypage.currentPage = 1
        this.getUserList(mypage);
        this.Cookies.get("");
        this.getRoleList();
      },
      methods: {
        getUserList(mypage){
          this.$axios.post(this.domain.serverpath+"userList",mypage).then((response)=>{
            this.$data.userData = response.data.content;
            this.total = response.data.totalElements;
            this.pageSize = response.data.size;
            this.currentPage = response.data.number+1;
          });
        },
        getRoleList(){
          this.$axios.post(this.domain.serverpath+"getRoleList").then((response)=>{
            this.$data.RoleList = response.data;
          })
        },
        BindRole(row){
          this.roleName = ""
          this.uid = row.
          this.roleName = row.roleName
        },
        CutRole(uid){
          let mypage = {}
          mypage.rid = this.roleName
          mypage.uid = uid
          this.$axios.post(this.domain.serverpath+"CutRole",mypage).then((response)=>{
            if(response.data == 1){
              this.$message({
                message: '恭喜你,角色切换成功...',
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }else {
              this.$message.error('对不起,角色切换失败...');
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
          });
        },
        updateById(fromData){
          this.form = fromData
          this.imageUrl = fromData.photoUrl
          this.dialogFormVisible02 = false,
          this.dialogFormVisible = true
        },
        addUser(){
          this.imageUrl = ''
          this.form = {id:0,photoUrl:'',password:''}
          this.dialogFormVisible02 = true,
          this.dialogFormVisible = true
        },
        saveUser(){
          var url = "addUser";
          if(this.form.id!=0){
            url = "updateUser";
          }
          this.dialogFormVisible = false
          this.dialogFormVisible02 = false
          this.$axios.post(this.domain.serverpath+url,this.form).then((response)=>{
            if(response.data == 1){
              this.$message({
                message: '恭喜你,操作成功...',
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
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
        },/*
        delAll() {
          this.delarr = []
          let length = this.multipleSelection.length;
          for (let i = 0; i < length; i++) {
            this.delarr.push(this.multipleSelection[i].id)
          }
          alert(this.delarr)
          this.$axios.post("http://localhost:10010/api/zuul1/userservice/delByIds?ids="+this.delarr).then((response)=>{
            if(response.data >= 1){
              this.$message({
                message: '恭喜你,删除成功...',
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }else {
              this.$message.error('对不起,删除失败...');
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }
          }).catch((error)=>{
            alert("删除操作有误...")
          });
        },*/
        delById(id){
          let mypage = {}
          mypage.id = id
          this.$axios.post(this.domain.serverpath+"delById",mypage).then((response)=>{
            if(response.data == 1){
              this.$message({
                message: '恭喜你,删除成功...',
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }else {
              this.$message.error('对不起,删除失败...');
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
          })
        },
        onSubmit(){
          let mypage = {}
          mypage.pageSize = this.pageSize
          mypage.currentPage = 1
          mypage.userName = this.formInline.name
          mypage.sex = this.formInline.sex
          mypage.createDate = this.formInline.createDate
          this.$axios.post(this.domain.serverpath+"mohuSelect",mypage).then((response)=>{
            this.$data.userData = response.data.content;
            this.total = response.data.totalElements;
            this.pageSize = 3;
            this.currentPage = 1;
          });
        },
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          let mypage = {}
          mypage.pageSize = val
          mypage.currentPage = 1
          this.getUserList(mypage);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          let mypage = {}
          mypage.pageSize = this.pageSize
          mypage.currentPage = val
          this.getUserList(mypage);
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
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
