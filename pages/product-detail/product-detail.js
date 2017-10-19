// 商品详情
import ProductSpecification from '../../components/product-specification/product-specification';
import WxParse from '../../libs/wxParse/wxParse.js';

let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId: undefined,
    productInfo: undefined,
    bannerArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let productId = options.id;
    this.setData({
      productId: productId
    });

    // let self = this;
    // this.productSpecification = new ProductSpecification(this, productId);
    // this.productSpecification.finishBlock = (specificationId, product, count, price) => {
    // };

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
        if (responseData.OutSold=="True"){
          Tool.showAlert('商品已下架', () =>{
            Tool.navigationPop();
          });
        }else{
          //查询附件
          self.requestAttatchments();

          //加载详情
          WxParse.wxParse('article', 'html', responseData.Description, self, 0);
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
    let task = RequestReadFactory.attachmentsRead(self.data.productId,"Attachments2");
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
    console.log("进入购物车");

    global.Tool.switchTab('/pages/shopping-cart/shopping-cart');
  },

  /**
   * 添加购物车
   */
  onAddCartListener: function (e) {
    console.log("添加购物车")
    this.productSpecification.showWithAction('ShoppingCart');
  },

  /**
   * 确认下单
   */
  onSubmitListener: function (e) {
    console.log("确认下单")
    this.productSpecification.showWithAction('Buy');
  }

})