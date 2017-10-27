// group-buy-confirm-order.js
let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressInfo: '',
        product:''
    },
    mainId:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;

        this.requestAddressInfo();
        this.requestActivityDetail();
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
    * 查询地址
    */
    requestAddressInfo: function () {
        let self = this;
        let r = RequestReadFactory.addressRead();
        r.finishBlock = (req) => {
            if (req.responseObject.Count > 0) {
                let responseData = req.responseObject.Datas;
                this.setData({
                    addressInfo: responseData[0]
                });
            }
        }
        r.addToQueue();
    },

    /**
     * 查询商品详情
     */
    requestActivityDetail: function () {
        let task = RequestReadFactory.requestActivityDetail(this.mainId);
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            datas.forEach((item, index) => {
                let imageUrl = Tool.imageURLForId(item.ImgId, '/res/img/common/common-avatar-default-icon.png');
                item.imageUrl = imageUrl;
            });

            this.setData({
                product: datas[0]
            });
        }
        task.addToQueue();
    },

    /**
     * 地址选择
     */
    addressViewTap: function (e) {
        wx.navigateTo({
            url: '/pages/address/address?door=1'
        })
    },

    submitTap:function(){
        if (Tool.isEmptyStr(this.data.addressInfo)){
            Tool.showSuccessToast('请填写地址');
            return;
        }

        let orderId = Tool.guid();
        let task = RequestWriteFactory.addGroupBuyOrder(this.mainId, this.data.addressInfo, orderId);

        task.finishBlock = (req) => {

            wx.redirectTo({
                url: '/pages/pay-method/pay-method?mainId=' + orderId,
            })
        };
        task.addToQueue();
    }
})