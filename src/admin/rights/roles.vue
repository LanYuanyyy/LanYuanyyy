<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">角色列表</el-menu-item>
      <el-menu-item index="2" @click="showAddDialog">添加角色</el-menu-item>
      <el-menu-item index="3" @click="show3 = !show3">显示和隐藏</el-menu-item>
    </el-menu>
    <div>
      <div style="margin-top: 20px; height: 200px;">
        <el-collapse-transition>
          <div v-show="show3">
            <el-table :data="roleList" style="width: 100%">
              <el-table-column type="expand">
                <template v-slot:default="{row}">
                  <span v-show="row.children.length === 0">该角色下没有任何权限信息</span>
                  <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
                    <el-col :span="4">
                      <el-tag closable @close="delRight(row,l1.id)">{{l1.authName}}</el-tag>
                    </el-col>
                    <el-col :span="20">
                      <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                        <el-col :span="4">
                          <el-tag
                            type="success"
                            closable
                            @close="delRight(row,l2.id)"
                          >{{l2.authName}}</el-tag>
                        </el-col>
                        <el-col :span="20">
                          <el-tag
                            class="l3"
                            type="warning"
                            closable
                            v-for="l3 in l2.children"
                            :key="l3.id"
                            @close="delRight(row,l3.id)"
                          >{{l3.authName}}</el-tag>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column label="角色名称" prop="roleName"></el-table-column>
              <el-table-column label="描述" prop="roleDesc"></el-table-column>
              <el-table-column label="操作">
                <template v-slot:default="{row}">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    size="small"
                    @click="showEditDialog(row)"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="small"
                    @click="delRole(row,$event)"
                  ></el-button>
                  <el-button
                    type="success"
                    icon="el-icon-edit"
                    round
                    size="small"
                    @click="showAssignDialog(row)"
                  >分配权限</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-transition>
      </div>
    </div>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="assignVisible" width="35%">
      <!-- 树形菜单控件 -->
      <el-tree
        ref="tree"
        :data="rightList"
        :props="props"
        show-checkbox
        default-expand-all
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加或者修改的对话框 -->
    <el-dialog :title="title" :visible.sync="editVisible" width="35%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      roleList: [],
      show3: true,
      rightList: [],
      props: {
        children: "children",
        label: "authName"
      },
      assignVisible: false,
      roleId: "",
      form: {
        id: "",
        roleName: "",
        roleDesc: ""
      },
      editVisible: false,
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: ["change", "blur"]
          }
        ],
        roleDesc: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: ["change", "blur"]
          }
        ]
      }
    };
  },
  created() {
    this.getRoleList();
  },
  computed: {
    title() {
      return this.form.id ? "修改角色" : "添加角色";
    }
  },
  methods: {
    async getRoleList() {
      const res = await this.axios.get("roles");
      const { meta, data } = res;
      if (meta.status === 200) {
        this.roleList = data;
        // console.log(this.roleList);
      }
    },
    async delRight(row, rightId) {
      // console.log(rightId);
      const res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`);
      const { status, msg } = res.meta;
      if (status === 200) {
        this.$message.success(msg);
        row.children = res.data;
      } else {
        this.$message.error(msg);
      }
    },
    async showAssignDialog(row) {
      // 吧角色id存起来
      this.roleId = row.id;
      this.assignVisible = true;

      // 发生axios获取所有的权限信息
      const { meta, data } = await this.axios.get("rights/tree");
      if (meta.status === 200) {
        this.rightList = data;
      }

      let ids = [];
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id);
          });
        });
      });
      // console.log(ids);
      this.$refs.tree.setCheckedKeys(ids);
    },
    async assignRight() {
      let ids = this.$refs.tree.getCheckedKeys();
      let halfIds = this.$refs.tree.getHalfCheckedKeys();
      let rids = [...ids, ...halfIds].join();
      // console.log(rids);
      // console.log(this.roleId);
      const res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      });
      // console.log(res);
      const { status, msg } = res.meta;
      if (status === 200) {
        this.$message.success(msg);
        this.assignVisible = false;
        this.getRoleList();
      } else {
        this.$message.error(msg);
      }
    },
    async delRole(row, e) {
      try {
        await this.$confirm("确定要删除该角色吗", "提示", { type: "warning" });
        const res = await this.axios.delete(`roles/${row.id}`);
        const { status, msg } = res.meta;
        if (status === 200) {
          this.$message.success(msg);
          this.getRoleList();
        } else {
          this.$message.error(msg);
        }
      } catch {
        this.$message("取消操作");
      } finally {
        let current = e.target;
        if (e.target.nodeName === "I") {
          current = e.target.parentNode;
        }
        current.blur();
      }
    },
    showAddDialog() {
      // 添加修改公用一个模态框 修改需要数据回显 添加的时候吧表单内容清空
      this.editVisible = true;
      this.form.id = "";
      this.form.roleName = "";
      this.form.roleDesc = "";
      // 保证校验结果显示后才能清空
      this.$nextTick(() => {
        // 重置表单的校验规则
        this.$refs.form.clearValidate();
      }, 100);
    },
    showEditDialog(row) {
      this.editVisible = true;
      this.form.id = row.id;
      this.form.roleName = row.roleName;
      this.form.roleDesc = row.roleDesc;
      // 保证校验结果显示后才能清空
      this.$nextTick(() => {
        // 重置表单的校验规则
        this.$refs.form.clearValidate();
      }, 100);
    },
    // 添加修改表单组合
    async editRole() {
      try {
        await this.$refs.form.validate();
        const { id } = this.form;
        let method = id ? "put" : "post";
        let url = id ? `roles/${id}` : `roles`;
        let code = id ? 200 : 201;

        const res = await this.axios[method](url, this.form);
        const { status, msg } = res.meta;
        if (status === code) {
          this.$message.success(msg);
          this.$refs.form.resetFields();
          this.editVisible = false;
          this.getRoleList();
        } else {
          this.$message.error(msg);
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.roles {
  .l1 {
    padding: 5px 0;
    border-bottom: 1px dotted #ccc;
  }
  .l2 {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>