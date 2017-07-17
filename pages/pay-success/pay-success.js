// 支付成功
Page({

    /**
     * 页面的初始数据
     */
    data: {
        no: "",//订单号
        price: "",// 支付金额
        id: "", //订单id
        infos: [],
    },

    /**
      * 生命周期函数--监听页面加载
      */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'infos',
            success: function (res) {
                self.setData({
                    infos: res.data,
                    no: options.no,
                    price: options.price,
                    id: options.id,
                })
            },
        })
    },

    // 查看订单
    lookOrder: function () {
        let id = this.data.id;
        wx.navigateTo({
            url: '../my/orderDetail/orderDetail?orderId=' + id,
        })
    },

    // 去逛逛
    goBuy: function () {
        wx.switchTab({
            url: '/pages/home/home',
        })
    },
})