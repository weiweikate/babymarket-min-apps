// shopping-cart.js
let { Tool, Event, RequestReadFactory, RequestWriteFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        viewCarts: [],//购物车视图

        hasList: false, // 是否有购物车数据
        totalPrice: 0,  // 合计

        touchStart: 0,
        touchEnd: 0,
        allSelected: false, //全选
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
        Event.on('deleteCart', this.requestData, this)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        Event.off('deleteCart', this.requestData)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.requestData();
    },

    /**
     * 数据请求
     */
    requestData: function () {
        // 清空数据
        this.setData({
            viewCarts: [],
        });
        this.requestCartViewInfo();
    },

    /**
     * 查询购物车视图
     */
    requestCartViewInfo: function () {
        let self = this;
        let r = RequestReadFactory.cartViewRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                self.setData({
                    hasList: true,
                    viewCarts: datas,
                });
                self.requestCartInfo();
            }
        }
        r.addToQueue();
    },

    /**
     * 查询购物车
     */
    requestCartInfo: function () {
        let self = this;
        let viewCarts = this.data.viewCarts;
        let r = RequestReadFactory.cartRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                for (let i = 0; i < viewCarts.length; i++) {
                    let houseId = viewCarts[i].WarehouseId;
                    let carts = [];
                    for (let j = 0; j < datas.length; j++) {
                        datas[j].image = global.Tool.imageURLForId(datas[j].ImgId);
                        if (datas[j].S_Name === "：") {
                            datas[j].S_Name = "";
                        }
                        if (houseId === datas[j].WarehouseId) {
                            carts.splice(carts.length, 0, datas[j]);
                        }
                    }
                    viewCarts[i].carts = carts;
                }
                self.setData({
                    viewCarts: viewCarts,
                });
                self.getTotalPrice();
            }
        }
        r.addToQueue();
    },

    /**
     * 合计
     */
    getTotalPrice: function () {
        let viewCarts = this.data.viewCarts;
        let total = 0;
        for (let i = 0; i < viewCarts.length; i++) {
            for (let j = 0; j < viewCarts[i].carts.length; j++) {
                if (viewCarts[i].carts[j].childSelected) {
                    total += viewCarts[i].carts[j].Qnty * viewCarts[i].carts[j].Price;
                }
            }
        }
        this.setData({
            totalPrice: total.toFixed(2)
        });
    },

    /**
     * 选择商品
     */
    selectchildList: function (e) {
        let groupPosition = e.currentTarget.dataset.groupPosition;
        let childPosition = e.currentTarget.dataset.childPosition;
        let viewCarts = this.data.viewCarts;
        let childSelected = viewCarts[groupPosition].carts[childPosition].childSelected;
        viewCarts[groupPosition].carts[childPosition].childSelected = !childSelected
        // 判断是否为全选
        let quantity = 0
        for (let i = 0; i < viewCarts[groupPosition].carts.length; i++) {
            if (viewCarts[groupPosition].carts[i].childSelected) {
                quantity++;
            }
        }
        // 全选仓库下商品则选中仓库
        if (quantity == viewCarts[groupPosition].carts.length) {
            viewCarts[groupPosition].groupSelected = true;
        } else {
            viewCarts[groupPosition].groupSelected = false;
        }
        // 不能同时选中不同仓库的商品
        // for (let i = 0; i < viewCarts.length; i++) {
        //  if (i != groupPosition) {
        //  viewCarts[i].groupSelected = false;
        //  for (let j = 0; j < viewCarts[i].carts.length; j++) {
        //     viewCarts[i].carts[j].childSelected = false;
        //  }
        //}
        //   }
        this.setData({
            viewCarts: viewCarts,
        });

        this.getTotalPrice();
    },

    /**
     * 仓库商品全选
     */
    selectGroupList: function (e) {
        let groupPosition = e.currentTarget.dataset.groupPosition;
        let viewCarts = this.data.viewCarts;
        let selectAllStatus = viewCarts[groupPosition].groupSelected;
        selectAllStatus = !selectAllStatus;
        viewCarts[groupPosition].groupSelected = selectAllStatus;
        for (let i = 0; i < viewCarts[groupPosition].carts.length; i++) {
            viewCarts[groupPosition].carts[i].childSelected = selectAllStatus;
        }
        this.setData({
            viewCarts: viewCarts,
        });
        this.getTotalPrice();
    },

    /**
     * 所有商品全选
     */
    selectAll: function () {
        let allSelected = this.data.allSelected;
        let viewCarts = this.data.viewCarts;
        allSelected = !allSelected;
        for (let i = 0; i < viewCarts.length; i++) {
            viewCarts[i].groupSelected = allSelected;
            for (let j = 0; j < viewCarts[i].carts.length; j++) {
                viewCarts[i].carts[j].childSelected = allSelected;
            }
        }
        this.setData({
            allSelected: allSelected,
            viewCarts: viewCarts,
        });
        this.getTotalPrice();
    },

    /**
     * 增加数量
     */
    onQuantityPlusListener: function (e) {
        let groupPosition = e.currentTarget.dataset.groupPosition;
        let childPosition = e.currentTarget.dataset.childPosition;
        let viewCarts = this.data.viewCarts;
        let qnty = parseInt(viewCarts[groupPosition].carts[childPosition].Qnty);
        qnty = qnty + 1;
        viewCarts[groupPosition].carts[childPosition].Qnty = String(qnty);
        let self = this;
        let r = RequestWriteFactory.modifyCartQnty(viewCarts[groupPosition].carts[childPosition].Id, viewCarts[groupPosition].carts[childPosition].Qnty);
        r.finishBlock = (req) => {
            self.setData({
                viewCarts: viewCarts,
            });
            self.getTotalPrice();
        }
        r.addToQueue();
    },
    /**
     * 减少数量
     */
    onQuantityMimusListener: function (e) {
        let groupPosition = e.currentTarget.dataset.groupPosition;
        let childPosition = e.currentTarget.dataset.childPosition;
        let viewCarts = this.data.viewCarts;
        let qnty = parseInt(viewCarts[groupPosition].carts[childPosition].Qnty);
        if (qnty <= 1) {
            return false;
        }
        qnty = qnty - 1;
        viewCarts[groupPosition].carts[childPosition].Qnty = String(qnty);
        let self = this;
        let r = RequestWriteFactory.modifyCartQnty(viewCarts[groupPosition].carts[childPosition].Id, viewCarts[groupPosition].carts[childPosition].Qnty);
        r.finishBlock = (req) => {
            self.setData({
                viewCarts: viewCarts,
            });
            self.getTotalPrice();
        }
        r.addToQueue();
    },

    /**
     * 新增订单
     */
    addOrder: function () {
        // 判断是否选择购物车
        let selectNum = 0;
        let viewCarts = this.data.viewCarts;
        let selectCarts = [];
        let self = this;
        for (let i = 0; i < viewCarts.length; i++) {
            for (let j = 0; j < viewCarts[i].carts.length; j++) {
                if (viewCarts[i].carts[j].childSelected) {
                    // 选中数量
                    selectCarts[selectNum] = viewCarts[i].carts[j];
                    selectNum++;
                }
            }
        }
        if (selectNum > 0) {
            self.goConfirm(selectCarts);
        } else {
            global.Tool.showAlert("请选择购物车商品");
        }
    },

    /**
     * 进入确认订单
     */
    goConfirm: function (selectCarts) {
        wx.setStorage({
            key: 'selectCarts',
            data: selectCarts,
            success: function (res) {
                wx.navigateTo({
                    url: '../order-confirm/order-confirm?door=1',
                })
            }
        })
    },

    /**
     * 进入商品详情或长按删除
     */
    goDetail: function (e) {
        let groupPosition = e.currentTarget.dataset.groupPosition;
        let childPosition = e.currentTarget.dataset.childPosition;
        let viewCarts = this.data.viewCarts;
        let touchTime = this.data.touchEnd - this.data.touchStart;
        let self = this;
        if (touchTime > 350) {
            // 删除购物车
            self.deleteCart(viewCarts, groupPosition, childPosition);
        } else {
            // 点击详情
            let productId = viewCarts[groupPosition].carts[childPosition].ProductId;
            self.goProductDetail(productId);
        }
    },

    /**
     * 删除购物车
     */
    deleteCart: function (viewCarts, groupPosition, childPosition) {
        let requestData = {
            "Id": viewCarts[groupPosition].carts[childPosition].Id,
        };
        let self = this;
        wx.showModal({
            title: '提示',
            content: '确定删除吗？',
            success: function (res) {
                if (res.confirm) {
                    let r = RequestWriteFactory.deleteCart(requestData);
                    r.finishBlock = (req) => {
                        viewCarts[groupPosition].carts.splice(childPosition, 1);
                        // 判断仓库下是否还有商品
                        if (viewCarts[groupPosition].carts.length <= 0) {
                            viewCarts.splice(groupPosition, 1);
                        }
                        self.setData({
                            viewCarts: viewCarts,
                        });
                        // 判断购物车下是否还有商品
                        if (!viewCarts.length) {
                            self.setData({
                                hasList: false
                            });
                        } else {
                            self.getTotalPrice();
                        }
                    }
                    r.addToQueue();
                }
            }
        })
    },

    /**
     * 进入详情
     */
    goProductDetail: function (productId) {
        wx.navigateTo({
            url: '../product-detail/product-detail?productId=' + productId
        })
    },

    /**
     * 按下事件开始
     */
    mytouchstart: function (e) {
        this.setData({
            touchStart: e.timeStamp
        })
    },

    /**
     * 按下事件结束
     */
    mytouchend: function (e) {
        this.setData({
            touchEnd: e.timeStamp
        })
    },

})