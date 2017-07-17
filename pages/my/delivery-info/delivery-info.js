// delivery-info.js

let {Tool, Storage, RequestReadFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl:'',
        companyName:'',
        companyNo:'yd',
        trackNo:'3972400229281',
        count:0,
        deliveryInfoList:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'deliveryInfoKey',
            success: function(res) {
                let data = res.data;
                self.setData({
                    imgUrl: data.imgUrl,
                    // trackNo: options.trackNo,
                    count: data.count,
                    // companyNo: options.companyNo,
                })
            }
        })

        this.requestDeliveryInfo(this.data.trackNo, this.data.companyNo)
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
     * 查询物流详情
     */
    requestDeliveryInfo: function (trackNo, companyNo) {
        if (Tool.isEmptyStr(trackNo) || Tool.isEmptyStr(companyNo)){
            return;
        }

        let r = RequestReadFactory.orderDeliveryInfoRead(trackNo, companyNo);
        r.finishBlock = (req, firstData) => {
            let result = req.responseObject.result;
            if (!Tool.isEmpty(result)) {
                this.setData({
                    deliveryInfoList: result.list.reverse(),
                    companyName: result.company,
                });
            }
        };
        r.addToQueue();
    },
})