<template>
  <div class="contrantBox">
    <mt-header title="合同模板">
      <router-link to="/home" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <router-link to="/record" slot="right">
        <mt-button>购买记录</mt-button>
      </router-link>
    </mt-header>
    <div class="recordItem">
      <div class="searchBox">
        <div>
          <span class="search"></span>
          <form action="#">
            <input type="search" v-model="contractName" @keypress="searchFn" placeholder="搜索合同文件">
          </form>
        </div>
        <p>精选{{copies}}份合同文书可下载</p>
      </div>
      <div class="container">
        <ul>
          <li v-for="item in datas" :key="item.id" @click="detailFn(item.id,item.price)">
            <p class="imageBox">
              <img src="@image/viewcontract_img.png">
            </p>
            <h5>{{item.name}}</h5>
            <p class="moneyBox">
              <span>¥{{item.price}}</span>
            </p>
          </li>
          <div class="noMore">没有更多了</div>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      contractName: "",
      datas: [],
      pageSize: 446,
      copies: 0
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      Indicator.open({
        text: "加载中",
        spinnerType: "fading-circle"
      });
      var params = {
        pageSize: this.pageSize,
        contratName: this.contratName
      };
      BaseApi.createRpcToken("/template/templetList", params)
        .then(
          data => {
            console.log(data);
            this.datas = data.datas.list;
            this.copies = data.datas.totalRow;
            Indicator.close();
          },
          data => {
            Indicator.close();
          }
        )
        .catch(function(e) {
          errorLog(e);
        });
    },
    loadMore() {
      this.loading = true;
      setTimeout(() => {
        this.pageSize = this.pageSize + this.num;
        if (this.pageSize > this.totalRow) {
          this.pageSize = this.totalRow;
        }
        this.init();
        this.loading = false;
      }, 2500);
    },
    searchFn(event) {
      var keycode = event.keyCode;
      if (keycode == "13") {
        event.preventDefault();
        this.contratName = event.target.value;
        this.pageSize = "";
        this.init();
        //请求搜索接口
      }
    },
    detailFn(id, price) {
      this.$router.push({
        path: "contractDetils",
        query: {
          id: id,
          money: price
        }
      });
    }
  }
};
</script>
<style lang="scss">
.contrantBox{
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
  .recordItem{
    width:100%;
    padding:0 10px;
    box-sizing: border-box;
    .searchBox{
      div{
        width:100%;
        height:33px;
        border: 1px solid #DCDCDC;
        border-radius: 50px;
        line-height: 33px;
        margin:10px 0;
        span{
          display: inline-block;
          width:15px;
          height: 15px;
          vertical-align: middle;
          background:url('../../assets/images/search_icon.png')no-repeat;
          background-size:cover;
          margin:0 10px;
        }
        form{
          display: inline-block;
          width:calc(100% - 50px);
          input{
            width:100%;
            font-size: 14px;
            color: #969696;
          }
        }
      }
      p:last-child{
        width:100%;
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 15px;
        color: #787878;
      }
    }
    .container{
      width: 100%;
      height: calc(100% - 163px);
      overflow-y: scroll;
      li{
        float: left;
        width:calc((100% - 10px) / 2);
        // height: 285px;
        margin-bottom: 10px;
        .imageBox{
          width:100%;
          height: auto;
          box-sizing: border-box;
          padding:18px;
          background: #F0F0F0;
          position: relative;
          img{
            width:100%;
            height: 100%;
          }
        }
        .imageBox:after{
          content: '';
          display: block;
          position: absolute;
          bottom:18px;
          left:18px;
          width:calc((100% - 36px);
          height: 1px;
          background-color: #fff;
        }
        h5{
          width:100%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          font-size: 14px;
          color: #323232;
          font-weight: normal;
          padding: 7px 0;
        }
        .moneyBox{
          font-size: 12px;
          color: #B41C2E;
        }
      }
      li:nth-child(2n){
        margin-left: 10px;
      }
      .noMore{
        margin:20px 0; 
        text-align: center;
      }
    }

  }

}
</style>
