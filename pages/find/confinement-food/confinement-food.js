// confinement-food.js
let { Tool, Storage, RequestReadFactory, Network } = global
import WxParse from '../../../libs/wxParse/wxParse.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        titleList:[],
        currentTab:0,
        datas:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestConfinementFoodDays();
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

    onTabChangeListener: function (e) {
        let currentIndex = e.detail.current;
        if (currentIndex == undefined) {
            currentIndex = e.currentTarget.dataset.current;
        }
        this.setData({
            currentTab: currentIndex
        });

        let item = this.data.titleList[currentIndex];
        WxParse.wxParse('article', 'html', item.Content, this, 5);
    },

    /**
     * 月子餐天数查询
     */
    requestConfinementFoodDays: function () {
        let task = RequestReadFactory.requestConfinementFoodDays();
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let arry = [];
            let memberInfo = Storage.currentMember();
            let babyBirthDays = memberInfo.BabyBirthDays;
            let defaultIndex = 0;
            datas.forEach((item, index) => {
                if (index == parseInt(babyBirthDays)){
                    defaultIndex = index-1;

                    let tmpItem = datas[index-1];
                    WxParse.wxParse('article', 'html', tmpItem.Content, self, 5);

                    this.setData({
                        datas: tmpItem,
                    });
                }

                item.MonthDay = '产后第';
                item.date = index + 1 + '天';
                arry.push(item);
            });

            this.setData({
                titleList: arry,
                currentTab: defaultIndex
            });
        };
        task.addToQueue();
    },
})