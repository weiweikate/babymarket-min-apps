let { Tool, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartArray: [],
    isAllSelect: false, //全选
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestCartData();
  },

  /**
   * 查询购物车列表
   */
  requestCartData: function () {
    let task = RequestReadFactory.cartRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        cartArray: responseData
      });
      console.log(responseData);
    };
    task.addToQueue();
  },

  /**
   * 修改购物车数量
   */
  requestModifyQuantityCart: function (id, quantity) {
    let task = RequestWriteFactory.modifyCartQuantity(id, quantity);
    task.finishBlock = (req) => {
      this.setTotalPrice();
    };
    task.addToQueue();
  },

  /**
   * 删除购物车
   */
  requestDeleteCart: function (id, position) {
    let self = this;
    let task = RequestWriteFactory.deleteCart(id);
    task.finishBlock = (req) => {
      let cartArray = self.data.cartArray;
      cartArray.splice(position, 1);

      this.setData({
        cartArray: cartArray
      });

      self.setAllSelectStatus();
      Tool.showSuccessToast("删除成功");
    };
    task.addToQueue();
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
   * item单选
   */
  onSelectClickLitener: function (e) {
    let position = e.currentTarget.dataset.position;
    let cartArray = this.data.cartArray;
    let cartData = cartArray[position];
    cartData.isSelect = !cartData.isSelect;
    this.setData({
      cartArray: cartArray
    });
    this.setAllSelectStatus();
  },

  /**
   * 设置全选按钮状态
   */
  setAllSelectStatus: function () {
    let cartArray = this.data.cartArray;
    let selectCount = 0;
    cartArray.forEach((item, index) => {
      if (item.isSelect) {
        selectCount++;
      }
    });
    this.setData({
      isAllSelect: cartArray.length == selectCount
    });

    this.setTotalPrice();
  },

  /**
   * 设置选中的总金额
   */
  setTotalPrice: function () {
    let cartArray = this.data.cartArray;
    let totalPrice = 0;
    cartArray.forEach((item, index) => {
      if (item.isSelect) {
        totalPrice += item.Price * item.Qnty;
      }
    });
    this.setData({
      totalPrice: totalPrice
    });
  },

  /**
   * 减少数量
   */
  onQuantityMinusListener: function (e) {
    let position = e.currentTarget.dataset.position;
    let cartArray = this.data.cartArray;
    let cartData = cartArray[position];
    if (cartData.Qnty > 1) {
      cartData.Qnty--;
      this.setData({
        cartArray: cartArray
      });

      this.requestModifyQuantityCart(cartData.Id, cartData.Qnty);
    } else {
      console.log("数量不能小于1");
    }
  },

  /**
   * 增加数量
   */
  onQuantityPlusListener: function (e) {
    let position = e.currentTarget.dataset.position;
    let cartArray = this.data.cartArray;
    let cartData = cartArray[position];
    if (cartData.Qnty < 999) {
      cartData.Qnty++;
      this.setData({
        cartArray: cartArray
      });

      this.requestModifyQuantityCart(cartData.Id, cartData.Qnty);
    } else {
      console.log("数量不能大于999");
    }
  },

  /**
   * 进入商品详情
   */
  onItemClickLitener: function (e) {
    let id = e.currentTarget.dataset.productId;
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + id
    })
  },

  /**
   * item长按时间，删除
   */
  onItemLongLitener: function (e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    let position = e.currentTarget.dataset.position;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        Tool.showLoading();
        self.requestDeleteCart(id, position);
      }
    })
  },

  /**
   * 全选
   */
  onAllSelectClickLitener: function () {
    let cartArray = this.data.cartArray;
    let isAllSelect = this.data.isAllSelect;
    cartArray.forEach((item, index) => {
      item.isSelect = !isAllSelect;
    });
    this.setData({
      cartArray: cartArray,
      isAllSelect: !isAllSelect
    });
    
    this.setTotalPrice();
  },

  /**
   * 提交，去结算
   */
  onSubmitClickListener: function () {

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
  }

})