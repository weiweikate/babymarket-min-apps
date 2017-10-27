// my-levy.js
let { Tool, Storage, RequestReadFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: []
    },
    hasMore: true,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestLevyOrderList(false)
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
        if (this.hasMore) {
            this.requestLevyOrderList(true)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
    * 我的试用
    */
    requestLevyOrderList: function (isLoadMore) {
        let condition = "${MemberId} == '" + Storage.memberId() + "'";
        let index = 0;
        if (isLoadMore) {
            index = this.data.listDatas.length;
        }
        let task = RequestReadFactory.requestLevyOrderDetail(20, index, condition);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let arry = self.data.listDatas;
            if (isLoadMore) {
                arry.concat(datas)
            } else {
                arry = datas;
            }

            let hasMore = true;
            if (arry.length >= req.responseObject.Total) {
                hasMore = false;
            }

            this.setData({
                listDatas: arry,
                hasMore: hasMore
            });
        };
        task.addToQueue();
    },

    myLevyCellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let item = this.data.listDatas[index];
        wx.navigateTo({
            url: '/pages/find/levy/levy-detail/levy-detail?id=' + item.Wind_AlarmId
        })
    }
})