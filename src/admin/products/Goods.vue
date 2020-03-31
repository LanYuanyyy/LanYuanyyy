<template>
  <div class="goods">
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
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">商品列表</el-menu-item>
      <el-menu-item index="2" @click="$router.push('/goods-add')">添加商品</el-menu-item>
    </el-menu>
    <div class="goods-list" v-for="item in goodList" :key="item.id" v-loading="loading">
      <el-card shadow="hover">
        <div class="imgs">
          <img src="../../assets/gamersky_06origin_11_20186279218E9.jpg" alt />
        </div>
        <p class="p1">{{item.goods_name}}</p>
        <p class="p2">${{item.goods_price}}</p>
        <p class="p3">{{item.add_time | dateFilter}}</p>
        <el-button type="primary" size="mini" @click="isShowGood(item)">商品详情</el-button>
      </el-card>
    </div>

    <!-- 商品详情 -->
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
      <img
        src="../../assets/grid-play-icetide-early-on-pc-with-public-test-server.jpg.adapt.crop16x9.431p.jpg"
        alt
      />
      <span>商品详情!</span>
      <el-form ref="goodsDetails" :model="goodsDetails" label-width="80px" status-icon>
        <el-form-item label="商品名称">
          <el-input placeholder="请输入用户名" v-model="goodsDetails.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input placeholder="请输入用户邮箱" v-model="goodsDetails.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input placeholder="请输入用户手机" v-model="goodsDetails.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input placeholder="请输入用户手机" v-model="goodsDetails.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="editUser">确定修改</el-button>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      activeIndex: "1",
      drawer: false,
      goodsDetails: {
        id: "",
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: ""
      },
      loading: true
    };
  },
  created() {
    this.getGoodList();
    // console.log(this.$router.currentRoute.name);
  },
  methods: {
    async getGoodList() {
      this.loading = true;
      const res = await this.axios.get("goods", {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      const { meta, data } = res;
      console.log(res);
      if (meta.status === 200) {
        this.goodList = data.goods;
        this.total = data.total;
      }
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodList();
    },
    indexMethod(index) {
      return (this.pagenum - 1) * this.pagesize + index + 1;
    },
    isShowGood(item) {
      this.drawer = true;
      // console.log(item);
      this.goodsDetails = { ...item };
      this.goodsDetails.id = item.goods_id;
      console.log(this.goodsDetails);
    },
    async editUser() {
      const id = this.goodsDetails.id;
      const res = await this.axios.put(`goods/${id}`, this.goodsDetails);
      console.log(res);
    }
  }
};
</script>

<style lang="less" scoped>
.goods {
  .el-menu {
  }
  .goods-list {
    text-align: center;
    margin-top: 20px;
    margin-right: 60px;
    width: 250px;
    height: 300px;
    float: left;
    /deep/.el-card__body {
      position: relative;
      height: 300px;
      padding: 0;
      .imgs {
        img {
          width: 250px;
        }
      }
      .el-button {
        position: absolute;
        right: 0;
        bottom: 10px;
        background-color: #cc99ff;
        border: none;
        border-radius: 0;
      }
      .el-button:hover {
        background-color: #cc00ff;
      }
    }
    .el-card {
      transition: 0.5s;
    }
    .p1 {
      padding-top: 5px;
      color: #ff3366;
    }
    .p2 {
      padding-top: 15px;
      color: #ffcc00;
    }
    .p3 {
      padding-top: 20px;
    }
  }
}
</style>
