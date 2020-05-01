import Vue from 'vue';
import axios from 'axios';
export default class Util {
    constructor() {
        throw new Error('静态类不需要初始化');
    }
    static getLocation = function (callback, errCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let latitude = position.coords.latitude
                let longitude = position.coords.longitude
                let geocoder = new qq.maps.Geocoder({
                    complete: function (result) {
                        callback && callback(result);
                    }
                });
                var coord = new qq.maps.LatLng(latitude, longitude);
                geocoder.getAddress(coord);
            }, errCallback || function (error) {
                callback && callback(null);
                switch (error.code) {
                    case 1:
                        console.log("位置服务被拒绝。");
                        break;
                    case 2:
                        console.log("暂时获取不到位置信息。");
                        break;
                    case 3:
                        console.log("获取位置信息超时。");
                        break;
                    default:
                        console.log("未知错误。");
                        break;
                }
            });
        } else {
            return null;
        }
    }
    // 获取唯一值
    static getUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    static getNowDate() {
        var time = new Date();
        var year = time.getFullYear(); //获取年
        var month = time.getMonth() + 1; //或者月
        var day = time.getDate(); //或者天
        var hour = time.getHours(); //获取小时
        var minu = time.getMinutes(); //获取分钟
        var second = time.getSeconds(); //或者秒
        return `${year}-${month}-${day}  ${hour}:${minu}:${second}`
    }
    static urlParse = function () {
        var url = location.search; //获取url中"?"符后的字串  
        console.log(url);
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
}