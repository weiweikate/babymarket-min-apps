// group-buy-rule.js
let { Network } = global
import WxParse from '../../../../libs/wxParse/wxParse.js';

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
      let self = this;
    wx.request({
        url: Network.sharedInstance().activityRuleURL,
        success: function (res) {
            console.log(res.data)
            let data0 = res.data;
            let arry0 = data0.split("<div");
            let data1 = arry0[3];
            data1 = data1.replace('id=\"ctl04_ctl01_ctl00\" class=\"libra-html\">', '');
            WxParse.wxParse('article', 'html', data1, self, 5);
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