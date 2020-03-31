<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="rightList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
    >
      <el-table-column label="层级" width="180">
        <template v-slot:default="{ row :{pid}}">
          <span v-if="pid === 0">一级</span>
          <span
            v-else-if="pid === 101 || pid === 102 || pid ===103 || pid === 125 || pid === 145"
          >二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" sortable width="180"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const res = await this.axios.get("rights/tree");
      const { status, msg } = res.meta;
      if (status === 200) {
        this.rightList = res.data;
        console.log(this.rightList);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
  margin-left: 2px;
}
</style>