/**
 * 登陆页面
 */

import RequestLogin from '../../network/requests/request-login';
let {Tool, Storage} = global;

Page({
    loginAction: function (e) {
        let userInfo = e.detail.value
        let username = userInfo.username
        let password = userInfo.password

        let self = this;
        let r = new RequestLogin(username, password);
        r.finishBlock = (req) => {
            let model = req.responseObject;
            let session = model.Session;
            let key = model.Person.Key;
            let id = Tool.idFromDataKey(key);
            let type = self.loginTypeWithKey(key);

            Storage.setCurrentSession(session);
            Storage.setDidLogin(true);
            Storage.setMemberId(id);
            Storage.setLoginType(type);
            self.gotoIndex();
        };
        r.addToQueue();
    },
    checkInput: function (e) {
        let userInfo = e.detail.value;
        let username = userInfo.username;
        let password = userInfo.password;
    },
    gotoIndex: function () {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    loginTypeWithKey: function (key) {
        let type = '';
        if (Tool.isStringStartsWith(key, 'Employee')) {
            type = 'Employee';//员工
        }
        else if (Tool.isStringStartsWith(key, 'KH')) {
            type = 'DealersBoss';//经销商老板
        }
        else if (Tool.isStringStartsWith(key, 'ZDSD')) {
            type = 'StoreBoss';//门店老板
        }
        else if (Tool.isStringStartsWith(key, 'CustomerPerson')) {
            type = 'DealersEmployee';//经销商员工
        }
        else if (Tool.isStringStartsWith(key, 'StorePerson')) {
            type = 'StoreEmployee';//门店员工
        }

        return type
    }
})

