// add-tooth-concult.js
let { Tool, RequestWriteFactory } = global;

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
      let toothNumber = e.detail.value.tooth;
      let consultDetail = e.detail.value.detail;

      console.log('----toothNumber:' + toothNumber);
      console.log('----consultDetail:' + consultDetail);

      // 判断是否填写信息
      if (Tool.isEmptyStr(toothNumber)) {
          Tool.showAlert("请填写出牙个数");
          return false;
      };

      if (Tool.isEmptyStr(consultDetail)) {
          Tool.showAlert("请填写咨询详情");
          return false;
      };

  }
})