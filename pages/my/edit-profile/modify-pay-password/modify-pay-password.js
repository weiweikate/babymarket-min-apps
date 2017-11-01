// modify-pay-password.js
let { Tool, Storage, RequestWriteFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoginPwHidden: true,
        isPayPwHidden: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    formSubmit: function (e) {
        let loginPw = e.detail.value.loginPassword;
        let payPw = e.detail.value.payPassword;

        if (Tool.isEmptyStr(loginPw)) {
            Tool.showAlert("请输入登录密码");
            return;
        }

        if (Tool.isEmptyStr(payPw)) {
            Tool.showAlert("请输入支付密码");
            return;
        }

        let r = RequestWriteFactory.payPasswordSet(loginPw, payPw, '2');
        r.finishBlock = (req) => {
            wx.showToast({
                title: '修改密码成功',
            })

            wx.navigateBack({
                'delta': 1
            })

        };
        r.addToQueue();
    },

    loginPwTap: function () {
        let isLoginPwHidden = this.data.isLoginPwHidden;
        this.setData({
            isLoginPwHidden: !isLoginPwHidden
        })
    },

    payPwTap: function () {
        let isPayPwHidden = this.data.isPayPwHidden;
        this.setData({
            isPayPwHidden: !isPayPwHidden
        })
    }
})