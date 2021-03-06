// baby-food-detail.js
import WxParse from '../../../libs/wxParse/wxParse.js';

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
        let datas = wx.getStorageSync("babyFoodDatas");
        this.setData({
            datas: datas
        })

        WxParse.wxParse('article', 'html', datas.Content, this, 5);
        wx.setNavigationBarTitle({
            title: datas.Title,
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
      wx.removeStorageSync("babyFoodDatas");
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
          title: '宝宝辅食 ' + self.data.datas.Title,
          path: '/pages/baby-food/baby-food-detail/baby-food-detail',
          success: function (res) {
              // 转发成功
          },
          fail: function (res) {
              // 转发失败
          }
      }
  }
})