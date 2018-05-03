// my-award.js
let { Tool, Storage, RequestReadFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [],
        award: '0',
        todayMoney: '0',

        telNo:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestTodayTotalAward();
        this.requestAwardDatas();
        //this.requestMemberInfo()
        let memberInfo = Storage.currentMember();
        let saleTel = Tool.isValidStr(memberInfo.SaleTel) ? memberInfo.SaleTel : global.TCGlobal.CustomerServicesNumber
        this.setData({
          telNo: saleTel
        })
    },
    requestMemberInfo: function (orderId) {
      let r = RequestReadFactory.memberInfoRead();
      r.finishBlock = (req) => {
        
      };
      r.addToQueue();
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
        if (!this.data.noMoreData) {
            this.loadMore();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    withdrawTap: function () {
        wx.navigateTo({
            url: '../withdraw/withdraw',
        })
    },

    withdrawDetailTap: function () {
        wx.navigateTo({
            url: '../my-award/award-detail/award-detail',
        })
    },

    contactTap: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.telNo
        })
    },

    /**
     * 店员获得奖励（今日和总得） 查询 查询
     */
    requestTodayTotalAward: function () {
        let r = RequestReadFactory.requestTodayTotalAward();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let firstData = datas[0];
            
            this.setData({
                award: firstData.RewardMoney,
                todayMoney: firstData.TodayAwardMoney
            });
        };
        r.addToQueue();
    },

    /**
      * 收到奖励列表查询
      */
    requestAwardDatas: function () {
        let r = RequestReadFactory.requestAwardList();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            this.setData({
                listDatas: datas
            });
        };
        r.addToQueue();
    },

})