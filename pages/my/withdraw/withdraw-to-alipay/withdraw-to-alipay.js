// withdraw-to-alipay.js
let {Tool, RequestWriteFactory, Event} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        maxAmount:'',
        name:'',
        account:'',
        datas: [
            {
                'inputName': 'amount',
                'title': '提现金额:',
                'placeholder': '暂不收取手续费',
                'value': ''
            },
            {
                'inputName': 'password',
                'title': '支付密码:',
                'placeholder': '请输入支付密码',
                'value': '',
                'password':true
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'memberInfo',
            success: function(res) {
                self.setData({
                    maxAmount:res.data.Balance 
                })
            },
        })

        self.setData({
            name: options.name,
            account: options.account,
        })
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
     * 设置支付密码
     */
    setPayPasswordTap: function () {
        wx.navigateTo({
            url: '../pay-password-set/pay-password-set'
        })
    },

    /**
     * 提交
     */
    formSubmit: function (e) {
        let value = e.detail.value;
        let amount = value.amount;
        let password = value.password;

        if (Tool.isEmptyStr(amount)) {
            Tool.showAlert("请填写提现金额");
            return;
        }

        if (Tool.isEmptyStr(password)) {
            Tool.showAlert("请填写支付密码");
            return;
        }

        if (amount > this.data.maxAmount){
            Tool.showAlert("超过最大提现金额");
            return;
        }

        let r = RequestWriteFactory.withdrawAdd(this.data.account, amount, password, this.data.name);
        r.finishBlock = (req) => {

            //刷新提现明细页面
            Event.emit('addWithdrawFinish');//发出通知

            wx.redirectTo({
                url: '../withdraw-success/withdraw-success',
            })

        };
        r.addToQueue();
    }

})