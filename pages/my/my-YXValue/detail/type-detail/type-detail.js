let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:'',
    datas:'',
    totalValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.type
    })
    options.iconUrl = Tool.imageURLForId(options.icon)
    this.setData({
      types: options
    })
    this.requestYXValueTypeLog(options.key)
    this.requestTotalYXValue(options.key)
  },
  requestYXValueTypeLog(key){
    // 获取总的婴雄值
    let r = RequestReadFactory.requestYXValueTypeLog(key);
    r.finishBlock = (req) => {
      //console.log(req.responseObject.Datas)
      let datas = req.responseObject.Datas
      this.setData({
        datas: datas
      });

    };
    r.addToQueue();
  },
  requestTotalYXValue(key) {
    // 获取总的婴雄值
    let r = RequestReadFactory.requestTotalYXValue(key);
    r.finishBlock = (req) => {
      let totalXYValue = req.responseObject.Datas[0].totalValue
      this.setData({
        totalValue: totalXYValue
      });

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