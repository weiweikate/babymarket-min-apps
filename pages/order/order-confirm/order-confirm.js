let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressInfo: undefined,
        orderLineArray: [],
        totalPrice: 0,
        canUsedMoney: 0,
        isEdit: true,
        door:'', // 判断是从哪种类型的产品页面进来的 0为婴雄联盟 1为普通兑换 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let orderLineArray = Storage.getterFor("orderLine");
        let canUsedMoney  = ''
        if (options.door == '0'){
          canUsedMoney = Storage.currentMember().YXValue
        } else {
          canUsedMoney = Storage.currentMember().Point;
        }
        let totalPrice = 0;
        orderLineArray.forEach((item) => {
            item.Points = parseInt(item.Points);
            item.Qnty = parseInt(item.Qnty);
            item.Price = parseInt(item.Price);
            item.YXValue = item.YXValues = parseInt(item.YXValue);
            if (options.door == '0'){
              item.door = 0
              totalPrice += item.YXValueSum;
            } else{
              totalPrice += item.Points;
            }
        });

        let isEdit = true;
        if (options.door == '3') {//秒杀进入
            isEdit = false;
        }
        this.setData({
            orderLineArray: orderLineArray,
            totalPrice: totalPrice,
            canUsedMoney: canUsedMoney,
            door: options.door,
            isEdit: isEdit
        })

        this.requestAddressInfo();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let addressInfo = this.data.addressInfo;
        if (global.Tool.isValidObject(addressInfo)) {
            this.setData({
                addressInfo: addressInfo
            })
        }
    },

    /**
     * 查询地址
     */
    requestAddressInfo: function () {
        let self = this;
        let r = RequestReadFactory.addressRead();
        r.finishBlock = (req) => {
            if (req.responseObject.Count > 0) {
                let responseData = req.responseObject.Datas;
                this.setData({
                    addressInfo: responseData[0]
                });
            }
        }
        r.addToQueue();
    },

    /**
     * 新增订单
     */
    requestAddOrder: function (requestData, orderLineRequest, orderId) {
        let task = RequestWriteFactory.orderAdd(requestData);
        task.finishBlock = (req) => {
            //新增订单明细
            this.requestAddOrderLine(orderLineRequest, orderId);
        };
        task.addToQueue();
    },

    /**
     * 新增订单明细
     */
    requestAddOrderLine: function (requestData, orderId) {
        let task = RequestWriteFactory.orderLineAdd(requestData);
        task.finishBlock = (req) => {
            //跳转到下一级
            wx.redirectTo({
                url: '/pages/pay-success/pay-success?id=' + orderId
            })
        };
        task.addToQueue();
    },

    /**
     * 地址选择
     */
    onAddressClickListener: function (e) {
        wx.navigateTo({
            url: '/pages/address/address?door=1'
        })
    },

    /**
     * 减少数量
     */
    onQuantityMinusListener: function (e) {
        let position = e.currentTarget.dataset.position;
        let orderLineArray = this.data.orderLineArray;
        let orderLineData = orderLineArray[position];
        if (orderLineData.Qnty > 1) {
            orderLineData.Qnty--;
            orderLineData.Points = orderLineData.Price * orderLineData.Qnty;
            let totalPrice = 0;
            orderLineArray.forEach((item) => {
                totalPrice += item.Points;
            });

            this.setData({
                orderLineArray: orderLineArray,
                totalPrice: totalPrice
            });
        } else {
            console.log("数量不能小于1");
        }
    },

    /**
     * 增加数量
     */
    onQuantityPlusListener: function (e) {
        let position = e.currentTarget.dataset.position;
        let orderLineArray = this.data.orderLineArray;
        let orderLineData = orderLineArray[position];
        if (orderLineData.Qnty < 999) {
            orderLineData.Qnty++;
            orderLineData.Points = orderLineData.Price * orderLineData.Qnty;
            let totalPrice = 0;
            orderLineArray.forEach((item) => {
                totalPrice += item.Points;
            });

            this.setData({
                orderLineArray: orderLineArray,
                totalPrice: totalPrice
            });
        } else {
            console.log("数量不能大于999");
        }
    },
    /**
     * 提交订单
     */
    onSubmitClickListener: function (e) {
        //如果合计积分大于可用积分，提示积分不足
        let canUsedMoney = this.data.canUsedMoney;
        let totalPrice = this.data.totalPrice;
        if (totalPrice > canUsedMoney) {
            Tool.showAlert('积分不足，兑换失败！');
            return;
        }
        let orderId = Tool.guid();

        if (this.data.door == '3') {//秒杀进入

            let requestData = {
                'Id': orderId,
                'MemberId': Storage.memberId(),
                'ReceiptAddressId': this.data.addressInfo.Id,
                "Need_Points_All": this.data.orderLineArray[0].Points +'',
                "Seckill_ProductId": this.data.orderLineArray[0].secondKillId,
                "ProductId": this.data.orderLineArray[0].ProductId,
            };

            let task = RequestWriteFactory.secondKillOrderAdd(requestData);
            task.finishBlock = (req) => {
                //跳转到下一级
                wx.redirectTo({
                    url: '/pages/pay-success/pay-success?id=' + orderId + '&door=' + this.data.door
                })
            };
            task.addToQueue();
        }else{
            let orderLineArray = this.data.orderLineArray;
            orderLineArray.forEach((item) => {
                item.ExchangeOrderId = orderId;
                item.Qnty += "";
                item.Points += "";
                item.Price += "";
                if(this.data.door == '0'){
                  if (!item.YXValues){
                    item.YXValues = item.Price
                  }
                  item.YXValues += ''
                  item.YXValue += ''
                  item.YXValueSum += ''
                  //item.Points = item.Price = '0'
                  delete item.door 
                }
            });
            let YXOrder = 'False'
            if (this.data.door == '0'){
               YXOrder = 'True'
            }
            let requestData = {
                'Id': orderId,
                'MemberId': Storage.memberId(),
                'ReceiptAddressId': this.data.addressInfo.Id,
                'YXOrder': YXOrder
            };

            Tool.showLoading();
            console.log(orderLineArray)
            this.requestAddOrder(requestData, orderLineArray, orderId);
        }
    }
})