<template>
  <div class="payBox">
    <mt-header title="支付">
      <router-link to="/contract" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <p class="payWay">支付方式</p>
    <mt-radio align="right" v-model="value" :options="options"></mt-radio>
    <p class="trueBox">
      <mt-button type="danger" @click="truePay">确认支付</mt-button>
    </p>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="buyBox">
      <div class="hint">
        <dl>
          <dt>温馨提示</dt>
          <dd>购买成功</dd>
        </dl>
      </div>
      <div>
        <mt-button type="default" @click="backFn">返回</mt-button>
        <router-link type="default" class="submit" tag="mt-button" to="/record">查看购买记录</router-link>
      </div>
    </mt-popup>
    <mt-popup v-model="popupVisibles" popup-transition="popup-fade" class="mint-popups">
      <div class="hint">是否购买完成</div>
      <div>
        <mt-button type="default" @click="cancelFn">取消</mt-button>
        <mt-button type="default" @click="trueFn">确定</mt-button>
      </div>
    </mt-popup>
    <p v-html="returnPay" style="display:none"></p>
  </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js";
export default {
  data() {
    return {
      selected: "1",
      userMessage: [],
      success: false,
      popupVisible: false,
      popupVisibles: false,
      contractId: "",
      returnPay: "",
      value: "1",
      isPay:false,
      isSubmitIng: false,
      options: [
        {
          label: "账户余额支付",
          value: "1"
        },
        // {
        //   label: '支付宝支付',
        //   value: '2'
        // },
        {
          label: "微信支付",
          value: "3"
        }
      ]
    };
  },
  methods: {
    backFn() {
      this.popupVisible = false;
    },
    truePay() {
      if(this.isPay==false){
        if (!this.isSubmitIng) {
          this.isSubmitIng = true;
          var querStr = {
            businessType: "1",
            payType: this.value,
            sourceFrom: "2",
            totalPrice: this.money,
            bussinessId: this.contractId
          };
          BaseApi.createRpcToken(
            "/pay/getOrderAmount",
            {
              businessType: 1,
              bussinessId: this.contractId
            },
            "post"
          ).then(
            data => {
              querStr.totalPrice = data.datas.amount;
              console.log(data.datas.amount);
              this.originalPrice = data.datas.originalPrice;
              BaseApi.createRpcToken("/pay/getPayNo", querStr, "post").then(
                data => {
                  this.payNo = data.datas.payNo;
                  if (data.datas.payType == "3") {
                    var wechatStr = {
                      payNo: this.payNo,
                      payOrder: "1",
                      body: "",
                      wapUrl: "http://m.xcontract.cn/record"
                    };
  
                    BaseApi.createRpcToken("/pay/wechat", wechatStr, "post").then(
                      payData => {
                        this.isSubmitIng = false;
                        this.popupVisibles = true;
                        localStorage.setItem("isPay", "yes");
                        window.location.href = payData.datas.result;
                      },
                      payData => {
                        this.isSubmitIng = false;
                      }
                    ).catch(function(e) {
                      errorLog(e);
                    });
                  } else if (data.datas.payType == "2") {
                    var aliPayStr = {
                      payNo: this.payNo,
                      payOrder: "1",
                      body: "",
                      returnUrl: "http://m.xcontract.cn/record"
                    };
                    console.log(aliPayStr);
                    BaseApi.createRpcToken(
                      "/pay/aliPay",
                      aliPayStr,
                      "post",
                      "",
                      "",
                      "",
                      "",
                      true
                    ).then(
                      aliPayData => {
                        this.returnPay = aliPayData;
                        setTimeout(function() {
                          document.forms[0].submit();
                        }, 500);
                        this.isSubmitIng = false;
                      },
                      aliPayData => {
                        this.isSubmitIng = false;
                      }
                    ).catch(function(e) {
                      errorLog(e);
                    });
                  } else if (data.datas.payType == "1") {
                    if (data.datas.status==1) {
                      this.$router.push("/record");
                      this.$toasts("支付成功");
                    }else{
                      this.$toasts(data.message);
                    }
                    this.isSubmitIng = false;
                  }
                },
                () => {
                  this.isSubmitIng = false;
                }
              ).catch(function(e) {
                errorLog(e);
              });
            },
            () => {
              this.isSubmitIng = false;
            }
          );
        }
      }else{
        this.$toasts("您已经购买过此模板！");
      }
    },
    cancelFn() {
      this.popupVisibles = false;
      localStorage.setItem("isPay", "no");
    },
    trueFn() {
      localStorage.setItem("isPay", "no");
      this.$router.push("/record");
    },
    //查看用户是否已经购买
    repetitionFn(id){
      var params={
        templateId:id
      }
       BaseApi.createRpcToken("/template/existPay",params).then(data => {
         console.log(data)
         if(data.datas.pay==true){
           this.isPay=true;
         }else{
           this.isPay=false;
         }
       }).catch(function(e) {
          errorLog(e);
        });
    }
  },
  created() {
    this.contractId = this.$route.query.id;
    this.repetitionFn(this.contractId)
    this.money = this.$route.query.money;
    console.log(this.contractId);
    BaseApi.createRpcToken("/user/getUserInfo").then(data => {
      console.log(data);
      if (data.datas.success == false) {
        this.success = false;
      } else {
        this.userMessage = data.datas;
        this.success = true;
      }
    }).catch(function(e) {
          errorLog(e);
        });
  },
  mounted() {
    if (localStorage.getItem("isPay") == "yes") {
      this.popupVisibles = true;
    }
  }
};
</script>
<style lang="scss">
.payBox {
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
  .payWay {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-indent: 10px;
    background: #f0f0f0;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #323232;
  }
  .mint-radiolist {
    .mint-cell {
      border-bottom: 1px solid #e6e6e6;
    }
    .mint-radio-input:checked + .mint-radio-core {
      background-color: #fff;
      border-color: #b41c2e;
    }
    .mint-radio-core::after {
      background-color: #b41c2e;
    }
  }
  .trueBox {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    margin-top: 20px;
    .mint-button {
      background: #b41c2e;
      border-radius: 8px;
      height: 40px;
      width: 100%;
    }
  }
  .mint-popup {
    width: 270px;
    height: 150px;
    border-radius: 8px;
    .hint {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      dl {
        dt {
          font-size: 16px;
          color: #323232;
        }
        dd {
          font-size: 12px;
          color: #646464;
        }
      }
    }
    .mint-button {
      width: 50%;
      height: 43px;
      line-height: 43px;
      background-color: #fff;
      font-size: 16px;
      color: #3d79fb;
    }
  }
  .mint-popups {
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
