let { Tool, Event, RequestReadFactory } = global;
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
    this.requestData();
  },

  /**
   * 数据请求
   */
  requestData: function () {
    this.requestToothAdvisoryInfo();
  },

  /**
   * 查询爱牙卫士
   */
  requestToothAdvisoryInfo: function () {
    let task = RequestReadFactory.toothAdvisoryRead();
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
      url: '/pages/find/clinic/tooth/tooth-detail/tooth-detail?id=' + id
    })
  },

  /**
   * 顶部切换事件
   */
  onTabListener: function (e) {
    let position = e.currentTarget.dataset.position;
    switch (position) {
      case "0":
        //发起咨询
        // wx.navigateTo({
        //   url: '../clinic/add-tooth-concult/add-tooth-concult',
        // })
        break;
      case "1":
        //我的咨询
        break;
      case "2":
        //知识库
        break;
    }
  }
})