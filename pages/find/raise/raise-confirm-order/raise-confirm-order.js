// raise-confirm-order.js
let { Tool, Storage, Network, RequestReadFactory, RequestWriteFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        product:'',
        count: '', //购买次数
        addressInfo:'',
        pwTextFieldHidden:true
    },
    mainId:'',
    password:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;
        this.setData({
            count: options.num
        })

        this.requestRaiseProduct();
        this.requestAddressInfo();
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
    * 众筹商品详情查询
    */
    requestRaiseProduct: function () {
        let task = RequestReadFactory.requestRaiseProductDetail(this.mainId);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let item = datas[0];
            this.setData({
                product: item
            });
        };
        task.addToQueue();
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
     * 地址选择
     */
    addressViewTap: function (e) {
        wx.navigateTo({
            url: '/pages/address/address?door=1'
        })
    },

    /**
     * 隐藏输入框
     */
    dismissTap:function(){
        this.setData({
            pwTextFieldHidden: true
        })
    },

    /**
     * 确定
     */
    confirmTap:function(){
        let orderId = Tool.guid();
        let task = RequestWriteFactory.addRaiseOrder(this.data.count, 
            this.mainId, this.data.addressInfo.Id, orderId, this.password);

        task.finishBlock = (req) => {

            wx.redirectTo({
                url: '/pages/find/raise/raise-pay-success/raise-pay-success?mainId=' + orderId,
            })
        };
        task.addToQueue();
    },

    /**
     * 立即下单
     */
    submitTap:function(e){
        let hidden = this.data.pwTextFieldHidden;
        this.setData({
            pwTextFieldHidden: !hidden
        })
    },

    /**
     * 监控密码输入
     */
    inputLinster:function(e){
        this.password = e.detail.value;
    }
})