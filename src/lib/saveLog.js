import baseApi from '@lib/baseApi';
import * as Bowser from "bowser";
import Util from "@lib/util.js"
import config from "@lib/config.js"
const browser = Bowser.getParser(window.navigator.userAgent);
let ENV = config.ENV;
const browserInfo = browser.getBrowser();
let warnAndInfoLog = [];
let errorSubmitUrl = "/errorLog";
let warnAndInfoLogUrl = "/m/warnAndInfoLog"
let handlerCommon = function (content, type) {
    let data = {};
    if (ENV != 'product') {
        if (type == 'warn') {
            console.warn(content);
        } else if (type == 'error') {
            console.error(content);
        } else {
            console.log(content);
        }
    }
    data.env = ENV;
    data.type = type;
    data.content = content;
    data.browserInfo = JSON.stringify(browserInfo);
    data.url = window.location.href;
    data.time = Util.getNowDate();
    return data;
}

let warnLog = function (content, trace) {
    let data = handlerCommon(content, 'warn');
    data.trace = trace;
    warnAndInfoLog.push(data);
}

let infoLog = function (content) {
    let data = handlerCommon(content, 'info');
    warnAndInfoLog.push(data);
}

let errorLog = function (content, otherInfo) {
    let data = handlerCommon(content, 'error');
    if (otherInfo) {
        data = Object.assign(data, otherInfo);
    }
    baseApi.createRpcToken(errorSubmitUrl, data, 'get');
}
export default {
    install() {
        window.warnLog = warnLog;
        window.errorLog = errorLog;
        window.infoLog = infoLog;
    }
}