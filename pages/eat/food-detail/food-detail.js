// food-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let datas = wx.getStorageSync('foodDatas');
        this.setData({
            datas:datas
        })
        
        wx.setNavigationBarTitle({
            title: datas.Name + '能不能吃',
        })
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
        wx.removeStorageSync('foodDatas');
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
        let self = this;
        return {
            title: self.data.datas.Name + '能不能吃',
            path: '/pages/eat/food-detail/food-detail',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})