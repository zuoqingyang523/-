<template>
  <div class="sign" id="docSign">
    <nav-top :name="'我的文件'"></nav-top>
    <div class="selectBox">
      {{currentItem.fileName}}
      <span
        v-show="up&&fileArray.length>1"
        class="tir"
        @click="changeShowFileList"
      ></span>
      <span v-show="!up&&fileArray.length>1" class="tir" @click="changeShowFileList"></span>
      <div class="readLine"></div>
    </div>
    <div class="content">
      <div
        class="contractContainer"
        v-for="item in fileArray"
        :id="item.id"
        :key="item.id"
        v-show="item.id == currentItem.id"
      ></div>
      <div v-show="!up" class="seleteDetail">
        <ul>
          <li
            v-for="item in fileArray"
            :key="item.id"
            class="contractItem"
            @click="selectItem(item)"
          >
            <div class="fistLineBox">
              <div class="nameBox">{{item.fileName}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import NavTop from "./common/NavTop.vue";
import BaseApi from "@lib/baseApi.js";
import { Indicator } from "mint-ui";
import Util from "@lib/util.js";
import { MessageBox } from "mint-ui";
import md5Util from "@lib/md5.js";
export default {
  name: "HelloWorld",
  components: {},
  data() {
    return {
      fileArray: [],
      queryParams: null,
      up: true,
      currentSeal: {},
      showDropImg: false,
      headerHeight: 102,
      defaultSelWidth: 119,
      canvasHeight: 0,
      canvasWith: 0,
      scale: 0,
      currentItem: {
        name: "数码科技合同"
      }
    };
  },
  components: {
    NavTop
  },
  created() {
    this.queryParams = this.$route.query;
  },
  computed: {},
  mounted() {
    this.getFiled();
    this.getSealList();
  },
  methods: {
    changeShowFileList() {
      this.up = !this.up;
    },
    selectItem(item) {
      this.currentItem = item;
      this.up = true;
      this.$forceUpdate();
      if (!this.currentItem.isAdd) {
        this.currentItem.isAdd = true;
        this.$nextTick(() => {
          this.getPdfToImage(this.currentItem.filePath, this.currentItem.id);
        });
      }
    },
    getPage(page, index, id) {
      var scale = 1; //缩放倍数，1表示原始大小
      var viewport = page.getViewport(scale);
      var clientWidth = $(window).width();
      this.scale = clientWidth / viewport.width;
      this.canvasHeight = viewport.height;
      this.canvasWith = viewport.width;
      viewport = page.getViewport(this.scale);
      var canvas = document.getElementById("canvas" + index + id);
      var canvasFather = canvas.parentNode;
      var context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvasFather.style.width = viewport.width + "px";
      canvasFather.style.height = viewport.height + "px";
      //   canvasFather.style.margin = "10px auto";
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext).promise.then(() => {
        this.loadedPageCount++;
      });
    },
    getPdfToImage(url, id) {
      let container = document.getElementById(id);
      container.style.display = "block";
      let _this = this;
      url =
        url ||
        "http://xcon-dev.oss-cn-beijing.aliyuncs.com/contract/1703/20181228/b7cc408b4dde4810bbbb7cb51d46e342.pdf";
      PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
        _this.totalPage = pdf.numPages;
        for (let i = 1; i <= _this.totalPage; i++) {
          $(container).append(
            `<div class="canvasBoxFlag" data-pageIndex=${i} id="canvasBoxFlag${i}${id}"><canvas data-pageIndex=${i} class="canvasContent" id="canvas${i}${id}"></canvas></div>`
          );
          $(".canvasBoxFlag").addClass("canvasBox");
        }
        for (let i = 1; i <= _this.totalPage; i++) {
          pdf.getPage(i).then(page => {
            _this.getPage(page, i, id);
          });
        }
      });
    },
    getFiled() {
      BaseApi.createRpcToken("/file/list", {
        id: this.$route.query.id || 1
      }).then(
        data => {
          this.fileArray = data.datas.list;
          this.selectItem(this.fileArray[0]);
        },
        () => {}
      ).catch(function(e) {
          errorLog(e);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.sign {
  .canvasBox {
    position: relative;
  }
  .my-doc-sign-seal_bg {
    background-color: #f5dbd4;
    opacity: 0.5;
  }
  .my-doc-sign-seal_delete {
    position: absolute;
    top: -14px;
    right: -18px;
    display: inline-block;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 18px;
    border: 1px solid #dedede;
    border-radius: 50%;
    color: #9e9e9e;
    font-size: 12px;
  }
  .my-doc-sign-seal {
    position: fixed;
    z-index: 169;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    z-index: 100;
    display: block;
  }
  .sealPositon {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -22px;
    margin-left: -22px;
    width: 45px;
    height: 45px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .sealNormal {
    position: absolute;
    width: 119px;
    height: 119px;
    background-color: rgba(208, 2, 27, 0.08);
    z-index: 4;
    img {
      width: 119px;
      height: 119px;
    }
    .deleteSeal {
      position: absolute;
      display: none;
      font-size: 12px;
      font-weight: 400;
      color: #fff;
      line-height: 12px;
      text-align: center;
      width: 40px;
      height: 20px;
      z-index: 2;
      line-height: 20px;
      background: rgba(208, 2, 27, 0.6);
      opacity: 1;
      border-radius: 0 0 10px 10px;
      cursor: pointer;
      border: none;
      left: 50%;
      top: 118px;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
    }
    &:hover {
      .deleteSeal {
        display: block;
      }
    }
  }
  height: 100vh;
  background-color: white;
  .content {
    padding-top: 102px;
    padding-bottom: 51px;
    position: relative;
    .seleteDetail {
      position: absolute;
      width: 100%;
      height: calc(100vh - 102px);
      top: 102px;
      left: 0;
      overflow: auto;
      background-color: white;
    }
    .contractContainer {
      width: 100%;
    }
  }
  .contractItem {
    padding: 0 20px;
    box-sizing: border-box;
    background-color: white;
    .fistLineBox {
      height: 35px;
      font-size: 15px;
      border-bottom: 1px solid #ebebeb;
      .nameBox {
        float: left;
        line-height: 35px;
      }
      .timeBox {
        float: right;
        padding-top: 15px;
        font-size: 12px;
        color: #b4b4b4;
        line-height: 12px;
      }
    }
    .lastLine {
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: #969696;
      text-align: left;
    }
  }
  .selectBox {
    height: 50px;
    font-size: 14px;
    color: #b41c2e;
    text-align: center;
    line-height: 50px;
    z-index: 200;
    opacity: 0.8;
    position: fixed;
    width: 100%;
    top: 50px;
    z-index: 20;
    background: white;
    border-bottom: 1px solid #dcdcd8;
    .tir {
      width: 22px;
      height: 12px;
      position: absolute;
      right: 10px;
      top: 20px;
      background: url(./../../assets/images/common/pulldown_icon.png);
      background-size: 100% 100%;
    }
    .readLine {
      position: absolute;
      width: 110px;
      height: 2px;
      top: 49px;
      left: 50%;
      margin-left: -55px;
      background-color: #b41c2e;
    }
  }
  .handlerBottom {
    height: 50px;
    font-size: 18px;
    color: #b41c2e;
    text-align: center;
    line-height: 50px;
    position: fixed;
    bottom: 0;
    display: flex;
    z-index: 200;
    width: 100%;
    border-top: 1px solid #dcdcd8;
    background: white;
    opacity: 0.9;
    div {
      flex: 1;
    }
    & > div:first-child {
      border-right: 1px solid #dcdcd8;
    }
  }
}
</style>
