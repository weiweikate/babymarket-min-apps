// raise-order-detail.js
let { Tool, Storage, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order:'',
        addressInfo: '',
        mobile:'',
        winOrder:'',
        joinNum:''
    },
    mainId: '',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;

        let memberInfo = Storage.currentMember();
        this.setData({
            mobile: memberInfo.Mobile
        })

        this.requestRaiseOrder();
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
     * 联系客服
     */
    contactTap:function(){
        wx.makePhoneCall({
            phoneNumber: global.TCGlobal.CustomerServicesNumber
        })
    },

    /**
     * 产品详情
     */
    productTap:function(){
        wx.navigateTo({
            url: '/pages/find/raise/raise-detail/raise-detail?mainId=' + this.data.order.Crowd_FundingId,
        })
    },

    /**
     * 众筹订单详情查询
     */
    requestRaiseOrder: function () {
        let task = RequestReadFactory.requestRaiseOrderDetail(this.mainId);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let order = datas[0];

            this.setData({
                order: order
            });

            this.requestAddressInfo(order.ReceiptAddressId);
            this.requestRaiseOrderLines();

            if (order.Win_Number != '0'){
                this.requestRaiseWinOrder();
            }
        };
        task.addToQueue();
    },

    /**
     * 获奖用户的众筹订单详情查询
     */
    requestRaiseWinOrder: function () {
        let condition = "${Is_Win} == 'True' && ${Crowd_FundingId} == '" + this.data.order.Crowd_FundingId + "'"
        let task = RequestReadFactory.requestRaiseOrderList(condition, 1, 0);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            this.setData({
                winOrder: datas[0]
            });

        };
        task.addToQueue();
    },

    /**
     * 众筹订单明细查询
     */
    requestRaiseOrderLines: function () {
        let task = RequestReadFactory.requestRaiseOrderLines(this.mainId);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let joinNum = ''
            datas.forEach((item, index) => {
                if(index == 0){
                    joinNum = item.Random_Number
                }else{
                    joinNum = joinNum + ',' + item.Random_Number
                }
            });

            this.setData({
                joinNum: joinNum
            });
        };
        task.addToQueue();
    },

    /**
     * 查询地址
     */
    requestAddressInfo: function (addressId) {

        let self = this;
        let r = RequestReadFactory.addressInfoRead(addressId);
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
})