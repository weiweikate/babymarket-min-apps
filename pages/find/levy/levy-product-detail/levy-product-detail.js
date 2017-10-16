import WxParse from '../../../../libs/wxParse/wxParse.js';
import Network from '../../../../network/network.js'

let { Tool, Storage, RequestReadFactory, RequestWriteFactory, Event } = global;
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
    let httpUrl = Network.sharedInstance().levyDetailURL;
    let self = this;
    wx.request({
      url: httpUrl + '?Id=' + options.id,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let response = res.data;
        let arry = response.split('<div id="ctl04_ctl02" class="libra-html">');
        let html = arry[1];
        WxParse.wxParse('article', 'html', html, self, 5);
      }
    })
  }
})