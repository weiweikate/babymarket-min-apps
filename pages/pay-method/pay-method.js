// 支付方式
let {Event,RequestWriteFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: {},
        infos: [],
        door: 0, // 0为确认订单进入，1为我的订单列表或订单详情进入
    },

    /**
      * 生命周期函数--监听页面加载
      */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'order',
            success: function (res) {
                let order = res.data;
                let infos = self.setInfoData(order);
                self.setData({
                    order: order,
                    infos: infos,
                    door: options.door,
                })
            },
        })
    },

    /**
     * 设置支付明细
     */
    setInfoData: function (order) {
        let infos = this.data.infos;
        if (order.Discount != "0") {
            let child = {
                title: "优惠劵",
                value: order.Discount,
            }
            infos.splice(infos.length, 0, child);
        }
        if (order.Money1 != "0") {
            let child = {
                title: "授信支付",
                value: order.Money1,
            }
            infos.splice(infos.length, 0, child);
        }
        if (order.Money2 != "0") {
            let child = {
                title: "钱包支付",
                value: order.Money2,
            }
            infos.splice(infos.length, 0, child);
        }
        if (parseFloat(order.Due) > 0) {
            let child = {
                title: "微信支付",
                value: order.Due,
            }
            infos.splice(infos.length, 0, child);
        }

        return infos;
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
     * 确认支付
     */
    pay: function () {
        let order = this.data.order;
        let infos = this.data.infos;
        let no = order.OrderNo;
        let money = order.Total;
        let id = order.Id;

        if (parseFloat(order.Due) > 0) {
            // 微信支付 
            /**
         *   wx.requestPayment({
            timeStamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            package: "prepay_id=" + res.data.prepayId,
            signType: 'MD5',
            paySign: self.getSign(),
            success: function (res) {
                // 支付成功
                wx.navigateTo({
                    url: '../pay-success/pay-success?no=' + no + '&price=' + money + '&way=微信支付&id=' + id,
                })
            },
            fail: function () {
                // 支付失败
            }

        })
         */
        } else {
            // 不需要微信支付的,修改订单装填为已支付
            order.StatusKey = "1";
            this.modifyOrder(order, infos, no, money, id);
        }
    },

    /**
     *  获取签名
     */
    getSign: function () {
        let MD5Util = require('../../tools/md5.js');
        let sign = '';
        var signA = "appId=" + app.appId + "&nonceStr=" + res.data.nonceStr + "&package=prepay_id=" + res.data.prepayId + "&signType=MD5&timeStamp=" + res.data.timestamp;
        var signB = signA + "&key=" + app.key;
        sign = MD5Util.MD5(signB).toUpperCase();
        return sign;
    }
})