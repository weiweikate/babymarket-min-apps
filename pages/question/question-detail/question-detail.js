// question-detail.js
let { Tool, Network } = global;
import WxParse from '../../../libs/wxParse/wxParse.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    Id: '',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let questionId = options.Id;
        this.Id = questionId;

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
     * 用户点击右上角分享 <div class="comment-container">
     */
    onShareAppMessage: function () {

    },

    requestData: function () {
        let url = Tool.generateURL(Network.sharedInstance().questionURL, {'Id':this.Id});
        console.log(url);

        let self = this;
        wx.request({
            url: url,
            success: function (res) {
                console.log(res.data)
                let data0 = res.data;
                let arry0 = data0.split('<div class="comment-container">');
                let data1 = '<div class="comment-container">' + arry0[1];
                let arry1 = data1.split('</form>');
                WxParse.wxParse('article', 'html', arry1[0], self, 0);
            }
        })
    },

    /**
     * 我来回答
     */
    replyTap:function(){
        wx.navigateTo({
            url: '/pages/question/question-reply/question-reply?Id=' + this.Id,
        })
    }
})