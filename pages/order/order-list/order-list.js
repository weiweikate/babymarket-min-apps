let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestOrderData();
  },

  /**
   * 查询订单列表
   */
  requestOrderData: function () {
    let task = RequestReadFactory.orderListRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        orderArray: responseData
      });
      console.log(responseData)
    };
    task.addToQueue();
  },

  /**
   * 进入订单详情
   */
  onGroupClickLitener: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/order-detail/order-detail?id=' + id
    })
  },

  /**
   * 进入订单详情
   */
  onChildClickLitener: function (e) {
    let id = e.currentTarget.dataset.groupId;
    wx.navigateTo({
      url: '/pages/order/order-detail/order-detail?id=' + id
    })
  },

  /**
   * 联系客服
   */
  onContactClickListener: function () {
    wx.makePhoneCall({
      phoneNumber: '0571-56888866'
    })
  }

})