// 支付方式
let { Event, RequestWriteFactory, RequestReadFactory, Tool} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: {},
    },
    mainId:'',

    /**
      * 生命周期函数--监听页面加载
      */
    onLoad: function (options) {
        this.mainId = options.mainId;

        //获取团购订单详情
        this.requestGroupBuyOrderDetail();
    },

    /**
     * 修改订单
     */
    modifyOrder: function (requestData, infos, no, money, id) {
        let self = this;
        let r = RequestWriteFactory.modifyOrder(requestData);
        let door=this.data.door;
        r.finishBlock = (req) => {
            wx.setStorage({
                key: 'infos',
                data: infos,
                success: function (res) {
                    wx.redirectTo({
                        url: '../pay-success/pay-success?no=' + no + '&price=' + money + '&id=' + id,
                    })
                    //如果从我的订单和订单详情进入，通知我的订单刷新数据
                    if (door === "1") {
                        Event.emit('deleteOrderFinish');//发出通知
                    }
                }
            })
        }
        r.addToQueue();
    },

    /**
     * 查询商品详情
    */
    requestGroupBuyOrderDetail: function () {
        let task = RequestReadFactory.requestGroupBuyOrderDetail(this.mainId);
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            datas.forEach((item, index) => {
                let imageUrl = Tool.imageURLForId(item.ImgId, '/res/img/common/common-avatar-default-icon.png');
                item.imageUrl = imageUrl;
            });

            this.setData({
                order: datas[0]
            });
        }
        task.addToQueue();
    },

    /**
     * 确认支付
     */
    confirmTap: function () {
        // 微信支付 
        this.getCode();
    },


    /**
     * 登录获取code
     */
    getCode: function () {
        let self = this;
        wx.login({
            success: function (res) {
                self.getOpenId(res.code);
            }
        })
    },

    /**
     * 根据code获取openId
     */
    getOpenId: function (code) {
        let self = this;
        wx.request({
            url: "https://app.xgrowing.com/node/wxapp/get_openid?appid=" + 
            global.TCGlobal.AppId + "&secret=" + global.TCGlobal.Secret 
            + "&js_code=" + code + "&grant_type=authorization_code",
            data: {},
            method: 'GET',
            success: function (res) {
                self.getSpbillCreateIp(res.data.data.openid);
            },
            fail: function () {
                // fail
            },
            complete: function () { 
                // complete
            }
        })
    },

    /**
     * 获取Ip
     */
    getSpbillCreateIp: function (openid) {
        let self = this;
        wx.request({
            url: "https://app.xgrowing.com/wxapp/api/get_client_ip.php",
            data: {},
            method: 'GET',
            success: function (res) {
                self.generateOrder(openid, res.data.data.client_ip);
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },

    /**
     * 一次签名
     */
    getSign: function (json) {
        let MD5Util = require('../../tools/md5.js');
        let sign = '';
        var signA = '';
        for (var i in json) {
            if (global.Tool.isValidStr(json[i])) {
                signA = signA + i + '=' + json[i];
                if (i != "trade_type") {
                    signA += '&';
                }
            }
        }
        var signB = signA + "&key=" + global.TCGlobal.WXPayKey;//key
        console.log(signB)
        sign = MD5Util.MD5(signB).toUpperCase();
        return sign;
    },

    /**
     * 根据openid和ip生成商户订单
     */
    generateOrder: function (openid, clientip) {
        var self = this;
        let order = this.data.order;
        let nonce_str = Math.random().toString(36).substr(2, 15);
        let money = parseInt(parseFloat(order.Money) * 100); // 分为单位
        let json = {
            appid: global.TCGlobal.AppId,
            body: 'TOPMOM-商品购买',
            device_info: 'WEB',
            mch_id: global.TCGlobal.WXPayMchId, //商户号
            nonce_str: nonce_str, //随机吗
            notify_url: 'https://mobile.topmom.com.cn', // 回调地址
            openid: openid,
            out_trade_no: order.OrderNo, // 订单编号
            spbill_create_ip: clientip,  //ip
            total_fee: String(money),
            trade_type: 'JSAPI',
            detail: '',
            attach: '',
            fee_type: '',
            time_start: global.Tool.timeStringFromInterval(global.Tool.timeIntervalFromNow(), 'YYYYMMDDHHmmss'),
            time_expire: global.Tool.timeStringFromInterval(global.Tool.timeIntervalFromNow(1800), 'YYYYMMDDHHmmss'),
            goods_tag: '',
            product_id: '',
            limit_pay: ''
        };

        var bodyData = '<xml>';
        for (var i in json) {
            bodyData += '<' + i + '>';
            bodyData += json[i]
            bodyData += '</' + i + '>';
        }
        bodyData += '<sign>' + self.getSign(json) + '</sign>'; //签名
        bodyData += '</xml>'
        console.log("bodyData======" + bodyData);
        //统一支付

        global.Tool.showLoading();
        wx.request({
            url: 'https://mobile.topmom.com.cn/Libra.Weixin.Pay.Web.UnifiedOrder.aspx?account=' + global.TCGlobal.WXPayAccount, //account
            //url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            method: 'POST',
            data: bodyData,
            success: function (res) {
                var pay = res.data;
                //发起支付
                var timeStamp = Math.round(new Date().getTime() / 1000).toString(); //时间戳
                var packages = 'prepay_id=' + self.getXMLNodeValue("prepay_id", pay);
                var nonceStr = self.getXMLNodeValue("nonce_str", pay);;
                console.log("res======" + JSON.stringify(res));
                self.pay(timeStamp, nonceStr, packages)
            },
            complete: () => {
                global.Tool.hideLoading();
            }
        })
    },

    /**
     * 获取返回xml的值
     */
    getXMLNodeValue: function (node_name, xml) {
        var tmp = xml.split("<" + node_name + ">");
        var _tmp = tmp[1].split("</" + node_name + ">");
        var temp = _tmp[0].split("[");
        var temp1 = temp[2].split("]");
        return temp1[0];
    },

    /**
     *  获取二次签名
     */
    getSign2: function (timeStamp, nonceStr, packages) {
        let MD5Util = require('../../tools/md5.js');
        let sign = '';
        var signA = "appId=" + global.TCGlobal.AppId + "&nonceStr=" + nonceStr
            + "&package=" + packages + "&signType=MD5&timeStamp=" + timeStamp;;
        var signB = signA + "&key=" + global.TCGlobal.WXPayKey;
        sign = MD5Util.MD5(signB).toUpperCase();
        return sign;
    },

    /**
     * 支付
     */
    pay: function (timeStamp, nonceStr, packages) {
        let self = this;
        let order = this.data.order;
        let no = order.OrderNo;
        let money = order.Total;
        let id = order.Id;
        let door = this.data.door;
        let infos = this.data.infos;
        global.Tool.showLoading();
        wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: packages,
            signType: "MD5",
            paySign: self.getSign2(timeStamp, nonceStr, packages),
            success: function (res) {
                console.log("success=========" + JSON.stringify(res));
                // 支付成功
                wx.setStorage({
                    key: 'infos',
                    data: infos,
                    success: function (res) {
                        wx.redirectTo({
                            url: '/pages/pay-success/pay-success?no=' + no + '&price=' + money + '&id=' + id,
                        })
                        //如果从我的订单和订单详情进入，通知我的订单刷新数据
                        if (door === "1") {
                            Event.emit('deleteOrderFinish');//发出通知
                        }
                    }
                })
            },
            fail: function (res) {
                // 支付失败
                console.log("fail=========" + JSON.stringify(res));
                self.closeOrder(nonceStr);
            },
            complete: () => {
                global.Tool.hideLoading();
            }
        })
    },

    /**
    * 关闭订单签名
    */
    getSign3: function (json) {
        let MD5Util = require('../../tools/md5.js');
        let sign = '';
        var signA = '';
        for (var i in json) {
            if (global.Tool.isValidStr(json[i])) {
                signA = signA + i + '=' + json[i];
                if (i != "out_trade_no") {
                    signA += '&';
                }
            }
        }
        var signB = signA + "&key=" + global.TCGlobal.WXPayKey;
        sign = MD5Util.MD5(signB).toUpperCase();
        return sign;
    },

    /**
     * 关闭订单
     */
    closeOrder: function (nonce_str) {
        var self = this;
        let order = this.data.order;
        let json = {
            appid: global.TCGlobal.AppId,
            mch_id: global.TCGlobal.WXPayMchId,
            nonce_str: nonce_str,
            out_trade_no: order.OrderNo,
        };
        var bodyData = '<xml>';
        for (var i in json) {
            bodyData += '<' + i + '>';
            bodyData += json[i]
            bodyData += '</' + i + '>';
        }
        bodyData += '<sign>' + self.getSign3(json) + '</sign>';
        bodyData += '</xml>'
        console.log("bodyData======" + bodyData);
        //统一支付
        wx.request({
            url: 'https://api.mch.weixin.qq.com/pay/closeorder',
            method: 'POST',
            data: bodyData,
            success: function (res) {
                var result = res.data;
                console.log("res1======" + JSON.stringify(res));

            },
            fail: function (res) {
                // 支付失败
                console.log("fail1=========" + JSON.stringify(res));
            }
        })
    },
})