// baby-food.js
let { Tool, Storage, RequestReadFactory, Event } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navTabs: [],
        currentTab: 0,
        listDatas:[]
    },
    hasMore:true,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestMonthList();
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
        if (hasMore) {
            let item = this.data.navTabs[this.data.currentTab];
            this.requestData(true, item.AgeMonth);
        }
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
        let oneSort = this.data.listDatas;
        let item = this.data.navTabs[currentIndex];
        
        Tool.showLoading();
        this.requestData(false, item.AgeMonth);
    },

    requestMonthList:function(){
        let r = RequestReadFactory.requestBabyFoodMonth();
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            self.setData({
                navTabs: datas
            })

            self.requestData(false, datas[0].AgeMonth);
        };
        r.addToQueue();
    },

    /**
     * 食物查询
     */
    requestData: function (isLoadMore, ageMonth) {
        let index = 0;
        if (isLoadMore) {
            index = this.data.listDatas.length;
        }
        let condition = "${AgeMonth} == '" + ageMonth + "'";

        let r = RequestReadFactory.requestBabyFoodList(index, 20, condition);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let arry = self.data.listDatas;
            if(isLoadMore){
                arry = arry.concat(datas);
            }else{
                arry = datas;
            }
            self.setData({
                listDatas: arry
            })

            if (arry.length >= req.responseObject.Total) {
                this.hasMore = false;
            }
        };
        r.addToQueue();
    },

    cellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let datas = this.data.listDatas[index];
        wx.setStorageSync('babyFoodDatas', datas);

        wx.navigateTo({
            url: '/pages/baby-food/baby-food-detail/baby-food-detail',
        })
    },
})