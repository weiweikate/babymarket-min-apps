// myOrder.js

let {Tool, Storage, RequestReadFactory, RequestWriteFactory, Event} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        orderList: [
            {
                'Line':['']
            },
            {
                'Line': ['']
            }],
        nomoredata: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.requestData();
        Event.on('deleteOrderFinish', this.requestData, this)
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
        Event.off('deleteOrderFinish', this.requestData)
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
        if (!this.data.nomoredata) {
            this.loadmore();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    requestData: function () {
        let index = 0;
        if (this.data.currentIndex == 0) {
            index = "undefined";
        } else {
            index = this.data.currentIndex - 1;
        }

        let r = RequestReadFactory.myOrderRead(index, 0);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;
            datas.forEach((item, index) => {
                let productList = item.Line;
                for (let i = 0; i < productList.length; i++) {
                    let product = productList[i];
                    let imageUrl = Tool.imageURLForId(product.ImgId, "/res/img/my/my-defualt_square_icon.png");
                    product.imageUrl = imageUrl;
                }
            });

            let arry = this.data.dataArry;
            arry.splice(this.data.currentIndex, 1, datas);

            let nomoredata = false;
            if (datas.length >= total) {
                nomoredata = true;
            }
            this.setData({
                orderList: datas,
                index: datas.length,
                dataArry: arry,
                nomoredata: nomoredata,
            });
        };
        r.addToQueue();
    },

    loadmore: function () {
        let index = 0;
        if (this.data.currentIndex == 0) {
            index = "undefined";
        } else {
            index = this.data.currentIndex - 1;
        }

        let r = RequestReadFactory.myOrderRead(index, this.data.index);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;
            datas.forEach((item, index) => {
                let productList = item.Line;
                for (let i = 0; i < productList.length; i++) {
                    let product = productList[i];
                    let imageUrl = Tool.imageURLForId(product.ImgId);
                    product.imageUrl = imageUrl;
                }
            });

            let arry = this.data.dataArry;
            arry.splice(this.data.currentIndex, 1, this.data.orderList.concat(datas));
            let nomoredata = false;
            if (this.data.index + datas.length >= total) {
                nomoredata = true;
            }
            this.setData({
                orderList: this.data.orderList.concat(datas),
                index: this.data.index + datas.length,
                dataArry: arry,
                nomoredata: nomoredata,
            });
        };
        r.addToQueue();
    },

    /**
     * segmentView tap
     */
    segmentIndexChangedTap: function (e) {
        var index = e.currentTarget.dataset.index;
        let datas = this.data.dataArry[index];
        this.setData({
            currentIndex: index,
            orderList: datas,
            nomoredata: false,
        })

        if (Tool.isEmptyArr(datas)) {
            this.requestData();
        }
    },

    orderCellTap: function (e) {
        var index = e.currentTarget.dataset.index;
        let order = this.data.orderList[index];

        wx.navigateTo({
            url: '../orderDetail/orderDetail?orderId=' + order.Id,
        })
    },

    bottomButtonTap: function (e) {
        var title = e.currentTarget.dataset.title;
        var index = e.currentTarget.dataset.index;

        if (title == '查看物流') {//查看物流
            let order = this.data.orderList[index];

            let trackNo = order.LogisticsNumber;
            let companyNo = order.LogisticsCode;

            let productList = order.Scan_Line;
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
            let order = this.data.orderList[index];
            let self = this;

            wx.showModal({
                title: '提示',
                content: '确认删除订单？',
                confirmText: '删除',
                success: function (res) {
                    if (res.confirm) {
                        //提交请求
                        let r = RequestWriteFactory.deleteOrder(order.Id);
                        r.finishBlock = (req) => {
                            //刷新界面
                            let datas = self.data.orderList;
                            datas.splice(index, 1);

                            let arry = self.data.dataArry;
                            arry.splice(self.data.currentIndex, 1, datas);

                            self.setData({
                                orderList: datas,
                                dataArry: arry
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
            let order = this.data.orderList[index];
            wx.setStorage({
                key: 'order',
                data: order,
            })
            wx.navigateTo({
                url: '../../pay-method/pay-method?door=1',
            })
        } else if (title == '立即分享') {//立即分享
            console('----- 立即分享 -----');
        }
    },

    //随便逛逛
    okButtonTap: function () {
        wx.switchTab({
            url: '/pages/home/home'
        })
    }
})