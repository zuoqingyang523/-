<template>
  <div class="confirmZqy" v-show="visible">
    <div class="confirmBg"></div>
    <div class="confirmInfo">
      <div class="confirmCenter">
        <img src="./close_icon.png" v-if="showClose" class="confirmClose" @click="closeConfirm">
        <strong class="outLine"></strong>
        <div class="contentConfirm" v-html="content"></div>
        <a
          @click="handlerLeft"
          class="leftBtn handlerBtn"
          :class="{'onlyBtn':!rightButton}"
          v-if="leftButton"
          v-html="leftButton"
        ></a>
        <a
          @click="handlerRight"
          class="rightBtn handlerBtn"
          :class="{'onlyBtn':!leftButton}"
          v-if="rightButton"
          v-html="rightButton"
        ></a>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  data() {
    return {
      visible: false,
      showClose: true,
      content: "",
      leftButton: "",
      rightButton: "",
      leftCallback: function() {},
      rightCallBack: function() {},
      mountedFunction: function() {}
    };
  },

  computed: {},
  methods: {
    destroyElement() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    handlerLeft() {
      if (this.leftCallback) {
        let flag = this.leftCallback(this.$el);
        if (!flag) {
          this.closeConfirm();
        }
      } else {
        this.closeConfirm();
      }
    },
    handlerRight() {
      if (this.rightCallBack) {
        let flag = this.rightCallBack(this.$el);
        if (!flag) {
          this.closeConfirm();
        }
      } else {
        this.closeConfirm();
      }
    },
    closeConfirm() {
      this.visible = false;
      this.destroyElement();
    }
  },
  mounted() {
    document.body.addEventListener(
      "touchmove",
      function(event) {
        event.preventDefault();
      },
      false
    );
    this.$nextTick(function() {
      this.mountedFunction && this.mountedFunction();
    });
  },
  beforeDestroy() {
    document.body.addEventListener(
      "touchmove",
      function(event) {
        event.preventDefault();
      },
      false
    );
  }
};
</script>
<style lang="scss" scoped>
.confirmBg {
  background: #000000;
  opacity: 0.3;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
}
.handlerBtn {
  display: inline-block;
  font-size: 16px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  width: 50%;
  margin: 0;
  border-radius: 0;
  background: none repeat scroll 0 0 #ffffff;
  border-radius: 2px;
  color: #363636;
}
.onlyBtn {
  width: 100%;
}
.confirmInfo {
  height: 0px;
  width: 0px;
  top: 50%;
  left: 50%;
  position: fixed;
  line-height: 1.7;
  z-index: 999999;
}
.confirmCenter {
  background: #fff;
  border: 1px solid #ffffff;
  width: 269px;
  position: absolute;
  // margin: -50px -135px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: 6px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
  text-align: center;
}
.confirmClose {
  margin-right: 6px;
  margin-top: 4px;
  width: 20px;
  height: 20px;
  float: right;
  vertical-align: middle;
  border-radius: 50%;
}
.outLine {
  display: block;
  padding: 2px 5px;
  background: #ffffff;
  color: #363636;
  border-radius: 2px 2px 0 0;
}
.contentConfirm {
  padding: 22px 3px;
  margin: 0;
  text-align: center;
  color: #000;
  font-size: 16px;
  border-bottom: 1px solid #d2d2da;
}
</style>
