<template>
  <div class="login">
    <div class="bgImg">
      <!-- <img src="../assets/jingwu-002.jpg" alt /> -->
    </div>
    <div id="wangCode">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <div class="stars">
      <div class="star" v-for="(item ,index) in starsCount" :key="index" ref="star"></div>
    </div>
    <div class="usform">
      <p>Login</p>
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="form"
        ref="form"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-button type="primary" class="sub" @click="login">登录</el-button>
        <el-button type="info" class="sub2">注册账号</el-button>
        <div class="share-button">
          <span>
            <i class="el-icon-s-custom"></i> 联系我们!
          </span>
          <a href="#">
            <i class="el-icon-eleme"></i>
          </a>
          <a href="#">
            <i class="el-icon-phone"></i>
          </a>
          <a href="#">
            <i class="el-icon-upload"></i>
          </a>
          <a href="#">
            <i class="el-icon-s-promotion"></i>
          </a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      starsCount: 800, // 雪花数量
      distance: 800, // 间距
      labelPosition: "right",
      form: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          // required: 非空规则
          // message: 提示信息
          // trigger: 触发的方式  blur  change
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    // let _this = this;
    // let starArr = _this.$refs.star;
    // console.log(starArr);
    // starArr.forEach(item => {
    //   var speed = 0.2 + Math.random() * 300;
    //   var thisDistance = _this.distance + Math.random() * 300;
    //   item.style.transformOrigin = `0 0 ${thisDistance}px`;
    //   item.style.transform = `translate3d(0,0,-${thisDistance}px) rotateY(${Math.random() *
    //     360}deg) rotateX(${Math.random() * -50}deg) scale(${speed},${speed})`;
    // });
  },
  methods: {
    async login() {
      try {
        await this.$refs.form.validate();
        const res = await this.axios.post("login", this.form);
        const { meta, data } = res;
        if (meta.status === 200) {
          localStorage.setItem("token", data.token);
          this.$router.push({ name: "index" });
        } else {
          this.$message.error(meta.msg);
        }
      } catch (e) {
        return false;
      }
    }
  }
};
</script>



<style lang="less">
// 雪花动画

@keyframes rolate {
  0% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }
  100% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg)
      rotateY(-360deg);
  }
}
.stars {
  transform: perspective(500px);
  transform-style: preserve-3d;
  position: absolute;
  perspective-origin: 50% 100%;
  left: 50%;
  top: 2%;
  animation: rolate 90s infinite linear;
  bottom: 0;
}
.star {
  width: 2px;
  height: 2px;
  background-color: #f7f7b8;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
}

.login {
  display: relative;
  .bgImg {
    height: 700px;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    overflow: hidden;
  }
  .usform {
    position: absolute;
    top: 50%;
    left: 60%;
    transform: translateY(-70%);
    width: 500px;
    padding: 20px;
    padding-top: 30px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    p {
      color: #fff;
      text-align: center;
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 700;
    }
    .el-form-item__label {
      color: #fff;
    }
    .sub {
      float: right;
    }
    .sub2 {
      float: right;
      margin-right: 10px;
    }
  }
  img {
    width: 100%;
    position: absolute;
    top: -280px;
  }

  #wangCode {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: radial-gradient(
      200% 100% at bottom center,
      #f7f7b6,
      #e96f92,
      #1b2947
    );
    background: radial-gradient(
      220% 105% at top center,
      #1b2947 10%,
      #75517b 40%,
      #e96f92 65%,
      #f7f7b6
    );
  }
  ul {
    height: 200px;
    position: absolute;
    left: 13%;
  }

  li {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    margin-right: 20px;
  }
  li:nth-child(1) {
    background-color: #f62e74;
    animation: love1 4s infinite;
  }
  li:nth-child(2) {
    background-color: #f45330;
    animation: love2 4s infinite;
    animation-delay: 0.15s;
  }
  li:nth-child(3) {
    background-color: #ffc883;
    animation: love3 4s infinite;
    animation-delay: 0.3s;
  }
  li:nth-child(4) {
    background-color: #30d268;
    animation: love4 4s infinite;
    animation-delay: 0.45s;
  }
  li:nth-child(5) {
    background-color: #006cb4;
    animation: love5 4s infinite;
    animation-delay: 0.6s;
  }
  li:nth-child(6) {
    background-color: #784697;
    animation: love4 4s infinite;
    animation-delay: 0.75s;
  }
  li:nth-child(7) {
    background-color: #ffc883;
    animation: love3 4s infinite;
    animation-delay: 0.9s;
  }
  li:nth-child(8) {
    background-color: #f45330;
    animation: love2 4s infinite;
    animation-delay: 1.05s;
  }
  li:nth-child(9) {
    background-color: #f62e74;
    animation: love1 4s infinite;
    animation-delay: 1.2s;
  }

  @keyframes love1 {
    30%,
    50% {
      height: 60px;
      transform: translateY(-30px);
    }
    70%,
    100% {
      height: 20px;
      transform: translateY(0px);
    }
  }
  @keyframes love2 {
    30%,
    50% {
      height: 125px;
      transform: translateY(-60px);
    }
    70%,
    100% {
      height: 20px;
      transform: translateY(0px);
    }
  }
  @keyframes love3 {
    30%,
    50% {
      height: 160px;
      transform: translateY(-75px);
    }
    70%,
    100% {
      height: 20px;
      transform: translateY(0px);
    }
  }
  @keyframes love4 {
    30%,
    50% {
      height: 180px;
      transform: translateY(-60px);
    }
    70%,
    100% {
      height: 20px;
      transform: translateY(0px);
    }
  }
  @keyframes love5 {
    30%,
    50% {
      height: 190px;
      transform: translateY(-45px);
    }
    70%,
    100% {
      height: 20px;
      transform: translateY(0px);
    }
  }
}
.share-button {
  width: 180px;
  height: 40px;
  // background: #dfe6e9;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: 0.3s linear;
}

.share-button:hover {
  transform: scale(1.1);
}

.share-button span {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #2d3436;
  color: #f1f1f1;
  text-align: center;
  line-height: 40px;
  z-index: 999;
  transition: 0.6s linear;
  border-radius: 40px;
}

.share-button:hover span {
  transform: translateX(-100%);
  transition-delay: 0.3s;
}

.share-button a {
  flex: 1;
  font-size: 26px;
  color: #fff;
  text-align: center;
  transform: translateX(-100%);
  opacity: 0;
  transition: 0.3s linear;
}

.share-button:hover a {
  opacity: 1;
  transform: translateX(0);
}

.share-button a:nth-of-type(1) {
  transition-delay: 1s;
}

.share-button a:nth-of-type(2) {
  transition-delay: 0.8s;
}

.share-button a:nth-of-type(3) {
  transition-delay: 0.6s;
}

.share-button a:nth-of-type(4) {
  transition-delay: 0.4s;
}
</style>