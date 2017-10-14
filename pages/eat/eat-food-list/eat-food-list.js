// eat-food-list.js
let { Tool, Storage, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: []
    },
    mainId: '',
    hasMore:true,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;
        this.requestData(false);
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
            this.requestData(true);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 食物查询
     */
    requestData: function (isLoadMore) {
        let index = 0;
        if(isLoadMore){
            index = this.data.listDatas.length;
        }
        let condition = "${FootClassifyId} == '" + this.mainId + "'";

        let r = RequestReadFactory.requestFoodList(index, 20, condition);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let arry = self.data.listDatas;
            arry = arry.concat(datas);
            self.setData({
                listDatas: arry
            })

            if (arry.length >= req.responseObject.Total){
                this.hasMore = false;
            }
        };
        r.addToQueue();
    },

    cellTap:function(e){
        let index = e.currentTarget.dataset.index;
        let datas = this.data.listDatas[index];
        wx.setStorageSync('foodDatas', datas);

        wx.navigateTo({
            url: '/pages/eat/food-detail/food-detail',
        })
    }
})