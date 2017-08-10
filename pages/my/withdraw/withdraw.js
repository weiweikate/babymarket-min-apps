// withdraw.js

let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;

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
        amount:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'memberInfo',
            success: function (res) {
                let memberInfo = res.data;
                self.setData({
                    balance: memberInfo.Balance,
                    havePassword: memberInfo.HavePassword
                });
            },
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

        if (amount < 100) {
            wx.showModal({
                title: '提示',
                content: '提现金额不能低于100',
                showCancel: false,
            })
            return;
        }

        this.setData({
            amount: amount
        });

        if (this.data.havePassword){

            this.setData({
                showInputAlert: true,
            })

        }else{
            wx.showModal({
                title: '提示',
                content: '尚未设置提现密码',
                confirmText:'去设置',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../complete-info/complete-info',
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
        this.setData({
            password: text
        });
    },

    inputAlertBtnClicked: function(e) {
        let index = e.currentTarget.dataset.index;
        this.dismissInputAlert();

        if(index == 1){//确定
            let r = RequestWriteFactory.withdrawAddRequest(this.data.amount, this.data.password);
            r.finishBlock = (req) => {
                wx.showToast({
                    title: '操作成功！',
                })

                this.setData({
                    amount: '',
                    
                });

                this.requestMemberInfo();
            };
            r.addToQueue();
        }
    },

    /**
    * 登录用户信息 
    */
    requestMemberInfo: function () {
        let r = RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {

                wx.setStorage({
                    key: 'memberInfo',
                    data: item,
                })

                this.setData({
                    balance: item.Balance,
                });

            });
        };
        r.addToQueue();
    }
})