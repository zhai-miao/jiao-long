<template>
    <div>
      <el-form label-width="0px" class="ms-content" :model="email">
        <el-form-item prop="username">
          <el-input v-model="email.username" placeholder="请输入有效用户名">
            <el-button slot="prepend" icon="el-icon-s-custom"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" >
          <el-input v-model="email.password" placeholder="请输入修改的密码" :type="sty">
            <el-button slot="prepend" icon="el-icon-view" @click="open()"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="login-btn">
         <el-button type="primary" @click="findEmail()">确认密码</el-button>
       </div>
    </div>
</template>

<script>
    export default {
        name: "email",
        data(){
          return{
            email:{},
            sty:"password"
          }
        },
      methods:{
          open(){
            if(this.sty=="password"){
                this.sty="text"
              }else{
                this.sty="password"
              }
          },
        findEmail(){
          if(this.email.username==""||this.email.username==null){
            this.$notify.info({
              title: '提示',
              message: '请填写用户名'
            });
            return;
          }
          if(this.email.password==""||this.email.password==null){
            this.$notify.info({
              title: '提示',
              message: '请填写密码'
            });
            return;
          }

          this.email.code=this.$route.query.code
          alert(this.email.code)
          this.$axios.post(this.domain.ssoserverpath+"editPass",this.email).then((response)=>{

              if(response.data.code==200){
                this.$message({
                  message: response.data.success,
                  type: 'success'
                });
                this.$router.push("/");

              }
            if(response.data.code==500){
              this.$message({
                message: response.data.error,
                type: 'error'
              });
            }

         })

        }
      }
    }
</script>

<style scoped>
  .ms-content{
    padding: 30px 30px;
    width: 500px;

  }
</style>
