// 商品详情
import ProductForm from '../product-form/product-form';
import WxParse from '../../libs/wxParse/wxParse.js';

let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId: undefined,
    productInfo: undefined,
    bannerArray: [],
    userXYvalue: undefined,
    door:''
  },
  // 查询会员的婴雄联盟订单
  requestXYExchangeDetail(start,end) {
    let r = RequestReadFactory.requestXYExchangeDetail(start,end);
    r.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas;
        this.setData({
          userXYvalue: responseData[0].YXValue
        });
      }
    }
    r.addToQueue();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let productId = options.id;
    this.setData({
      productId: productId
    });
    this.setData({
      door: options.door
    });

    this.productForm = new ProductForm(this);
    this.productForm.finishBlock = (formId, innerType, quantity, price) => {
      //结束当前页面，跳转到订单确认界面
      let url = '/pages/order/order-confirm/order-confirm'
      if (this.data.productInfo.IsYXProduct == 'True'){
        url = '/pages/order/order-confirm/order-confirm?door=0'
      }
      wx.redirectTo({
        url: url
      })
    };

    this.requestProductInfo();
  },

  /**
   * 查询商品详情
   */
  requestProductInfo: function () {
    let self = this;
    let task = RequestReadFactory.productByIdRead(self.data.productId);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas[0];
        self.setData({
          productInfo: responseData
        });
        if (responseData.OutSold == "True") {
          Tool.showAlert('商品已下架', () => {
            Tool.navigationPop();
          });
        } else {
          //查询附件
          self.requestAttatchments();

          //加载详情
          WxParse.wxParse('article', 'html', responseData.Description, self, 0);
        }
        if (responseData.ActivityProduct == 'True'){
          self.requestXYExchangeDetail(responseData.StartDate.slice(0, 10), responseData.EndDate.slice(0, 10))
        } else {
          self.setData({
            userXYvalue: Storage.currentMember().YXValue
          });
        }
      } else {
        //商品不存在
        Tool.showAlert('商品不存在', () => {
          Tool.navigationPop();
        });
      }
    };
    task.addToQueue();
  },

  //附件
  requestAttatchments() {
    let self = this;
    let task = RequestReadFactory.attachmentsRead(self.data.productId, "Attachments2");
    task.finishBlock = (req) => {
      let bannerArray = req.responseObject.imageUrls;
      self.setData({
        bannerArray: bannerArray
      });
    };
    task.addToQueue();
  },

  /**
   * 进入购物车
   */
  onGoCartListener: function (e) {
    let url = '/pages/shopping-cart/shopping-cart'
    if(this.data.door == '0'){
      url = '/pages/shopping-cart/shopping-cart?door=0'
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 添加购物车
   */
  onAddCartListener: function (e) {
    this.productForm.show(0, this.data.productInfo);
  },

  /**
   * 立即兑换
   */
  onSubmitListener: function (e) {
    this.productForm.show(1, this.data.productInfo);
  }

})