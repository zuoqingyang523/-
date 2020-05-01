<template>
  <div class="signDetail">
    <nav-top :name="'保全凭证'" :state="'close'">
      <!-- <div slot="submit" @click="save">保存</div> -->
    </nav-top>
    <div style="height:50px;"></div>
    <div class="detail" >
      <p class="pageDscp">基本信息</p>
      <ul class="moduleContent">
        <li class="item">
          <div class="label">合同名称：</div>
          <div class="content">{{detail.info.name}}</div>
        </li>
        <li class="item">
          <div class="label">发起签约时间：</div>
          <div class="content">{{detail.info.signStartTime}}</div>
        </li>
        <li class="item">
          <div class="label">签署方式：</div>
          <div class="content">
            <span v-if="detail.info.orderType == 0">无序</span>
            <span v-if="detail.info.orderType == 1">顺序</span>
          </div>
        </li>
        <li class="item">
          <div class="label">签约方：</div>
          <div class="content signList">
            <span
              class="moreNameSign"
              v-for="(item,index) in detail.signatoryList"
              :key="index"
            >{{item.name}}</span>
          </div>
        </li>
      </ul>
      <ul class="moduleContent">
        <li class="item">
          <div class="label">合同编号：</div>
          <div class="content">legalXchain-abc20181115001</div>
        </li>
        <li class="item">
          <div class="label">签署完成日期：</div>
          <div class="content">2018.11.13 20:12:13</div>
        </li>
        <li class="item">
          <div class="label">签署完合同有效期限：</div>
          <div
            class="content"
          >{{detail.info.startDate |formatData}}至{{detail.info.endDate|formatData}}</div>
        </li>
        <!-- <li class="item">
          <div class="label">履约方：</div>
          <div class="content">北京天马科技有限公司</div>
        </li>-->
      </ul>
      <ul class="moduleContent noBorder">
        <li class="item">
          <div class="label">证书签发机构：</div>
          <div class="content">司法联盟链legalXchain</div>
        </li>
        <li class="item">
          <div class="label">签署平台：</div>
          <div class="content">Xcontract</div>
        </li>
        <li class="item">
          <div class="label">时间戳：</div>
          <div class="content">国家授时中心北斗卫星授时</div>
        </li>
        <li class="item">
          <div class="label">签署地点：</div>
          <div class="content">北京市朝阳区利泽东路308号</div>
        </li>
      </ul>
      <p class="pageDscp">保全凭证</p>
      <ul
        class="status moduleContent"
        v-for="item in detail.contractSignList"
        :key="item.signStatusTime"
      >
        <li class="item moduleDscp statusDscp">
          <div class="label">{{judgeStatus(item)}}</div>
          <div class="content">2018.11.13 20:12:13</div>
        </li>
        <li class="item">
          <div class="label">发起方：</div>
          <div class="content">{{detail.contractUser.name}}</div>
        </li>
        <li class="item">
          <div class="label">发起时间：</div>
          <div class="content">{{detail.info.signStartTime}}</div>
        </li>
        <li class="item">
          <div class="label">签署状态：</div>
          <div class="content">{{judgeStatus(item)}}</div>
        </li>
        <li class="item">
          <div class="label">存证ID：</div>
          <div class="content">{{item.txId}}</div>
        </li>
        <img class="flag" v-if="item.txId" src="@image/seal02_img.png">
      </ul>
    </div>
  </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js";
import { Indicator } from "mint-ui";
import NavTop from "./common/NavTop.vue";
import Util from "@lib/util.js";

export default {
  name: "HelloWorld",
  components: {},
  data() {
    return {
      detail: {
        info:{}
      },
      queryParams: null
    };
  },
  components: {
    NavTop
  },
  filters: {
    formatData(value) {
      if (value) {
        return value.slice(0, 10);
      } else {
        return "";
      }
    }
  },
  created() {
    this.queryParams = this.$route.query;
  },
  computed: {},
  mounted() {
    this.getDetail();
  },
  methods: {
    judgeStatus(item) {
      if (item.signStatus === 0) {
        return "发起签约";
      } else if (item.signStatus === 2) {
        return "已签";
      } else if (item.signStatus === 1) {
        return "未签";
      } else if (item.signStatus === 3) {
        return "拒签";
      }
    },
    getDetail() {
      Indicator.open();
      BaseApi.createRpcToken("/contract/detail", {
        id: this.queryParams.id
      }).then(
        data => {
          this.detail = data.datas.detail;
          Indicator.close();
        },
        () => {
          Indicator.close();
        }
      ).catch(function(e) {
          errorLog(e);
        });
    },
    save() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.signDetail {
  width: 100%;
  height: 100vh;
  .detail {
    height: calc(100vh -50px);
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    overflow: auto;
    .pageDscp {
      line-height: 25px;
      font-size: 14px;
      color: #505050;
      padding-left: 10px;
    }

    .moduleContent {
      padding: 10px;
      border-bottom: 1px dashed #979797;
      background-color: white;
      .item {
        line-height: 22px;
        display: flex;
        .label {
          width: 42%;
          color: #646464;
        }
        .content {
          color: #969696;
        }
        .signList {
          display: flex;
          justify-content: space-around;
        }
      }
    }
    .status {
      border: 1px dashed #979797;
      margin-bottom: 10px;
      border-radius: 6px;
      position: relative;
      .statusDscp {
        border-bottom: 1px dashed #979797;
        .label {
          font-size: 13px;
          color: #646464;
        }
      }
      .flag {
        position: absolute;
        width: 63px;
        height: 53px;
        top: 90px;
        right: 30px;
      }
      .item {
        .label {
          color: #969696;
          width: 88px;
        }
        .content {
          width: calc(100% - 88px);
          white-space: normal;
          word-break: break-all;
          word-wrap: break-word;
        }
      }
    }
    .noBorder {
      border: none;
    }
  }
}
</style>
