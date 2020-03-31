<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo">
          <img src="../../assets/anthem-logo.png" alt />
        </div>
        <el-button type="danger" size="mini" class="out" @click="loginOut">退出</el-button>
        <el-dropdown>
          <el-button type="primary" size="mini">
            更多菜单
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="el-icon-user">个人中心</el-dropdown-item>
            <el-dropdown-item class="el-icon-chat-line-round">站内信</el-dropdown-item>
            <el-dropdown-item class="el-icon-cold-drink">我的关注</el-dropdown-item>
            <el-dropdown-item class="el-icon-goods">充值</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="active"
            class="el-menu-vertical-demo"
            text-color="#fff"
            active-text-color="#ffd04b"
            background-color="#304156"
            unique-opened
            router
          >
            <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{menu.authName}}</span>
              </template>
              <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.path">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="banner" v-show="false">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in banner" :key="item.id">
                <img :src="item.srcs" alt />
              </el-carousel-item>
            </el-carousel>
          </div>
          <!-- <h4>todolist</h4> -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      isbanner: false,
      menuList: [],
      banner: [
        { id: 1, srcs: require("../../assets/banner/slidepic1.jpg") },
        { id: 2, srcs: require("../../assets/banner/slidepic2.jpg") },
        { id: 3, srcs: require("../../assets/banner/slidepic3.jpg") },
        { id: 4, srcs: require("../../assets/banner/slidepic4.jpg") },
        { id: 5, srcs: require("../../assets/banner/slidepic5.jpg") },
        { id: 6, srcs: require("../../assets/banner/slidepic6.jpg") },
        { id: 7, srcs: require("../../assets/banner/slidepic7.jpg") },
        { id: 8, srcs: require("../../assets/banner/slidepic8.jpg") },
        { id: 9, srcs: require("../../assets/banner/slidepic9.jpg") }
      ]
    };
  },
  created() {
    this.getMenuList();
    // console.log(this.$router.history.current.name);
  },
  methods: {
    async getMenuList() {
      const res = await this.axios.get("menus");
      const { data, meta } = res;
      if (meta.status === 200) {
        this.menuList = data;
        // console.log(this.menuList);
      } else {
        this.$message.success(meta.msg);
      }
    },
    loginOut() {
      this.$confirm("你确定要退出吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem("token");
          // 跳转到登录页
          this.$router.push("/login");
          // 提示
          this.$message.success("退出成功");
        })
        .catch(() => {
          this.$message("取消操作");
        });
    },
    isShowBanner() {
      if (this.$router.history.current.name === "index") {
        this.isbanner = true;
      } else {
        this.isbanner = false;
      }
    }
  },
  computed: {
    active() {
      return this.$route.path.slice(1).split("-")[0];
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

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
      /*边框圆角*/
      background-size: 400%;
      /*背景大小*/
      z-index: 1;
      /*层叠定位*/
      .el-dropdown {
        float: right;
        margin-right: 50px;
        margin-top: 15px;
      }
      .out {
        float: right;
        // margin-right: 50px;
        margin-top: 15px;
      }
      .logo {
        float: left;
        img {
          height: 40px;
          margin-top: 10px;
        }
      }
    }
    .el-header:hover {
      animation: animate 8s linear infinite alternate;
    }
    .el-aside {
      background-color: rgb(48, 65, 86);
      .el-menu-vertical-demo {
        background-color: rgb(48, 65, 86);
      }
      .el-submenu {
        width: 200px;
      }
    }
    .el-main {
      img {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        text-align: center;
        width: 500px;
        height: 224px;
      }
      .banner {
        width: 1000px;
        margin: 0 auto;
      }
      .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
      }

      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }

      .el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
      }
    }
  }
}
.el-card {
  height: 58px;
  .el-card__body {
    height: 20px;
  }
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
</style>