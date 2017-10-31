let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestInfo(options.id);
  },



  modifyTap: function () {
    wx.navigateTo({
      url: '../add-baby-diary/add-baby-diary?type=1',
    })
  },
  /**
   * 宝宝日记查询
   */
  requestInfo: function (id) {
    let task = RequestReadFactory.babyDiaryDetailRead(id);
    task.finishBlock = (req, firstData) => {
      if (req.responseObject.Count > 0) {
        this.setData({
          detailInfo: firstData
        });
      }
    }
    task.addToQueue();
  },
})