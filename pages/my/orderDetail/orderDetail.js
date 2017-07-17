// orderDetail.js
let {Tool, Storage, RequestReadFactory, RequestWriteFactory, Event} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressData: {
            name: '',
            mobile: '',
            detail: '',
        },
        orderLineList: ['', '', ''],
        orderId: '',
        orderDatas: '',
        deliveryInfo: '',
        orderStatus: '',
        orderTips: '',
        bottomButton0Name: '',//从右往左
        bottomButton1Name: '',
        bottomButton2Name: '',

        settlementList: [
            {
                title: '商品总额',
                value: '',
            },
            {
                title: '优惠券',
                value: '',
            },
            {
                title: '物流费用',
                value: '',
            },
            {
                title: '关税',
                value: '',
            },
            {
                title: '支付方式',
                value: '支付宝',
            },
            {
                title: '已省金额',
                value: '',
            }
        ],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId: options.orderId,
        }),

        this.requestData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.requestData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 物流
     */
    deliveryTap: function () {
        let trackNo = this.data.orderDatas.LogisticsNumber;
        let companyNo = this.data.orderDatas.LogisticsCode;

        let productList = this.data.orderDatas.Scan_Line;
        let count = productList.length;
        let imgUrl = productList[count - 1].imageUrl;

        let deliveryInfo = {
            "trackNo": trackNo,
            "companyNo": companyNo,
            "count": count,
            "imgUrl": imgUrl
        }

        wx.setStorage({
            key: 'deliveryInfoKey',
            data: deliveryInfo,
        }),

            wx.navigateTo({
                url: '../../my/delivery-info/delivery-info'
            })
    },

    /**
     * 底部按钮点击处理
     */
    bottomButtonTap: function (e) {
        var title = e.currentTarget.dataset.title;

        if (title == '查看物流') {//查看物流
            let order = this.data.orderDatas;

            let trackNo = order.LogisticsNumber;
            let companyNo = order.LogisticsCode;

            let productList = order.Line;
            let count = productList.length;
            let imgUrl = productList[count - 1].imageUrl;

            let deliveryInfo = {
                "trackNo": trackNo,
                "companyNo": companyNo,
                "count": count,
                "imgUrl": imgUrl
            }

            wx.setStorage({
                key: 'deliveryInfoKey',
                data: deliveryInfo,
            }),

            wx.navigateTo({
                url: '../../my/delivery-info/delivery-info'
            })

        } else if (title == '删除订单') {//删除订单
            let order = this.data.orderDatas;
            let self = this;

            wx.showModal({
                title: '提示',
                content: '确认删除订单？',
                confirmText: '删除',
                success: function (res) {
                    if (res.confirm) {
                        //提交请求
                        let r = RequestWriteFactory.deleteOrder(self.data.orderId);
                        r.finishBlock = (req) => {
                            Event.emit('deleteOrderFinish');//发出通知

                            //返回上一个界面
                            wx.navigateBack({
                                delta: 1,
                            })
                        };
                        r.addToQueue();
                    }
                }
            })
        } else if (title == '联系客服') {//联系客服
            wx.makePhoneCall({
                phoneNumber: global.TCGlobal.CustomerServicesNumber,
                // success: function () {
                //     console.log("拨打电话成功！")
                // },
                // fail: function () {
                //     console.log("拨打电话失败！")
                // }
            })
        } else if (title == '确认收货') {//确认收货
            let order = this.data.orderList[index];
            let r = RequestWriteFactory.modifyOrderStatus(order.Id, '3');
            r.finishBlock = (req) => {
                this.requestData();
            };
            r.addToQueue();

        } else if (title == '付款') {//付款
            wx.setStorage({
                key: 'order',
                data: this.data.orderDatas,
            })
            wx.navigateTo({
                url: '../../pay-method/pay-method',
            })
        } else if (title == '立即分享') {//立即分享
            console.log('----- 立即分享 -----');
        } else if (title == '申请退款') {//申请退款
            console.log('----- 申请退款 -----');
        }
        else if (title == '取消退款') {//取消退款
            console.log('----- 取消退款 -----');
        }
    },


    /**
     * 订单状态处理
     */
    dealOrderStatus: function (statusKey) {

        let orderStatus = '';
        let orderTips = '';
        let bottomButton0Name = '';
        let bottomButton1Name = '';
        let bottomButton2Name = '';

        if (statusKey == '0') {//待付款
            orderStatus = '待付款';
            orderTips = '您的订单已提交，请在30分内完成支付,超过订单自动取消';
            bottomButton0Name = '立即付款';
            bottomButton1Name = '取消订单';

        } else if (statusKey == '1') {//待发货
            orderStatus = '待发货';
            orderTips = '如果较长时间未发货时，您可以联系客服：' + global.TCGlobal.CustomerServicesNumber;
            bottomButton0Name = '联系客服';
            bottomButton1Name = '申请退款';

        } else if (statusKey == '2') {//待收货
            orderStatus = '待收货';
            orderTips = '请您确认收货';
            bottomButton0Name = '确认收货';
            bottomButton1Name = '查看物流';
            bottomButton2Name = '申请退款';

        } else if (statusKey == '3') {//待评价
            orderStatus = '买家已收货';
            orderTips = '请您立即分享';
            bottomButton0Name = '立即分享';
            bottomButton1Name = '查看物流';

        } else if (statusKey == '4') {//已评价
            orderStatus = '已评价';
            orderTips = '您已完成评价';
            bottomButton0Name = '联系客服';
            bottomButton1Name = '查看物流';

        } else if (statusKey == '5') {//交易成功
            orderStatus = '交易成功';
            orderTips = '';
            bottomButton0Name = '联系客服';

        } else if (statusKey == '6') {//订单关闭
            orderStatus = '订单关闭';
            orderTips = '系统定时关单';
            bottomButton0Name = '删除订单';

        } else if (statusKey == '7') {//退款中
            orderStatus = '退款中';
            orderTips = '';
            bottomButton0Name = '取消退款';

        } else if (statusKey == '8') {//退款成功
            orderStatus = '退款成功';
            orderTips = '';
            bottomButton0Name = '删除订单';

        } else if (statusKey == '9') {//退款失败
            orderStatus = '退款失败';
            orderTips = '';
            bottomButton0Name = '联系客服';

        }

        this.setData({
            orderStatus: orderStatus,
            orderTips: orderTips,
            bottomButton0Name: bottomButton0Name,
            bottomButton1Name: bottomButton1Name,
            bottomButton2Name: bottomButton2Name
        });
    },

    /**
     * 查询订单详情
     */
    requestData: function () {
        let r = RequestReadFactory.orderDetailRead(this.data.orderId);
        r.finishBlock = (req, firstData) => {

            //图片url拼接
            let productList = firstData.Line;
            for (let i = 0; i < productList.length; i++) {
                let product = productList[i];
                product.imageUrl = Tool.imageURLForId(product.ImgId, "/res/img/my/my-defualt_square_icon.png");
            }

            //订单状态相关处理
            this.dealOrderStatus(firstData.StatusKey);

            //支付方式
            let payName = firstData.PaywayName;
            if (Tool.isEmptyStr(payName)) {
                payName = '支付宝';
            }
            if (firstData.StatusKey == '0') {
                payName = '待支付';
            }

            this.setData({
                orderDatas: firstData,
                addressData: {
                    name: firstData.Consignee,
                    mobile: firstData.Mobile,
                    detail: firstData.Address,
                },
                orderLineList: productList,
                'settlementList[0].value': '¥' + firstData.Money,
                'settlementList[1].value': '¥' + firstData.Discount,
                'settlementList[2].value': '¥' + firstData.ExpressSum,
                'settlementList[3].value': '¥' + firstData.Tax,
                'settlementList[4].value': payName,
                'settlementList[5].value': '¥' + firstData.BuyerCommission,
            });

            if (firstData.StatusKey === '2') {//待收货，查询物流信息
                this.requestDeliveryInfo(this.data.orderDatas.LogisticsNumber, this.data.orderDatas.LogisticsCode);
            }
        };
        r.addToQueue();
    },

    /**
     * 查询物流详情
     */
    requestDeliveryInfo: function (trackNo, companyNo) {
        // if (Tool.isEmptyStr(trackNo) || Tool.isEmptyStr(companyNo)){
        //     return;
        // }

        let r = RequestReadFactory.orderDeliveryInfoRead('3972400229281', 'yd');
        r.finishBlock = (req, firstData) => {
            let result = req.responseObject.result;
            if (Tool.isEmpty(result)) {
                this.setData({
                    deliveryInfo: {
                        remark: '暂无物流流转信息'
                    },
                });
            } else {
                let firstInfo = result.list[result.list.length - 1];
                this.setData({
                    deliveryInfo: firstInfo,
                });
            }
        };
        r.addToQueue();
    },

})