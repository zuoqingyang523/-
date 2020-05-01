<template>
  <div class="signList">
    <nav-top :name="'我的文件'" :backUrl="'/home'"></nav-top>
    <div style="height:50px;"></div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="0">全部</mt-tab-item>
      <mt-tab-item id="1">待我签</mt-tab-item>
      <mt-tab-item id="2">待他人签</mt-tab-item>
      <mt-tab-item id="4">已完成</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected" class="tabContainer">
      <mt-tab-container-item id="0">
        <list
          @loadMore="loadMore"
          @loadNew="loadNew"
          :total="allTotal"
          :status="0"
          :currentLength="allCurrentLength"
          v-if="allTotal&&allCurrentLength"
        >
          <ul slot="list">
            <li v-for="item in allList" :key="item.id" class="contractItem" @click="goSign(item)">
              <div class="fistLineBox">
                <div class="nameBox">{{item.name}}</div>
                <div class="timeBox">{{item.createTime | time10}}</div>
              </div>
              <div class="lastLine">
                <span v-if="item.contractUser">{{'发件人：'+ item.contractUser.name}}</span>
              </div>
            </li>
            <div v-if="allCurrentLength===allTotal" class="noMore">没有更多了</div>
          </ul>
        </list>
        <div v-if="!allTotal" class="noDataContainer">
          <div class="noDataContent">
            <img class="noDataImage" src="@image/nofile_icon.png">
            <p class="contentDscp">暂无数据</p>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="1">
        <list
          @loadMore="loadMore"
          @loadNew="loadNew"
          :total="waitTotal"
          :status="1"
          :currentLength="waitCurrentLength"
          v-if="waitTotal&&waitCurrentLength"
        >
          <ul slot="list">
            <li v-for="item in waitList" :key="item.id" class="contractItem" @click="goSign(item)">
              <div class="fistLineBox">
                <div class="nameBox">{{item.name}}</div>
                <div class="timeBox">{{item.createTime | time10}}</div>
              </div>
              <div class="lastLine">
                <span v-if="item.contractUser">{{'发件人：'+ item.contractUser.name}}</span>
              </div>
            </li>
            <div v-if="waitCurrentLength===waitTotal" class="noMore">没有更多了</div>
          </ul>
        </list>
        <div v-if="!waitTotal" class="noDataContainer">
          <div class="noDataContent">
            <img class="noDataImage" src="@image/nofile_icon.png">
            <p class="contentDscp">暂无数据</p>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <list
          @loadMore="loadMore"
          @loadNew="loadNew"
          :status="2"
          :total="waitOtherTotal"
          :currentLength="waitOtherCurrentLength"
          v-if="waitOtherTotal&&waitOtherCurrentLength"
        >
          <ul slot="list">
            <li
              v-for="item in waitOtherList"
              @click="goSign(item)"
              :key="item.id"
              class="contractItem"
            >
              <div class="fistLineBox">
                <div class="nameBox">{{item.name}}</div>
                <div class="timeBox">{{item.createTime | time10}}</div>
              </div>
              <div class="lastLine">
                <span v-if="item.contractUser">{{'发件人：'+ item.contractUser.name}}</span>
              </div>
            </li>
            <div v-if="waitOtherCurrentLength===waitOtherTotal" class="noMore">没有更多了</div>
          </ul>
        </list>
        <div v-if="!waitOtherTotal" class="noDataContainer">
          <div class="noDataContent">
            <img class="noDataImage" src="@image/nofile_icon.png">
            <p class="contentDscp">暂无数据</p>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="4">
        <list
          @loadMore="loadMore"
          @loadNew="loadNew"
          :status="4"
          :total="completeTotal"
          :currentLength="completeCurrentLength"
          v-if="completeTotal&&completeCurrentLength"
        >
          <ul slot="list">
            <li
              v-for="item in completeList"
              :key="item.id"
              class="contractItem"
              @click="goSign(item)"
            >
              <div class="fistLineBox">
                <div class="nameBox">{{item.name}}</div>
                <div class="timeBox">{{item.createTime | time10}}</div>
              </div>
              <div class="lastLine">
                <span v-if="item.contractUser">{{'发件人：'+ item.contractUser.name}}</span>
              </div>
            </li>
            <div v-if="completeCurrentLength===completeTotal" class="noMore">没有更多了</div>
          </ul>
        </list>
        <div v-if="!completeTotal" class="noDataContainer">
          <div class="noDataContent">
            <img class="noDataImage" src="@image/nofile_icon.png">
            <p class="contentDscp">暂无数据</p>
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
import NavTop from "./common/NavTop.vue";
import list from "./common/list.vue";
import BaseApi from "@lib/baseApi.js";
import { Indicator } from "mint-ui";
export default {
  name: "HelloWorld",
  components: {},
  data() {
    return {
      selected: "",
      allTotal: 0,
      allCurrentLength: 0,
      allList: [],
      waitTotal: 0,
      waitCurrentLength: 0,
      waitList: [],
      waitOtherTotal: 0,
      waitOtherCurrentLength: 0,
      waitOtherList: [],
      completeTotal: 0,
      completeCurrentLength: 0,
      completeList: []
    };
  },
  components: {
    NavTop,
    list
  },
  created() {},
  computed: {},
  mounted() {
    console.log(this.$route.query.flag == "waitOther");
    if (this.$route.query.flag == "waitOther") {
      this.selected = "2";
      this.getList(2, "new");
    } else if (this.$route.query.flag == "waitMy") {
      this.selected = "1";
      this.getList(1, "new");
    } else {
      this.selected = "0";
      this.getList(0, "new");
    }
  },
  watch: {
    selected: function(newVale, oldValue) {
      if (newVale !== oldValue && oldValue !== "") {
        this.getList(newVale, "new");
      }
    }
  },
  filters: {
    time10: function(value) {
      return (value + "").substring(0, 10);
    }
  },
  beforeRouteLeave(to, from, next) {
    Indicator.close();
    next();
  },
  methods: {
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
    getSearchParams(status, flag) {
      let searchParams = {
        pageNumber: 1,
        pargSize: 10,
        status: status
      };
      if (flag !== "new") {
        if (status == 0) {
          searchParams.pageNumber =
            Number.parseInt(this.allCurrentLength / 10) + 1;
        } else if (status == 1) {
          searchParams.pageNumber =
            Number.parseInt(this.waitCurrentLength / 10) + 1;
        } else if (status == 2) {
          searchParams.pageNumber =
            Number.parseInt(this.waitOtherCurrentLength / 10) + 1;
        } else if (status == 4) {
          searchParams.pageNumber =
            Number.parseInt(this.completeCurrentLength / 10) + 1;
        }
      }
      return searchParams;
    },
    loadMore(detail) {
      this.getList(detail.status, "more", detail.cb);
    },
    loadNew(detail) {
      this.getList(detail.status, "new", detail.cb);
    },
    getList(status, flag, cb) {
      let searchParams = this.getSearchParams(status, flag);
      Indicator.open();
      BaseApi.createRpcToken("/contract/list", searchParams).then(
        data => {
          if (status == 0) {
            this.allTotal = data.datas.list.totalRow;
            if (flag == "new") {
              this.allList = data.datas.list.list;
            } else {
              this.allList.push(...data.datas.list.list);
            }
            this.allCurrentLength = this.allList.length;
            cb && cb(this.allCurrentLength, this.allTotal);
          } else if (status == 1) {
            this.waitTotal = data.datas.list.totalRow;
            if (flag == "new") {
              this.waitList = data.datas.list.list;
            } else {
              this.waitList.push(...data.datas.list.list);
            }
            this.waitCurrentLength = this.waitList.length;
            cb && cb(this.waitCurrentLength, this.waitTotal);
          } else if (status == 2) {
            this.waitOtherTotal = data.datas.list.totalRow;
            if (flag == "new") {
              this.waitOtherList = data.datas.list.list;
            } else {
              this.waitOtherList.push(...data.datas.list.list);
            }
            this.waitOtherCurrentLength = this.waitOtherList.length;
            cb && cb(this.waitOtherCurrentLength, this.waitOtherTotal);
          } else if (status == 4) {
            this.completeTotal = data.datas.list.totalRow;
            if (flag == "new") {
              this.completeList = data.datas.list.list;
            } else {
              this.completeList.push(...data.datas.list.list);
            }
            this.completeCurrentLength = this.completeList.length;
            cb && cb(this.completeCurrentLength,this.completeTotal);
          }
          Indicator.close();
        },
        () => {
          cb && cb();
          Indicator.close();
        }
      ).catch(function(e) {
          errorLog(e);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.signList {
  height: 100%;
  .mint-navbar {
    margin-bottom: 10px;
  }
  .noMore {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #c8c8c8;
    line-height: 14px;
    text-align: center;
  }
  .mint-tab-container-wrap {
    height: 100%;
    .mt-tab-container-item {
      height: 100%;
    }
  }

  .noDataContainer {
    height: calc(100% - 106px);
    position: relative;
    .noDataContent {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -30px;
      margin-top: -30px;
      text-align: center;
      .noDataImage {
        width: 35px;
        height: 30px;
        margin-bottom: 10px;
      }
      .contentDscp {
        color: #b4b4b4;
        font-size: 12px;
        line-height: 15px;
      }
    }
  }
  .mint-navbar .mint-tab-item.is-selected {
    border-bottom: 3px solid #b41c2e;
    color: #b41c2e;
    margin-bottom: -3px;
  }
  .mint-cell {
    min-height: 70px;
  }
  .tabContainer {
    height: calc(100% - 116px);
  }
  .contractItem {
    padding: 0 20px;
    border-bottom: 2px solid #ebebeb;
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
}
</style>
