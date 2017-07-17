// pay-password-set.js
let {Tool, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        datas: [
            {
                'inputName': 'password',
                'title': '新密码:',
                'placeholder': '请输入新密码',
                'value': '',
                'password':true
            },
            {
                'inputName': 'passwordSecond',
                'title': '确认密码:',
                'placeholder': '请再次输入新密码',
                'value': '',
                'password': true
            }
        ],
        second: '59',
        showSecond: '获取验证码',
        getCodeEnable: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'memberInfo',
            success: function (res) {
                self.setData({
                    mobile: res.data.Mobile
                })
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
     * 获取验证码
     */
    getVerifyCodeTap: function () {
        if (this.data.getCodeEnable) {
            this.countdown(this);
        }

        let r = RequestWriteFactory.verifyCodeGet(this.data.mobile, '2');
        r.finishBlock = (req) => {
            wx.showToast({
                title: '验证码已发送',
            })
        };
        r.addToQueue();
    },

    /**
     * 倒计时
     */
    countdown: function (that) {
        var second = that.data.second;
        // console.log('-----second: ' + second);

        if (second == 0) {
            that.setData({
                second: '59',
                getCodeEnable: true,
                showSecond: '获取验证码',
            });
            return;
        } else {
            that.setData({
                showSecond: '获取验证码(' + second + ')',
            });
        }

        var time = setTimeout(function () {
            that.setData({
                second: second - 1,
                getCodeEnable: false,
            });
            that.countdown(that);
        }, 1000)
    },

    /**
    * 提交
    */
    formSubmit: function (e) {
        let value = e.detail.value;
        let password = value.password;
        let passwordSecond = value.passwordSecond;
        let verifyCode = value.verifyCode;

        // console.log('----password:' + password);
        // console.log('----passwordSecond:' + passwordSecond);
        // console.log('----verifyCode:' + verifyCode);

        if (Tool.isEmptyStr(verifyCode)) {
            Tool.showAlert("请填写验证码");
            return;
        }

        if (Tool.isEmptyStr(password)) {
            Tool.showAlert("请填写新密码");
            return;
        }

        if (passwordSecond != password) {
            Tool.showAlert("两次输入的密码不一致");
            return;
        }

        if (password.length > 18 || password.length < 6
            || !Tool.checkString(password)) {
            Tool.showAlert("密码由6-18位数字或字母组成");
            return;
        }

        let r = RequestWriteFactory.payPasswordSet(verifyCode, password, passwordSecond, this.data.mobile);
        r.finishBlock = (req) => {
            wx.navigateBack({
                'delta':1
            })
        };
        r.addToQueue();
    }
})