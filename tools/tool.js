/**
 * Created by Patrick on 1/13/17.
 */

'use strict';

var bmap = require('../libs/baidu-map/bmap-wx.min');

//工具类


let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class Tool {

    constructor() {
        if (__instance()) return __instance();

        //init
        this.requestCount = 0;//判断加载动画是否需要隐藏

        __instance(this);
    }

    static sharedInstance() {
        return new Tool();
    }

    static formatTime(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        return [year, month, day].map(Tool.formatNumber).join('-') + ' ' + [hour, minute, second].map(Tool.formatNumber).join(':');
    }

    static formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    }

    static timeStringFromInterval(interval, format) {
        let date = new Date(interval * 1000);
        return this.timeStringForDate(date, format);
    }

    static stringToDate(_date,_format,_delimiter)    {
        var formatLowerCase=_format.toLowerCase();
        var formatItems=formatLowerCase.split(_delimiter);
        var dateItems=_date.split(_delimiter);
        var monthIndex=formatItems.indexOf("mm");
        var dayIndex=formatItems.indexOf("dd");
        var yearIndex=formatItems.indexOf("yyyy");
        var month=parseInt(dateItems[monthIndex]);
        month-=1;
        var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
        return formatedDate;
    }

    static timeIntervalFromString(string) {
        let date = Tool.dateFromString(string);
        let timeInterval = parseInt(date.getTime() / 1000);
        return timeInterval;
    }

    static timeIntervalFromNow(interval = 0){
        return this.timeIntervalFromDate(new Date(),interval);
    }

    static timeIntervalFromDate(date, interval) {
        return parseInt(date.getTime() / 1000) + interval;
    }

    static dateFromString(string) {
        let date = new Date(string.replace(/-/g, '/'));
        return date;
    }

    static timeStringForDateString(string, formate) {
        if ('1900-01-01 00:00:00' === string) {
            return '空';
        }
        let date = Tool.dateFromString(string);
        let timeString = Tool.timeStringForDate(date, formate);
        return timeString;
    }

    static timeStringForDate(date, formate) {
        let timeString = Date.format(date, formate);
        return timeString;
    }

    static timeDurationStringForInterval(interval) {
        let str = Tool.timeStringFromInterval(interval, "YYYY MM-DD HH:mm");
        return this.timeDurationStringForDateString(str);
    }

    static timeDurationStringForDateString(string) {
        if (Tool.isEmptyStr(string)) {
            return;
        }
        let duration = parseInt(new Date().getTime() / 1000) - Tool.timeIntervalFromString(string);
        let isNegtive = duration < 0;
        if (isNegtive) {
            duration = -duration;
        }
        let time = '';
        let count = 1;
        if (duration < 60 * 60) {
            count = parseInt(duration / 60.0);
            if (count == 0) {
                time = '刚刚';
            }
            else {
                time = count + "分钟" + (isNegtive ? '后' : '前');
            }
        }
        else if (duration < (24 * 60 * 60)) {
            count = parseInt(duration / 60 / 60);
            time = count + "小时" + (isNegtive ? '后' : '前');
        } else {
            time = Tool.timeStringForDateString(string, "MM-DD HH:mm");
        }

        return (time);
    }

    static dayCountFromInterval(interval) {
        let days = 0;
        let duration = interval - this.timeIntervalFromNow(0);
        let isNegtive = duration < 0;
        if (isNegtive) {
            duration = -duration;
        }

        days = parseInt(duration / (24 * 3600));

        return days + 1;
    }

    /**
     * 时间转为秒数 eg 8:30转为秒数
     * @param time
     * @returns {number}
     */
    static secondCountFromTime(time){
        let arr = time.split(':');
        if (arr.length == 2) {
            let hour = arr[0]
            let min = arr[1];
            let timeInterval = hour * 60 * 60 + min * 60;
            return timeInterval;
        }
        return 0;
    }

    /**
     * 把秒数变成string
     * @param timeCount
     * @returns {string} 08:30
     */
    static timeStringForTimeCount(timeCount) {
        let hour = parseInt(timeCount / (60 * 60));
        let min = parseInt((timeCount - hour * 3600) / 60);
        let hourString = hour + '';
        hourString = global.Tool.addZero(hourString, 2);
        let minString = min + '';
        minString = global.Tool.addZero(minString, 2);
        let openinghours = hourString + ':' + minString;
        return openinghours;
    }

    //生成UUID
    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    //拼接网址
    static generateURL(baseURL, params) {
        if (undefined !== params) {
            let pairs = [];
            for (let key in params) {
                let value = params[key];
                let pair = key + "=" + value;
                pairs.push(pair);
            }

            let query = pairs.join('&');
            let url = baseURL + '?' + query;
            url = encodeURI(url);
            return url;
        }
        else {
            return baseURL;
        }
    }

    //Object 空值判断
    static isEmpty(object) {
        if (object === null || object === undefined) {
            return true;
        }
        for (let i in object) {
            return false;
        }
        return true;
    }

    static isValid(object) {
        return !Tool.isEmpty(object);
    }

    static isEmptyId(theId) {
        if (Tool.isEmptyStr(theId)) {
            return true;
        }
        if ('00000000-0000-0000-0000-000000000000' === theId) {
            return true;
        }
        return false;
    }

    static isValidId(theId) {
        return !Tool.isEmptyId(theId);
    }

    static isEmptyObject(obj) {
        if (Tool.isEmpty(obj)) {
            return true;
        }
        for (var name in obj) {
            return false;
        }
        return true;
    }

    static isValidObject(obj) {
        return !Tool.isEmptyObject(obj);
    }

    //String 空值判断
    static isEmptyStr(str) {
        if (Tool.isEmpty(str)) {
            return true;
        }
        else if (str instanceof String && str.length === 0) {
            return true;
        }
        return false;
    }

    static isValidStr(str) {
        return !Tool.isEmptyStr(str);
    }

    //Array 空值判断
    static isEmptyArr(arr) {
        if (Tool.isEmpty(arr)) {
            return true;
        }
        else if (arr instanceof Array && arr.length === 0) {
            return true;
        }
        return false;
    }

    static isValidArr(arr) {
        return !Tool.isEmptyArr(arr);
    }

    /**
     * 数组是否越界判断
     */
    static isArrValidForIndex(arr, index) {
        if (Tool.isValidArr(arr) && arr.length > index) {
            return true;
        }
        return false;
    }

    static isTrue(str) {
        if (Tool.isEmptyStr(str)) {
            return false;
        }
        return 'true' === str.toLowerCase();
    }

    static isFalse(str) {
        return !Tool.isTrue(str);
    }

    static isFunction(fun) {
        return typeof fun === 'function';
    }

    //弹窗提示
    static showAlert(msg, okCB = () => { }) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    okCB();
                }
            }
        });
    }

    static showSuccessToast(title, finish = null) {
        let duration = 1000;

        let success = () => {
            if (finish) {
                setTimeout(() => {
                    finish();
                }, duration);
            }
        }

        setTimeout(() => {
            wx.showToast({
                title: title,
                icon: 'success',
                duration: duration,
                success: success,
            })
        }, 400);
    }

    //显示加载动画 rCount 为请求的次数
    static showLoading(rCount = 1) {
        Tool.sharedInstance().requestCount = rCount;

        if (Tool.canIUse('showLoading')) {
            wx.showLoading({ title: '加载中...' });
        }
        else {
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 95000
            });
        }
    }

    //隐藏加载动画
    static hideLoading() {
        Tool.sharedInstance().requestCount--;
        if (Tool.sharedInstance().requestCount <= 0) {
            if (Tool.canIUse('hideLoading')) {
                wx.hideLoading();
            }
            else {
                wx.hideToast();
            }
        }
    }

    //返回上一个界面
    static navigationPop() {
        wx.navigateBack({
            delta: 1
        });
    }

    /**
     * 选择图片
     * @param imgCount
     * @param successCallback
     */
    static chooseImgsFromWX(imgCount, successCallback) {
        wx.chooseImage({
            count: imgCount, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: successCallback
        }
        );
    }

    /**
     * 图片地址
     * @param theID
     * @param placeholder
     * @returns {*}
     */
    static imageURLForId(theID, placeholder = '') {
        if (global.TCGlobal.EmptyId === theID || Tool.isEmptyStr(theID)) {
            return placeholder;
        }
        if (global.Storage.didLogin()) {
            return global.Network.sharedInstance().attatchmentURL + '?Id=' + theID + '&_SESSION_=' + global.Storage.currentSession();
        }
        return global.Network.sharedInstance().attatchmentURL + '?Id=' + theID;
    }

    static idFromDataKey(key) {
        let com = key.split('.');
        if (Tool.isValidArr(com)) {
            for (let i = 0; i < com.length; i++) {
                let userId = com[i];
                if (Tool.isValidStr(userId)) {
                    if (userId.length > 30 && userId.match("-") != null) {
                        return userId;
                    }
                }
            }
        }
    }

    /**
     * 日期筛选条件
     * @param start
     * @param endDate
     * @param dataKey
     * @returns {string}
     */
    static conditionWithStartDate(start, endDate, dataKey) {
        let con = '';
        if (Tool.isValidStr(start)) {
            con = "${" + dataKey + "} >= '" + start + "'";
        }

        if (Tool.isValidStr(endDate)) {
            if (Tool.isValidStr(con)) {
                con = con + " && ${" + dataKey + "} <= '" + endDate + "'";
            }
            else {
                con = "${" + dataKey + "} <= '" + endDate + "' ";
            }
        }

        let shopId = global.Storage.memberId()
        if (Tool.isValidStr(con)) {
            con = con + " && ${ShopId} == '" + shopId + "'";
        }
        else {
            con = "${ShopId} == '" + shopId + "' ";
        }

        return con;
    }

    /**
     * 搜索条件拼接
     * @param keyword
     * @param theKey
     * @returns {string}
     */
    static conditionForKeyword(keyword, theKey) {
        let con = '';
        if (Tool.isValidStr(keyword) && Tool.isValidStr(theKey)) {
            con = "StringIndexOf(${" + theKey + "},'" + keyword + "') > 0";
            let keywords = keyword.split(' ');
            if (Tool.isValidArr(keywords)) {
                let key = keyword[0];
                if (Tool.isValidStr(key)) {
                    con = "StringIndexOf(${" + theKey + "},'" + key + "') > 0"
                }

                if (keywords.length >= 2) {
                    keywords.forEach((item, index) => {
                        key = item;
                        if (Tool.isValidStr(key)) {
                            con = con + " && StringIndexOf(${" + theKey + "},'" + key + "') > 0";
                        }
                    })
                }
            }
        }

        return con;
    }


    /**
     * 从数组中移除一个对象
     * @param obj
     * @param arr
     * @returns {*}
     */
    static removeObjectFromArray(obj, arr) {
        var index = arr.indexOf(obj);
        // console.log('removeObjectFromArray index:' + index);

        if (index > -1) {
            arr.splice(index, 1);
        }

        return arr;
    }

    /**
     *  获取Appendixes  id
     */
    static getAppendixesKeyMap(str) {
        let id = '';
        let key = '';
        if (Tool.isValidStr(str)) {
            let arr = str.split('.');
            if (Tool.isValidArr(arr) && arr.length == 2) {
                key = arr[0];
                id = arr[1];
            }
        }
        return { key: key, id: id };
    }

    // 格式化距离
    static formatDistance(value) {
        let dis = parseInt(value);
        let isKM = dis > 1000;
        if (isKM) {
            return parseInt(dis / 1000) + '公里';
        }
        else {
            return dis + '米';
        }
    }

    /**
     * str是否已needle开头
     *
     * @param str
     * @param needle
     * @returns {boolean}
     */
    static isStringStartsWith(str, needle) {
        return str.lastIndexOf(needle, 0) === 0
    }

    static addZero(str, length) {
        return new Array(length - str.length + 1).join("0") + str;
    }

    static redirectTo(url, success, fail, complete) {
        console.log('\n\n******************************************************************************************');
        console.log('redirectTo:' + url);
        wx.redirectTo({
            url: url,
            success: success,
            fail: fail,
            complete: complete,
        }
        )
    }

    static switchTab(url, success, fail, complete) {
        console.log('\n\n******************************************************************************************');
        console.log('switchTab:' + url);
        wx.switchTab({
            url: url,
            success: success,
            fail: fail,
            complete: complete,
        })
    }

    static navigateTo(url, success, fail, complete) {
        console.log('\n\n******************************************************************************************');
        console.log('navigateTo:' + url);
        wx.navigateTo({
            url: url,
            success: success,
            fail: fail,
            complete: complete,
        })
    }

    /**
     * 查看权限
     * @param scope
     * @param success
     * @param fail
     */
    static getScope(scope, success, fail, complete, notCompatible) {
        if (wx.canIUse('getSetting') && wx.canIUse('authorize')) {
            wx.getSetting({
                success(res) {
                    if (!res[scope]) {
                        wx.authorize({
                            scope: scope,
                            success() {
                                console.log(scope + ' success');
                                if (global.Tool.isFunction(success)) {
                                    success();
                                }
                            },
                            fail() {
                                console.log(scope + ' fail');
                                if (global.Tool.isFunction(fail)) {
                                    fail();
                                }
                            },
                            complete() {
                                console.log(scope + ' complete');
                                if (global.Tool.isFunction(complete)) {
                                    complete();
                                }
                            },
                        })
                    }
                },
                fail(res) {
                    console.log('authorize、getSetting 不兼容当前版本');
                    if (global.Tool.isFunction(notCompatible)) {
                        notCompatible();
                    }
                }
            })
        }
        else {
            console.log('authorize、getSetting 不兼容当前版本');
            if (global.Tool.isFunction(notCompatible)) {
                notCompatible();
            }
        }
    }

    static canIUse(method) {
        let canIUse = wx.canIUse(method);
        if (canIUse === false) {
            console.log('方法：' + method + '不兼容当前版本，无法使用');
        }
        return canIUse;
    }

    /**
     * 获取地理位置，自动处理授权提示
     * @param success
     * @param fail
     * @param complete
     */
    static getLocation(success = (res) => { }, fail = () => { }, complete = () => { }) {
        let resultHandler = (success, fail, complete) => {
            Tool.queryLocation((res) => {
                if (Tool.isValid(res)) {
                    success(res);
                }
                else {
                    fail();
                }
            }, () => {
                complete();
            });
        }

        //请求授权获取地理位置信息
        this.getScope('scope.userLocation',
            //成功
            () => {
                resultHandler(success, fail, complete);
            },
            //失败
            () => {
                fail();
            },
            //完成
            () => {
                complete();
            },
            //不兼容，直接请求地址
            () => {
                resultHandler(success, fail, complete);
            });
    }

    //调用微信接口，获取定位信息
    static queryLocation(cb = (res) => { }, complete = () => { }) {
        wx.getLocation({
            // type:'gcj02',
            success: function (res) {
                console.log('location');
                console.log(res);

                var that = this;
                /* 获取定位地理位置 */
                // 新建bmap对象
                var BMap = new bmap.BMapWX({
                    ak: global.TCGlobal.BaiduMapKey
                });
                var fail = function (data) {
                    console.log(data);
                };
                var success = function (data) {
                    //返回数据内，已经包含经纬度
                    console.log(data);

                    res.wxMarkerData = data.wxMarkerData;
                    res.originalData = data.originalData;
                    cb(res);
                }
                // 发起regeocoding检索请求
                BMap.regeocoding({
                    fail: fail,
                    success: success
                });
            },
            fail: function () {
                cb(null);
            },
            complete: function () {
                complete();
            }
        })
    }

    /**
     * 判断字符串中是否只包含字母或数字
     */
    static checkString(value) {
        var Regx = /^[A-Za-z0-9]*$/;
        if (Regx.test(value)) {
            return true;
        }
        else {
            return false;
        }
    }
    
}

