// question.js

let { Tool, Storage, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据 
     */
    data: {
        navTabs: [
            {
                'Name': '最新'
            },
            {
                'Name': '同龄'
            }, 
            {
                'Name': '精选'
            },
        ],
        currentTab:0,
        listDatas:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData(this.data.currentTab);
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
     * swiper切换事件
     */
    onTabChangeListener: function (e) {
        let currentIndex = e.detail.current;
        if (currentIndex == undefined) {
            currentIndex = e.currentTarget.dataset.current;
        }
        this.setData({
            currentTab: currentIndex
        });

        //如果分类的主体数据为空，那么去请求主体数据
        // let oneSort = this.data.oneSortData[currentIndex];
        // if (oneSort.bodyData == undefined && currentIndex > 0) {
        //     Tool.showLoading();
        //     this.requestSortAdData(oneSort.Id);
        // }
    },

    replyTap:function(e){
        console.log('立即回答' + e.currentTarget.dataset.index);
    },

    latestCellTap: function (e) {
        console.log('点击cell' + e.currentTarget.dataset.index);
    },

    bestCellTap: function(e) {
        console.log('点击cell' + e.currentTarget.dataset.index);
    },

    /**
    * 孕育问答
    */
    requestData: function (tabIndex) {
        let condition = "${BreedQueAnsId} == '" + global.TCGlobal.EmptyId + "'";
        let r = RequestReadFactory.requestQAWithCondition(condition, 0, 20);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                
            });

            self.setData({
                listDatas: datas
            })
        };
        r.addToQueue();
    },
})