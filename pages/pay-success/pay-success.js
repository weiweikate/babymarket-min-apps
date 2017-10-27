let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderInfo: undefined
    },
    door: '',

    /**
      * 生命周期函数--监听页面加载
      */
    onLoad: function (options) {
        let orderId = options.id;
        this.door = options.door;

        Tool.showLoading();
        if (this.door == '3') {//秒杀进入
            this.requestSecKillOrderInfo(orderId);
        } else {
            this.requestOrderInfo(orderId);
        }
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
   * 查询秒杀订单详情
   */
    requestSecKillOrderInfo: function (orderId) {
        let self = this;
        let condition = "${Id} == '" + orderId + "'"
        let r = RequestReadFactory.requestSecKillOrderDetail(1, 0, condition);
        r.finishBlock = (req) => {
            if (req.responseObject.Count > 0) {
                let responseData = req.responseObject.Datas;

                let item = responseData[0]
                item.Number = item.Order_Number
                item.Points = item.Need_Points_All
                item.ReciptTypeName = '总部寄送'
                this.setData({
                    orderInfo: item
                });
            }
        }
        r.addToQueue();
    },

    /**
     * 查看订单
     */
    onGoOrderClickListener: function () {
        let id = this.data.orderInfo.Id;
        wx.redirectTo({
            url: '/pages/order/order-detail/order-detail?id=' + id + '&door=' + this.door
        })
    },
    /**
     * 去逛逛
     */
    onGoBugClickListener: function () {
        wx.switchTab({
            url: '/pages/home/home'
        })
    },
})