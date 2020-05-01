<template>
  <div class="signResult">
    <nav-top :name="'签署文件'" :isCloseFlag="true" :backUrl="closeToUrl"></nav-top>
    <div style="height:50px"></div>
    <div class="resultFlag">
      <div v-if="successFlag == 'Y'" class="imgFlag imgFlagSuccess"></div>
      <div v-if="successFlag == 'N'" class="imgFlag imgFlagError"></div>
      <div v-if="successFlag == 'N'" class="flagDscp">签约失败</div>
      <div v-if="successFlag == 'Y'" class="flagDscp">签约成功</div>
    </div>
    <div class="bottomBtn" v-if="successFlag == 'N'">
      <div @click="reSign" class="btnGroup">
        <img src="./../../assets/images/continuesign_icon.png">
        <span class="btnDscp">去签署</span>
      </div>
    </div>
  </div>
</template>

<script>
import NavTop from "./common/NavTop.vue";
export default {
  name: "signResult",
  components: { NavTop },
  data() {
    return {
      query: {},
      closeToUrl: "",
      successFlag: ""
    };
  },
  created() {
    this.query = this.$route.query;
    this.successFlag = this.query.isSuccess;
    console.log(this.successFlag);
    if (this.successFlag == "Y") {
      this.closeToUrl = `/signList?flag=waitOther`;
    } else {
      this.closeToUrl = `sign/?id=${this.query.id}&taskId=${
        this.query.taskId
      }&contractForMe=${this.query.contractForMe}`;
    }
  },
  mounted() {},
  methods: {
    reSign() {
      this.$router.push(this.closeToUrl);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.signResult {
  width: 100%;
  height: 100%;
  position: relative;
  .bottomBtn {
    position: absolute;
    width: 100%;
    height: 51px;
    bottom: 0;
    left: 0;
    background: #ffffff;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    .btnDscp {
      font-size: 16px;
      color: #b41c2e;
    }
    img {
      width: 25px;
      height: 23px;
      margin-right: 5px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }
  .resultFlag {
    width: 100%;
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .imgFlag {
      width: 44px;
      height: 44px;
    }
    .imgFlagSuccess {
      background: url(./../../assets/images/success_icon.png);
      background-size: 100% 100%;
    }
    .imgFlagError {
      background: url(./../../assets/images/faile01_icon.png);
      background-size: 100% 100%;
    }
    .flagDscp {
      margin-top: 10px;
      font-size: 14px;
      color: #505050;
      text-align: center;
      background-size: 100% 100%;
    }
  }
}
</style>
