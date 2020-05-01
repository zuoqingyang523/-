import RequestMethod from './request.js';
import Util from './util.js'
import axios from 'axios';
import {
    Toast
} from 'mint-ui'
/**
 *  Created by zqy on 18/12/23.
 *   APIs  $http版.
 *  本文件定义  zqy 基础类
 *  @author  zqy
 */
// 增加axios拦截
axios.interceptors.response.use((suc) => {
    if (!suc.config.isNotFormat) {
        if (suc.data && suc.data.code == 200) {
            if (suc.config.responseType === 'arraybuffer') {
                return Promise.resolve(suc);
            }
            return Promise.resolve(suc.data);
        } else {
            if (suc.data.code === 102) {
                goToHandler();
            } else if (suc.data.code === 103) {
                goToHandler();
            } else {
                if (localStorage.token) {
                    handlerServiceErrResponse(suc.data, suc.config.isCommonHandler);
                }
            }
            errorLog('', {
                requestId: suc.config.requestId,
                requestUrl: suc.config.url,
                code: suc.data.code
            })
            return Promise.reject(suc.data);
        }
    } else {
        return Promise.resolve(suc.data);
    }

}, (error) => {
    handlerErrResponse(error.response, error.response.status, error.config.isCommonHandler);
    return Promise.reject(error.response.data, error.response.status);
});

let goToHandler = function (fault) {
    localStorage.clear();
    window.location.href = '/login';
    if (bowser.msie) {
        window.location.reload();
    }

};
let showMessage = function (str, s) {
    Toast({
        message: str,
        type: 'error',
        showClose: true,
        duration: s || 2000
    });
};
let handlerErrResponse = async function (error, status, isCommonHandler) {
    let res = error.data;
    if (status === 502) {
        // 502  单独处理
        return;
    }
    if (status === 404) {
        // 404  单独处理
        return;
    } else if (status === 403) {
        sessionStorage.token = (await createRpcTokenFun('/getToken')).result;
        window.location.href = '/m/login';
        return;
    }
    if (res) {
        if (isCommonHandler) {
            console.log(res);
            if (res.message) {
                showMessage(res.message, 2000);
            } else {
                showMessage('抱歉暂时无法处理您的请求”');
            }
        }
    } else {
        showMessage('抱歉暂时无法处理您的请求');
    }
};
let handlerServiceErrResponse = function (data, isCommonHandler) {
    if (isCommonHandler) {
        if (data.message) {
            showMessage(data.message, 2000);
        } else {
            showMessage('抱歉暂时无法处理您的请求”');
        }
    }
};
let createRpcTokenFun = function (url, data, method, encode = true,
    cache = false, isCommonHandler = true, responseType, isNotFormat, isVery = true) {
    if (!sessionStorage.token && !isVery) {
        this.getTocken
    }
    data = data || {};
    method = method || RequestMethod.GET;
    cache = cache || false;
    if (method.toLowerCase() === 'get' || method.toLowerCase() === 'head') {
        let params = '';
        Object.keys(data).forEach(
            function (key) {
                if (data[key] !== undefined && data[key] !== '') {
                    let value = data[key];
                    if (encode) {
                        value = encodeURIComponent(value.replace("?", "::::"));
                    }
                    params += key + '=' + value + '&';
                }
            }
        );
        if (params.length > 0) {
            params = params.substr(0, params.length - 1);
            url += '?' + params;
            data = {};
        }
    }
    let headers;
    // 传入设置Authorization请求头信息
    let uid = Util.getUID();
    headers = BaseApi.getHeaderValue(uid);
    if (cache === false) {
        headers['Cache-Control'] = 'no-cache';
        headers['Pragma'] = 'no-cache';
    }
    url = '/m' + url;
    return axios({
        url: url,
        method: method,
        data: data,
        _timeout: 15000,
        cache: cache,
        headers: headers,
        isCommonHandler: isCommonHandler,
        responseType: responseType,
        isNotFormat: isNotFormat,
        requestId: uid,
        transformRequest: function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }
    });
};
export default class BaseApi {
    /**
     * 构造方法
     * @param {string} version
     */
    /**
     * 创建访问令牌
     * @param {string} url 请求地址
     * @param {Object} data 请求参数
     * @param {string} method  http请求方式
     * @param {boolean} encode 是否编码 用于get请求 默认为false
     * @param {boolean} cache 是否启用缓存
     * @param {boolean} isCommonHandler 是否采用默认方式处理错误提示语 默认为true
     * @param {string} responseType 相应类型
     * @param {string} isNotFormat 后台返回的数据是否规范
     * @return {Object} 访问令牌
     */
    static async createRpcToken(url, data, method, encode = false,
        cache = false, isCommonHandler = true, responseType, isNotFormat, isVery = true) {
        if (!sessionStorage.token) {
            sessionStorage.token = (await createRpcTokenFun('/getToken')).result;
            return createRpcTokenFun(url, data, method, encode, cache, isCommonHandler, responseType, isNotFormat, isVery)
        } else {
            return createRpcTokenFun(url, data, method, encode, cache, isCommonHandler, responseType, isNotFormat, isVery)
        }

    }
    /**
     * 获取请求头信息 ,子类重写此方法可改变请求头信息
     * @param  {boolean} cache  请求是否缓存
     * @return {Object}
     * **/
    static getHeaderValue(uid) {
        let headers = localStorage.token ? {
            'token': localStorage.token,
        } : {};
        headers = Object.assign(headers, {
            'X-CSRF-Token': sessionStorage.token,
            'request-id': uid
        })
        return headers;
    }
}