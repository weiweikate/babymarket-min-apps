// modify-password.js
let { Tool, Storage, RequestWriteFactory, RequestReadFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        code:'',
        password:'',

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
    
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#ff5555',
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

    /**
     * 验证码显示、隐藏
     */
    passwordHideOrShowTap: function () {
        let temp = this.data.passwordHide;
        this.setData({
            passwordHide: !temp
        });
    },

    /**
     * 获取验证码
     */
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
        let r = RequestReadFactory.requestVerifyMember(this.data.mobile);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if(Tool.isValidObject(datas) && datas.length>0){
                let item = datas[0];
                if (item.Id == Storage.memberId()){//有效用户
                    //获取验证码
                    this.requestVerifyCode();

                }else{
                    Tool.showAlert("手机号码不存在！");
                    return;
                }
            }
        };
        r.addToQueue();
    },

    /**
     * 下一步
     */
    nextTap: function (e) {
        let mobile = this.data.mobile;
        let code = this.data.code;
        let password = this.data.password;
        
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

        let r = RequestWriteFactory.loginPasswordSet(mobile, code, password);
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

    mobileInput:function(e){
        this.setData({
            mobile: e.detail.value
        });
    },

    codeInput:function(e){
        this.setData({
            code: e.detail.value
        }); 
    },

    passwordInput:function(e){
        this.setData({
            password: e.detail.value
        }); 
    },

    requestVerifyCode:function(){
        let r = RequestWriteFactory.verifyCodeGet(this.data.mobile, '2');
        r.finishBlock = (req) => {
        };
        r.addToQueue();
    }
})