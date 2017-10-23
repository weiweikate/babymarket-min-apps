// raise.js
let { Tool, Storage, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        images: ['', ''],
        cycleArry:[],
        currentTab:0,
        navTabs:[
            { 'Name': '人气'},
            { 'Name': '进度' },
            { 'Name': '总需人次' },
            ],
        listDatas:[],
        winArry:[]
    },
    hasMore:false,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestRaiseProducts(false);
        this.requestCyclePictures();//轮播图
        this.requestWinList();//中奖列表
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
        if (!this.hasMore){
            this.requestRaiseProducts(true);
        }
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

        this.requestRaiseProducts(false);
    },

    /**
     * 规则
     */
    ruleTap: function () {

    },

    /**
     * 众筹商品列表查询
     */
    requestRaiseProducts: function (isLoadMore) {
        let index = 0;
        let order;
        let productList = this.data.listDatas;
        if (isLoadMore) {
            index = productList.length;
        }

        let currentIndex = this.data.currentTab;
        if(currentIndex == 0){
            order = "${Popularity} DESC";
        }else if(currentIndex == 1){
            order = "${Remain_Need_Count} DESC";
        } else if (currentIndex == 1) {
            order = "${Need_Count} DESC";
        }

        let task = RequestReadFactory.requestRaiseProducts(20, index, order);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let arry = this.data.listDatas;
            if (isLoadMore) {
                arry = arry.concat(datas);
            } else {
                arry = datas;
            }
            this.setData({
                listDatas: arry
            });

            self.hasMore = true;
            if (arry.length >= req.responseObject.Total) {
                self.hasMore = false;
            }
        };
        task.addToQueue();
    },

    /**
     * 轮播图查询
     */
    requestCyclePictures: function () {
        let condition = "${IsAppearIndex} == 'True'&& ${IsUse} == 'True' && ${Ref001Type} == 'Crowd_Funding'";
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
                images: arry,
                cycleArry: datas
            });
        };
        task.addToQueue();
    },

    /**
     * 中奖列表查询
     */
    requestWinList: function () {
        let condition = "${Is_Win} == 'True'";
        let task = RequestReadFactory.requestRaiseOrderList(condition, 99999, 0);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let arry = [];
            datas.forEach((item, index) => {
                let win = item.NickName + '获得' + item.Product_Name;
                arry = arry.concat(win);
            });

            this.setData({
                winArry: arry
            });
        };
        task.addToQueue();
    },

    /**
     * 立即参与
     */
    joinTap:function(e){
        let index = e.currentTarget.dataset.index;
        let datas = this.data.listDatas[index];
        wx.setStorageSync("raiseDatas", datas);
        wx.navigateTo({
            url: '/pages/find/raise/raise-detail/raise-detail',
        })
    },

    raiseCellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let datas = this.data.listDatas[index];
        wx.navigateTo({
            url: '/pages/find/raise/raise-detail/raise-detail?mainId=' + datas.Id,
        })
    },
})