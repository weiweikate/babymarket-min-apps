let { Tool, Storage, RequestReadFactory } = global;

Page({
  data: {
    //海报数据
    bannerArray: [],
    // 当前选中的tab
    currentTab: 0,
    //一级分类数据
    oneSortData: [],
    //首页标签
    targetArray: []
  },
  onLoad: function () {
    Tool.showLoading();
    this.requestOneSortData();
  },

  /**
   * 获取一级分类数据
   */
  requestOneSortData: function () {
    let task = RequestReadFactory.homeOneSortRead(1);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        oneSortData: responseData
      });

      this.requestHomeBannerData();
    };
    task.addToQueue();
  },

  /**
   * 查询首页海报数据
   */
  requestHomeBannerData: function () {
    let task = RequestReadFactory.homeBannerRead();
    task.finishBlock = (req) => {
      let bannerArray = req.responseObject.bannerArray;
      this.setData({
        bannerArray: bannerArray
      });

      this.requestHomeTargetData();
    };
    task.addToQueue();
  },

  /**
   * 查询首页标签数据
   */
  requestHomeTargetData: function () {
    let task = RequestReadFactory.homeTargetRead();
    task.finishBlock = (req) => {
      let targetArray = req.responseObject.Datas;
      this.setData({
        targetArray: targetArray
      });

      //循环请求标签产品数据
      targetArray.forEach((item, index) => {
        this.requestHomeTargetProductData(item.Id, item.ArrangementModeKey, index);
      });
    };
    task.addToQueue();
  },

  /**
   * 查询首页标签产品数据
   */
  requestHomeTargetProductData: function (id, typeId, index) {
    let task = RequestReadFactory.homeTargetProductRead(id, typeId == "1" ? 4 : 3);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let targetArray = this.data.targetArray;
      targetArray[index].productArray = responseData;
      this.setData({
        targetArray: targetArray
      });
    };
    task.addToQueue();
  },

  /**
   * 获取二级分类数据
   */
  requestTwoSortData: function (id) {
    let self = this;
    let task = RequestReadFactory.homeTwoSortRead(id);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let oneSortData = self.data.oneSortData;
      let currentTab = self.data.currentTab;
      oneSortData[currentTab].twoSortArray = responseData;
      self.setData({
        oneSortData: oneSortData
      });

      //查询二级分类的商品
      responseData.forEach((item, index) => {
        self.requestTwoSortProductData(item.Id, index);
      });
    };
    task.addToQueue();
  },

  /**
   * 获取二级分类数据
   */
  requestTwoSortProductData: function (id, index) {
    let task = RequestReadFactory.productByCategoryIdRead(id);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let oneSortData = this.data.oneSortData;
      let currentTab = this.data.currentTab;
      oneSortData[currentTab].twoSortArray[index].productArray = responseData;
      this.setData({
        oneSortData: oneSortData
      });
      console.log(oneSortData)
    };
    task.addToQueue();
  },

  /**
   * swiper切换事件
   */
  onTabChangeListener: function (e) {
    let currentIndex = e.detail.current;
    if (currentIndex == undefined) {
      currentIndex = e.currentTarget.dataset.current;
    }
    this.setData({
      currentTab: currentIndex
    });

    //如果分类的主体数据为空，那么去请求主体数据
    let oneSort = this.data.oneSortData[currentIndex];
    if (oneSort.twoSortArray == undefined && currentIndex > 0) {
      Tool.showLoading();
      this.requestTwoSortData(oneSort.Id);
    }
  },
  /**
   * 列表子视图点击事件,进入商品详情
   */
  onChildClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + id
    })
  }
})