<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">用户列表</el-menu-item>
      <el-menu-item index="2" @click="isShowadd">添加用户</el-menu-item>
    </el-menu>
    <el-collapse-transition>
      <div v-show="show">
        <el-table :data="userList" stripe style="width: 100%">
          <el-table-column prop="username" label="用户名" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column label="用户状态">
            <template v-slot:default="{row}">
              <el-switch
                v-model="row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeState(row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot:default="{row}">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="isShoweditForm(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delUser(row.id,$event)"
              ></el-button>
              <a href="#" @click="showAssignDialog(row)">分配角色</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-collapse-transition>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户的模态框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="35%">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入用户密码" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入用户邮箱" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入用户手机" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--  修改模态框 -->
    <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="35%">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px" status-icon>
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入用户邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入用户手机" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的模态框 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="35%">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      userList: [],
      query: "",
      pagenum: 1, // 当前页
      pagesize: 4, // 一页显示几条
      total: 0, // 总条数
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addDialogVisible: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "用户名长度必须是3-12位",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "密码长度必须是6-12位", trigger: "blur" }
        ],
        email: [
          { type: "email", message: "请输入有效的邮箱", trigger: "blur" }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号",
            trigger: "blur"
          }
        ]
      },
      editForm: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      editDialogVisible: false,
      show: false,
      assignDialogVisible: false,
      assignForm: {
        rid: "",
        id: "",
        username: ""
      },
      roleList: []
    };
  },
  created() {
    this.getUserList();
    this.show = true;
  },
  methods: {
    async getUserList() {
      const res = await this.axios.get("users", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res.data);
      const { meta, data } = res;
      if (meta.status === 200) {
        this.userList = data.users;
        this.total = data.total;
        // console.log(this.userList);
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      // 只要修改了每页的条数，从第一页开始显示
      this.pagenum = 1;
      this.getUserList();
    },
    // 修改了当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.getUserList();
    },
    isShowadd() {
      this.addDialogVisible = true;
    },
    async addUser() {
      try {
        await this.$refs.addForm.validate();
        const res = await this.axios.post("users", this.addForm);
        const { status, msg } = res.meta;
        // console.log(res);
        if (status === 201) {
          this.$message.success("添加用户成功");
          this.$refs.addForm.resetFields();
          this.addDialogVisible = false;
          this.total++;
          this.pagenum = Math.ceil(this.total / this.pagesize);
          this.getUserList();
        } else {
          this.$message.error(msg);
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    isShoweditForm(user) {
      this.editDialogVisible = true;
      this.editForm = { ...user };
    },
    async editUser() {
      try {
        await this.$refs.editForm.validate();
        const { id, email, mobile } = this.editForm;
        const res = await this.axios.put(`users/${id}`, { email, mobile });
        const { status, msg } = res.meta;
        if (status === 200) {
          this.$message.success("修改成功");
          this.$refs.editForm.resetFields();
          this.editDialogVisible = false;
          this.getUserList();
        } else {
          this.$message.error(msg);
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async changeState({ id, mg_state: state }) {
      try {
        const res = await this.axios.put(`users/${id}/state/${state}`);
        const { status, msg } = res.meta;
        if (status === 200) {
          this.$message.success("修改用户状态成功");
          this.getUserList();
        } else {
          this.$message.error(msg);
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async delUser(id, e) {
      // console.log(e.target);
      try {
        await this.$confirm("确定要删除此用户吗?", "提示", {
          type: "warning"
        });
        const res = await this.axios.delete(`users/${id}`);

        const { status, msg } = res.meta;
        if (status === 200) {
          this.$message.success("删除成功");
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--;
          }
          this.getUserList();
        } else {
          this.$message.error(msg);
        }
      } catch (e) {
        console.log(e);
        return false;
      }
      e.target.blur();
    },
    async showAssignDialog(row) {
      this.assignDialogVisible = true;
      this.assignForm.id = row.id;
      this.assignForm.username = row.username;
      // 回显角色id,需要发送ajax请求
      const userRes = await this.axios.get(`users/${row.id}`);
      if (userRes.meta.status === 200) {
        this.assignForm.rid = userRes.data.rid === -1 ? "" : userRes.data.rid;
      }
      // this.assignForm.rid =
      // 加载角色列表
      const res = await this.axios.get("roles");
      if (res.meta.status === 200) {
        this.roleList = res.data;
        // console.log(this.roleList);
      }
    },
    async assignRole() {
      if (!this.assignForm.rid) {
        return this.$message.error("请选择一个角色");
      }
      // 发送ajax请求
      const res = await this.axios.put(
        `users/${this.assignForm.id}/role`,
        this.assignForm
      );
      // console.log(res);
      const { status, msg } = res.meta;
      if (status === 200) {
        this.$message.success(msg);
        this.assignDialogVisible = false;
        // 重新渲染
        this.getUserList();
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.users {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
}
a {
  margin-left: 5px;
  padding: 5px;
  /*移动，根据X,Y轴*/
  // width: 25px;
  /*宽*/
  // height: 10px;
  /*高*/
  text-align: center;
  /*字体水平居中*/
  /*字体大小*/
  /*行高*/
  color: #fff;
  text-transform: uppercase;
  /*字体大写*/
  text-decoration: none;
  /*字体增加装饰：去除下划线*/
  font-family: sans-serif;
  /*非衬线体*/
  box-sizing: border-box;
  /*盒模型大小规则*/
  background: linear-gradient(
    90deg,
    #03a9f4,
    #f441a5,
    #ffeb3b,
    #03a9f4,
    #f441a5,
    #ffeb3b,
    #03a9f4
  );
  /*渐变背景*/
  border-radius: 60px;
  /*边框圆角*/
  background-size: 400%;
  /*背景大小*/
  z-index: 1;
  /*层叠定位*/
}

a:hover {
  animation: animate 8s linear infinite alternate;
  /*动画: 名称 时间 线性 循环 播放完回退播放*/
}

@keyframes animate {
  0% {
    background-position: 0%;
    /*修改背景定位，实现渐变色炫光*/
  }

  50% {
    background-position: 100%;
  }

  100% {
    background-position: 0%;
  }
}

a::before {
  /*之前添加*/
  content: "";
  /*内容*/
  position: absolute;
  /*绝对定位*/
  top: -5px;
  /*当设置对立的2个定位属性时，元素的大小将由对立的大小决定*/
  left: -5px;
  right: -5px;
  bottom: -5px;
  /*当设置对立的2个定位属性时，元素的大小将由对立的大小决定*/
  z-index: -1;
  background: linear-gradient(
    90deg,
    #03a9f4,
    #f441a5,
    #ffeb3b,
    #03a9f4,
    #f441a5,
    #ffeb3b,
    #03a9f4
  );
  border-radius: 40px;
  background-size: 400%;
  filter: blur(20px);
  /*过渡：模糊*/
  opacity: 0;
  /*透明度*/
  transition: 1s;
  /*过渡时间*/
}

a:hover::before {
  filter: blur(20px);
  opacity: 1;
  animation: animate 8s linear infinite;
  /*注意动画名称统一*/
}
</style>