<template>
  <div class="add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="tab0">
        <el-form label-width="80px" :model="form">
          <el-form-item label="商品名称">
            <el-input placeholder="请输入商品名称" v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input placeholder="请输入商品价格" v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input placeholder="请输入商品重量" v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input placeholder="请输入商品数量" v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="form.goods_cat" :options="options" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="form.is_promote" :label="true">是</el-radio>
            <el-radio v-model="form.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="tab1">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          multiple
          list-type="picture-card"
          :on-success="handleSuccess"
          :headers="headers"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file, fileList}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>

              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file,fileList)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="tab2">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      active: 0,
      activeName: "tab0",
      form: {
        goods_name: "",
        goods_cat: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        is_promote: false
      },
      options: [],
      props: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: []
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    handleClick(tab) {
      // console.log(tab.index);
      this.active = +tab.index;
    },
    next() {
      this.active++;
      this.activeName = "tab" + this.active;
    },
    // 获取到商品列表参数
    async getGoods() {
      const res = await this.axios.get(`categories?type=3`);
      const { meta, data } = res;
      if (meta.status === 200) {
        this.options = data;
      }
    },
    // 上传图片
    handleRemove(file) {
      const idx = this.fileList.findIndex(item => item.uid === file.uid);
      this.fileList.splice(idx, 1);
      const path = file.response.data.tmp_path;
      // console.log(path);
      const idx2 = this.form.pics.findIndex(item => item.pic === path);
      this.form.pics.splice(idx2, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      if (res.meta.status === 200) {
        this.form.pics.push({
          pic: res.data.tmp_path
        });
        this.fileList = fileList;
      }
    },
    async addGood() {
      const res = await this.axios.post("goods", {
        ...this.form,
        // 把数组转换成字符串
        goods_cat: this.form.goods_cat.join()
      });
      const { status, msg } = res.meta;
      if (status === 201) {
        this.$message.success(msg);
        this.$router.push("/goods");
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>


<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  /deep/.ql-editor {
    height: 300px;
  }
}
</style>