// recharge.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        award: '100',
        currentIndex:-1,
        inputValue:'',
        costPoints:'0'
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

    selectCoinTap:function(e){
        let index = e.currentTarget.dataset.index;
        let coins = e.currentTarget.dataset.coins;
        let cost = coins/10;

        this.setData({
            currentIndex:index,
            inputValue: '',
            costPoints: cost
        });
    },

    beginInputTap:function(e){
        this.setData({
            currentIndex: 3
        });
    },

    inputValueChanged:function(e){
        let value = e.detail.value;
        let cost = value / 10;
        this.setData({
            costPoints: cost
        });
    },

    rechargeTap: function (e){
        let coins = this.data.costPoints * 10;
        if(coins%10 != 0){
            wx.showToast({
                title: '请输入10的倍数',
            })
            return;
        }
        console.log('金币' + this.data.costPoints*10);
    }
})