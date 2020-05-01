<template>
  <div class="signMain">
    <div v-show="showScaleBox" class="scaleImageBox" @click="hideScalBoxFun">
      <div class="scaleContainer" id="pinchBox">
        <img :src="imageSrc">
      </div>
    </div>
    <div class="sign" id="docSign">
      <nav-top :name="queryParams.taskId?'合同签署':'合同'" :backUrl="'/signList'" v-show="!showScaleBox">
        <div slot="submit" @click="submit" v-if="queryParams.taskId">提交</div>
      </nav-top>
      <div class="selectBox">
        {{currentItem.fileName}}
        <span
          v-show="up&&fileArray.length>1"
          class="tir"
          @click="changeShowFileList"
        ></span>
        <span v-show="!up&&fileArray.length>1" class="tir" @click="changeShowFileList"></span>
        <div class="readLine"></div>
      </div>
      <div class="content">
        <div
          class="contractContainer"
          v-for="item in fileArray"
          :id="item.id"
          :key="item.id"
          v-show="item.id == currentItem.id"
        ></div>
        <div v-show="!up" class="seleteDetail">
          <ul>
            <li
              v-for="item in fileArray"
              :key="item.id"
              class="contractItem"
              @click="selectItem(item)"
            >
              <div class="fistLineBox">
                <div class="nameBox">{{item.fileName}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="handlerBottom" v-if="queryParams.taskId">
        <div @click="addSeal">签署</div>
        <div @click="rejectSign" v-if="!queryParams.contractForMe">拒签</div>
      </div>
    </div>
  </div>
</template>

<script>
import NavTop from "./common/NavTop.vue";
import BaseApi from "@lib/baseApi.js";
import { Indicator } from "mint-ui";
import DargApi from "@lib/dragApi.js";
import Util from "@lib/util.js";
import { MessageBox } from "mint-ui";
import md5Util from "@lib/md5.js";
import pinchZoom from "pinch-zoom-js";
export default {
  name: "HelloWorld",
  components: {},
  data() {
    return {
      fileArray: [],
      queryParams: null,
      up: true,
      currentSeal: {},
      showDropImg: false,
      headerHeight: 102,
      defaultSelWidth: 119,
      canvasHeight: 0,
      canvasWith: 0,
      scale: 0,
      seals: [],
      location: {},
      currentItem: {},
      // 授权签章的数组列表
      authorizedSealList: [],
      //缩率图片展示的src
      imageSrc: "",
      //是否展示图片缩放盒子
      showScaleBox: false,
      //盒子滚动的高度
      signScrollTop: ""
    };
  },
  components: {
    NavTop
  },
  created() {
    this.getLocation();
    this.queryParams = this.$route.query;
    if (this.queryParams.from == "canvasSign") {
      this.addSeal();
    }
    BaseApi.createRpcToken("/user/getUserInfo")
      .then(
        data => {
          if (!data.datas.success) {
            $.showConfirm(
              "请到Xcontract电子签名平台</br>电脑版官网实名认证，</br>http://www.xcontract.com/",
              "好的",
              "",
              function() {
                history.go(-1);
              },
              "",
              false
            );
          }
        },
        err => {}
      )
      .catch(function(e) {
        errorLog(e);
      });
  },
  computed: {},
  mounted() {
    let pz = new pinchZoom(document.querySelector("#pinchBox"));
    this.getFiled();
    if (this.queryParams.taskId) {
      this.getSealList();
    }
  },
  methods: {
    changeShowFileList() {
      this.up = !this.up;
    },
    getLocation() {
      Util.getLocation(result => {
        this.location = result;
      });
    },
    initHammer: function(el, sealid, uid) {
      var obj = el[0];
      var el = el;
      var _this = this;
      function isTouch(event) {
        var type = event.type;
        if (type.indexOf("touch") >= 0) {
          return true;
        } else {
          return false;
        }
      }
      function getPos(event) {
        var x, y;
        if (isTouch(event)) {
          x = event.touches[0].pageX;
          y = event.touches[0].pageY;
        } else {
          x = event.offsetX;
          y = event.offsetY;
        }
        return { x: x, y: y };
      }

      obj.addEventListener(
        "touchstart",
        function(ev) {
          ev.stopPropagation();
          el.css("position", "absolute");
        },
        false
      );
      obj.addEventListener(
        "touchmove",
        function(ev) {
          ev.stopPropagation();
          if (ev.targetTouches["0"]) {
            //panup时没有target
            ev.preventDefault();
            el.removeClass("my-doc-sign-seal_bg");
            var xy = getPos(ev);
            var pos = {};
            var pageWidth = $(window).width() - el.width();
            var pageHeight =
              $(".sign #" + _this.currentItem.id).height() + el.height() - 50;
            if (xy.x > 0 && xy.x < pageWidth) {
              pos.left = xy.x + "px";
            }
            if (xy.y > _this.headerHeight && xy.y < pageHeight) {
              pos.top = xy.y + "px";
            }
            el.css(pos);
          }
        },
        false
      );
      obj.addEventListener(
        "touchend",
        function(ev) {
          ev.stopPropagation();
          if (!el.hasClass("my-doc-sign-seal_bg")) {
            _this.setPostion(el, sealid, uid);
          }
        },
        false
      );
    },

    save() {},
    selectItem(item) {
      this.currentItem = item;
      this.up = true;
      this.$forceUpdate();
      if (!this.currentItem.isAdd) {
        this.currentItem.isAdd = true;
        this.$nextTick(() => {
          this.getPdfToImage(this.currentItem.filePath, this.currentItem.id);
        });
      }
    },
    addSealHandler() {
      this.showDropImg = true;
    },
    getSealDerault(list) {
      list.forEach(element => {
        if (element.defaulted) {
          this.currentSeal = element;
        }
      });
    },
    getSealList() {
      BaseApi.createRpcToken("/seal/sealList", {
        checkStatus: 2
      })
        .then(
          data => {
            this.seals = (data.datas && data.datas.resultList) || [];
            if (this.seals.length) {
              this.getSealDerault(data.datas.resultList);
              this.getauthSeaList(0);
            } else {
              this.getauthSeaList(1);
            }
          },
          () => {}
        )
        .catch(function(e) {
          errorLog(e);
        });
    },
    getauthSeaList(isHaveDefault) {
      BaseApi.createRpcToken("/seal/authorizedSealList", {
        taskId: this.$route.query.taskId,
        contractId: this.$route.query.id
      })
        .then(
          data => {
            if (
              data.datas &&
              data.datas.resultList &&
              data.datas.resultList.length
            ) {
              this.authorizedSealList = data.datas.resultList;
              if (isHaveDefault) {
                this.getSealDerault(data.datas.resultList);
              }
              this.seals.push(...data.datas.resultList);
            }
            if (!this.seals.length) {
              window.location.href = `/canvasSign/sign.html?token=${localStorage.token ||
                "DrAAp4R00GXnm2k1NTTgLjSuiDLNp9"}&id=${
                this.$route.query.id
              }&taskId=${this.$route.query.taskId}&from=sign`;
            }
          },
          () => {}
        )
        .catch(function(e) {
          errorLog(e);
        });
    },
    addSeal: function() {
      let sealid = this.currentSeal.id;
      // 生成得到页面上的章唯一id
      let uid = Util.getUID();
      let sealHtml = `<div id="${uid}" data-uid="${uid}"  data-sealid=${sealid} class="my-doc-sign-seal my-doc-sign-seal_bg">
        <img src="" data-uid="${uid}"  data-sealid=${sealid}>
        '<span class="my-doc-sign-seal_delete" data-uid="${uid}"  data-sealid=${sealid}>X</span>
        </div>`;
      let el = $(sealHtml);
      let image = el.find("img");
      image.attr("src", this.currentSeal.fullFilePath);
      var rule = this.defaultSelWidth * this.scale;
      image.css({
        width: rule,
        height: rule
      });
      el.css({
        width: rule,
        height: rule,
        marginLeft: -(rule / 2),
        marginTop: -(rule / 2)
      });
      this.initHammer(el, sealid, uid);
      el.find(".my-doc-sign-seal_delete").on("click", e => {
        let del = e.originalEvent.target || e.originalEvent.srcElement;
        let uid = del.dataset.uid;
        let sealid = del.dataset.sealid;
        delete this.currentItem.sealPos[sealid][uid];
        el.remove();
      });
      el.on("click", this.clickSeal);
      $("#docSign").append(el);
    },
    getPosition: function(el) {
      var scrollAbsTop = Math.abs(el.position().top - this.headerHeight);
      var scrollLeft = el.position().left; //印章相对于屏幕左边的距离
      var scrollTop = scrollAbsTop % (this.canvasHeight * this.scale); //这里的4是因为每页之间空4个像素
      var imageY = scrollTop;
      var ruy = (this.canvasHeight * this.scale - imageY) / this.scale;
      var llx = scrollLeft / this.scale;
      var rux = llx + this.defaultSelWidth;
      var lly = ruy - this.defaultSelWidth;
      var pageNo =
        parseInt(scrollAbsTop / (this.canvasHeight * this.scale)) + 1;
      var pos = {
        ruy: ruy,
        llx: llx,
        rux: rux,
        lly: lly,
        pageNo: pageNo,
        type: 0
      };
      return pos;
    },
    rejectSign() {
      $.showConfirm(
        "<span class='confirmTitle'>签署密码</span> " +
          "<input id='signPassword'  type='password' placeholder='*您的签署密码'  autocomplete='off' class='confirmInput'/> " +
          "<textarea id='rejectReason' rows='3'  placeholder='*请输入拒绝原因'  autocomplete='off' class='confirmTextArea'/></textarea> ",
        "<span class='cancelBtn'>忘记密码？</span>",
        "<span class='sureBtn'>确定</span>",
        function() {
          $.showConfirm(
            "请到Xcontract电子签名平台</br>电脑版官网找回签署密码，</br>http://www.xcontract.com/",
            "好的"
          );
        },
        () => {
          let pwd = $("#signPassword").val();
          let reson = $("#rejectReason").val();
          if (!pwd) {
            $.showMsg("签署密码不能为空");
            return false;
          } else if (!reson) {
            $.showMsg("拒绝原因不能为空");
            return false;
          } else if (reson.length > 50) {
            $.showMsg("拒绝原因最多50个字符");
            return false;
          }
          BaseApi.createRpcToken("/contract/refuse", {
            id: this.$route.query.id,
            taskId: this.$route.query.taskId,
            reason: reson,
            signPassword: md5Util.md5(pwd),
            signLocation:
              this.location &&
              this.location.detail &&
              this.location.detail.address,
            signLocationAttr:
              this.location &&
              this.location.detail &&
              this.location.detail.location &&
              this.location.detail.location.lng +
                "," +
                this.location.detail.location.lat
          })
            .then(
              data => {
                if (data.datas.success) {
                  $.showMsg("拒签成功");
                  this.$router.push("/signList");
                } else {
                  $.showMsg(data.datas.message);
                }
              },
              () => {}
            )
            .catch(function(e) {
              errorLog(e);
            });
        }
      );
    },
    clickSeal: function(e) {
      let clickEl = e.originalEvent.target || e.originalEvent.srcElement;
      this.currentChangeSeal = {
        uid: clickEl.dataset.uid,
        sealid: clickEl.dataset.sealid
      };
      var seals = this.seals;
      var divWidth = 0;
      divWidth = (seals.length + 1) * 150;
      let imageHtml = "";
      for (var i = 0; i < seals.length; i++) {
        var item = seals[i];
        imageHtml += '<div data-index="' + i + '"class="my_doc_sign_div_seal">';
        imageHtml +=
          ' <div   data-index="' +
          i +
          '" name="seal" class="my_doc_sign_img_seal" data="' +
          item.fullFilePath +
          '" style="background-image: url(' +
          item.fullFilePath +
          ')"></div>';
        if (item.id == this.currentSeal.id) {
          imageHtml +=
            '           <img src="/selected_icon.png" class=" my_doc_sign_img_uncheck my_doc_sign_img_check">';
        } else {
          imageHtml +=
            '           <img src="/selected_icon.png" class=" my_doc_sign_img_uncheck">';
        }
        imageHtml += "</div>";
      }
      let html = '<span class="confirmTitle">印章选择</span>';
      html +=
        ' <div style="overflow-x:scroll;overflow-y: hidden;margin-top: 10px; padding-bottom: 20px;"> ';
      html +=
        '   <div style="width:' +
        divWidth +
        'px;height:100%;padding-left: 10px;">';
      html += imageHtml;
      html += "   </div>";
      html += "</div>";
      var confirm = $.showConfirm(
        html,
        "取消",
        "<span class='sureBtn'>确定</span>",
        null,
        () => {
          if (this.defaultTemp) {
            if (
              this.currentItem.sealPos &&
              this.currentItem.sealPos[this.currentChangeSeal.sealid] &&
              this.currentItem.sealPos[this.currentChangeSeal.sealid][
                this.currentChangeSeal.uid
              ]
            ) {
              let sealTemp = Object.assign(
                {},
                this.currentItem.sealPos[this.currentChangeSeal.sealid][
                  this.currentChangeSeal.uid
                ]
              );
              delete this.currentItem.sealPos[this.currentChangeSeal.sealid][
                this.currentChangeSeal.uid
              ];
              if (!this.currentItem.sealPos[this.defaultTemp.id]) {
                this.currentItem.sealPos[this.defaultTemp.id] = {};
              }
              this.currentItem.sealPos[this.defaultTemp.id][
                this.currentChangeSeal.uid
              ] = sealTemp;
            }
            let targetBox = $("#" + this.currentChangeSeal.uid);
            let targetImg = targetBox.find("img");
            let targetDel = targetBox.find("span");
            targetBox.attr("data-sealid", this.defaultTemp.id);
            targetImg.attr("data-sealid", this.defaultTemp.id);
            targetImg.attr("src", this.defaultTemp.fullFilePath);
            targetDel.attr("data-sealid", this.defaultTemp.id);
            this.currentSeal = this.defaultTemp;
            this.defaultTemp = null;
          }
        },
        true,
        () => {
          $.recoverTouch("touchmove");
          $(".confirmCenter").width(319);
          $(".handlerLeft").css("width", "155");
          $(".handlerRight").css("width", "155");
          $(".my_doc_sign_div_seal").on("click", e => {
            this.selectSeal(e);
          });
        }
      );
    },
    selectSeal(e) {
      let el = e.originalEvent.srcElement || e.originalEvent.target;
      this.defaultTemp = this.seals[el.dataset.index];
      $(".my_doc_sign_img_uncheck").removeClass("my_doc_sign_img_check");
      $($(".my_doc_sign_img_uncheck")[el.dataset.index]).addClass(
        "my_doc_sign_img_check"
      );
    },
    getPage(page, index, id) {
      var scale = 1; //缩放倍数，1表示原始大小
      var viewport = page.getViewport(scale);
      var clientWidth = $(window).width();
      this.scale = clientWidth / viewport.width;
      this.canvasHeight = viewport.height;
      this.canvasWith = viewport.width;
      viewport = page.getViewport(this.scale);
      var canvas = document.getElementById("canvas" + index + id);
      var canvasFather = canvas.parentNode;
      var context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvasFather.style.width = viewport.width + "px";
      canvasFather.style.height = viewport.height + "px";
      //   canvasFather.style.margin = "10px auto";
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext).promise.then(() => {
        this.loadedPageCount++;
      });
    },
    showImgScale(canvas) {
      this.imageSrc = canvas.toDataURL("image/png");
      this.signScrollTop = $(".content").scrollTop();

      console.log($(".content")[0].scrollTop);
      this.showScaleBox = true;
    },
    hideScalBoxFun() {
      this.showScaleBox = false;
      // this.$nextTick(() => {
      //   $(".content").scrollTop(this.signScrollTop);
      // });
    },
    getPdfToImage(url, id) {
      let container = document.getElementById(id);
      container.style.display = "block";
      let _this = this;
      url =
        url ||
        "http://xcon-dev.oss-cn-beijing.aliyuncs.com/contract/1703/20181228/b7cc408b4dde4810bbbb7cb51d46e342.pdf";
      PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
        _this.totalPage = pdf.numPages;
        for (let i = 1; i <= _this.totalPage; i++) {
          $(container).append(
            `<div class="canvasBoxFlag" data-pageIndex=${i} id="canvasBoxFlag${i}${id}"><canvas data-pageIndex=${i} class="canvasContent" id="canvas${i}${id}"></canvas></div>`
          );
          $(".canvasBoxFlag").addClass("canvasBox");
          $(".canvasBoxFlag").on("click", function(el) {
            _this.showImgScale($(this).find("canvas")[0]);
          });
        }
        for (let i = 1; i <= _this.totalPage; i++) {
          pdf.getPage(i).then(page => {
            _this.getPage(page, i, id);
          });
        }
      });
    },
    setPostion(el, sealid, uid) {
      !this.currentItem.sealPos && (this.currentItem.sealPos = {});
      !this.currentItem.sealPos[sealid] &&
        (this.currentItem.sealPos[sealid] = {});
      this.currentItem.sealPos[sealid][uid] = this.getPosition(el);
    },
    submit() {
      this.confirmHandler();
    },
    getPassword(signInfo) {
      $.showConfirm(
        "<span class='confirmTitle'>签署密码</span> " +
          "<input id='signPassword'  type='password' placeholder='*您的签署密码'  autocomplete='off' class='confirmInput'/> ",
        "<span  class='cancelBtn'>忘记密码？</span>",
        "<span  class='sureBtn'>确定</span>",
        function() {
          $.showConfirm(
            "请到Xcontract电子签名平台</br>电脑版官网找回签署密码，</br>http://www.xcontract.com/",
            "好的"
          );
        },
        () => {
          let pwd = $("#signPassword").val();
          if (!pwd) {
            $.showMsg("签署密码不能为空");
            return false;
          } else {
            signInfo.data.signPassword = md5Util.md5(pwd);
            console.log(signInfo);
            this.signRep(signInfo);
          }
        }
      );
    },
    confirmHandler(pwd) {
      let signInfo = this.getSignData();
      if (signInfo.hasSignCount) {
        if (signInfo.haveAuthSel) {
          let notSignCount = this.fileArray.length - signInfo.hasSignCount;
          if (notSignCount === 0) {
            // 全部合同都签署完成
            this.getPassword(signInfo);
          } else {
            // 部分合同未签署 需要用户确认
            $.showConfirm(
              `你有${notSignCount}条合同未签署，是否签署完成`,
              "否",
              "是",
              "",
              () => {
                this.getPassword(signInfo);
              }
            );
          }
        } else {
          $.showMsg("该合同是授权合同，必须使用授权签章");
        }
      } else {
        // 一个文件都没有签署
        $.showMsg("请在合同上加盖印章后，再点击签署");
      }
    },
    // 发起签署请求
    signRep(signInfo) {
      BaseApi.createRpcToken("/contract/sign", signInfo.data, "post")
        .then(
          data => {
            //提交成功
            if (data.datas.success) {
              if (data.datas.finished) {
                this.$router.push(`/signDetail?id=${this.$route.query.id}`);
              } else {
                this.$router.push("/signResult?isSuccess=Y");
              }
            } else {
              let url = `/signResult?isSuccess=N&id=${
                this.$route.query.id
              }&taskId=${this.$route.query.taskId}`;
              if (this.$route.query.contractForMe) {
                url += `&contractForMe=${this.$route.query.contractForMe}`;
              }
              this.$router.push(url);
              $.showMsg(data.datas.message);
            }
          },
          () => {}
        )
        .catch(function(e) {
          errorLog(e);
        });
    },
    getSignData() {
      let data = {
        id: this.$route.query.id,
        sealParams: [],
        taskId: this.$route.query.taskId,
        signLocation:
          this.location && this.location.detail && this.location.detail.address,
        signLocationAttr:
          this.location &&
          this.location.detail &&
          this.location.detail.location &&
          this.location.detail.location.lng +
            "," +
            this.location.detail.location.lat
      };
      let hasSignCount = 0;
      let haveAuthSel = this.authorizedSealList.length ? false : true;
      this.fileArray.forEach(value => {
        let hasSign = false;
        for (let i in value.sealPos) {
          if (this.authorizedSealList.length) {
            this.authorizedSealList.forEach((value, index) => {
              if (value.id == i) {
                haveAuthSel = true;
              }
            });
          }
          for (let x = 0; x < 2; x++) {
            let dataTemp = {
              fileId: value.id,
              sealId: i,
              sealPos: [],
              type: x
            };
            for (let j in value.sealPos[i]) {
              hasSign = true;
              if (value.sealPos[i][j].type == x) {
                dataTemp.sealPos.push(value.sealPos[i][j]);
              }
            }
            if (dataTemp.sealPos.length) {
              data.sealParams.push(dataTemp);
            }
          }
        }
        if (hasSign) {
          hasSignCount += 1;
        }
      });
      console.log(data.sealParams);
      data.sealParams = JSON.stringify(data.sealParams);
      return {
        hasSignCount: hasSignCount,
        haveAuthSel: haveAuthSel,
        data: data
      };
    },
    getFiled() {
      BaseApi.createRpcToken("/file/list", {
        id: this.$route.query.id || 1
      })
        .then(
          data => {
            this.fileArray = data.datas.list;
            this.selectItem(this.fileArray[0]);
          },
          () => {}
        )
        .catch(function(e) {
          errorLog(e);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.signMain {
  width: 100%;
  height: 100%;
  position: relative;
}
.my_doc_sign_div_seal {
  width: 120px;
  height: 120px;
  margin: 10px 13px;
  position: relative;
  float: left;
  border: 1px solid #dddddd;
}
.my_doc_sign_img_seal {
  width: 100%;
  height: 100%;
  position: absolute;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  padding: 0;
  border: none;
}
.my_doc_sign_img_uncheck {
  display: none;
}
.my_doc_sign_img_check {
  width: 120px;
  height: 120px;
  position: absolute;
  display: block;
  left: 0px;
  top: 0px;
}
.confirmInput {
  margin-top: 14px;
  padding-left: 16px;
  width: 216px;
  border: 1px solid #dfdfdf;
  height: 38px;
  outline: none;
  background: white;
}
.confirmTitle {
  width: 100%;
  font-weight: 600;
  color: #101014;
}
.confirmTextArea {
  padding-top: 8px;
  height: 72px;
  padding-left: 16px;
  outline: none;
  margin-top: 10px;
  width: 216px;
  border-radius: 6px;
  border: 1px solid #dfdfdf;
  background: white;
}
.cancelBtn {
  color: #363636;
}
.sureBtn {
  color: #b41c2e;
  font-weight: 600;
}
.scaleImageBox {
  overflow: auto;
  z-index: 10000;
  width: 100%;
  background-color: white;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
.sign {
  position: relative;
  height: 100vh;
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  overflow: scroll;
  .canvasBox {
    position: relative;
  }
  .my_doc_sign_div_seal {
    width: 120px;
    height: 120px;
    margin: 10px 13px;
    position: relative;
    float: left;
    border: 1px solid #dddddd;
  }
  .my_doc_sign_img_seal {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 30px;
    top: 30px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    padding: 0;
    border: none;
  }
  .my_doc_sign_img_check {
    width: 25px;
    height: 25px;
    position: absolute;
    display: block;
    left: 90px;
    top: 90px;
  }
  .my_doc_sign_img_uncheck {
    display: none;
  }
  .my-doc-sign-seal_bg {
    background-color: #f5dbd4;
    opacity: 0.5;
  }
  .my-doc-sign-seal_delete {
    position: absolute;
    top: -14px;
    right: -18px;
    display: inline-block;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 18px;
    border: 1px solid #dedede;
    border-radius: 50%;
    color: #9e9e9e;
    font-size: 12px;
  }

  .my-doc-sign-seal {
    position: fixed;
    z-index: 169;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    z-index: 100;
    display: block;
  }
  .sealPositon {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -22px;
    margin-left: -22px;
    width: 45px;
    height: 45px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .sealNormal {
    position: absolute;
    width: 119px;
    height: 119px;
    background-color: rgba(208, 2, 27, 0.08);
    z-index: 4;
    img {
      width: 119px;
      height: 119px;
    }
    .deleteSeal {
      position: absolute;
      display: none;
      font-size: 12px;
      font-weight: 400;
      color: #fff;
      line-height: 12px;
      text-align: center;
      width: 40px;
      height: 20px;
      z-index: 2;
      line-height: 20px;
      background: rgba(208, 2, 27, 0.6);
      opacity: 1;
      border-radius: 0 0 10px 10px;
      cursor: pointer;
      border: none;
      left: 50%;
      top: 118px;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
    }
    &:hover {
      .deleteSeal {
        display: block;
      }
    }
  }

  .content {
    padding-top: 102px;
    padding-bottom: 51px;
    position: relative;
    height: 5000px;
    .pinch-zoom-container {
      overflow: visible !important;
      height: auto !important;
    }
    .seleteDetail {
      position: absolute;
      width: 100%;
      height: calc(100vh - 102px);
      top: 102px;
      left: 0;
      overflow: auto;
      background-color: white;
    }
    .contractContainer {
      width: 100%;
    }
  }
  .contractItem {
    padding: 0 20px;
    box-sizing: border-box;
    background-color: white;
    .fistLineBox {
      height: 35px;
      font-size: 15px;
      border-bottom: 1px solid #ebebeb;
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
  .selectBox {
    height: 50px;
    font-size: 14px;
    color: #b41c2e;
    text-align: center;
    line-height: 50px;
    z-index: 200;
    opacity: 0.8;
    position: fixed;
    width: 100%;
    top: 50px;
    z-index: 20;
    background: white;
    border-bottom: 1px solid #dcdcd8;
    .tir {
      width: 22px;
      height: 12px;
      position: absolute;
      right: 10px;
      top: 20px;
      background: url(./../../assets/images/common/pulldown_icon.png);
      background-size: 100% 100%;
    }
    .readLine {
      position: absolute;
      width: 110px;
      height: 2px;
      top: 49px;
      left: 50%;
      margin-left: -55px;
      background-color: #b41c2e;
    }
  }
  .handlerBottom {
    height: 50px;
    font-size: 18px;
    color: #b41c2e;
    text-align: center;
    line-height: 50px;
    position: fixed;
    bottom: 0;
    display: flex;
    z-index: 200;
    width: 100%;
    border-top: 1px solid #dcdcd8;
    background: white;
    opacity: 0.9;
    div {
      flex: 1;
    }
    & > div:first-child {
      border-right: 1px solid #dcdcd8;
    }
  }
}
</style>
