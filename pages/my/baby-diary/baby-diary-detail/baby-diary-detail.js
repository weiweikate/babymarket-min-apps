let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: undefined,
    id: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });

    this.requestInfo();

    //注册通知
    Event.on('refreshBabyDiaryList', this.requestInfo, this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    Event.off('refreshBabyDiaryList', this.requestInfo)
  },

  modifyTap: function () {
    Storage.setterFor("baby-diary-info", this.data.detailInfo);
    wx.navigateTo({
      url: '/pages/my/baby-diary/add-baby-diary/add-baby-diary?type=1',
    })
  },
  /**
   * 宝宝日记查询
   */
  requestInfo: function () {
    let task = RequestReadFactory.babyDiaryDetailRead(this.data.id);
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