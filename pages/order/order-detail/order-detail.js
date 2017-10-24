let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: undefined
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    let orderId = options.id;

    Tool.showLoading();
    this.requestOrderInfo(orderId);
  },

  /**
   * 查询订单详情
   */
  requestOrderInfo: function (orderId) {
    let self = this;
    let r = RequestReadFactory.orderDetailRead(orderId);
    r.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas;
        this.setData({
          orderInfo: responseData[0]
        });
      }
    }
    r.addToQueue();
  },

  /**
   * 进入商品详情
   */
  onChildClickLitener: function (e) {
    let productId = e.currentTarget.dataset.productId;
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + productId
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