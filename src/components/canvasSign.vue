<template>
  <div class="hand-sign">
    <div data-role="page" id="hand-sign">
      <div data-role="content" class="my-hand-sign-Context">
        <div id="tools" class="my-hand-sign-bottom">
          <div class="lines">
            <div
              class="my-hand-sign-line"
              lineWidth="4"
              :class="{'my-hand-sign-line-active':activeLine == 4}"
              @click="activeLineChange(4)"
            >
              <img
                class="line-img nor-img"
                src="../../src/assets/images/canvasSign/fine_img_nor.png"
              >
              <img
                class="line-img active-img"
                src="../../src/assets/images/canvasSign/fine_img_select.png"
              >
            </div>
            <div
              class="my-hand-sign-line"
              lineWidth="6"
              @click="activeLineChange(6)"
              :class="{'my-hand-sign-line-active':activeLine == 6}"
            >
              <img
                class="line-img nor-img"
                src="../../src/assets/images/canvasSign/medium_img_nor.png"
              >
              <img
                class="line-img active-img"
                src="../../src/assets/images/canvasSign/medium_img_select.png"
              >
            </div>
            <div
              class="my-hand-sign-line"
              lineWidth="10"
              @click="activeLineChange(10)"
              :class="{'my-hand-sign-line-active':activeLine == 10}"
            >
              <img
                class="line-img nor-img"
                src="../../src/assets/images/canvasSign/coarse_img_nor.png"
              >
              <img
                class="line-img active-img"
                src="../../src/assets/images/canvasSign/coarse_img_select.png"
              >
            </div>
          </div>
          <img
            class="clean"
            id="clean"
            src="../../src/assets/images/canvasSign/remove_btn_hov_pre.png"
            @click="clean"
          >
          <img
            class="disable"
            id="disable"
            src="../../src/assets/images/canvasSign/save_btn_unclickable.png"
          >
          <img
            class="submit"
            id="submit"
            src="../../src/assets/images/canvasSign/save_btn_nor.png"
            @click="submit"
          >
          <div class="colors">
            <div
              class="my-hand-sign-check-div"
              :class="{'my-hand-sign-check-div-black':activeColor == 3}"
              style="margin-bottom: 10px;"
            >
              <div
                class="my-hand-sign-uncheck"
                @click="activeColorChange(3)"
                :class="{'my-hand-sign-check':activeColor == 3}"
                style="background-color: black"
                colorKey="3"
              ></div>
            </div>
            <div
              class="my-hand-sign-check-div"
              style="margin-bottom: 10px;"
              :class="{'my-hand-sign-check-div-blue':activeColor == 2}"
            >
              <div
                class="my-hand-sign-uncheck"
                @click="activeColorChange(2)"
                style="background-color: blue"
                colorKey="2"
                :class="{'my-hand-sign-check':activeColor == 2}"
              ></div>
            </div>
            <div
              class="my-hand-sign-check-div"
              :class="{'my-hand-sign-check-div-red':activeColor == 1}"
            >
              <div
                @click="activeColorChange(1)"
                class="my-hand-sign-uncheck"
                :class="{'my-hand-sign-check':activeColor == 1}"
                style="background-color: red"
                colorKey="1"
              ></div>
            </div>
          </div>
        </div>
        <canvas class="myCanvas" id="myCanvas"></canvas>
      </div>
    </div>
    <div id="successBox" style="display:none">
      <div style="display:flex;justify-content:center;align-items:center;flex-direction:column">
        <img
          src="../../src/assets/images/canvasSign/Group.png"
          style="width: 40px;height: 40px;margin-bottom: 6px;"
        >
        <p>新建签名成功</p>
      </div>
    </div>
  </div>
</template>
<script>
import canvasWrite from "@lib/handSignUtil.js";
import Util from "@lib/util.js";
import $ from "jquery";
import BaseApi from "@lib/baseApi.js";
let urlParse = Util.urlParse;
let handSignUtil = {
  color: 3,
  lineWidth: 4,
  canvas: {},
  canvasWrite: {},
  size: {
    width: 0,
    height: 0
  },
  getColorCode: function(colorIndex) {
    let colorArr = ["#FF0000", "#0000FF", "#000000"];
    return colorArr[colorIndex - 1];
  },
  pageshow: function() {
    handSignUtil.size.width = $(document).width();
    handSignUtil.size.height = $(document).height();
    handSignUtil.canvas = document.getElementById("myCanvas");
    var canvasSize = handSignUtil.getCanvasSize();
    handSignUtil.canvasWrite = new canvasWrite(
      handSignUtil.canvas,
      canvasSize.width,
      canvasSize.height
    );
    handSignUtil.canvasWrite.strokeColor(
      handSignUtil.getColorCode(handSignUtil.color)
    );
    handSignUtil.canvasWrite.lineWidth(handSignUtil.lineWidth);
  },
  getCanvasSize: function() {
    return {
      width: $("#myCanvas").width(),
      height: $("#myCanvas").height()
    };
  },
  clean: function() {
    handSignUtil.canvasWrite.clean();
  },
  //将canvas转换为图片
  generateSeal: async function(name) {
    if (!sessionStorage.token) {
      sessionStorage.token = (await BaseApi.createRpcToken("/getToken")).result;
    }
    if (!name.isSubmitIng) {
      var that = name;
      that.isSubmitIng = true;
      var tmpBase64 = handSignUtil.canvas.toDataURL("image/png");
      var canvasSize = handSignUtil.getCanvasSize();
      var tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = canvasSize.height;
      tmpCanvas.height = canvasSize.width;
      var ctx = tmpCanvas.getContext("2d");
      var image = new Image();
      image.src = tmpBase64;
      image.onload = function() {
        ctx.translate(0, canvasSize.width);
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.drawImage(image, 0, 0);
        var imageBase64 = tmpCanvas.toDataURL("image/png");
        var sealJson = {
          base64Image: imageBase64,
          sourceType: 2
        };
        var sealInfo = JSON.stringify(sealJson);
        $.ajax({
          url: "/m/seal/uploadHandSeal",
          type: "POST",
          data: sealInfo,
          dataType: "json",
          contentType: "application/json",
          timeout: 300000,
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            that.isSubmitIng = false;
          },
          headers: {
            token: urlParse().token,
            "X-CSRF-Token": sessionStorage.token,
            "request-id": Util.getUID()
          },
          success: function(data) {
            if (data.code == 200) {
              $(".bg").hide();
              $("#hand-sign").hide();
              $("#successBox").show();
              if (urlParse().wirte == "1") {
                setTimeout(() => {
                  that.$router.push({ path: "/signature" });
                }, 1000);
              }
              if (urlParse().from == "sign") {
                that.$router.push(
                  `../sign/?id=${urlParse().id}&taskId="${
                    urlParse().taskId
                  } &from=canvasSign`
                );
              }
            } else {
              $.showMsg(data.message);
            }
            that.isSubmitIng = false;
          }
        });
      };
    }
  }
};
export default {
  name: "canvasSign",
  components: {},
  data() {
    return {
      activeColor: 3,
      activeLine: 4,
      isSubmitIng: false
    };
  },
  computed: {},
  mounted() {
    this.initStyle();
    handSignUtil.pageshow();
  },
  methods: {
    submit() {
      handSignUtil.generateSeal(this);
    },
    initStyle() {
      $("#successBox").css("width", window.innerHeight + "px");
      $("#successBox").css("height", window.innerWidth + "px");
      $("#successBox").css("transform-origin", "right bottom");
      $("#successBox").css(
        "transform",
        "rotate(90deg) translate(" +
          (window.innerHeight - window.innerWidth) +
          "px," +
          window.innerHeight +
          "px)"
      );
    },
    activeColorChange(flag) {
      this.activeColor = flag;
      handSignUtil.color = flag;
      handSignUtil.canvasWrite.strokeColor(
        handSignUtil.getColorCode(handSignUtil.color)
      );
    },
    clean() {
      handSignUtil.clean();
    },
    activeLineChange(flag) {
      this.activeLine = flag;
      handSignUtil.lineWidth = flag;
      handSignUtil.canvasWrite.storkelienWidth(handSignUtil.lineWidth);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scope="true">
#successBox {
  display: flex;
  justify-content: center;
  align-items: center;
}
.hand-sign {
  #hand-sign {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    vertical-align: middle;
  }

  .my-hand-sign-Context {
    width: 100%;
    height: 100%;
    position: fixed;
    padding: 0;
    margin: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    vertical-align: middle;
  }

  .my-hand-sign-bottom {
    float: left;
    margin-top: 3%;
    width: 10%;
    height: 85%;
    vertical-align: middle;
    text-align: center;
    margin-left: 3px;
  }

  .myCanvas {
    float: right;
    width: 83%;
    height: 99%;
    margin-right: 10px;
    border: 1px dashed #9f9f9f;
    background-size: cover;
    background-position: center;
  }

  .signTitle {
    float: right;
    width: 10%;
    height: 100%;
    margin-right: 10px;
  }

  .clean {
    width: 100%;
    height: 20%;
    position: relative;
    display: block;
    left: 0;
    top: 7%;
  }

  .disable {
    width: 100%;
    height: 20%;
    display: block;
    position: relative;
    left: 0;
    top: 12%;
  }

  .submit {
    width: 100%;
    height: 20%;
    display: none;
    position: relative;
    left: 0;
    top: 12%;
  }

  .lines {
    text-align: center;
    vertical-align: center;
    width: 32px;
    margin-left: 1px;
    position: relative;
    left: 0;
    top: 3%;
  }

  .my-hand-sign-line {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 1px solid white;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .my-hand-sign-line .nor-img {
    display: block;
  }

  .my-hand-sign-line .active-img {
    display: none;
  }

  .my-hand-sign-line-active .nor-img {
    display: none;
  }

  .my-hand-sign-line .active-img {
    display: block;
  }

  .line-img {
    width: 30px;
    height: 30px;
  }

  .colors {
    text-align: center;
    vertical-align: center;
    width: 32px;
    margin-left: 1px;
    position: relative;
    left: 0;
    top: 20%;
  }

  .my-hand-sign-uncheck {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    margin-left: 4px;
    margin-top: 4px;
  }

  .my-hand-sign-check {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    margin-left: 2px;
    margin-top: 2px;
  }

  .my-hand-sign-check-div {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 1px solid white;
    overflow: hidden;
  }

  .my-hand-sign-check-div-red {
    background-color: #f6f6f6;
    border: 1px solid red;
  }

  .my-hand-sign-check-div-blue {
    background-color: #f6f6f6;
    border: 1px solid blue;
  }

  .my-hand-sign-check-div-black {
    background-color: #f6f6f6;
    border: 1px solid black;
  }

  .ui-loader-default {
    display: none;
  }

  .ui-mobile-viewport {
    border: none;
  }
}
</style>
