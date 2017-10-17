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
    let levyId = options.id;
    let applyId = options.applyId;
    this.setData({
      levyId: levyId,
      applyId: applyId,
      isWin: options.isWin == 'false' ? false : true
    });

    let addUrl = "/pages/find/levy/levy-detail/levy-report/levy-report-add/levy-report-add?levyId=" + levyId + "&applyId=" + applyId;

    this.createBtn = new CreateBtn(this, addUrl);
    if (!this.data.isWin) {
      this.createBtn.setHide();
    }

    this.requestList();

    Event.on('refreshReportList', this.requestList, this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    Event.off('refreshReportList', this.requestList)
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