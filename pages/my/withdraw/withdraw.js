// withdraw.js

let {Tool, RequestReadFactory, Event} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas: [
            {
                'inputName': 'name',
                'title': '支付宝用户名:',
                'placeholder': '姓名',
                'value': ''
            },
            {
                'inputName': 'account',
                'title': '对方账户:',
                'placeholder': '支付宝账号／手机号码',
                'value': ''
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
        Event.on('addAlipayAccountFinish', this.requestData, this)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        Event.off('addAlipayAccountFinish', this.requestData)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 绑定支付宝 
     */
    bindAlipayTap: function () {
        wx.redirectTo({
            url: '../withdraw/bind-alipay/bind-alipay',
        })
    },

    /**
     * 下一步
     */
    formSubmit: function (e) {
        let value = e.detail.value;
        let name = value.name;
        let account = value.account;

        wx.redirectTo({
            url: '../withdraw/withdraw-to-alipay/withdraw-to-alipay?name=' + name + '&account='+ account,
        })
    },

    /**
     * 绑定支付宝账号查询
     */
    requestData: function () {
        let r = RequestReadFactory.alipyAccountRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                this.setData({
                    'datas[0].value': item.Name,
                    'datas[1].value': item.AplipayAccount
                });

            });
        };
        r.addToQueue();
    },
})