<template>
  <div class="signComplete" id="docSign">
    <nav-top :name="'我的文件'">
      <div slot="submit" @click="submit" v-if="queryParams.taskId">提交</div>
    </nav-top>
    <mt-navbar v-model="selected">
      <mt-tab-item id="0">保全证书</mt-tab-item>
      <mt-tab-item id="1">合同预览</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected" class="tabContainer">
      <mt-tab-container-item id="0">
        <see :data="seeData" v-if="seeData"></see>
      </mt-tab-container-item>
      <mt-tab-container-item id="1">
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
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import NavTop from "./common/NavTop.vue";
import BaseApi from "@lib/baseApi.js";
import see from "./common/see.vue";
import { Indicator } from "mint-ui";
import DargApi from "@lib/dragApi.js";
import Util from "@lib/util.js";
import { MessageBox } from "mint-ui";
import md5Util from "@lib/md5.js";
export default {
  name: "HelloWorld",
  data() {
    return {
      fileArray: [],
      selected: "0",
      queryParams: null,
      up: true,
      seeData: null,
      currentItem: {
        name: "数码科技合同"
      }
    };
  },
  components: {
    NavTop,
    see
  },
  created() {
    this.queryParams = this.$route.query;
  },
  computed: {},
  mounted() {
    this.getFiled();
  },
  methods: {
    changeShowFileList() {
      this.up = !this.up;
    },

    selectItem(item) {
      this.currentItem = item;
      this.getCrea(item.id);
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
    getCrea(fileId) {
      this.seeData = null;
      BaseApi.createRpcToken("/file/cert", {
        fileId: fileId || 1
      }).then(
        data => {
          this.seeData = data.datas.cert;
        },
        () => {}
      ).catch(function(e) {
          errorLog(e);
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
.signComplete {
  padding-top: 52px;
  height: 100%;
  background-color: white;
  .canvasBox {
    position: relative;
  }
  .mint-navbar .mint-tab-item.is-selected {
    border-bottom: 3px solid #b41c2e;
    color: #b41c2e;
    margin-bottom: -3px;
  }
  .mint-cell {
    min-height: 70px;
  }
  .tabContainer {
    height: calc(100% - 116px);
    .mint-tab-container-wrap {
      height: 100%;
      .mint-tab-container-item {
        height: 100%;
        position: relative;
        padding-top: 10px;
      }
    }
  }
  .mint-tab-container-item {
    height: 100%;
    position: relative;
    overflow: auto;
  }
  .content {
    position: relative;
    .seleteDetail {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 102px;
      left: 0;
      overflow: auto;
      background-color: white;
    }
    .contractContainer {
      width: 100%;
      padding-top: 51px;
      overflow: auto;
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
    position: absolute;
    width: 100%;
    top: 6px;
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
