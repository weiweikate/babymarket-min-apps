let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos:{},
    data:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.iconUrl = global.Tool.imageURLForId(options.iconUrl)
    wx.setNavigationBarTitle({
      title: options.title
    })
    options.type = options.value.indexOf('+') !=-1 ?  1:2
    this.setData({
      infos: options
    })
    this.requestYXValueSuccessClerkAward(options)
  },
  requestYXValueSuccessClerkAward(options){
    let r = ''
    if (options.type=='1'){
      r = RequestReadFactory.requestYXValueSuccessClerkAward(options.Id)
    } else{
      r = RequestReadFactory.requestOrderLine(options.Id)
    }
    r.finishBlock = (req) => {
      console.log(req.responseObject.Datas)
      this.setData({
        data: req.responseObject.Datas[0]
      })
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