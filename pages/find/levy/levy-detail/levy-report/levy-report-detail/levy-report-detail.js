let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: undefined,
    imagesArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestDetail(options.id);
  },

  /**
   * 获取试用报告详情
   */
  requestDetail: function (id) {
    let task = RequestReadFactory.levyReportDetailRead(id);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas;
        this.setData({
          detailInfo: responseData[0]
        });
        //请求附件数据
        this.requestAttachments(id);
      }
    }
    task.addToQueue();
  },

  /**
   * 查询附件
   */
  requestAttachments: function (id) {
    let task = RequestReadFactory.attachmentsByIdRead(id);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        imagesArray: responseData
      });
    }
    task.addToQueue();
  }

})