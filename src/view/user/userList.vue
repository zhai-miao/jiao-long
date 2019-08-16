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
            <el-button type="primary" @click="addUser" style="margin-right: -150px" v-if="authmap.includes('addUser')">添加</el-button>
            <el-button type="primary" @click="delAll" style="margin-left: 150px">批删</el-button>
            <!--<el-button type="primary" @click="downloadExcel" style="margin-left: 10px">前台导出</el-button>-->
            <el-button type="primary" @click="downloadExcel02" style="margin-left: 10px">后台导出</el-button>
            <div style="float: right;margin-left: 10px">
              <el-upload
                class="upload-demo"
                action="http://localhost:10000/api/server/dowloudExcel"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed">
                <el-button size="primary" type="primary">批量上传</el-button>
              </el-upload>
            </div>
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
          label="是否有效"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.delStatus==1"><el-button type="success" icon="el-icon-check" circle></el-button></span>
            <span v-if="scope.row.delStatus==0"><el-button type="danger" icon="el-icon-delete" circle></el-button></span>
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
            <el-button type="warning" @click="updateById(scope.row)"  v-if="authmap.includes('updateUser')">修改</el-button>
            <el-button type="danger" @click="delById(scope.row.id)" v-if="authmap.includes('delById')">删除</el-button>
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
              <el-button slot="reference" @click="BindRole(scope.row.roleInfo)" v-if="authmap.includes('CutRole')">角色绑定</el-button>
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
        <el-form :model="form" status-icon :rules="rules" ref="form">
          <el-form-item label="用户ID" :label-width="formLabelWidth">
            <el-input v-model="form.id" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="userName" :label-width="formLabelWidth">
            <el-input v-model="form.userName" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="loginName" :label-width="formLabelWidth">
            <el-input v-model="form.loginName" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="用户电话" prop="tel" :label-width="formLabelWidth">
            <el-input v-model.number="form.tel" autocomplete="off" style="column-width: 200px;"></el-input>
          </el-form-item>


          <!--<el-form-item v-if="dialogFormVisible02">-->
            <!--<el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">-->
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
              </el-form-item>
            <!--</el-form>-->
          <!--</el-form-item>-->


          <el-form-item label="删除状态" :label-width="formLabelWidth">
            <label><input type="radio" v-model="form.delStatus" value="1"></input>有效</label>
            <label><input type="radio" v-model="form.delStatus" value="0"></input>失效</label>
          </el-form-item>
          <el-form-item label="用户性别"  :label-width="formLabelWidth">
            <label><input type="radio" v-model="form.sex" value="1"></input>男</label>
            <label><input type="radio" v-model="form.sex" value="0"></input>女</label>
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
        var checkUserName = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('输入的只能是汉字和英文'));
          } else {
            const reg = /^[\u0391-\uFFE5A-Za-z]+$/
            console.log(reg.test(value));
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的名称,输入的只能是汉字和英文...'));
            }
          }
        };
        var checkPhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'));
          } else {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            console.log(reg.test(value));
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的手机号'));
            }
          }
        };
        return {
          headers:{
            token:window.localStorage.getItem("token"),
            Cookie:{}
          },
          /*userid:localStorage.getItem("userid"),
          username:localStorage.getItem("username"),*/
          authmap:localStorage.getItem("authmap"),
          userid:this.toAes.get("userid"),
          username:this.toAes.get("username"),
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
            ],
            tel: [
              {validator: checkPhone, trigger: 'blur'}
            ],
            userName: [
              {validator: checkUserName, trigger: 'blur'}
            ],
            loginName: [
              {validator: checkUserName, trigger: 'blur'}
            ],
          }
        }
      },
      mounted(){
        this.userid = this.toAes.get("userid")
        this.username = this.toAes.get("username")
        let mypage = {}
        mypage.pageSize = 3
        mypage.currentPage = 1
        mypage.userId = this.userid
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
          this.uid = row.id
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
          this.form.checkPass = fromData.password
          this.imageUrl = fromData.photoUrl
          this.dialogFormVisible02 = false,
          this.dialogFormVisible = true
        },
        addUser(){
          this.imageUrl = ''
          this.form = {id:0,photoUrl:''}
          //this.resetForm();
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
            if(response.data.code == 200){
              this.$message({
                message: response.data.success,
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }else {
              this.$message.error(response.data.success);
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
        delAll() {                    //批删
          this.delarr = []
          let length = this.multipleSelection.length;
          for (let i = 0; i < length; i++) {
            this.delarr.push(this.multipleSelection[i].id)
          }
          this.delarr.unshift("")
          //因为后台需要对对象中的数组取出来转为字符串格式后再问转为数组形式，但是后果是第一个和最后一个分别带上[,]。所以要加两个空的解决BUG
          this.delarr.push("")
          alert(this.delarr)
          let mypage = {}
          mypage.ids = this.delarr
          this.$axios.post(this.domain.serverpath+"delById",mypage).then((response)=>{
            if(response.data >= 1){
              this.$message({
                message: '恭喜你,删除状态更改成功...',
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }else {
              this.$message.error('对不起,删除状态更改失败...');
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }
          }).catch((error)=>{
            alert("删除操作有误...")
          });
        },
        delById(id){
          let mypage = {}
          mypage.id = id
          this.$axios.post(this.domain.serverpath+"delById",mypage).then((response)=>{
            if(response.data == 1){
              this.$message({
                message: '恭喜你,删除状态更改成功...',
                type: 'success'
              });
              let mypage = {}
              mypage.pageSize = this.pageSize
              mypage.currentPage = 1
              this.getUserList(mypage);
            }else {
              this.$message.error('对不起,删除状态更改失败...');
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
          mypage.userId = this.userid
          this.getUserList(mypage);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          let mypage = {}
          mypage.pageSize = this.pageSize
          mypage.currentPage = val
          mypage.userId = this.userid
          this.getUserList(mypage);
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
        },


        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },

      downloadExcel02(){    //后台方式列表下载
        let mypage = {}
        mypage.pageSize = this.pageSize
        mypage.currentPage = this.currentPage
        this.$axios.post(this.domain.serverpath+"writeOutExecel",mypage).then((response)=>{
          if(response.data.code == 200){
            this.$message({
              message: response.data.success,
              type: 'success'
            });
          }else {
            this.$message.error('对不起,导出失败失败...');
          }
        }).catch((error)=>{
            this.$message({
              message: '对不起,您没有相关权限...',
              type: 'error',
              duration: 3000
            });
        })
      },

        //前台方式列表下载
        downloadExcel() {
          this.$confirm('确定下载列表文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.excelData = this.$data.userData //你要导出的数据list。
            this.export2Excel()
          }).catch(() => {

          });
        },
        //数据写入excel
        /*export2Excel() {
          var that = this;
          require.ensure([], () => {
            const { export_json_to_excel } = require('@/excel/export2Excel'); //这里必须使用绝对路径，使用@/+存放export2Excel的路径
            const tHeader = ['用户姓名','登陆姓名','密码','电话','图片地址']; // 导出的表头名信息
            const filterVal = ['userName','loginName', 'password', 'tel', 'photoUrl']; // 导出的表头字段名，需要导出表格字段名
            const list = that.excelData;
            const data = that.formatJson(filterVal, list);

            export_json_to_excel(tHeader, data, '下载数据excel');// 导出的表格名称，根据需要自己命名
          })
        },
        //格式转换，直接复制即可
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        },*/
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
