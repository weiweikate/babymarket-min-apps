let { Tool, Storage, RequestReadFactory, RequestWriteFactory, Event } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestLotteryData();
  },

  /**
   * 我的中奖纪录查询
   */
  requestLotteryData: function () {
    let task = RequestReadFactory.myLotteryExtractRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        listArray: responseData
      });
    }
    task.addToQueue();
  },
})