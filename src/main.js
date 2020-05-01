import isToHttps from '@lib/isToHttps.js'
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios';
import GlobalConfig from "./lib/config";
import method from './lib/method';
import "./assets/common/common.css";
import 'mint-ui/lib/style.css';
import '@lib/extend.js'
import {
  Base64
} from 'js-base64';
import moment from "vue-moment";
import 'lib-flexible/flexible.js';
// 按需引入
import Mint from 'mint-ui';
Vue.use(Mint);
import toastRegistry from './components/common/index'
import errorHandler from '@lib/errorHandler.js';
import saveLog from "@lib/saveLog.js"
Vue.use(saveLog);
Vue.use(errorHandler, Vue);
// 这里也可以直接执行 toastRegistry()
Vue.use(toastRegistry)
Vue.prototype.$Ajax = axios;
Vue.prototype.$Base64 = Base64;
Vue.prototype.$Moment = moment;
Vue.prototype.$Method = method;
// 处理微信浏览器的问题
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
  WeixinJSBridge.call('hideToolbar'); // 隐藏底部状态栏
  WeixinJSBridge.call('hideOptionMenu'); // 隐藏右上角的三个点的选项
  WeixinJSBridge.call('showToolbar'); // 显示底部状态栏
  WeixinJSBridge.call('showOptionMenu'); // 显示右上角的三个点的选项
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");