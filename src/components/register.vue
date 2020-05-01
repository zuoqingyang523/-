<template>
  <div class="registerBox">
      <mt-header title="注册">
        <router-link to="/" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
     </mt-header>
     <p class="hintBox">目前仅支持中国大陆手机号进行账号注册</p>
     <div class="registerForm">
        <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
        <mt-field label="验证码" v-model="captcha" placeholder="请输入验证码">
          <span v-show="sendAuthCode" class="code PhotoCode" @click="getCode">获取验证码</span>
            <span
              v-show="!sendAuthCode"
              class="code PhotoCode"
              style="color:#B83343;border-color:#a5303d;"
            >{{auth_time}}秒后重新获取</span>
        </mt-field>
        <mt-field label="登录密码" placeholder="必须包含数字与字母，长度在6-20位" type="password" v-model="password"></mt-field>
        <div class="agreementBox">
            <input type="checkbox" v-model="checkbox" class="checkbox" id="checkbox">
            <label for="checkbox">同意</label>
            <router-link tag="span" to="register/serviceAgreement">
                  《Xcontract服务协议》
            </router-link>
            和
             <router-link tag="span" to="register/privacyStatement">
                  《Xcontract隐私声明》
            </router-link>
        </div>
        <p>
          <mt-button @click.native="handleClick" type="default">提交</mt-button>
        </p>
     </div>
     
  </div>
  
</template>
<script>
import BaseApi from "@lib/baseApi.js"
import md5 from "@lib/encryption.js";
export default {
  data(){
    return {
      phone:'',
      captcha:'',
      password:'',
      auth_time:0,
      sendAuthCode:true,
      checkbox:false,
    }
  },
  methods:{
    getCode(){
      if(this.phone==''){
        this.$toasts('请输入手机号');
        return;
      }
      var photoReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      console.log(this.phone)
      if(!photoReg.test(this.phone)){
        this.$toasts('手机号格式错误');
        return;
      }
      var params={
        account:this.phone
      }
       BaseApi.createRpcToken('/user/checkAccount',params).then(data => {
         console.log(data)
         if(data.datas.code==3001){
          this.$toasts('用户已经存在');
          return;
         }else{
             BaseApi.createRpcToken('/common/getRegisterCode',params).then(data => {
                console.log(data) 
            }).catch(function(e) {
              errorLog(e);
            });
        this.sendAuthCode = false;
        this.auth_time = 60;
        var auth_timetimers = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.sendAuthCode = true;
            clearInterval(auth_timetimers);
          }
        }, 1000);
         }
       })
      
      var params={
        mobile:this.phone
      }
    },
    handleClick(){
        if(this.checkbox!=false){
          if(this.phone==''){
            this.$toasts('请输入手机号');
            return;
          }
          if(this.captcha==''){
            this.$toasts('请输入验证码');
            return;
          }
          if(this.password==''){
            this.$toasts('请输入密码');
            return;
          }
          var pwdReg=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
          var photoReg=/^[1][3,4,5,7,8][0-9]{9}$/
          if(photoReg.test(this.phone) || this.captcha!='' || pwdReg.test(this.password)){
              var params={
                account:this.phone,
                password:md5.md5(this.password),
                verifyCode:this.captcha
              }
              BaseApi.createRpcToken( "/user/register", params,'post','','','','',false).then((data)=>{
                console.log(data)
                if(data.code==200){
                  this.$toasts('注册成功')
                  this.$router.push('/login')
                }
              },data=>{
                if(data.code==107){
                  this.$toasts(data.message)
                }
              }).catch(function(e) {
                errorLog(e);
              });
          }else{
             this.$toasts('输入的不能为空');
          }
        }else{
          this.$toast("请先勾选协议")
        }
    }
  }
}
</script>
<style lang="scss">
.registerBox{
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
  .hintBox{
      color: #F4C4B5;
      padding:18px 0;
      display: table;
      width:100%;
      font-size:14px;
      text-align: center;
      font-family: 'PingFangSC-Medium';
  }
  .registerForm{
      .mint-cell{
        border-top:1px solid  #C8C8C8;
        .mint-cell-title{
          width:80px;
          .mint-cell-text{
            font-size: 16px;
            color: #505050;
          }
        }
        .mint-cell-value{
          .mint-field-core{
            font-size: 12px;
            // color: #C8C8C8;
          }
          .code{
            display: inline-block;
            font-size: 14px;
            width:120px;
            text-align: center;
            border-left: 1px solid #D1D1D1;
          }
        }
      }
      .agreementBox{
        border-top:1px solid  #C8C8C8;
        width: 100%;
        padding:15px 10px;
        box-sizing: border-box;
        height: 14px;
        line-height: 14px;
        display: table;
        .checkbox{
          height: 12px;
          width:12px;
          vertical-align: middle;
          margin-right: 5px;
        }
        label{
          color: #505050;
          font-size: 14px;
        }
        span{
          color: #16A0F0;
        }
      }
      p{
        margin-top:15px;
        .mint-button{
          width: calc(100% - 20px);
          box-sizing: border-box;
          margin:0 10px;
          background: #B41C2E;
          color:#fff;
          font-weight: 520;
          letter-spacing: 2px;
        }
      }
  }
}
</style>
