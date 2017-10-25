// raise-product-detail.js
import WxParse from '../../../../libs/wxParse/wxParse.js';
import Network from '../../../../network/network.js'

let { Tool } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let mainId = options.mainId;
        let self = this;

        wx.request({
            url: Tool.generateURL(Network.sharedInstance().raiseURL, { 'Id': mainId }),

            success: function (res) {
                console.log(res.data)

                let response = res.data;
                let arry = response.split('<div id="ctl04_ctl00" class="libra-html">');

                WxParse.wxParse('article', 'html', arry[1], self, 5);
            }
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

    }
})