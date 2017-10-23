// group-buy.js
let { Tool, Storage, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cycleArry:[],
        bannerArray: [],
        currentTab: 0,
        navTabs: [
            {
                'Name': '本期团购'
            },
            {
                'Name': '往期团购'
            }
        ],
        listDatas: []
    },
    hasMore: true,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestCyclePictures();//轮播图查询
        this.requestActivityList(false);
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
        if (!this.hasMore){
            this.requestActivityList(true);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 轮播图点击
     */
    onBannerClickListener:function(e){
        let index = e.currentTarget.dataset.position;
        let item = this.data.cycleArry[index];
        let mainId = item.Ref001Id;

        wx.navigateTo({
            url: '/pages/find/group-buy/group-buy-detail/group-buy-detail?mainId=' + mainId,
        })
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

        this.requestActivityList(false);
    },

    /**
     * 轮播图查询
     */
    requestCyclePictures: function () {
        let condition = "${IsUse} == 'True' && ${Ref001Type} == 'Activity'";
        let task = RequestReadFactory.requestWelfareCycle(condition);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let arry = [];
            datas.forEach((item, index) => {
                let imageUrl = Tool.imageURLForId(item.ImgId, '/res/img/common/common-avatar-default-icon.png');
                arry = arry.concat(imageUrl);
            });

            this.setData({
                bannerArray: arry,
                cycleArry:datas
            });
        };
        task.addToQueue();
    },

    /**
     * 活动列表查询
     */
    requestActivityList: function (isLoadMore) {
        let index = 0;
        let currentIndex = this.data.currentTab;
        let isEnd = currentIndex==0?'False':'True';
        if(isLoadMore){
            index = this.data.listDatas.length;
        }

        let task = RequestReadFactory.requestActivityList(index, 20, isEnd);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let listDatas = self.data.listDatas;

            datas.forEach((item, index) => {
                let imageUrl = Tool.imageURLForId(item.ImgId, '/res/img/common/common-avatar-default-icon.png');
                item.imageUrl = imageUrl;
            });

            if(isLoadMore){
                listDatas = listDatas.concat(datas);
            }else{
                listDatas = datas;
            }

            self.hasMore = true;
            if (listDatas.length >= req.responseObject.Total){
                self.hasMore = false;
            }

            this.setData({
                listDatas: listDatas
            });
        };
        task.addToQueue();
    },

    /**
     * 立即参与
     */
    buyButtonTap:function(e){
        let index = e.currentTarget.dataset.index;
        console.log(index);
        let datas = this.data.listDatas[index];

        if (Tool.isFalse(datas.Ended)){
            wx.setStorageSync("groupBuyDatas", datas)
            wx.navigateTo({
                url: '/pages/find/group-buy/group-buy-detail/group-buy-detail',
            })
        }
    },

    /**
     * cell
     */
    groupBuyCellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        console.log(index);

        let datas = this.data.listDatas[index];
        wx.setStorageSync("groupBuyDatas", datas)
        wx.navigateTo({
            url: '/pages/find/group-buy/group-buy-detail/group-buy-detail',
        })
    },
})