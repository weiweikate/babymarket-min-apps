// sign.js
let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        award: '0',
        coinsList: [
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '10'
            },
            {
                'coin': '10'
            },
        ],
        signDays: 0,//连续签到天数,
        todaySign:false
    },
    thisCoins:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestSignRecords();

        let memberInfo = Storage.currentMember();
        this.setData({
            award: memberInfo.Coin
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
     * 立即签到
     */
    signTap:function(){
        if (!this.data.todaySign){
            this.addSignRecords();
        }
    },

    /**
     * 签到记录查询
     */
    requestSignRecords: function () {
        let r = RequestReadFactory.requestSignRecord();
        let self = this;
        r.finishBlock = (req, firstData) => {

            //判断今天是否已签到
            let date = Tool.timeStringForDateString(firstData.Date, "YYYY-MM-DD");
            let nowStr = Tool.timeStringForDate(new Date(), "YYYY-MM-DD");

            let hasSign = false;
            if (date === nowStr){//今天已签到
                hasSign = true;
            }

            self.setData({
                signDays: firstData.Days,
                todaySign: hasSign
            })
            this.thisCoins = firstData.Coin;
        };
        r.addToQueue();
    },

    /**
     * 新增签到记录
     */
    addSignRecords: function () {
        let task = RequestWriteFactory.addSignRecord();
        task.finishBlock = (req) => {
            let coins = parseInt(this.data.award) + parseInt(this.thisCoins);

            this.setData({
                todaySign: true,
                signDays: this.data.signDays + 1,
                award: coins
            });

            //修改本地数据库信息
            let memberInfo = Storage.currentMember();
            memberInfo.Coin = coins;
            Storage.setCurrentMember(memberInfo);
        };
        task.addToQueue();
    },
})