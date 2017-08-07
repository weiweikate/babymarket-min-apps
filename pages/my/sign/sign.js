// sign.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        award: '100',
        coinsList: [
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '5'
            },
            {
                'coin': '10'
            },
            {
                'coin': '10'
            },
        ],
        signDays: 3,//连续签到天数,
        todaySign:false
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

    signTap:function(){
        let days = this.data.signDays + 1;
        this.setData({
            signDays:days,
            todaySign:true
        });
    }
})