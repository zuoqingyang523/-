<template>
  <div class="writeBox">
      <mt-header title="绘制签名">
        <router-link to="/signature" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <div slot="right">
            <mt-button id="saveCanvas"  @click="handelSaveEl()">提交</mt-button>
        </div>
     </mt-header>

   <div id="canvas">
     <img src="../assets/images/place.png" v-if="placeWrite">
    </div>
    <img :src="imgsrc" alt="">
  <div class="footer">
      <span v-on:click="handelClearEl()" class="clearWrite">清除</span>
      <ul class="colorList">
        <span>颜色：</span>
        <li class="color1" @click="handelColour('#273039')"></li>
        <li class="color2" @click="handelColour('#00A0E9')"></li>
        <li class="color3" @click="handelColour('#F74555')"></li>
      </ul>
  </div>
</div>
    </div>
</template>
<script>
import BaseApi from "@lib/baseApi.js"

let canvas = document.createElement("canvas");
let cxt = canvas.getContext("2d");
export default {
  name: "HelloWorld",
  components: {},
  data() {
    return {
      placeWrite:true,
      linewidth: 1, //线条粗细，选填
      color: "black", //线条颜色，选填
      background: "#fbfbfb", //线条背景，选填
      imgsrc: ""
    };
  },
  mounted() {
    console.log("mounted");
    console.log(this.color);
    this.getCanvas();
  },
  methods: {
    getCanvas() {
      let el = document.getElementById("canvas");
      el.appendChild(canvas);
      canvas.width = el.clientWidth;
      canvas.height = el.clientHeight;
      cxt.fillStyle = this.background; //填充绘图的背景颜色
      cxt.fillRect(0, 0, canvas.width, canvas.height); //绘制“已填色”的矩形
      cxt.lineCap = 'round';
        cxt.lineJoin = 'round';
        cxt.restore();
      cxt.strokeStyle = this.color; //笔触的颜色
      cxt.lineCap = "round"; //线条末端线帽的样式
      let linewidth = this.linewidth;
      //开始绘制
      canvas.addEventListener(
        "touchstart",
        function(e) {
          event.preventDefault()
          this.placeWrite=false;
          cxt.beginPath();
          cxt.lineWidth = linewidth; //当前线条的宽度，以像素计
          cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY-52);
        }.bind(this),
        false
      );
      //绘制中
      canvas.addEventListener(
        "touchmove",
        function(e) {
          cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY-52);
          cxt.stroke();
        }.bind(this),
        false
      );
      //结束绘制
      canvas.addEventListener(
        "touchend",
        function() {
          cxt.closePath();
          
        }.bind(this),
        false
      );
    },
    handelColour(color) {
      this.color = color;
      this.getCanvas();
    },
    handelThickness() {
      this.linewidth = 5;
      this.getCanvas();
    },
    handelClearEl() {
      cxt.clearRect(0, 0, canvas.width, canvas.height);
    },
    handelSaveEl() {
      var that=this;
      if(this.placeWrite==true){
        this.$toasts('请绘制签名');
        return;
      }
      let imgBase64 = canvas.toDataURL();
      console.log(this.imgsrc);
        var sealJson = {
              base64Image:imgBase64,
              sourceType: 2
          };  
          var  datas=JSON.stringify(sealJson)
            console.log(datas)
          $.ajax({
                url: '/m/seal/uploadHandSeal',
                type: "POST",
                data: datas,
                dataType: "json",
                contentType: "application/json",
                timeout: 300000,
                error: function (XMLHttpRequest, textStatus, errorThrown) {},
                headers: {
                    "token": localStorage.getItem('token')
                },
                success: function (data) {
                  if(data.code=='200'){
                    that.$toasts('上传成功');
                    setTimeout(()=>{
                      that.$router.push({
                        path:'/signature'
                      })
                    },1000)
                  }
                }
            });
    },
  }
};
</script>
<style lang="scss">
html,body{
  width:100%;
  height:100%;
}
.writeBox{
  width:100%;
  height:100%;
  background: #FAFAFA;
  position: fixed;
  top:0;
  left:0;
  right: 0;
  bottom:0; 
  .mint-header{
      height: 52px;
      line-height: 52px;
      background: #B41C2E;
      font-size: 18px;
      letter-spacing: 3px;
      font-family: 'PingFangSC-Medium';
  }
  #canvas{
    width:100%;
    height: calc(100% - 126px);
    position: relative;
    img{
      width:80%;
      height: auto;
      position: absolute;
      left:50%;
      margin-left:-40%;
      top:50%;
      margin-top:-10px;
    }
  }
  canvas {
    width:100%;
    height: 100%;
    background: #fbfbfb!important;
    border:none!important;
    cursor: default;
  }
  .footer{
    width:100%;
    height: 58px;
    line-height: 58px;
    padding:0 10px;
    box-sizing: border-box;
    .clearWrite{
      font-size: 18px;
      color: #646464;
      float: left;
      display: block;
      width:30%;
    }
    .colorList{
      font-size: 18px;
      color: #646464;
      float: left;
      span{
        float: left;
      }
      li{
        float: left;
        width:34px;
        height: 34px;
        border-radius: 50%;
        margin:12px 0;
        margin-left: 10px;
      }
      .color1{
        background: #273039;
      }
      .color2{
        background: #00A0E9;
      }
      .color3{
        background: #F74555;
      }
    }
  }

  
}
</style>
