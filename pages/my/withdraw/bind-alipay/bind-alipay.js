// bind-alipay.js
let {Tool, Storage, RequestWriteFactory, Event} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {

        datas: [
            {
                'inputName': 'name',
                'title': '姓名:',
                'placeholder': '姓名',
                'value': ''
            },
            {
                'inputName': 'account',
                'title': '账号:',
                'placeholder': '本人的支付宝账号',
                'value': ''
            },
            {
                'inputName': 'accountSecond',
                'title': '确认账号:',
                'placeholder': '请再输一遍',
                'value': ''
            }
        ],

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

    /**
     * 绑定
     */
    formSubmit: function (e) {
        let value = e.detail.value;
        let name = value.name;
        let account = value.account;
        let accountSecond = value.accountSecond;

        if (Tool.isEmptyStr(name)){
            Tool.showAlert("请填写姓名");
            return;
        }

        if (account != accountSecond) {
            Tool.showAlert("两次填写的支付宝账号不一致");
            return;
        }

        let r = RequestWriteFactory.withdrawAdd(account, name, accountSecond);
        r.finishBlock = (req) => {

            //刷新上一个页面
            Event.emit('addAlipayAccountFinish');//发出通知

            wx.showToast({
                title: '操作成功！',
                success:function(){
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })

        };
        r.addToQueue();
    },
})