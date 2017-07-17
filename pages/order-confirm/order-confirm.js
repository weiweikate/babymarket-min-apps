// 订单确认
let {Tool, Storage, Event, RequestReadFactory, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        total: 0,  // 合计
        orderId: '', //订单id
        num: 0, // 0为无地址，1为有地址
        door: 0, //0为商品库进入，1为购物车进入
        order: {}, //订单
        orders: [],//传来的选中的购物车商品
        isInsideMember: false,// 是否是内部会员

        creditChecked: true, // 授信开关
        balanceChecked: true, // 钱包开关
        isAirProduct: false, //是否是跨境商品

        status: 0, // 0为未选择优惠劵 1为选择了优惠劵
        couponData: {
            CouponId: '',
            Discount: '',
            money: '选择优惠劵',
        },
        addressData: {
            Consignee: '请添加地址',
            Mobile: '',
            Address: '您还没有添加收货地址，赶紧加一个',
            addressId: '',
            Card: '',
        },
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
                title: '已省金额',
                value: '',
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        let isInsideMember = global.Storage.isInsideMember();
        let id = global.Tool.guid();
        wx.getStorage({
            key: 'selectCarts',
            success: function (res) {
                self.setData({
                    orders: res.data,
                    door: parseInt(options.door),
                    isInsideMember: isInsideMember,
                    orderId: id,
                })
                self.requestData();
            },
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let status = this.data.status;
        let door = this.data.door;
        let order = this.data.order;
        let CouponId = this.data.couponData.CouponId;
        if (status == 1) {
            let requestData = {
                Id: order.Id,
                CouponId: CouponId,
            };
            this.modifyOrder(requestData, order, door);
        }
        this.setData({
            status: 0
        })
    },

    /**
     * 数据请求
     */
    requestData: function () {
        this.requestAddressDefaultInfo();
    },

    /**
     * 查询默认地址
     */
    requestAddressDefaultInfo: function () {
        let self = this;
        let r = RequestReadFactory.addressDefaultRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                let address = datas[0];
                self.setData({
                    addressData: {
                        Consignee: address.Consignee,
                        Mobile: address.Mobile,
                        Address: address.Address,
                        addressId: address.Id,
                        Card: address.Card,
                    },
                    num: 1,
                });
                this.requestAddOrder();
            }
        }
        r.addToQueue();
    },

    /**
     * 新增订单请求
     */
    requestAddOrder: function () {
        let self = this;
        let id = this.data.orderId;
        let addressId = self.data.addressData.addressId;
        let orders = this.data.orders;
        let door = this.data.door;

        let r = RequestWriteFactory.orderAddRequest(id, addressId, String((new Date()).valueOf()));
        r.finishBlock = (req) => {
            // 新增订单明细
            let requestData = new Array();
            let orderLineBean = undefined;
            for (let i = 0; i < orders.length; i++) {
                orderLineBean = new Object();
                orderLineBean.Product_Name = orders[i].Product_Name;
                orderLineBean.Product_ShowName = orders[i].Product_ShowName;
                orderLineBean.S_Name = orders[i].S_Name;
                orderLineBean.ImgId = orders[i].ImgId;
                orderLineBean.Money = orders[i].Money;
                orderLineBean.Price = orders[i].Price;
                orderLineBean.Qnty = orders[i].Qnty;
                orderLineBean.ProductId = orders[i].ProductId;
                if (door === 1) {
                    orderLineBean.Shopping_CartId = orders[i].Id;
                }
                orderLineBean.OrderId = id;
                orderLineBean.MemberId = global.Storage.memberId();
                requestData[i] = orderLineBean;
            }
            this.requestAddOrderLine(requestData);
        }
        r.addToQueue();
    },

    /**
      * 新增订单明细请求
      */
    requestAddOrderLine: function (requestData) {
        let self = this;
        let door = this.data.door;
        let r = RequestWriteFactory.orderLineAddRequest(requestData);
        r.finishBlock = (req) => {
            // 查询订单详情
            self.requestOrderDetail();
        }
        r.addToQueue();
    },

    /**
     * 查询订单详情
     */
    requestOrderDetail: function () {
        let self = this;
        let id = this.data.orderId;
        let isAirProduct = this.data.isAirProduct;
        let creditChecked = this.data.creditChecked;
        let balanceChecked = this.data.balanceChecked;
        let r = RequestReadFactory.orderDetailRead(id);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                let order = datas[0];
                // 判断是否使用授信
                creditChecked = this.isUseCredit(order.UseCredit);
                // 判断是否使用钱包
                balanceChecked = this.isUseBalance(order.UseBalance);
                // 跨境订单，授信和余额为false，不能点
                if (order.Cross_Order === "True") {
                    isAirProduct = true;
                    creditChecked = false;
                    balanceChecked = false;
                }
                creditChecked = self.setCredit(order, order.Credit, order.Money1, this.isUseCredit(order.UseCredit));
                balanceChecked = self.setBalance(order, order.Balance, order.Money2, this.isUseBalance(order.UseBalance));
                self.setData({
                    'settlementList[0].value': '¥' + order.Money,
                    'settlementList[1].value': '-¥' + order.Discount,
                    'settlementList[2].value': '¥' + order.ExpressSum,
                    'settlementList[3].value': '¥' + order.Tax,
                    'settlementList[4].value': '¥' + order.BuyerCommission,
                    order: order,
                    isAirProduct: isAirProduct,
                    creditChecked: creditChecked,
                    balanceChecked: balanceChecked,
                    total: order.Due,
                })
            }
        }
        r.addToQueue();

    },

    /**
     * 修改订单
     */
    modifyOrder: function (requestData, order, door) {
        let self = this;
        let r = RequestWriteFactory.modifyOrder(requestData);
        r.finishBlock = (req) => {
            if (order.Formal === "True" && global.Tool.isValidStr(order.Due)) {
                // 订单新增成功，跳转到支付界面
                self.goConfirmPay(order);
                //如果从购物车进来，通知购物车刷新数据
                if (door === 1) {
                    Event.emit('deleteCart');//发出通知
                }
            } else {
                self.requestOrderDetail();
            }
        }
        r.addToQueue();
    },

    /**
     * 进入确认支付
     */
    goConfirmPay: function (order) {
        wx.setStorage({
            key: 'order',
            data: order,
            success: function (res) {
                wx.redirectTo({
                    url: '../pay-method/pay-method?door=0',
                })
            }
        })
    },

    /**
     *设置授信
     */
    setCredit: function (order, credit, usedCredit, isEnabled) {
        if (isEnabled) {
            order.credit = "使用授信：￥-" + usedCredit + "（余额：￥" + credit + "）";
        } else {
            order.credit = "使用授信（余额：￥" + credit + "）";
        }
        if (parseFloat(credit) <= 0) {
            isEnabled = false;
        }
        return isEnabled;
    },

    /**
     *设置钱包
     */
    setBalance: function (order, balance, usedBalance, isEnabled) {
        if (isEnabled) {
            order.balance = "使用钱包：￥-" + usedBalance + "（余额：￥" + balance + "）";
        } else {
            order.balance = "使用钱包（余额：￥" + balance + "）";
        }
        if (parseFloat(balance) <= 0) {
            isEnabled = false;
        }
        return isEnabled;
    },

    /**
     * 新增订单按钮
     */
    addOrder: function () {
        let num = this.data.num;
        let order = this.data.order;
        let isAirProduct = this.data.isAirProduct;
        let Card = this.data.addressData.Card;
        let self = this;
        // 判断有无地址
        if (num == 1) {
            // 有地址
            if (isAirProduct && global.Tool.isValidStr(Card)) {
                global.Tool.showAlert("跨境商品请使用实名认证地址!");
            } else {
                wx.showModal({
                    title: '提示',
                    content: '确认提交订单吗？',
                    success: function (res) {
                        if (res.confirm) {
                            self.submitOrder();
                        }
                    }
                })
            }
        } else {
            //无地址
            self.goAddAddress();
        }
    },

    /**
     * 无地址 进入添加地址
     */
    goAddAddress: function () {
        wx.showModal({
            title: '提示',
            content: '还没有地址，请先添加地址！',
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '../address/add-address',
                    })
                }
            }
        })
    },

    /**
     * 更新为正式订单
     */
    submitOrder: function () {
        let door = this.data.door;
        let order = this.data.order;
        let CouponId = this.data.couponData.CouponId;
        let Discount = this.data.couponData.Discount;
        let status = this.data.status;
        order.Formal = "True";
        order.Delivery_AddressId = this.data.addressData.addressId;
        if (status == 1) {
            order.CouponId = this.data.couponData.CouponId;
            order.Discount = this.data.couponData.Discount;
        }
        this.modifyOrder(order, order, door);
    },

    /**
     * 选择地址
     */
    selectAddress: function () {
        // 判断有无地址，有地址则到选择地址，无地址则到添加地址
        let num = this.data.num;
        if (num == 1) {
            // 选择地址
            wx.navigateTo({
                url: '../address/select-address/select-address',
            })
        } else {
            //添加地址
            wx.navigateTo({
                url: '../address/add-address/add-address',
            })
        }
    },

    /**
     * 选择优惠劵
     */
    selectCoupon: function () {
        let order = this.data.order;
        wx.navigateTo({
            url: '../coupon/select-coupon/select-coupon?Due=' + order.Due,

        })
    },

    /**
     * 授信开关的操作
     */
    creditSwitch: function (e) {
        let isAirProduct = this.data.isAirProduct;
        let creditChecked = this.data.creditChecked;
        let order = this.data.order;
        let door = this.data.door;
        let self = this;
        creditChecked = !creditChecked;
        // 跨境商品不能使用授信
        if (isAirProduct) {
            creditChecked = false;
        }
        // 余额小于0不能使用授信
        if (parseFloat(order.Credit) <= 0) {
            creditChecked = false;
        }
        order.UseCredit = this.getBooleanValue(creditChecked);
        // 设置状态
        this.setData({
            creditChecked: creditChecked,
            order: order,
        })
        // 设置授信和钱包的数据
        this.setCredit(order, order.Credit, self.getMoney1Value(), creditChecked);
        this.setBalance(order, order.Balance, self.getMoney2Value(), self.isUseBalance(order.UseBalance));
        // 设置支付金额
        this.getTrueMoney();
        // 修改订单
        let requestData = {
            Id: order.Id,
            UseCredit: order.UseCredit,
        };
        this.modifyOrder(requestData, order, door);
    },

    /**
     * 钱包开关的操作
     */
    balanceSwitch: function () {
        let isAirProduct = this.data.isAirProduct;
        let balanceChecked = this.data.balanceChecked;
        let order = this.data.order;
        let door = this.data.door;
        let self = this;
        balanceChecked = !balanceChecked;
        // 跨境商品不能使用钱包
        if (isAirProduct) {
            balanceChecked = false;
        }
        // 余额小于0不能使用钱包
        if (parseFloat(order.Balance) <= 0) {
            balanceChecked = false;
        }
        order.UseBalance = this.getBooleanValue(balanceChecked);
        // 设置状态
        this.setData({
            balanceChecked: balanceChecked,
            order: order,
        })
        // 设置授信和钱包的数据
        this.setCredit(order, order.Credit, self.getMoney1Value(), self.isUseCredit(order.UseCredit));
        this.setBalance(order, order.Balance, self.getMoney2Value(), balanceChecked);
        // 设置支付金额
        this.getTrueMoney();
        // 修改订单
        let requestData = {
            Id: order.Id,
            UseBalance: order.UseBalance,
        };
        this.modifyOrder(requestData, order, door);
    },

    /**
     * 判断是否使用授信
     */
    isUseCredit: function (UseCredit) {
        let isEnabled = false;
        if (UseCredit === "True") {
            isEnabled = true;
        } else {
            isEnabled = false;
        }
        return isEnabled;
    },

    /**
     * 判断是否使用钱包
     */
    isUseBalance: function (UseBalance) {
        let isEnabled = false;
        if (UseBalance === "True") {
            isEnabled = true;
        } else {
            isEnabled = false;
        }
        return isEnabled;
    },

    /**
     * 将布尔值转成字符串
     */
    getBooleanValue: function (creditChecked) {
        let isCredit = "";
        if (creditChecked) {
            isCredit = "True";
        } else {
            isCredit = "False";
        }
        return isCredit;
    },

    /**
     * 获取授信使用的金额
     */
    getMoney1Value: function () {
        let order = this.data.order;
        let credit = parseFloat(order.Credit);
        let total = parseFloat(order.Total);
        return credit >= total ? total : credit;
    },

    /**
     * 获取钱包使用的金额
     */
    getMoney2Value: function () {
        let order = this.data.order;
        let total = parseFloat(order.Total);
        let self = this;
        if (this.isUseCredit(order.UseCredit)) {
            let credit = this.getMoney1Value();
            let balance = total - credit;
            return balance > 0 ? balance : 0;
        } else {
            let balance = parseFloat(order.Balance);
            return balance >= total ? total : balance;
        }
    },

    /**
     * 获取实付金额，本地先计算
     */
    getTrueMoney: function () {
        let order = this.data.order;
        let total = parseFloat(order.Total);
        if (order.UseCredit === "True") {
            let credit = parseFloat(order.Credit);
            if (credit >= total) {
                total = 0;
            } else {
                total = total - credit;
            }
        }
        if (order.UseBalance === "True") {
            let balance = parseFloat(order.Balance);
            if (balance >= total) {
                total = 0;
            } else {
                total = total - balance;
            }
        }
        this.setData({
            total: total,
        })
    },
})