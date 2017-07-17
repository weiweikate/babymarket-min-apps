/**
 * Created by coin on 3/12/17.
 */
'use strict';

import Request from '../base-requests/request'
import Network from '../network'
import Tool from '../../tools/tool'

/**
 * 登录请求不属于读、写请求，不能写在factory中，另外创建，并重写body方法
 */

export default class RequestLogin extends Request {

    constructor(username,password) {
        super({});
        this.baseUrl = Network.sharedInstance().loginURL;

        this.username = username;
        this.password = password;
    }

    //拼接body
    body() {
        this._body = {
            "LoginName":this.username,
            "Password":this.password,
            "Medium":"Tope企Lite"
        };
        this.bodyParam = this._body;
        return this._body;
    }
}
