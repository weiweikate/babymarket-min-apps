// global.Storage.memberId() 0.1 18968049999 123456
let { Tool, Storage, RequestWriteFactory } = global;
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
  formSubmit(e){
    let params = e.detail.value
    if (Tool.isEmptyStr(Tool.trim(e.detail.value.Password))){
      Tool.showAlert('请输入登录密码')
      return
    } else if (Tool.isEmptyStr(Tool.trim(e.detail.value.PayPassword))) {
      Tool.showAlert('请输入提现密码')
      return
    }
    this.requestAddTXpassword(params)
  },
  requestAddTXpassword(params){
    let r = RequestWriteFactory.addTXpassword(params);
    r.finishBlock = (req) => {
      let callBack = () => {
        wx.navigateTo({
          url: '/pages/my/withdraw/withdraw',
        })
      }
      Tool.showAlert('操作成功', callBack)
    };
    r.addToQueue();
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