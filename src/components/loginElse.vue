<template>
  <div class="loginBox">
      <div class="loginHead">
         <img src="../assets/images/common/xcontractlogo_img.png">
      </div>
      <div class="content">
          <div class="item">
            <dl>
              <dt>用户名<span>*</span></dt>
                <dd class="photoImg"><mt-field label="" placeholder="请输入手机号" v-model="username"></mt-field></dd>
            </dl>
          </div>
          <div class="item">
            <dl>
                <dt>验证码<span>*</span></dt>
                <dd class="pwdImg">
                  <mt-field label="" placeholder="请输入验证码" v-model="code">
                  <span v-show="sendAuthCode" class="code PhotoCode" @click="getCode">获取验证码</span>
            <span
              v-show="!sendAuthCode"
              class="code PhotoCode"
              style="color:#B83343;border-color:#a5303d;"
            >{{auth_time}}秒后重新获取</span>
                  </mt-field>
              </dd>
            </dl>
          </div>
      </div>
       <p class="btnBox">
            <mt-button @click.native="handleClick" type="default">下一步</mt-button>
        </p>
        <div class="hintBox">
            <p class="fl">第一次用?&nbsp;&nbsp;去<router-link to="register" tag="span">注册</router-link></p>
            <p class="fr"><router-link to="/login" tag="span">其他方式登录</router-link></p>
        </div>
        <div class="truthsoBox">
          <span>北京智签科技有限公司</span>
        </div>
  </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js";
export default {
  data(){
    return{
      username:'',
      code:'',
      sendAuthCode:true,
      auth_time:0,
    }
  },
  methods:{
    handleClick(){
      var emilReg = /^[A-Za-z0-9_-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      var photoReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if(this.username=='' || this.code==''){
        this.$toasts('输入的不能为空');
        return;
      }else if(!photoReg.test(this.username) && !emilReg.test(this.username)) {
          this.$toasts('手机号格式错误');
          return;
      }else{
        var params={
        account:this.username,
        password:this.code
        }
        BaseApi.createRpcToken('/user/checkAccount',params).then(data => {
            if(data.datas.code==3007){
              this.$toasts('用户不存在');
            }
        }).catch(function(e) {
          errorLog(e);
        });
      }
      var params={
        account:this.username,
        smsCode:this.code
      }
      BaseApi.createRpcToken( "/user/login", params,'post').then((data)=>{
        console.log(data)
        if(data.code==200){
            localStorage.setItem("userId", data.datas.userId);
          localStorage.setItem('token',data.datas.token);
          localStorage.setItem("userName",this.username);
          this.$router.push('home')
              this.$toasts('登录成功');
          // this.$router.push('/signList')
        }
      },(data)=>{
        console.log(data)
        if(data.code=='1002'){
          this.$toasts(data.message)
        }
        if(data.code==3001){
         this.$toasts('用户名或者密码错误');
         return
        }
      }).catch(function(e) {
          errorLog(e);
        });
    },
    getCode(){
      var photoReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if(this.username==''){
        this.$toasts('请输入手机号');
        return;
      }
      if(!photoReg.test(this.username)){
        this.$toasts('手机号格式错误');
        return;        
      }
      this.sendAuthCode = false;
        this.auth_time = 60;
        var auth_timetimers = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.sendAuthCode = true;
            clearInterval(auth_timetimers);
          }
        }, 1000);
      var queryStr = {
          mobile: this.username
        };
        BaseApi.createRpcToken("/common/getLoginCode", queryStr).then(
          data => {
            console.log(data);
            if(data.code=='200'){
              this.$toasts('验证码已发送');
            }
          },
          data => {
            console.log(data);
          }
        ).catch(function(e) {
          errorLog(e);
        });
    }
  }
}
</script>
<style lang="scss">
.loginBox{
  width:100%;
  height: 100%;
  box-sizing: border-box;
  padding:0 10px;
  background: #FAFAFA;
  .loginHead{
    width: 100%;
    padding:40px 0;
    display: flex;
    justify-content: center;
    align-content: center;
    img{
      width: auto;
      height: auto;
      max-width: 80%;
      max-height: 80%;
    }
  }
  .content{
    .item{
      margin-bottom: 15px;
      overflow: hidden;
      dl{
        dt{
          color: #505050;
          font-size:16px;
          margin-bottom: 5px; 
          span{
            color: #B41C2E;
            font-size: 16px;
            vertical-align: middle;
            margin-left: 5px;
          }
        }
        dd{
          .mint-cell-title{
            display: block;
            width: 25px;
            height: 25px;
            margin-right: 10px;
          }
          .code{
            display: inline-block;
            font-size: 14px;
            width:120px;
            text-align: center;
            border-left: 1px solid #D1D1D1;
          }
          .mint-cell-value{
            .mint-field-core{
              font-size: 14px;
            }
          }
          .mint-cell-wrapper{
            background: #FFFFFF;
            border: 1px solid #D1D1D1;
            border-radius: 8px;
          }
        }
        .photoImg{
          .mint-cell-title{
              background: url("../assets/images/common/number_icon.png")no-repeat center center;
              background-size:cover;
          }
        }
        .pwdImg{
          .mint-cell-title{
              background: url("../assets/images/common/Verification_icon.png")no-repeat center center;
              background-size:80%;
          }
        }
      }
    }
  }
  .btnBox{
    margin-top:25px;
    margin-bottom: 10px;
    .mint-button{
      width:100%;
      box-sizing: border-box;
      background: #B41C2E;
      color:#fff;
      font-weight: 520;
      letter-spacing: 2px;
    }
  }
  .hintBox{
    p{
      font-size: 14px;
      color: #646464;
      span{
        color: #16A0F0;
      }
    }
  }
  .truthsoBox{
    width:100%;
    height: calc(100vh - 400px);
    line-height:  calc(100vh - 400px);
    display: flex;
    justify-content: center;
    align-content: center;
    color:rgba(220,220,220,1);
    font-size: 14px;
  }
}
</style>
