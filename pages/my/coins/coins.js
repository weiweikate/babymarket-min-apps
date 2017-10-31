// coins.js
let { Tool, Storage, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [],
        award: '0',
        todayMoney: '0'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestCoinsRule();
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
        this.requestTodayCoins();
        let memberInfo = Storage.currentMember();
        this.setData({
            award: memberInfo.Coin
        })
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

    rechargeTap:function(){
        wx.navigateTo({
            url: '../coins/recharge/recharge',
        })
    },

    /**
     * 金币规则查询
     */
    requestCoinsRule:function(){
        let r = RequestReadFactory.requestCoinsRule();
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            self.setData({
                listDatas: datas
            })

            this.requestCoinsLog();
        };
        r.addToQueue();
    },

    /**
     * 金币日志查询
     */
    requestCoinsLog: function () {
        let r = RequestReadFactory.requestCoinsLog();
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let ruleDatas = self.data.listDatas;

            ruleDatas.forEach((ruleItem, ruleIndex) => {
                ruleItem.currentCount = "0";
                datas.forEach((item, index) => {
                    if (item.CoinRuleId == ruleItem.Id){
                        ruleItem.currentCount = parseInt(item.Count) > parseInt(ruleItem.MaxCout) ? parseInt(ruleItem.MaxCout) : item.Count;
                    }
                });
            });

            let memberInfo = Storage.currentMember();
            if (Tool.isTrue(memberInfo.InformationCompleted)){
                let item = ruleDatas[0];
                item.currentCount = "1";
            }

            self.setData({
                listDatas: ruleDatas
            })
        };
        r.addToQueue();
    },

    /**
     * 今日获得金币数量 查询
     */
    requestTodayCoins: function () {
        let r = RequestReadFactory.requestTodayCoins();
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let item = datas.firstObject;
            if (Tool.isValidObject(item)){
                self.setData({
                    todayMoney: item.CoinIncome
                })
            }
        };
        r.addToQueue();
    }
})