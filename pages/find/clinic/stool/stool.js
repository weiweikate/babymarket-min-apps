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
    this.requestAdvisoryInfo();
  },

  /**
   * 查询咨询
   */
  requestAdvisoryInfo: function () {
    let task = RequestReadFactory.advisoryRead();
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
      url: '/pages/find/clinic/stool/stool-detail/stool-detail?id=' + id
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
        //   url: '../clinic/add-clinic/add-clinic',
        // })
        // wx.navigateTo({
        //   url: '/pages/find/clinic/stool/stool-add/stool-add'
        // })
        break;
      case "1":
        //我的咨询
        if (Storage.didLogin()) {
          wx.navigateTo({
            url: '/pages/find/clinic/stool/stool-list/stool-list',
          })
        } else {
          //请先登录
          Tool.showAlert("请先登录");
        }
        break;
      case "2":
        //知识库
        wx.navigateTo({
          url: '/pages/find/clinic/stool/stool-knowledge/stool-knowledge',
        })
        break;
    }
  }
})