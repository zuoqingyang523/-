<template>
  <div class="navBar">
    <span class="backBtn" @click="goBack" v-if="!isCloseFlag"></span>
    <span v-if="isCloseFlag" class="closeBtn" @click="goBack">x</span>
    {{name}}
    <div class="submit">
      <slot name="submit"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "navBar",
  props: ["name", "backUrl", "isCloseFlag"],
  components: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    goBack() {
      if (!this.backUrl) {
        window.history.go(-1);
      } else {
        this.$router.push(this.backUrl);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.navBarPadding {
  height: 50px;
}
.navBar {
  background: #b41c2e;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  color: #ffffff;
  position: fixed;
  text-align: center;
  width: 100%;
  z-index: 50000;
  top: 0;
  left: 0;
  .backBtn {
    position: absolute;
    height: 23px;
    width: 23px;
    background: url(./../../../assets/images/common/laststep_icon.png);
    background-size: 23px 23px;
    top: 14px;
    left: 10px;
    cursor: pointer;
  }
  .closeBtn {
    position: absolute;
    height: 23px;
    width: 23px;
    top: 14px;
    left: 10px;
    font-size: 23px;
    line-height: 23px;
    cursor: pointer;
  }
  .submit {
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    line-height: 50px;
    right: 20px;
    top: 0;
    width: 40px;
    cursor: pointer;
  }
}
</style>
