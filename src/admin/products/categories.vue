<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">商品分类</el-menu-item>
      <el-menu-item index="2" @click="isShowAddGoods">添加分类</el-menu-item>
    </el-menu>
    <el-table :data="categoryList">
      <!-- tree-key: 每个对象的id -->
      <!-- parent-key 父节点的id -->
      <!-- level-key -->
      <el-table-tree-column
        tree-key="cat_id"
        folder-icon
        parent-key="cat_pid"
        level-key="cat_level"
        label="分类名称"
        prop="cat_name"
        :indent-size="20"
      ></el-table-tree-column>
      <el-table-column label="是否有效">
        <template v-slot="{ row }">{{ row.cat_deleted ? '否' : '是' }}</template>
      </el-table-column>
      <el-table-column label="层级">
        <template v-slot:default="{row:{cat_level}}">
          <el-tag effect="dark" v-if="cat_level === 0">一级</el-tag>
          <el-tag type="success" effect="dark" v-else-if="cat_level === 1">二级</el-tag>
          <el-tag type="info" effect="dark" v-else>三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button
            type="primary"
            circle
            icon="el-icon-edit"
            size="small"
            @click="isShowedit(row)"
          ></el-button>
          <el-button type="danger" circle icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加模态框 -->
    <el-drawer
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input autocomplete="off" v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级名称" prop="cat_pid">
            <el-cascader clearable v-model="addForm.cat_pid" :options="options" :props="props"></el-cascader>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button
            type="primary"
            @click="$refs.drawer.closeDrawer()"
            :loading="loading"
            class="btn"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
          <el-button @click="cancelForm">取 消</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 修改的对话框 -->
    <el-dialog title="修改分类名称" :visible.sync="editVisible" width="35%">
      <el-form ref="editCate" :model="editCate" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入角色名称" v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      categoryList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      dialog: false,
      props: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        checkStrictly: true
      },
      addForm: {
        cat_name: "",
        cat_pid: [],
        cat_level: 0
      },
      options: [],
      rules: {
        cat_name: [
          {
            required: true,
            message: "分类名称不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },
      editVisible: false,
      editCate: {
        id: 0,
        cat_name: ""
      }
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    async getCategoryList() {
      const res = await this.axios.get(`categories`, {
        params: {
          // 获取3级的分类
          type: 3,
          // 分页参数
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      const { meta, data } = res;
      if (meta.status === 200) {
        this.categoryList = data.result;
        // console.log(this.categoryList);
        this.total = data.total;
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getCategoryList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getCategoryList();
    },
    async handleClose(done) {
      try {
        this.loading = true;
        await this.$refs.addForm.validate();
        // 发送ajax请求
        const res = await this.axios.post(`categories`, {
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length,
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0
        });
        console.log(res);
        const { status, msg } = res.meta;
        if (status === 201) {
          this.$message.success(msg);
          this.$refs.addForm.resetFields();
          this.getCategoryList();
        }
      } catch (e) {
        console.log(e);
        this.$message.error("取消操作");
        this.$refs.addForm.resetFields();
      }
      setTimeout(() => {
        done();
        this.loading = false;
      }, 500);
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
    },
    async isShowAddGoods() {
      this.dialog = true;
      const res = await this.axios.get(`categories?type=2`);
      const { meta, data } = res;
      if (meta.status === 200) {
        this.options = data;
      }
    },
    isShowedit(user) {
      // console.log(user);
      this.editVisible = true;
      this.editCate.id = user.cat_id;
      this.editCate.cat_name = user.cat_name;
    },
    async edit() {
      await this.$refs.editCate.validate();
      const { id, cat_name } = this.editCate;
      const res = await this.axios.put(`categories/${id}`, { cat_name });
      console.log(res.meta.msg);
      this.$message.error("没有访问权限");
      this.editVisible = false;
    }
  }
};
</script>


<style lang="less" scoped>
.demo-drawer__footer {
  text-align: center;
}
.btn {
  width: 100px;
}
</style>