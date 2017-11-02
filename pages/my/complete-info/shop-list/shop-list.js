// shop-list.js
let { Tool, RequestReadFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: []
    },
    keyword: '',
    cityId: '',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.cityId = options.cityId;
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    cellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let name = e.currentTarget.dataset.name;

        let pages = getCurrentPages();
        let pageBOne = pages[pages.length - 2];// 前一页
        if (pageBOne.route == 'pages/my/complete-info/complete-info') {
            pageBOne.setData({
                shopName: name,
                shopId: this.data.listDatas[index].Id
            })
            wx.navigateBack({
                delta: 1,
            })
        }
    },

    /**
     * 搜索
     */
    onConfirmAction: function (e) {
        console.log(e.detail.value);
        let value = e.detail.value;

        if (Tool.isEmptyStr(value)) {
           value=''
        }

        this.keyword = value;
        this.requestData();
    },

    requestData: function () {
        let condition = '';
        if (Tool.isValidStr(this.keyword)) {
            condition = "${CityId} == '" + this.cityId + "' && StringIndexOf(${ShopName},'" + this.keyword + "') > 0";
        } else {
            condition = "${CityId} == '" + this.cityId + "'";
        }
        let r = RequestReadFactory.requestStoreList(condition);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            this.setData({
                listDatas: datas
            })
        };

        r.addToQueue();
    },

})