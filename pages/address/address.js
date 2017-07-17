// address.js
let {Tool, RequestReadFactory, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addresses: [], // 购物车列表
        hasAddress: false, // 是否有购物车数据
        num: 0, // 当num为1时是新增地址，需要刷新页面
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
    },

    /**
 * 生命周期函数--监听页面显示
 */
    onShow: function () {
        let num = this.data.num;
        if (num == 1) {
            this.requestAddressInfo();
        }
        this.setData({
            num: 0
        })
    },

    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    onPullDownRefresh: function () {
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
            this.setStatus();
        }
        r.addToQueue();
    },

    /**
     * 设置默认文字
     */
    setStatus: function () {
        var addresses = this.data.addresses;
        for (let i = 0; i < addresses.length; i++) {
            if (addresses[i].Default == "True") {
                addresses[i].status = "当前默认";
                addresses[i].selected = true;
            } else {
                addresses[i].status = "设为默认";
                addresses[i].selected = false;
            }
        }
        this.setData({
            addresses: addresses,
        });
    },

    /**
     * 选择默认地址
     */
    selectAddress: function (e) {
        let self = this;
        let addresses = self.data.addresses;
        let index = e.currentTarget.dataset.index;
        // 修改数据默认地址
        let r = RequestWriteFactory.modifyDefaultAddress(addresses[index].Id);
        r.finishBlock = (req) => {
            let selected = addresses[index].selected;
            for (let i = 0; i < addresses.length; i++) {
                if (index == i) {
                    addresses[i].selected = true;
                    addresses[i].status = "当前默认";
                } else {
                    addresses[i].selected = false;
                    addresses[i].status = "设为默认";
                }
            }
            self.setData({
                addresses: addresses,
            });
        }
        r.addToQueue();
    },

    /**
     * 删除地址
     */
    deleteAddress: function (e) {
        let self = this;
        wx.showModal({
            title: '提示',
            content: '确认删除该地址吗？',
            success: function (res) {
                if (res.confirm) {
                    let index = e.currentTarget.dataset.index;
                    let addresses = self.data.addresses;
                    // 修改数据删除地址
                    let r = RequestWriteFactory.deleteAddress(addresses[index].Id);
                    r.finishBlock = (req) => {
                        addresses.splice(index, 1);
                        self.setData({
                            addresses: addresses
                        });
                        if (!addresses.length) {
                            self.setData({
                                hasAddress: false
                            });
                        }
                    }
                    r.addToQueue();
                }
            }
        })
    },

    /**
     * 进入地址详情修改
     */
    addressInfo: function (e) {
        let index = e.currentTarget.dataset.index;
        let addresses = this.data.addresses;
        wx.navigateTo({
            url: '../address/add-address/add-address?extra=' + JSON.stringify(addresses[index]),
        })
    },

    /**
     * 新建收货地址
     */
    addAddress: function () {
        wx.navigateTo({
            url: '../address/add-address/add-address',
        })
    },

})