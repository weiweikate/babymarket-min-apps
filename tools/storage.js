/**
 * Created by Patrick on 3/14/17.
 */
import Tool from './tool';

/**
 * 存储类
 */
let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class Storage {

    constructor() {
        if (__instance()) return __instance();

        //init

        __instance(this);
    }

    static sharedInstance() {
        return new Storage();
    }

    static getterFor(key) {
        if (Storage.sharedInstance()['_' + key] === undefined) {
            try {
                let value = wx.getStorageSync(key);
                if (value) {
                    Storage.sharedInstance()['_' + key] = value;
                }
            } catch (e) {
                Storage.sharedInstance()['_' + key] = undefined;
            }
        }
        return Storage.sharedInstance()['_' + key];
    }

    static setterFor(key, value) {
        Storage.sharedInstance()['_' + key] = undefined;
        wx.setStorageSync(key, value);
    }

    /**
     * 微信用户信息
     * @returns {undefined|*|void}
     */
    static wxUserInfo() {
        return this.getterFor('wxUserInfo');
    }

    static setWxUserInfo(wxUserInfo) {
        this.setterFor('wxUserInfo', wxUserInfo);
    }

    //当前Session
    static currentSession() {
        if (Tool.isEmptyStr(Storage.sharedInstance()._currentSession)) {
            try {
                let value = wx.getStorageSync('currentSession');
                if (!Tool.isEmpty(value)) {
                    Storage.sharedInstance()._currentSession = value;
                }
                else {
                    Storage.sharedInstance()._currentSession = '2a119ab6-31f7-488d-9c60-a59300a70185';
                }
            } catch (e) {
                Storage.sharedInstance()._currentSession = undefined;
            }
        }
        return Storage.sharedInstance()._currentSession;
    }

    static setCurrentSession(currentSession) {
        this.setterFor('currentSession', currentSession)
    }

    static currentMember(){
        return this.getterFor('currentMember');
    }

    static setCurrentMember(currentMember){
        this.setterFor('currentMember',currentMember);
    }

    //登陆标记
    static didLogin() {
        return this.getterFor('didLogin');
    }

    static setDidLogin(didLogin) {
        this.setterFor('didLogin', didLogin);
    }

    //当前登录用户名
    static loginUserName() {
        return this.getterFor('loginUserName');
    }

    static setLoginUserName(loginUserName) {
        this.setterFor('loginUserName', loginUserName);
    }

    //当前登录用户Id
    static memberId() {
        return this.getterFor('memberId');
    }

    static setMemberId(memberId) {
        this.setterFor('memberId', memberId);
    }

    //是否为内部员工
    static isInsideMember() {
        return this.getterFor('Inside') == 'True';
    }

    static setInsideMember(inside) {
        this.setterFor('Inside', inside);
    }

    /**
     * 当前登录类型
     * type = 'Employee';//员工
     * type = 'DealersBoss';//经销商老板
     * type = 'StoreBoss';//门店老板
     * type = 'DealersEmployee';//经销商员工
     * type = 'StoreEmployee';//门店员工
     */
    static loginType() {
        return this.getterFor('loginType');
    }

    static setLoginType(loginType) {
        this.setterFor('loginType', loginType);
    }

    //系统信息
    static sysInfo() {
        return this.getterFor('sysInfo');
    }

    static setSysInfo(sysInfo) {
        this.setterFor('sysInfo', sysInfo);
    }

    /**
     * 获取历史搜索记录
     */
    static getHistorySearch() {
        return this.getterFor('historySearch');
    }

    /**
     * 设置历史搜索记录
     */
    static setHistorySearch(historyData) {
        this.setterFor('historySearch', historyData);
    }

    /**
    * 清除历史搜索记录
    */
    static clearHistorySearch() {
        this.setterFor('historySearch', null);
    }
}