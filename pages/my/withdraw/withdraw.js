// withdraw.js 0.1 18758328354 123456

let {Tool, Storage, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: '',
        havePassword:false,
        showInputAlert:false,
        placeholder:'请输入支付密码',
        password:'',
        account:'',
        amount:'',

        alertType:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let memberInfo = Storage.currentMember();
        this.setData({
            balance: memberInfo.Balance,
            havePassword: Tool.isValidStr(memberInfo.PayPassword),
            account: memberInfo.AlipayAccount,
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
     * 提现明细 
     */
    withdrawDetailTap: function () {
        wx.navigateTo({
            url: '../withdraw-detail/withdraw-detail',
        })
    },

    /**
     * 确认提现 
     */
    formSubmit: function (e) {
        let value = e.detail.value;
        let amount = value.amount;
        
        if (amount > this.data.balance) {
            wx.showModal({
                title: '提示',
                content: '超过最大提现金额！',
                showCancel:false,
            })
            return;
        }

        /*if (amount < 100) {
            wx.showModal({
                title: '提示',
                content: '提现金额不能低于100',
                showCancel: false,
            })
            return;
        }*/

        this.setData({
            amount: amount
        });

        if (this.data.havePassword){

            this.setData({
                showInputAlert: true,
                placeholder: '请输入支付宝账号',
                alertType:1
            })

        }else{
            wx.showModal({
                title: '提示',
                content: '尚未设置提现密码',
                confirmText:'去设置',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            //url: '../complete-info/complete-info',
                          url:'/pages/my/withdraw/pay-passward/pay-passward'
                        })
                    }
                }
            })
        }
    },

    dismissInputAlert:function() {
        this.setData({
            showInputAlert: false//隐藏
        });
    },

    alertInputOnChange: function(e) {
        let text = e.detail.value;

        if (this.data.alertType == 1) {
            this.setData({
                account: text
            });
        }

        else if (this.data.alertType != 1) {
            this.setData({
                password: text
            });
        }
    },

    inputAlertBtnClicked: function(e) {
        let index = e.currentTarget.dataset.index;
        this.dismissInputAlert();

        if (index == 1 && this.data.alertType == 1){//确定
            this.setData({
                showInputAlert: true,
                placeholder: '请输入支付密码',
                alertType: 0
            })
        }

        else if (index == 1 && this.data.alertType != 1) {//确定
            let r = RequestWriteFactory.addWithdrawRecord(this.data.amount, this.data.password, this.data.account);
            r.finishBlock = (req) => {
                wx.showToast({
                    title: '操作成功！',
                })

                let balance = (parseFloat(this.data.balance) - parseFloat(this.data.amount)).toFixed(2);
                this.setData({
                    amount: '',
                    balance: balance.toString()
                });

                //修改本地数据库信息
                let memberInfo = Storage.currentMember();
                memberInfo.Balance = balance.toString();
                Storage.setCurrentMember(memberInfo);
            };
            r.addToQueue();
        }
    }
})