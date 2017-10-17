let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    endTime: undefined,
    listArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      endTime: options.time
    });

    Tool.showLoading();
    this.requestReportList(options.id);
  },

  /**
  * 获取试用报告列表
  */
  requestReportList: function (id) {
    let task = RequestReadFactory.levyReportRead(id);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.requestList(id, responseData);
    }
    task.addToQueue();
  },

  /**
   * 获取中奖的用户列表
   */
  requestList: function (id, reportArray) {
    let task = RequestReadFactory.levyWinRead(id, reportArray);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        listArray: responseData
      });
    }
    task.addToQueue();
  }

})