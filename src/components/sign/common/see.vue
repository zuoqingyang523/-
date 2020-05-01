<template>
  <div class="contentContainer">
    <div class="proFlag"></div>
    <div class="proTitle">Xcontract电子签约保全证书</div>
    <div class="proId">证书编号：XC0120181212001337</div>
    <div class="proDscp">
      本证书由司法联盟链legalXchain签发，证明文件（电子数据）自电子签约发起
      至签署完成，已经存在且内容保持完整，未被修改。
    </div>
    <div class="proIdList">
      <div class="item" style="margin-bottom: 20px;">
        <div class="label">合同指纹HASH:</div>
        <div class="content">{{data.fileHash}}</div>
      </div>
      <div class="item">
        <div class="label">区块链保全ID：</div>
        <div class="content">{{data.txId}}</div>
      </div>
    </div>
    <div class="proIdList formItem">
      <div class="item">
        <div class="label">合同名称：</div>
        <div class="content">{{data.contract.name}}</div>
      </div>
      <div class="item">
        <div class="label">签署截止日期：</div>
        <div class="content">{{data.contract.signDeadlineDate}}</div>
      </div>
      <div class="item">
        <div class="label">合同有效期：</div>
        <div class="content">{{data.contract.startDate}}</div>
      </div>
      <div class="item">
        <div class="label">发起方：</div>
        <div class="content">{{data.contractUser.name}}</div>
      </div>
      <div class="item">
        <div class="label">发起时间：</div>
        <div class="content">{{data.contract.signStartTime}}</div>
      </div>
      <div class="item">
        <div class="label">签署方：</div>
        <div class="content">{{getSignUser(data.signatoryList)}}</div>
      </div>
      <div class="item">
        <div class="label">签署完成日期：</div>
        <div class="content">{{data.contract.signFinishTime}}</div>
      </div>
      <div class="item">
        <div class="label">签署平台：</div>
        <div class="content">Xcontract</div>
      </div>
      <div class="item">
        <div class="label">顺序签署：</div>
        <div class="content" v-if="data.contract.orderType==1">是</div>
        <div class="content" v-if="data.contract.orderType==0">否</div>
      </div>
      <div class="item">
        <div class="label">时间戳：</div>
        <div class="content">国家授时中心北斗卫星授时</div>
      </div>
      <div class="item">
        <div class="label">证书签发机构：</div>
        <div class="content">司法联盟链legalXchain</div>
      </div>
      <div class="item">
        <div class="label">文件大小：</div>
        <div class="content">{{data.fileSize}}</div>
      </div>
      <div class="item">
        <div class="label">文件格式：</div>
        <div class="content">.PDF</div>
      </div>
      <div class="seaImage"></div>
    </div>
    <div class="bottomDetail">
      <div class="qrcodeBox">
        <div class="qrcode"></div>
        <p class="qrcodeDscp">扫描二维码•手机端查看</p>
      </div>
      <div class="sealPower"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {};
  },
  mounted() {},

  methods: {
    getSignUser(data) {
      let temp = "";
      if (data && data.length) {
        data.forEach(element => {
          temp += element.name;
        });
      }
      return temp;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.contentContainer {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background: url(./../../../assets/images/Group_bg.png);
  background-size: 100% 100%;
  padding: 10px 5% 20px 5%;
  .proFlag {
    width: 140px;
    height: 60px;
    margin: 0 auto;
    margin-bottom: 20px;
    background: url(./../../../assets/images/logo02_img.png);
    background-size: 100%;
  }
  .proTitle {
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #323232;
    text-align: center;
    line-height: 24px;
    margin-bottom: 14px;
  }
  .proId {
    font-size: 14px;
    color: #464646;
    text-align: center;
    line-height: 14px;
    margin-bottom: 20px;
  }
  .proDscp {
    font-size: 14px;
    color: #464646;
    text-align: justify;
    line-height: 16px;
    text-indent: 2em;
    margin-bottom: 20px;
  }
  .proIdList {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 30px 30px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #646464;
    line-height: 12px;
    background: url(./../../../assets/images/scancode02_img.png) no-repeat;
    background-size: 100% 100%;
    .item {
      display: flex;
      justify-content: space-around;
      .label {
        width: 94px;
        text-align: left;
        font-size: 12px;
        word-break: break-all;
        line-height: 28px;
      }
      .content {
        width: 220px;
        text-align: left;
        font-size: 12px;
        line-height: 14px;
        flex: 1;
        word-break: break-all;
      }
    }
  }
  .formItem {
    background: none;
    padding: 0 40px;
    height: auto;
    position: relative;
    margin-bottom: 37px;
    .item {
      margin-bottom: 10px;
      .label {
        line-height: 12px;
      }
      .content {
        font-size: 12px;
        line-height: 12px;
        margin-top: 0px;
      }
    }
    .seaImage {
      position: absolute;
      background: url(./../../../assets/images/seal02_img.png);
      width: 127px;
      height: 106px;
      bottom: 20px;
      left: 182px;
    }
  }
  .bottomDetail {
    width: 100%;
    height: 126px;
    display: flex;
    justify-content: space-between;
    .sealPower {
      width: calc(100% - 150px);
      height: 126px;
      background: url(./../../../assets/images/chapter02_img.png);
      background-size: 100% 100%;
    }
    .qrcodeBox {
      padding-top: 18px;
    }
    .qrcode {
      width: 80px;
      height: 80px;
      background: url(./../../../assets/images/code02_img.png);
      background-size: 80px 80px;
      margin: 0 auto;
      margin-bottom: 10px;
    }
    .qrcodeDscp {
      font-size: 14px;
      color: #646464;
      text-align: center;
      line-height: 14px;
    }
  }
}
</style>
