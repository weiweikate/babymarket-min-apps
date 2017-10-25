// raise-pay-success.js
let { RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order:''
    },
    mainId:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;

        this.requestRaiseOrder();
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
     * 查看订单
     */
    checkOrderTap: function () {

    },
    
    /**
     * 去逛逛
     */
    goTap: function () {

    },

    /**
     * 众筹订单详情查询
     */
    requestRaiseOrder: function () {
        let task = RequestReadFactory.requestRaiseOrderDetail(this.mainId);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            this.setData({
                order: datas[0]
            });
        };
        task.addToQueue();
    },
})