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
        if (Storage.didLogin()) {
          wx.navigateTo({
            url: '/pages/find/clinic/tooth/tooth-add/tooth-add',
          })
        } else {
          //请先登录
          Tool.showAlert("请先登录");
        }
        break;
      case "1":
        //我的咨询
        if (Storage.didLogin()) {
          wx.navigateTo({
            url: '/pages/find/clinic/tooth/tooth-list/tooth-list',
          })
        } else {
          //请先登录
          Tool.showAlert("请先登录");
        }
        break;
      case "2":
        //知识库
        wx.navigateTo({
          url: '/pages/find/clinic/tooth/tooth-knowledge/tooth-knowledge',
        })
        break;
    }
  }
})