// modify-password.js
let { Tool, Storage, RequestWriteFactory, RequestReadFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        getCodeBtEnable: true,
        second: '59',
        showSecond: false,
        time: Object,
        passwordHide: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'currentMember',
            success: function (res) {
                self.setData({
                    mobile: res.data.Mobile
                });
            },
        })
        // wx.setNavigationBarColor({
        //     frontColor: '#ffffff',
        //     backgroundColor: '#ff5555',
        // })
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
        clearTimeout(this.data.time);
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

    passwordHideOrShowTap: function () {
        let temp = this.data.passwordHide;
        this.setData({
            passwordHide: !temp
        });
    },

    getCodeTap: function () {
        let tempEnable = this.data.getCodeBtEnable;
        if (!tempEnable) {
            return;
        }

        this.setData({
            getCodeBtEnable: !tempEnable,
            showSecond: true
        });

        this.countdown(this);
        let r = RequestWriteFactory.verifyCodeGet(this.data.mobile, '1');
        r.finishBlock = (req) => {
            wx.showToast({
                title: '验证码已发送',
            })
        };
        r.addToQueue();
    },

    submitTap: function (e) {
        let mobile = e.detail.value.mobile;
        let code = e.detail.value.code;
        let password = e.detail.value.password;
        
        if (Tool.isEmptyStr(mobile)) {
            Tool.showAlert("请输入手机号");
            return;
        }

        if (Tool.isEmptyStr(code)) {
            Tool.showAlert("请输入短信验证码");
            return;
        }

        if (Tool.isEmptyStr(password)) {
            Tool.showAlert("请输入新密码");
            return;
        }
        
        // let r = RequestReadFactory.checkCodeRead(value, this.data.mobile);
        // r.finishBlock = (req) => {
        //     let datas = req.responseObject.Datas;
        //     if(datas.length >= 1){
        //         wx.navigateTo({
        //             url: '../password-reset/password-reset?code=' + value + "&mobile=" + this.data.mobile,
        //         })
        //     }else{
        //         Tool.showAlert("你的验证码不正确");
        //         return;
        //     }
        // };
        // r.addToQueue();

        let r = RequestWriteFactory.modifyLoginPassword(this.data.mobile, this.data.code, password);
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
    

    /**
     * 倒计时
     */
    countdown: function (that) {
        var second = that.data.second;
        console.log('-----second: ' + second);
        clearTimeout(this.data.time);

        if (second == 0) {
            that.setData({
                second: '59',
                getCodeBtEnable: true,
                showSecond: false
            });
            return;
        }

        var time = setTimeout(function () {
            that.setData({
                second: second - 1,
                getCodeBtEnable: false,
                showSecond: true,
            });
            that.countdown(that);
        }, 1000)
        that.setData({
            time: time
        });
    },
})