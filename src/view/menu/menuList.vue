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
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>
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
          filterText: '',
          menuInfoList: [],
          defaultProps: {
            children: 'menuInfoList',
            label: 'menuName',
            code: 'leval'
          },
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
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
      }
    }
</script>

<style scoped>

</style>
