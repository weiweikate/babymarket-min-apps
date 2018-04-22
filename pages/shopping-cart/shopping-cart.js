let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartArray: [],
    isAllSelect: false, //全选
    totalPrice: 0,
    door:'' //是否从婴雄联盟页面进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      door: options.door
    });
    this.requestCartData(options.door);
  },

  /**
   * 查询购物车列表
   */
  requestCartData: function (types) {
    let task = RequestReadFactory.cartRead(types);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        cartArray: responseData
      });
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
    let url = '/pages/product-detail/product-detail?id=' + id
    if(this.data.door == '0'){
      url = url+'&door=0'
    }
    wx.navigateTo({
      url: url
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
    let requestData = [];
    let cartArray = this.data.cartArray;
    cartArray.forEach((item, index) => {
      if (item.isSelect) {
        let request = {
          'ShopCartId': item.Id,
          'MemberId': Storage.memberId(),
          'ProductId': item.ProductId,
          'ProductImgUrl': item.imageUrl,
          'ProductName': item.Name,
          'Price': item.Price,
          'Points': item.Points,
          'Qnty': item.Qnty,
          'ProductSizeId': item.ProductSizeId,
          'IsYXProduct':'False'
        };
        if(this.data.door == '0') {
          request.YXValue = item.Price
          request.IsYXProduct = 'True'
          request.YXValueSum = Number(item.Points)
        }
        requestData.push(request);
      }
    });

    if (requestData.length > 0) {
      //结束当前页面，跳转到订单确认界面
      let url = '/pages/order/order-confirm/order-confirm'
      if(this.data.door){
        url = url + '?&door=' + this.data.door + '&cartType=' + this.data.door
      }
      Storage.setterFor("orderLine", requestData);
      wx.redirectTo({
        url: url,
      })
    } else {
      Tool.showAlert("请选择购物车商品");
    }
  }

})