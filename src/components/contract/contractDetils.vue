<template>
  <div class="detailsBox">
    <mt-header title="合同详情">
      <router-link to="/contract" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="detailsCon">
      <div class="detailsHead">
        <h2>{{result.name}}</h2>
        <p>
          <span>{{result.categoryName}}</span>
          <img src="../../assets/images/views_icon.png">
          <span>{{result.viewCount}}</span>
        </p>
      </div>
      <div class="padBox">
        <pdf
          :src="src"
          :page="currentPage"
          @num-pages="pageCount=$event"
          @page-loaded="currentPage=$event"
          @loaded="loadPdfHandler"
        ></pdf>
      </div>
    </div>
    <div class="footer">
      <span class="money">¥{{money}}</span>
      <mt-button type="default" class="help" @click="helpFn">帮助</mt-button>
      <mt-button type="danger" class="pay" @click="goPay">购买</mt-button>
      <mt-popup v-model="helpVisible" popup-transition="popup-fade" class="helpBox">
        <h3>购买流程</h3>
        <ul>
          <li>
            <span class="number">1</span>
            搜索找到您需要的文书
          </li>
          <li>
            <img src="../../assets/images/next_icon.png">
          </li>
          <li>
            <span class="number">2</span>
            预览文书
          </li>
          <li>
            <img src="../../assets/images/next_icon.png">
          </li>
          <li>
            <span class="number">3</span>
            支付并购买
          </li>
          <li>
            <img src="../../assets/images/next_icon.png">
          </li>
          <li>
            <span class="number">4</span>
            系统会自动发送到邮箱下载
          </li>
        </ul>
        <img src="../../assets/images/shut_icons.png" @click="closeFn" class="close">
      </mt-popup>
    </div>
  </div>
</template>
<script>
import pdf from "vue-pdf";

import BaseApi from "@lib/baseApi.js";
export default {
  data() {
    return {
      popupVisible: false,
      helpVisible: false,
      id: "",
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: "pdf", // 文件类型
      src: "",
      mail: "",
      money: "",
      contractId: "",
      result: []
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.money = this.$route.query.money;
    this.init();
  },
  methods: {
    init() {
      var queryStr = {
        id: this.id
      };
      console.log(this.currentPage);
      if (this.contratName) queryStr.contratName = this.contratName;
      BaseApi.createRpcToken("/template/readContractTemplate", queryStr)
        .then(data => {
          console.log(data);
          this.result = data.datas;
          this.src = pdf.createLoadingTask(this.result.filePath);
          this.contractId = data.datas.id;
        })
        .catch(function(e) {
          errorLog(e);
        });
    },
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
    },
    goPay() {
      this.$router.push({
        path: "/contractDetils/pay",
        query: {
          id: this.contractId,
          money: this.money
        }
      });
    },
    closeFn() {
      this.helpVisible = false;
    },
    helpFn() {
      this.helpVisible = true;
    }
  },
  components: {
    pdf
  }
};
</script>
<style lang="scss">
.detailsBox {
  .mint-header {
    height: 52px;
    line-height: 52px;
    background: #b41c2e;
    font-size: 18px;
    letter-spacing: 3px;
    font-family: "PingFangSC-Medium";
  }
  .detailsCon {
    width: 100%;
    height: calc(100% - 52px);
    overflow-y: scroll;
    margin-bottom: 55px;
    .detailsHead {
      width: 100%;
      overflow: hidden;
      padding: 0 10px;
      box-sizing: border-box;
      h2 {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #323232;
        font-weight: normal;
        padding: 10px 0;
      }
      p {
        padding: 10px 0;
        span:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-size: 15px;
          color: #505050;
          margin-right: 35px;
        }
        span:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: #828282;
        }
        img {
          width: 19px;
          height: 16px;
          vertical-align: middle;
          margin-right: 5px;
        }
      }
    }
    .padBox {
      width: calc(100% - 20px);
      margin: 0 10px;
      box-sizing: border-box;
      border: 1px solid #646464;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    z-index: 999;
    background-color: #fff;

    .mint-button--default {
      box-shadow: none;
    }
    span {
      display: inline-block;
    }
    .money {
      width: 42.7%;
      background: #fafafa;
      font-size: 16px;
      color: #cd5b5a;
      border-top: 1px solid rgba(000, 000, 000, 0.2);
    }
    .help {
      width: 18.7%;
      font-size: 16px;
      color: #969696;
      background-color: #fafafa;
      height: 100%;
      border-radius: 0;
      border: 0;
      border-left: 1px solid rgb(235, 235, 235);
      border-top: 1px solid rgba(000, 000, 000, 0.2);
    }
    .pay {
      width: 38.6%;
      background: #b41c2e;
      font-size: 16px;
      padding: 0;
      color: #ffffff;
      height: 100%;
      border-radius: 0;
      border-top: 1px solid#b41c2e;
    }
    .buyBox {
      width: 270px;
      height: 300px;
      border: 1px solid #f0f0f0;
      box-sizing: border-box;
      padding: 0 20px;
      box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      dl {
        margin-top: 40px;
        dt {
          height: 40px;
          img {
            width: 40px;
            height: 40px;
          }
        }
        dd {
          line-height: 16px;
          font-size: 16px;
          color: #b41c2e;
        }
      }
      .search {
        margin-top: 15px;
        margin-bottom: 10px;
        input {
          width: 100%;
          height: 44px;
          border: 1px solid #b4b4b4;
          border-radius: 8px;
          text-indent: 10px;
        }
      }
      .hint {
        font-size: 14px;
        line-height: 20px;
        color: #969696;
        text-align: justify;
      }
      .submit {
        margin-top: 10px;
        width: 100%;
        height: 44px;
        background: #b41c2e;
        border: 1px solid #b4b4b4;
        border-radius: 8px;
        font-size: 16px;
        color: #ffffff;
      }
      .close {
        width: 35px;
        height: 35px;
        position: absolute;
        bottom: -45px;
        left: 50%;
        margin-left: -17px;
      }
    }
    .helpBox {
      width: 270px;
      height: 350px;
      background: #ffffff;
      border: 1px solid #f0f0f0;
      box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      h3 {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #b41c2e;
        line-height: 40px;
        margin-top: -30px;
        margin-bottom: 10px;
      }
      ul {
        li:nth-child(2n-1) {
          width: 162px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #646464;
          border-radius: 12px;
          position: relative;
          .number {
            position: absolute;
            top: -6px;
            left: 50%;
            margin-left: -23px;
            display: inline-block;
            background-color: #fff;
            z-index: 1;
            padding: 0 18px;
            font-size: 18px;
            color: #646464;
            line-height: 12px;
          }
        }
        li:nth-child(2n) {
          line-height: 36px;
          img {
            width: 14px;
            height: 17px;
          }
        }
      }
      .close {
        width: 35px;
        height: 35px;
        position: absolute;
        bottom: -45px;
        left: 50%;
        margin-left: -17px;
      }
    }
  }
}
</style>
