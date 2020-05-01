<template>
  <div class="recordBox">
    <mt-header title="合同购买记录">
        <router-link to="/contract" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
     </mt-header>
      <p class="searchBox"><span></span><input type="text" v-model="contractName" @change="searchFn" placeholder="搜索合同文件"></p>
      <div class="recordCon">
         <ul>
           <li v-for="item in tableData"  :key="item.id" class="contractItem">
              <div class="fistLineBox">
                <div class="nameBox">{{item.contractName}}</div>
                <div class="timeBox">{{item.payTime}}</div>
              </div>
              <div class="lastLine">
                <span>￥{{item.price}}</span>
                <span v-if="item.payType==1">账户余额支付</span>
                <span v-if="item.payType==2">支付宝支付</span>
                <span v-if="item.payType==3">微信支付</span>
                <span @click="delFn(item.id)">删除</span>
                <span v-if="isIOS" @click="downLoadFn(item.id,item.contractName)">下载</span>
              </div>
            </li>
         </ul>
      </div>
      <mt-popup
            v-model="popupVisible"
            popup-transition="popup-fade">
            <div class="hint">
                确定要删除该合同？
            </div>
            <div>
              <mt-button type="default" @click="trueFn">确定</mt-button>
              <mt-button type="default" @click="cancelFn">取消</mt-button>              
            </div>
      </mt-popup>
  </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js"
export default {
  data(){
    return{
      isIOS:true,
      popupVisible:false,
      contractName:'',
      tableData:[],
      id:''
    }
  },
  created(){
      this.init()
  },
  methods:{
    init(){
      var queryStr={
        'contractName':this.contractName,
        'pageNumber':'',
        'pageSize':''
      }
      if(this.contractName) queryStr.contractName=this.contractName;
      console.log(queryStr)
      BaseApi.createRpcToken("/template/userContractTemplateList",queryStr).then((data) => {
            this.tableData=data.datas.list      
            }, (data) => {
              // console.log(data);
      }).catch(function(e) {
          errorLog(e);
        }); 
    },
    searchFn(){
      this.init()
    },
    delFn(id){
      this.id=id;
      this.popupVisible=true;
    },
    downLoadFn(id,name){
      var params={
        id:id,
        fileName:name
      }
      console.log(params)
      BaseApi.createRpcToken("/template/downloadContractTemplate",params).then((data) => {
              if(data.code==200){
            var   link = document.createElement('a');
            link.setAttribute("download", "");
            link.href = data.datas.filePath;
            link.click();
            link.style.display = "none";
              }
            }, (data) => {
      }).catch(function(e) {
          errorLog(e);
        }); 
    },
    cancelFn(){
      this.popupVisible=false;
    },
    trueFn(){
      var params={
        id:this.id
      }
      BaseApi.createRpcToken("/template/deleteUserContractTemplate",params).then((data) => {
        if(data.code=='200'){
            this.$toasts("删除成功");
            this.popupVisible=false;
            this.init();
        }
            }, (data) => {
      }).catch(function(e) {
          errorLog(e);
        });
    }
  },
  mounted(){
    var u = navigator.userAgent;
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    // if(isiOS){
    //   this.isIOS=false;
    // }
  }
}
</script>
<style lang="scss" >
.recordBox{
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
  .recordCon{
    width: 100%;
    height: calc(100% - 108px);
    overflow-y: scroll;
      .contractItem {
        padding: 0 20px;
        border-bottom: 1px solid #ebebeb;
        background-color: white;
        margin-bottom: 9px;
        .fistLineBox {
          height: 35px;
          font-size: 15px;
          border-bottom: 1px solid #ebebeb;
          .nameBox {
            width:50%;
            float: left;
            font-size: 16px;
            color: #646464;
            line-height: 35px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap
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
          span{
            float: left;
          }
          span:nth-child(1){
            color: #E88078;
            margin-right: 30px;
          }
          span:nth-child(2){
            color: #969696;
          }
          span:nth-child(3), span:nth-child(4){
            float: right;
            color: #969696;
            background: #FFFFFF;
            border: 1px solid #969696;
            border-radius: 2px;
            display: block;
            width:38px;
            height: 21px;
            font-size: 12px;
            line-height: 21px;
            text-align:center;
            margin-top: 6px;
          }
          span:nth-child(3){
            margin-left: 5px;
          }
        }
      }
  }
  .searchBox{
      width:calc(100% - 20px);
      height:33px;
      border: 1px solid #DCDCDC;
      border-radius: 50px;
      line-height: 33px;
      margin:10px;
      box-sizing: border-box;
      span{
          display: inline-block;
          width:15px;
          height: 15px;
          vertical-align: middle;
          background:url('../../assets/images/search_icon.png')no-repeat;
          background-size:cover;
          margin:0 10px;
        }
      input{
        width:calc(100% - 50px);
        font-size: 14px;
        color: #969696;
      }
  }
  .mint-popup{
    width:270px;
    height: 150px;
    border-radius: 8px;
    .hint{
      width:100%;
      height: 107px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      font-size: 16px;
      color: #323232;
    }
    .mint-button{
      width:50%;
      height: 43px;
      line-height: 43px;
      background-color: #fff;
      font-size: 16px;
      color: #787878;
    }
  }
}
</style>
