// eat.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [
            {
                'imageUrl': '/res/img/index/index-tool-eat-icon.png',
                'title': '五谷杂粮'
            },
            {
                'imageUrl': '/res/img/index/index-tool-vaccine-icon.png',
                'title': '蔬菜菌类'
            },
            {
                'imageUrl': '/res/img/index/index-tool-baby-food-icon.png',
                'title': '水果'
            },
            {
                'imageUrl': '/res/img/index/index-tool-lib-icon.png',
                'title': '饮品'
            },
            {
                'imageUrl': '/res/img/index/index-tool-lib-icon.png',
                'title': '零食'
            },
            ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    toolCellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        console.log(index);
        
        wx.navigateTo({
            url: '../eat/eat-food-list/eat-food-list',
        })
    },
})