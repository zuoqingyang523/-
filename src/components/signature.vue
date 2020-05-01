<template>
  <div class="signatureBox">
    <mt-header title="签章管理">
      <router-link to="/home" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">我的签章</mt-tab-item>
      <!-- <span class="line"> </span> -->
      <mt-tab-item id="2">授权签章</mt-tab-item>
      <mt-tab-item id="3">审核中</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="uploadBox">
          <ul>
            <li>
              <img src="../assets/images/common/add_icon.png" @click="uploadFn">
              <p>添加签章</p>
              <form style="display:none;" id="fileUpload">
                <input type="file" id="file" name="file" accept="image/*" @change="imgPreview">
              </form>
            </li>
            <li>
              <a :href="writeAddess">
                <img src="../assets/images/common/add_icon.png">
                <p>手写签章</p>
              </a>
            </li>
          </ul>
        </div>
        <div class="signBox">
          <div class="notList" v-if="!notList">
            <img src="../assets/images/noadd.png" alt>
            <p class="contentDscp">暂无数据</p>
          </div>
          <ul v-if="notList">
            <li
              v-for="item in  allSignList"
              :key="item.id"
              @click="defaultFn(item.id,item.defaulted)"
            >
              <img :src="item.fullFilePath" class="img">
              <img
                src="../assets/images/del.png"
                class="del"
                @click.stop="delFn(item.id)"
                v-if="item.defaulted=='0'"
              >
              <p v-if="item.defaulted=='1'" class="defaulted">
                <img src="../assets/images/moren.png" @click="defaultFn(item.id)">
              </p>
            </li>
          </ul>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="signBox">
          <div class="notList" v-if="accredit">
            <img src="../assets/images/noadd.png" alt>
            <p class="contentDscp">暂无授权签章</p>
          </div>
          <ul v-if="!accredit">
            <li v-for="item in accreditList" :key="item.id">
              <img :src="item.fullFilePath" class="img">
            </li>
          </ul>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <div class="signBox">
          <div class="notList" v-if="noSign">
            <img src="../assets/images/noadd.png" alt>
            <p class="contentDscp">暂无待审核印章</p>
          </div>
          <ul v-if="!noSign">
            <li v-for="item in  result" :key="item.id">
              <img :src="item.fullFilePath" class="img">
              <p class="defaulted">
                <img src="../assets/images/shenhe.png">
              </p>
            </li>
          </ul>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="buyBox">
      <div class="hint">确定要删除该印章？</div>
      <div>
        <mt-button type="default" @click="trueFn">确定</mt-button>
        <mt-button type="default" @click="cancelFn">取消</mt-button>
      </div>
    </mt-popup>
    <mt-popup v-model="defaultVisible" popup-transition="popup-fade" class="buyBox">
      <div class="hint">此印章将被设置为您的默认印章？</div>
      <div>
        <mt-button type="default" @click="trueDefaultFn">确定</mt-button>
        <mt-button type="default" @click="cancelFn">取消</mt-button>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js";
import { stat } from "fs";
import Util from "@lib/util.js";
export default {
  data() {
    return {
      notList: false,
      writeAddess: `canvasSign?token=${localStorage.token ||
        "Tnur5Z01dIINOpTFyv00y8vylkQepF"}&wirte=1`,
      selected: "1",
      success: false,
      popupVisible: false,
      defaultVisible: false,
      noSign: true,
      accredit: true,
      imgageName: "",
      result: [],
      allSignList: [],
      accreditList: [],
      id: "",
      idx: ""
    };
  },
  mounted() {
    this.init();
    this.accreditFn();
    $(".uploadBox li").css("height", $(".uploadBox li").width());
  },
  methods: {
    init() {
      var queryStrs = {
        checkStatus: "2"
      };
      BaseApi.createRpcToken("/seal/sealList", queryStrs)
        .then(data => {
          if (data.datas != null) {
            this.allSignList = data.datas.resultList;
            if (this.allSignList.length > 0) {
              this.notList = true;
            } else {
              this.notList = false;
            }
          }
        })
        .catch(function(e) {
          errorLog(e);
        });
      var queryStr = {
        checkStatus: "1"
      };
      BaseApi.createRpcToken("/seal/sealList", queryStr)
        .then(data => {
          this.result = [];
          if (data.datas != null) {
            for (var i = 0; i < data.datas.resultList.length; i++) {
              if (data.datas.resultList[i].sourceType == "1") {
                this.result.push(data.datas.resultList[i]);
              }
            }
            console.log(this.re);
            if (this.result.length > 0) {
              this.noSign = false;
            } else {
              this.noSign = true;
            }
          }
        })
        .catch(function(e) {
          errorLog(e);
        });
    },
    defaultFn(idx, status) {
      if (status == 1) {
        return;
      }
      this.idx = idx;
      this.status = status;
      this.defaultVisible = true;
    },
    uploadFn() {
      $("#file").trigger("click");
    },
    imgPreview(e) {
      var that = this;
      console.log(e);
      var files = e.target.files;
      var file = files[0];
      const formData = new FormData($("#fileUpload")[0]);
      formData.append("sourceType", "1");
      $.ajax({
        url: "/m/seal/uploadSeal",
        type: "POST",
        data: formData,
        contentType: false,
        timeout: 300000,
        processData: false,
        error: function(XMLHttpRequest, textStatus, errorThrown) {},
        headers: {
          token: localStorage.getItem("token"),
          "X-CSRF-Token": sessionStorage.token,
          "request-id": Util.getUID()
        },
        success: function(data) {
          if (data.code == "200") {
            that.$toasts("上传成功");
            that.init();
            that.selected = "3";
          }
        }
      });
    },
    accreditFn() {
      BaseApi.createRpcToken("/seal/authorizedSealList")
        .then(data => {
          console.log(data);
          if (data.datas != null) {
            this.accreditList = data.datas.resultList;
            if (this.accreditList.length > 0) {
              this.accredit = true;
            } else {
              this.accredit = false;
            }
          }
        })
        .catch(function(e) {
          errorLog(e);
        });
    },
    trueFn() {
      var queryStrs = {
        ids: this.id
      };
      BaseApi.createRpcToken("/seal/deleteById", queryStrs)
        .then(
          data => {
            console.log(data);
            if (data.datas.success == true) {
              this.$toasts("删除成功");
              this.popupVisible = false;
              this.accreditFn();
              this.init();
            } else {
              this.popupVisible = false;
              this.$toasts("删除失败");
            }
          },
          data => {
            console.log(data);
          }
        )
        .catch(function(e) {
          errorLog(e);
        });
    },
    cancelFn() {
      this.popupVisible = false;
      this.defaultVisible = false;
    },
    delFn(id) {
      this.popupVisible = true;
      this.id = id;
    },
    trueDefaultFn() {
      console.log(this.status);
      if (this.status == 1) {
        this.status = 0;
      } else {
        this.status = 1;
      }
      var queryStrs = {
        status: this.status,
        id: this.idx
      };
      console.log(queryStrs);
      BaseApi.createRpcToken("/seal/setDefaulted", queryStrs)
        .then(
          data => {
            this.defaultVisible = false;
            if (data.datas.success == true) {
              this.init();
              this.$toasts("设置成功");
            } else {
              this.$toasts("设置失败");
            }
          },
          data => {
            console.log(data);
          }
        )
        .catch(function(e) {
          errorLog(e);
        });
    }
  },
  created() {}
};
</script>
<style lang="scss">
.signatureBox {
  width: 100%;
  height: 100%;
  background: #fafafa;
  .mint-header {
    height: 52px;
    line-height: 52px;
    background: #b41c2e;
    font-size: 18px;
    letter-spacing: 3px;
    font-family: "PingFangSC-Medium";
  }
  .mint-navbar {
    margin-bottom: 3px;
    .mint-tab-item-label {
      font-size: 16px;
    }
    .mint-tab-item.is-selected {
      color: #b41c2e;
      border-bottom: 3px solid #b41c2e;
    }
    .mint-tab-item:nth-child(1) {
      position: relative;
    }
    .line {
      position: absolute;
      display: table;
      width: 2px;
      height: 24px;
      background: #f0f0f0;
      left: 50%;
      margin-top: 12px;
      margin-left: -1px;
    }
  }
  .mint-tab-container {
    width: 100%;
    height: calc(100% - 112px);
    overflow-y: scroll;
    background: #fafafa;
    .mint-tab-container-item {
      .uploadBox {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        padding: 0 10px;
        margin: 10px 0;
        ul {
          width: 100%;
        }
        li{
          float: left;
          width: calc((100% / 2) - 5px);
          height: 150px;
          border: 1px solid #dcdcdc;
          box-sizing: border-box;
          background-color: #fff;
          img {
            width: 50px;
            height: 50px;
          }
          p {
            font-size: 16px;
            color: #646464;
            margin-top: 10px;
          }
        }
        li:nth-child(1) {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-right: 10px;
        }
        li:nth-child(2){
          a{
            display: flex;
            width:100%;
            height: 100%;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .noSign {
        width: 100%;
        padding: 30px 0;
        text-align: center;
      }
      .signBox {
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        position: relative;
        .notList {
          width: 100px;
          height: 60px;
          position: absolute;
          left: 50%;
          margin-left: -50px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
          img {
            width: 35px;
            height: auto;
            margin-bottom: 10px;
          }
          .contentDscp {
            color: #b4b4b4;
            font-size: 12px;
            line-height: 15px;
          }
        }
        li:nth-child(2n-1) {
          margin-right: 10px;
        }
        li {
          float: left;
          position: relative;
          width: calc((100% - 10px) / 2);
          overflow: hidden;
          background-color: #fff;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          .img {
            width: 100%;
            height: auto;
            border: 0;
            border: 1px solid #fff;
          }
          .del {
            position: absolute;
            top: 10px;
            right: 10px;
          }
        }
        .defaulted {
          position: absolute;
          left: 0;
          top: 0;
          img {
            width: 50px;
            height: 50px;
          }
        }
      }
    }
  }
  .mint-popup {
    width: 270px;
    height: 150px;
    border-radius: 8px;
    .hint {
      width: 100%;
      height: 107px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      font-size: 16px;
      color: #323232;
    }
    .mint-button {
      width: 50%;
      height: 43px;
      line-height: 43px;
      background-color: #fff;
      font-size: 16px;
      color: #787878;
    }
  }
}
</style>
