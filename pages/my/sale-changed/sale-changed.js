// pages/my/sale-changed/sale-changed.js
let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    babyAllianceList:null,
    news: [],
    babyAlliancePrdType:[],
    babyAlliancePrdList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestBabyAlliance()
    this.requestBabyAllianceAward()
    this.requestBabyAllianceProductCategory()

  },
  // 婴雄联盟
  requestBabyAlliance: function () {
    let r = RequestReadFactory.requestBabyAlliance();
    r.finishBlock = (req) => {
      let responseData = req.responseObject.Datas[0]
      responseData.PostId = global.Tool.imageURLForId(responseData.PostId);
      responseData.ValueImgId = global.Tool.imageURLForId(responseData.ValueImgId);
      responseData.RewardiconId = global.Tool.imageURLForId(responseData.RewardiconId);
      responseData.OrderIconId = global.Tool.imageURLForId(responseData.OrderIconId);
      responseData.RankIconId = global.Tool.imageURLForId(responseData.RankIconId);
      this.setData({
        babyAllianceList: responseData
      });

    };
    r.addToQueue();
  },
  // 英雄联盟战报
  requestBabyAllianceAward: function () {
    let r = RequestReadFactory.requestBabyAllianceAward();
    r.finishBlock = (req) => {
      //console.log(req)
      let news = req.responseObject.Datas
      this.setData({
        news: news
      });

    };
    r.addToQueue();
  },
  requestBabyAllianceProductCategory(){
    let self = this;
    let r = RequestReadFactory.requestBabyAllianceProductCategory();
    r.finishBlock = (req) => {
      console.log(req.responseObject.Datas)
      //查询二级分类的商品
      let responseData = req.responseObject.Datas
      this.setData({
        babyAlliancePrdType: responseData
      });
      responseData.forEach((item, index) => {
        let maxcount = undefined
        if(index==0){
          maxcount = 3
        }
        self.requestProductData(item.Id, maxcount,index);
      });
    }
    r.addToQueue();
  },
  requestProductData(id,maxcount,index){
    let task = RequestReadFactory.productByCategoryIdRead(id,maxcount);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let babyAlliancePrdList = this.data.babyAlliancePrdList
      babyAlliancePrdList[index] = responseData
      this.setData({
        babyAlliancePrdList: babyAlliancePrdList
      });
    };
    task.addToQueue();
  },
  ruleClicked(){
    wx.navigateTo({
      url: '/pages/allianceContract/allianceContract'
    })
  },
  itemClicked(e){
    if (e.currentTarget.dataset.overdue == 'True'){
      Tool.showAlert('该商品兑换活动已结束');
      return
    }
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + id+'&door=0'
    })
  },
  XYcartClicked(){
    wx.navigateTo({
      url: '/pages/shopping-cart/shopping-cart?isXYcart=true&door=0'
    })
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
  
  }
})