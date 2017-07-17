// select-address.js
let {RequestReadFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addresses: [], // 购物车列表
        hasAddress: false, // 是否有购物车数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
    },

    /**
      * 数据请求
      */
    requestData: function () {
        this.requestAddressInfo();
    },

    /**
     * 查询地址
     */
    requestAddressInfo: function () {
        let self = this;
        let r = RequestReadFactory.addressRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                for (let i = 0; i < datas.length; i++) {
                    datas[i].isShow = true;
                    if (global.Tool.isEmptyStr(datas[i].Card)) {
                        datas[i].isAuthentication = false;
                        datas[i].authentication = "未认证";
                    } else {
                        datas[i].isAuthentication = true;
                        datas[i].authentication = "已认证";
                    }
                }
                this.setData({
                    hasAddress: true,
                    addresses: datas,
                });
            }
        }
        r.addToQueue();
    },


    /**
     * 选中地址返回
     */
    addressInfo: function (e) {
        let addresses = this.data.addresses;
        let index = e.currentTarget.dataset.index;

        let pages = getCurrentPages();
        let pageBOne = pages[pages.length - 2];// 前一页
        if (pageBOne.route == 'pages/order-confirm/order-confirm') {
            let address = addresses[index];
            pageBOne.setData({
                addressData: {
                    Consignee: address.Consignee,
                    Mobile: address.Mobile,
                    Address: address.Address,
                    addressId: address.Id,
                    Card: address.Card,
                },
            })
            wx.navigateBack({
                delta: 1,
            })
        }
    },

})