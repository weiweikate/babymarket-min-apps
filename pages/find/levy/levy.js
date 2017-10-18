import RequestGetSystemTime from '../../../network/requests/request-get-system-time';
let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

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
    this.requestSystemTime();

    Event.on('refreshApplyList', this.requestSystemTime, this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    Event.off('refreshApplyList', this.requestSystemTime)
  },

  /**
   * 获取平台时间
   */
  requestSystemTime: function () {
    let task = new RequestGetSystemTime();
    task.finishBlock = (req) => {
      let time = req.responseObject.Now;
      if (Storage.didLogin()) {
        //先查询申请列表
        this.requestApplyList(time);
      } else {
        this.requestLevy(time);
      }
    }
    task.addToQueue();
  },

  /**
   * 获取我的申请
   */
  requestApplyList: function (time) {
    let task = RequestReadFactory.levyApplyRead();
    task.finishBlock = (req) => {
      this.requestLevy(time, req.responseObject.Datas);
    }
    task.addToQueue();
  },

  /**
   * 黄金便征集令查询
   */
  requestLevy: function (time, apply) {
    let task = RequestReadFactory.levyRead(time, apply);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        listArray: responseData
      });
    }
    task.addToQueue();
  },

  /**
   * 咨询详情
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/find/levy/levy-detail/levy-detail?id=' + id
    })
  },
  /**
   * 立即申请
   */
  onApplyClickListener: function (e) {
    let typed = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;

    switch (typed) {
      case 0:
        if (Storage.didLogin()) {
          //立即申请
          wx.navigateTo({
            url: '/pages/find/levy/levy-apply/levy-apply?id=' + id
          })
        } else {
          //请先登录
          Tool.showAlert("请先登录");
        }
        break;
      case 1:
        //已结束
        Tool.showAlert('该商品申请已结束');
        break;
      case 2:
        //已申请
        Tool.showAlert('您已申请了该商品');
        break;
    }
  }
})