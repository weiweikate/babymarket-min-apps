// withdraw-detail.js

let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailDatas: [],
        nomoredata:false,
        index:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
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
        if (!this.data.nomoredata){
            this.loadmore(this.data.index);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
    * 提现明细查询
    */
    requestData: function () {
        let r = RequestReadFactory.withdrawListRead(0);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;
            let nomoredata = false;
            if (datas.length >= total) {
                nomoredata = true;
            }

            this.setData({
                detailDatas: datas,
                nomoredata: nomoredata,
                index: datas.length,
            });
        };
        r.addToQueue();
    },

    loadmore: function (index) {
        let r = RequestReadFactory.withdrawListRead(index);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let arry = this.data.detailDatas.concat(datas);
            
            let total = req.responseObject.Total;
            let nomoredata = false;
            if (this.data.index + datas.length >= total) {
                nomoredata = true;
            }
            this.setData({
                detailDatas: arry,
                nomoredata: nomoredata,
                index: this.data.index + datas.length,
            });
        };
        r.addToQueue();
    },
})