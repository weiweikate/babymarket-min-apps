// pages/find/levy/levy-apply/levy-apply.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address:{
            'Consignee':'普艳芳',
            'Mobile':'13646837967',
            'Address':'浙江省杭州市西湖区天目山路313号杭州照相机研究所8号楼培康食品'
        }
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

    submitTap:function(e){
        let content = e.detail.value.input;
        console.log(content);
    }
})