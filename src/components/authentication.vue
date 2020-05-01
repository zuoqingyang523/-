<template>
  <div class="Authentication">
      <mt-header title="认证信息">
        <router-link to="/home" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
     </mt-header>
     <div v-if="norealName">
          <mt-navbar v-model="selected" >
              <mt-tab-item id="1">个人信息</mt-tab-item>
              <span class="line"></span>
              <mt-tab-item id="2">企业信息</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">
                <mt-cell title="姓名：">{{userMessage.realName}}</mt-cell>
                <mt-cell title="身份证号：">{{userMessage.idcardNumber}}</mt-cell>
                <mt-cell title="认证状态："><span>未认证</span>
                <mt-button type="default" @click="goFn">去认证 
                </mt-button></mt-cell>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
              <mt-cell title="企业名称："></mt-cell>
              <mt-cell title="所属行业："></mt-cell>
              <mt-cell title="机构类型："></mt-cell>
              <mt-cell title="公司地址："></mt-cell> 
              <mt-cell title="联系电话："></mt-cell>
              <mt-cell title="认证状态：">
                <span>未认证</span>
                <mt-button type="default" @click="goFn">去认证</mt-button>
              </mt-cell>
            </mt-tab-container-item>
          </mt-tab-container>
     </div>
     <div v-if='realNameG' class="noLine">
        <mt-navbar v-model="selected">
          <mt-tab-item id="1">个人信息</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <mt-cell title="姓名：">{{userMessage.realName}}</mt-cell>
            <mt-cell title="身份证号：">{{userMessage.idcardNumber}}</mt-cell>
            <mt-cell title="认证状态：">已认证</mt-cell>
          </mt-tab-container-item>
        </mt-tab-container>
     </div>
     <div v-if='realNameQ' class="noLine">
        <mt-navbar v-model="selected">
          <mt-tab-item id="1">企业信息</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="selected" >
          <mt-tab-container-item id="1">
            <mt-cell title="企业名称：">{{userMessage.enterpriseName}}</mt-cell>
            <mt-cell title="所属行业：">{{userMessage.categoryName}}</mt-cell>
            <mt-cell title="机构类型：">{{userMessage.industryName}}</mt-cell>
            <mt-cell title="公司地址：">{{userMessage.enterpriseAddress}}</mt-cell> 
            <mt-cell title="联系电话：">{{userMessage.enterprisePhone}}</mt-cell>
           <mt-cell title="认证状态：">已认证</mt-cell>
          </mt-tab-container-item>
        </mt-tab-container> 
     </div>
      <mt-popup
              v-model="popupVisible"
              popup-transition="popup-fade">
              <p>请到Xcontract电子签名平台<br/>
            电脑版官网进行企业实名认证，
            http://www.xcontract.cn</p>
            <span @click="okFn">好的</span>
      </mt-popup>
  </div>
  
</template>
<script>
import BaseApi from "@lib/baseApi.js"
export default {
  data(){
    return {
    success:false,
    selected:'1',
    userMessage:[],
    popupVisible:false,
    norealName:true,
    realNameG:false,
    realNameQ:false,
    }
  },
  methods:{
    okFn(){
      this.popupVisible=false
    },
  goFn(){
      this.popupVisible=true
    }
  },
  created(){
    BaseApi.createRpcToken("/user/getUserInfo",).then(
        data => {
          console.log(data.datas.success)
          this.userMessage=data.datas;
         if(data.datas.success==false){
            this.norealName=true;
            this.realNameG=false;
            this.realNameQ=false;
         }else{
           if(data.datas.realNameType=='1'){
             this.norealName=false;
            this.realNameG=true;
            this.realNameQ=false;
           }else{
            this.norealName=false;
            this.realNameG=false;
            this.realNameQ=true;
           }
         }
        }).catch(function(e) {
          errorLog(e);
        });
  },
}
</script>
<style lang="scss">
.Authentication{
  width:100%;
  height:100%;
  background: #FAFAFA;
  .mint-header{
      height: 52px;
      line-height: 52px;
      background: #B41C2E;
      font-size: 18px;
      letter-spacing: 3px;
      font-family: 'PingFangSC-Medium';
  }
  .mint-navbar{
    margin-bottom: 10px;
    .mint-tab-item-label{
      font-size: 16px;
    }
    .mint-tab-item.is-selected{
      color: #B41C2E;
      border-bottom:3px solid #B41C2E;
    }
    .mint-tab-item:nth-child(1){
      position: relative;
    }
    .line{
      position: absolute;
      display: table;
      width:2px;
      height:24px;
      background: #F0F0F0;
      left:50%;
      margin-top: 12px;
      margin-left: -1px;
    }
  }
  .mint-tab-container{
    .mint-cell{
      border-bottom:1px solid #F0F0F0;
    }
    .mint-cell-value{
        color: #B4B4B4;
    }
    .mint-tab-container-item:nth-child(1){
        .mint-cell:last-child{
          .mint-cell-value{
            color: #28BF15;
          }
        }
    }
    .mint-tab-container-item{
        .mint-cell:last-child{
          .mint-cell-value{
            span:nth-child(1){
              color: #E88078;
              margin-right: 10px;
            }
            .mint-button--default{
              font-size: 14px;
              display: inline-block;
              height: 25px;
              line-height: 23px;
              text-align:center;
              background-color: #fff;
              border: 1px solid #969696;
              border-radius: 2px;
              color: #E88078;
            }
          }
        }
    }
    .mint-tab-container-item:last-child{
        .mint-cell:nth-child(6){
          .mint-cell-value{
            span:nth-child(1){
              color: #E88078;
              margin-right: 10px;
            }
            .mint-button--default{
              font-size: 14px;
              display: inline-block;
              height: 25px;
              line-height: 25px;
              text-align:center;
              background-color: #fff;
              border: 1px solid #969696;
              border-radius: 2px;
              color: #E88078;
            }
          }
        }
    }
  }
  .noLine{
    .mint-navbar .mint-tab-item.is-selected{
      border:1px solid #F0F0F0;
    }
  }
  .mint-popup{
    width:270px;
    height:163px;
    border-radius: 16px;
    text-align: center;
    p{
      padding:30px 20px;
      text-align: center;
      color: #323232;
      overflow: hidden;
      font-size: 16px;
      border-bottom:1px solid #B4B4B4;
      line-height: 20px;
    }
    span{
      line-height: 45px;
      font-size: 16px;
      color: #787878;
    }
  }
}
</style>
