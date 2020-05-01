<template>
  <div class="loginBox">
    <div class="loginHead">
      <img src="../assets/images/common/xcontractlogo_img.png">
    </div>
    <div class="content">
      <div class="item">
        <dl>
          <dt>
            用户名
            <span>*</span>
          </dt>
          <dd class="photoImg">
            <mt-field label placeholder="请输入手机号或邮箱" v-model="username"></mt-field>
          </dd>
        </dl>
      </div>
      <div class="item">
        <dl>
          <dt>
            密码
            <span>*</span>
          </dt>
          <dd class="pwdImg">
            <mt-field label placeholder="请输入密码" type="password" v-model="password"></mt-field>
          </dd>
        </dl>
      </div>
    </div>
    <p class="btnBox">
      <mt-button @click.native="handleClick" type="default">下一步</mt-button>
    </p>
    <div class="hintBox">
      <p class="fl">第一次用?&nbsp;&nbsp;去
        <router-link to="register" tag="span">注册</router-link>
      </p>
      <p class="fr">
        <router-link to="/celeritylogin" tag="span">其他方式登录</router-link>
      </p>
    </div>
    <div class="truthsoBox">
      <span>北京智签科技有限公司</span>
    </div>
  </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js";
import md5 from "@lib/encryption.js";
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleClick() {
      var emilReg = /^[A-Za-z0-9_-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      var photoReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (this.username == "" || this.password == "") {
        this.$toast("输入的不能为空");
      } else if (
        !photoReg.test(this.username) &&
        !emilReg.test(this.username)
      ) {
        this.$toasts("输入格式有误");
      } else {
        var params = { account: this.username };
        BaseApi.createRpcToken(
          "/user/checkAccount",
          params,
          "",
          "",
          "",
          false
        ).then(data => {
          console.log(data);
          if (data.datas.code == 3007) {
            this.$toasts("用户不存在");
          }
        }).catch(function(e) {
          errorLog(e);
        });
      }
      var params = {
        account: this.username,
        password: md5.md5(this.password)
      };
      BaseApi.createRpcToken("/user/login", params,'post').then(
        data => {
          if (data.code == 200) {
            this.$toasts("登录成功");
            localStorage.setItem("token", data.datas.token);
            localStorage.setItem("userName",this.username);
            localStorage.setItem("userId", data.datas.userId);
            this.$router.push({
              path:"home"
            })
            // if (this.$route.query.id && this.$route.query.taskId) {
            //   this.$router.push(
            //     `/sign/?&id=${this.$route.query.id}&taskId=${
            //       this.$route.query.taskId
            //     }`
            //   );
            // } else {
            //   this.$router.push("/signList");
            // }
          }
        },
        data => {
            this.$toasts(data.message);
        }
      ).catch(function(e) {
          errorLog(e);
        });
    }
  }
};
</script>
<style lang="scss">
.loginBox {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  background: #fafafa;
  .loginHead {
    width: 100%;
    padding: 40px 0;
    display: flex;
    justify-content: center;
    align-content: center;
    img {
      width: 80%;
      height: 80%;
    }
  }
  .content {
    .item {
      margin-bottom: 15px;
      overflow: hidden;
      dl {
        dt {
          color: #505050;
          font-size: 16px;
          margin-bottom: 5px;
          span {
            color: #b41c2e;
            font-size: 16px;
            vertical-align: middle;
          }
        }
        dd {
          .mint-cell-title {
            display: block;
            width: 25px;
            height: 25px;
            margin-right: 10px;
          }
          .mint-cell-value {
            .mint-field-core {
              font-size: 14px;
            }
          }
          .mint-cell-wrapper {
            background: #ffffff;
            border: 1px solid #d1d1d1;
            border-radius: 8px;
          }
        }
        .photoImg {
          .mint-cell-title {
            background: url("../assets/images/common/number_icon.png") no-repeat
              center center;
            background-size: 80%;
          }
        }
        .pwdImg {
          .mint-cell-title {
            background: url("../assets/images/common/Verification_icon.png")
              no-repeat center center;
            background-size: 80%;
          }
        }
      }
    }
  }
  .btnBox {
    margin-top: 25px;
    margin-bottom: 10px;
    .mint-button {
      width: 100%;
      box-sizing: border-box;
      background: #b41c2e;
      color: #fff;
      font-weight: 520;
      letter-spacing: 2px;
    }
  }
  .hintBox {
    width: 100%;
    display: table;
    p {
      font-size: 14px;
      color: #646464;
      span {
        color: #16a0f0;
      }
    }
  }
  .truthsoBox {
    width: 100%;
    height: calc(100vh - 380px);
    line-height: calc(100vh - 380px);
    display: flex;
    justify-content: center;
    align-content: center;
    color: rgba(220, 220, 220, 1);
    font-size: 14px;
  }
}
</style>
