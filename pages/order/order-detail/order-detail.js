let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: undefined,
    door:''
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    let orderId = options.id;
    this.setData({
        door: options.door
    })
    Tool.showLoading();
    this.requestOrderInfo(orderId);
  },
 
  /**
   * 查询订单详情
   */
  requestOrderInfo: function (orderId) {
    let self = this;

    if (this.data.door == '1' || this.data.door == 0){//积分订单
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
    } else if (this.data.door == '2'){//团购订单
        let task = RequestReadFactory.requestGroupBuyOrderDetail(orderId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let item = responseData[0];
            
            item.Detail = [{
                "ProductName": item.ProductName,
                "ProductImgUrl": item.ProductImgUrl,
                "Price": '￥' + item.Price,
                "Qnty": '1'
            }]

            this.setData({
                orderInfo: item
            });
        };
        task.addToQueue();
    } else if (this.data.door == '3') {//秒杀订单
        let condition = "${Id} == '" + orderId + "'"
        let task = RequestReadFactory.requestSecKillOrderDetail(1,0,condition);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let item = responseData[0];

            item.Detail = [{
                "ProductName": item.Name,
                "ProductImgUrl": item.imgUrl,
                "Price": item.Need_Points + '积分',
                "Qnty": '1'
            }]

            this.setData({
                orderInfo: item
            });
        };
        task.addToQueue();
    }
  },

  /**
   * 进入商品详情
   */
  onChildClickLitener: function (e) {
    let productId = e.currentTarget.dataset.productId;
    if(this.data.door == '3'){//秒杀

        wx.navigateTo({
            url: '/pages/find/second-kill/second-kill-detail/second-kill-detail?mainId=' + this.data.orderInfo.Seckill_ProductId
        })
    } else if (this.data.door == '2'){//团购
        wx.navigateTo({
            url: '/pages/find/group-buy/group-buy-detail/group-buy-detail?mainId=' + this.data.orderInfo.ActivityId
        })
    }else{
        let productId = e.currentTarget.dataset.productId;
        wx.navigateTo({
            url: '/pages/product-detail/product-detail?id=' + productId
        })
    }
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