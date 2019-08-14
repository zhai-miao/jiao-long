<template>

  <el-main id="et" :style="{height:wheight+'px','background-color':'#ffebcd'}">

      <router-view style="padding: 0px" ></router-view>

  </el-main>

</template>

<script>
    export default {
        name: "datamain",
      data(){
          return{
            wheight:window.innerHeight-60
          }
      },
      mounted(){
          if(this.toAes.get("userid")==null){
            this.$router.push({path:'/'})
          }
      },
      created(){
          this.$router.push({path:"/system"})   //登陆或刷新页面时返回的页面
      }
    }
</script>

<style scoped>

</style>
