let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderArray: [],
        door:undefined,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            door: options.type
        })
        if (this.data.door == '1') {//我的积分订单
            this.requestOrderData();
            wx.setNavigationBarTitle({
                title: '我的积分订单',
            })
        } else if (this.data.door == '2') {//我的团购订单
            this.requestGroupBuyOrderData();
            wx.setNavigationBarTitle({
                title: '我的团购订单',
            })
        } else if (this.data.door == 0){ //婴雄值兑换订单
            this.requestOrderData('YXOrder');
            wx.setNavigationBarTitle({
              title: '婴雄联盟订单',
            })
        }
    },
   requestYXExchangeOrder(){
     let task = RequestReadFactory.requestYXExchangeOrder()
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
     * 查询订单列表
     */
    requestOrderData: function (orderType) {
      let task = RequestReadFactory.orderListRead(orderType);
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
     * 查询 我的团购订单
     */
    requestGroupBuyOrderData: function () {
        let condition = "${MemberId} == '" + Storage.memberId() + "'"
        let task = RequestReadFactory.requestGroupBuyOrderList(condition);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;

            responseData.forEach((item, index) => {
                item.Detail = [{
                    "ProductName": item.ProductName,
                    "ProductImgUrl": item.ProductImgUrl,
                    "Price": '￥' + item.Price,
                    "Qnty": '1'
                }]
            });

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
            url: '/pages/order/order-detail/order-detail?id=' + id + '&door=' + this.data.door
        })
    },

    /**
     * 进入订单详情
     */
    onChildClickLitener: function (e) {
        let id = e.currentTarget.dataset.groupId;
        wx.navigateTo({
            url: '/pages/order/order-detail/order-detail?id=' + id + '&door=' + this.data.door
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