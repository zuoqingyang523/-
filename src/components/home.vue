<template>
  <div class="home">
      <div class="head">
          <img src="../../src/assets/images/menu_icon.png" @click="barFn">
          <span>Xcontract</span>
      </div>
      <div class="sidebar">
          <div class="sidebarHead">
              <img src="../../src/assets/images/user.png" class="userImg">
              <dl class="userMessage" v-if="isauthentication">
                  <dt>{{username}}</dt>
                  <dd><img src="../../src/assets/images/have_real_icon.png"><span>已认证</span></dd>
              </dl>
              <dl class="userMessage" v-if="!isauthentication" >
                  <dt>{{username}}</dt>
                  <dd><img src="../../src/assets/images/no_real_icon.png"><span>未认证</span></dd>
              </dl>
          </div>
          <div class="sidebarCon">
              <ul>
                <router-link tag="li" to="/signature"><img src="../../src/assets/images/mysignature_icon.png">我的签章</router-link>
                <router-link  tag="li" to="/record"><img src="../../src/assets/images/purchaserecord_icon.png">合同购买记录</router-link>
                <router-link tag="li" to="authentication"><img src="../../src/assets/images/autonym_icon.png">实名认证</router-link>
              </ul>
          </div>
          <div class="exit" @click="exitFn">
              退出登录
          </div>
      </div>
      <div class="close" v-if="close" @click="closeFn"></div>
      <div class="content">
          <div class="mune">
              <div class="item">
                  <router-link tag="dl" to="/signature">
                    <dt><img src="../../src/assets/images/control stamping_icon.png"></dt>
                    <dd>签章管理</dd>
                  </router-link>
                    <router-link tag="dl" to="/contract">
                        <dt><img src="../../src/assets/images/contract template_icon.png"></dt>
                        <dd>合同模板</dd>
                    </router-link>
              </div>
              <div class="myfile">
                  <div class="fileHead">
                    <span class="fl fileName"><img src="../../src/assets/images/file_title_icon.png">我的文件</span>
                    <router-link to='/signlist' class="fr all" tag="span">查看全部</router-link>
                  </div>
                  <div class="fileCon">
                      <dl>
                        <dt @click="signFn('waitMy')">
                          <img src="../assets/images/waitseal_icon.png">
                          <span>{{numm}}</span>
                        </dt>
                        <dd>待我签</dd>
                      </dl>
                      <dl>
                        <dt @click="signFn('waitOther')">
                            <img src="../assets/images/waitothers_icon.png">
                          <span>{{numt}}</span>
                        </dt>
                        <dd>待他人签</dd>
                      </dl>
                  </div>
              </div>
          </div>
          <div class="fileBox">
              <div class="fileHead">
                <img src="../assets/images/file.png">最近文件</span>
              </div>
              <div class="fileCon" v-if="notData">
                  <div>
                      <img src="../assets/images/noadd.png" alt=""><br/>
                      暂无文件
                  </div>
              </div>
              <div class="fileCons" v-if="!notData">
                  <ul>
                    <li>
                      <li v-for="item in contractList" :key="item.id" class="contractItem" @click="goSign(item)">
                        <div class="fistLineBox">
                          <div class="nameBox">{{item.name}}</div>
                          <div class="timeBox">{{item.createTime}}</div>
                        </div>
                        <div class="lastLine">
                          <span v-if="item.contractUser">{{'发起人：'+ item.contractUser.name}}</span>
                        </div>
                      </li>
                    </li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js";
export default {
  data(){
    return{
      isauthentication:false,
      close:false,
      username:'',
      numm:0,
      numt:0,
      contractList:[],
      notData:true,
    }
  },
  created(){
    this.userMessage();
    this.init();
  },
  methods:{
    init(){
      var params={
        status:'1'
      }
      BaseApi.createRpcToken("/contract/list",params).then(
        data => {
          if(data.datas!=null){
            this.numm=data.datas.list.totalRow       
          }
      }).catch(function(e) {
          errorLog(e);
        });
      var paramss={
        status:'2'
      }
      BaseApi.createRpcToken("/contract/list",paramss).then(
        data => {
          if(data.datas!=null){
            this.numt=data.datas.list.totalRow
          }
      }).catch(function(e) {
          errorLog(e);
        });
      var paramss={
        status:'2'
      }
      BaseApi.createRpcToken("/home/getContractHomeInfo",paramss).then(
        data => {
          this.contractList=data.datas.contractList.list
          if(this.contractList.length>0){
            this.notData=false;
          }else{
            this.notData=true;
          }
      }).catch(function(e) {
          errorLog(e);
        });
    },
    signFn(name){
      this.$router.push({
        path:'/signlist',
        query:{
          flag:name
        }
      })
    },
    getTaskId(data, flag) {
      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].actionCode === flag) {
            return data[i].taskId;
          }
        }
      } else {
        return false;
      }
    },
    goSign(data, flag) {
      if (data.signStatus == 2) {
        this.$router.push(`/signComplete/?&id=${data.id}`);
      } else {
        let taskId = this.getTaskId(data.taskList, "SIGN");
        let url = `/sign/?&id=${data.id}`;
        if (taskId) {
          url = `${url}&taskId=${taskId}`;
        }
        if (localStorage.userId == data.contractUser.userId) {
          url = `${url}&contractForMe=1`;
        }
        this.$router.push(url);
      }
    },
    userMessage(){
      BaseApi.createRpcToken("/user/getUserInfo").then(
        data => {
          if(data.datas.success==false){
            this.isauthentication=false;
            this.username=localStorage.getItem('userName')
          }else{
            this.isauthentication=true
            this.username=data.datas.realName
          }
      }).catch(function(e) {
          errorLog(e);
        });
    },
    exitFn(){
      this.$toasts("退出成功");
      window.location.href="https://www.xcontract.cn/home"
    },
    barFn(){
      $('.sidebar').css('left','0')
      this.close=true;
    },
    closeFn(){
      $('.sidebar').css('left','-300px')
      this.close=false;
    }
  }
}
</script>
<style lang="scss">
.home{
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  .head{
    width:100%;
    height: 52px;
    line-height: 52px;
    background-color: #323232;
    text-align: center;
    font-size: 18px;
    color:#fff;
    position: relative;
    img{
      height: 18px;
      width:18px;
      position: absolute;
      left:20px;
      top:50%;
      margin-top:-11px;
    }
  }
  .sidebar{
    position: fixed;
    z-index: 999;
    top:0;
    left:-290px;
    width:270px;
    height:100%;
    box-sizing: border-box;
    padding:0 40px;
    padding-top:30px;
    background: #323232;
    box-shadow: 6px 6px 12px 0 rgba(0,0,0,0.30);
    transition:left 1s;
    .sidebarHead{
      overflow: hidden;
      .userImg{
        float: left;
        height: 60px;
        width:60px;
        margin-right: 10px;
        border-radius: 50%;
      }
      .userMessage{
        float: left;
        dt{
          width:118px;
          opacity: 0.8;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #FFFFFF;
          text-align: left;
          margin-bottom: 10px;
        }
        dd{
          width:82px;
          height: 25px;
          text-align: left;
          display: flex;
          align-items: center;
          span{
            opacity: 0.8;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color:#fff;
          }
          img{
            width:20px;
            height: 20px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 5px;
          }
        }
      }
    }
    .sidebarCon{
      margin-top: 50px;
      li{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #FFFFFF;
        width:100%;
        padding:15px 0;
        border-bottom: 1px solid #979797;
        img{
          height: 30px;
          width:30px;
          vertical-align: middle;
          margin-right: 11px;
        }
      }
    }
    .exit{
      position: absolute;
      bottom:30px;
      left:40px;
      opacity: 0.8;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #FFFFFF;
    }
  }
  .close{
    z-index: 999;
    position: fixed;
    right:0;
    top:0;
    width:calc(100% - 270px);
    height: 100%;
  }
  .content{
    width:100%;
    .mune{
      width:100%;
      height: 160px;
      background: #585858;
      position: relative;
      .item{
        width:100%;
        padding-top:27px;
        dl{
          float: left;
          width:calc(100% / 2);
          box-sizing: border-box;
          text-align:center;
          height: 50px;
          dt{
            img{
              width:29px;
              height: 29px;
            }
          }
          dd{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #FFFFFF;
            margin-top: 5px;
          }
        }
        dl:first-child{
          opacity: 0.8;
          border-right:1px solid #D8D8D8;
        }
        dl:last-child{
          opacity: 0.8;
          border-left:1px solid #D8D8D8;
        }
      }
      .myfile{
        position: absolute;
        left:20px;
        bottom:-100px;
        width:calc(100% - 40px);
        height: 144px;
        margin-top: -20px;
        z-index: 22;
        margin:0 auto;
        box-shadow: 0 1px 7px 0 rgba(000,000,000,0.2);
        border-radius: 12px;
        background-color: #fff;
        overflow: hidden;
        .fileHead{
          width:100%;
          height:34px;
          line-height: 34px;
          text-indent: 15px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #B4B4B4;
          border-bottom:1px solid #DCDCDC;
          .fileName{
            display:flex;
            align-items: center;
          }
          img{
            width:20px;
            height: 20px;
            margin-right: 5px;
            margin-left: 10px;
          }
          .all{
            margin-right: 24px;
            position: relative;
          }
          .all:after{
            content: '';
            width: 7px;
            height: 7px;
            position: absolute;
            top: 17px;
            right: -10px;
            border-left: 1px solid #999;
            border-bottom: 1px solid #999;
            transform: translate(0, -50%) rotate(-135deg);
          }
        }
        .fileCon{
          width:100%;
          background: #FFFFFF;
          text-align: center;
          height: 110px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #B4B4B4;
          dl:nth-child(1){
            border-right:1px solid #DCDCDC;
          }
          dl{
            width:calc(100% / 2);
            height: 110px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction:column;
            dt{
              position: relative;
              img{
                  width:50px;
                  height: 50px;
                  vertical-align: middle;
              }
              span{
                position: absolute;
                display: inline-block;
                width: 22px;
                height: 22px;
                text-align: center;
                line-height: 22px;
                right: -14px;
                top:-3px;
                background:url("../assets/images/bubble_nor.png")no-repeat;
                background-size:cover;
                color:#fff;
              }
            }
            dd{
              font-size: 16px;
              color: #646464;
            }
          }
          dl:nth-child(1){
            margin-left: 1px solid #DCDCDC;
          }
        }
      }
    }
    .fileBox{
      width:calc(100% - 40px);
      min-height: 144px;
      z-index: 22;
      margin:0 auto;
      margin-top: 120px;
      margin-bottom:20px;
      box-shadow: 0 1px 7px 0 rgba(000,000,000,0.2);
      border-radius: 12px;
      overflow: hidden;
      .fileHead{
        width:100%;
        height:34px;
        line-height: 34px;
        text-indent: 15px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #B4B4B4;
        background: #FFFFFF;
        border-bottom:1px solid #DCDCDC;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        img{
            width:14px;
            height: 14px;
            margin-right: 5px;
            margin-left: 10px;
        }
        .all{
          margin-right: 10px;
        }
      }
      .fileCon{
          width:100%;
          background: #FFFFFF;
          text-align: center;
          height: 110px;
          box-shadow: 0 1px 7px 0 rgba(240,240,240,0.50);
          border-radius: 0 0 12px 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #B4B4B4;
          img {
            width: 35px;
            height: 30px;
            margin-bottom: 12px;
          }
      }
      .fileCons{
        width:100%;
        overflow: hidden;
        background: #FFFFFF;
        text-align: center;
        box-shadow: 0 1px 7px 0 rgba(240,240,240,0.50);
        .contractItem {
          padding: 0 20px;
          border-bottom: 1px solid #ebebeb;
          background-color: white;
          
          .fistLineBox {
            height: 35px;
            font-size: 15px;
            border-bottom: 1px dashed #ebebeb;
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
      }
    }
  }
}

</style>