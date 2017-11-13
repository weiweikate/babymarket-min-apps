// recharge.js
let { Tool, Storage, RequestReadFactory, Event, RequestWriteFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        award: '0',
        points:'0',
        currentIndex: -1,
        inputValue: '',
        costPoints: '0'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let memberInfo = Storage.currentMember();
        this.setData({
            award: memberInfo.Coin,
            points:memberInfo.Point
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

    selectCoinTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let coins = e.currentTarget.dataset.coins;
        let cost = coins / 10;

        this.setData({
            currentIndex: index,
            inputValue: '',
            costPoints: cost
        });
    },

    beginInputTap: function (e) {
        this.setData({
            currentIndex: 3
        });
    },

    inputValueChanged: function (e) {
        let value = e.detail.value;
        let cost = value / 10;
        this.setData({
            costPoints: cost
        });
    },

    rechargeTap: function (e) {
        let coins = this.data.costPoints * 10;
        if (coins % 10 != 0) {
            wx.showToast({
                title: '请输入10的倍数',
            })
            return;
        }
        console.log('金币' + this.data.costPoints * 10);

        this.addRechargeRecords();
    },

    /**
     * 新增充值记录
    */
    addRechargeRecords: function () {
        let task = RequestWriteFactory.addExchangeRecord(this.data.costPoints.toString());
        let self = this;
        task.finishBlock = (req) => {
            let coins = parseInt(self.data.award) + parseInt(self.data.costPoints)*10;
            let points = parseInt(self.data.points) - parseInt(self.data.costPoints);

            this.setData({
                points: points.toString(),
                award: coins.toString(),
            });

            //修改本地数据库信息
            let memberInfo = Storage.currentMember();
            memberInfo.Coin = coins.toString();
            memberInfo.Point = points.toString();
            Storage.setCurrentMember(memberInfo);
        };
        task.addToQueue();
    },
})