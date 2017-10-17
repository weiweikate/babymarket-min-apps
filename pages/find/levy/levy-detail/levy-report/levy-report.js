let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
import CreateBtn from '../../../../../components/create-btn/create-btn';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    levyId: undefined,
    applyId: undefined,
    isWin: false,
    listArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      levyId: options.id,
      applyId: options.applyId,
      isWin: options.isWin == 'false' ? false : true
    });

    this.createBtn = new CreateBtn(this, "/pages/find/levy/levy-detail/levy-report-detail/levy-report-detail");
    if (!this.data.isWin) {
      this.createBtn.setHide();
    }

    this.requestList();
  },

  /**
   * 获取试用报告列表
   */
  requestList: function () {
    let task = RequestReadFactory.levyReportRead(this.data.levyId);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        listArray: responseData
      });
    }
    task.addToQueue();
  },

  /**
   * 进入报告详情
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/find/levy/levy-detail/levy-report/levy-report-detail/levy-report-detail?id=' + id,
    })
  }
})