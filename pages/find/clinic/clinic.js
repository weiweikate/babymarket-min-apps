// clinic.js
let { Tool, Event, RequestReadFactory } = global;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listArray: [],
    currentTab: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let position = options.position
    let title = '';
    switch (position) {
      case "0":
        title = '便便诊所';
        break;
      case "1":
        title = '爱牙卫士';
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      currentTab: position
    });

    this.requestData();
  },

  /**
   * 数据请求
   */
  requestData: function () {
    let currentTab = this.data.currentTab;
    switch (currentTab) {
      case "0":
        this.requestAdvisoryInfo();
        break;
      case "1":
        this.requestToothAdvisoryInfo();
        break;
    }
  },

  /**
   * 查询咨询
   */
  requestAdvisoryInfo: function () {
    let task = RequestReadFactory.advisoryRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        listArray: responseData
      });
    }
    task.addToQueue();
  }, 
  /**
   * 查询爱牙卫士
   */
  requestToothAdvisoryInfo: function () {
    let task = RequestReadFactory.toothAdvisoryRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        listArray: responseData
      });
    }
    task.addToQueue();
  },
  /**
   * 咨询详情
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log(id);
    // if (this.data.pageType == 0) {//便便诊所
    //   wx.navigateTo({
    //     url: '../clinic/clinic-detail/clinic-detail',
    //   })
    // } else if (this.data.pageType == 1) {//爱牙卫士

    // }

  },

  /**
   * 顶部切换事件
   */
  onTabListener: function (e) {
    let position = e.currentTarget.dataset.position;
    switch (position) {
      case "0":
        //发起咨询
        break;
      case "1":
        //我的咨询
        break;
      case "2":
        //知识库
        break;
    }
  },

  /**
   * 发起咨询
   */
  add: function () {
    if (this.data.pageType == 0) {//便便诊所
      wx.navigateTo({
        url: '../clinic/add-clinic/add-clinic',
      })
    } else if (this.data.pageType == 1) {//爱牙卫士
      wx.navigateTo({
        url: '../clinic/add-tooth-concult/add-tooth-concult',
      })
    }
  },

  /**
   * 我的咨询
   */
  mine: function () {
    if (this.data.pageType == 0) {//便便诊所
      wx.navigateTo({
        url: '../clinic/my-clinic/my-clinic',
      })
    } else if (this.data.pageType == 1) {//爱牙卫士

    }
  },
  /**
   * 知识库
   */
  knowledge: function () {

  },
})