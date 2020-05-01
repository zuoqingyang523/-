let ENV = process.env.VUE_APP_CURRENTMODE; //获取环境变量
console.log(ENV)
let currentUrl = "";
let mobileSignUrl = '';
switch (ENV) {
  case 'testing':
    console.log('测试环境')
    currentUrl = "http://47.94.74.150:8000";
    mobileSignUrl = "http://47.94.74.150:8001";
    break;
  case 'preview':
    console.log('预发环境')
    currentUrl = "http://www.xcontract.cn";
    mobileSignUrl = "http://m.xcontract.cn";
    break;
  case 'product':
    console.log('生产环境')
    currentUrl = "http://www.xcontract.cn";
    mobileSignUrl = "http://m.xcontract.cn";
    break;
  default:
    console.log("本地环境")
    currentUrl = "http://47.94.74.150:8000";
    mobileSignUrl = "http://47.94.74.150:8001";
}
let GlobalConfig = {
  currentUrl: currentUrl,
  mobileSignUrl: mobileSignUrl,
  ENV: ENV
}
export default GlobalConfig;