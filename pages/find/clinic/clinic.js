// clinic.js
let { Tool, Event, RequestReadFactory } = global;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listArray: [],
    dataIndex: 0,
    totalNum: 0,
    currentTab: 0
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    // this.requestData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //this.requestAdvisoryMoreInfo();
  },

  /**
   * 数据请求
   */
  requestData: function () {
    // 清空数据
    this.setData({
      listArray: [],
    });
    //this.requestAdvisoryInfo();
  },

  /**
   * 查询咨询
   */
  requestAdvisoryInfo: function () {
    let self = this;
    let r = RequestReadFactory.advisoryRead();
    r.finishBlock = (req) => {
      let datas = req.responseObject.Datas;
      let totalNum = req.responseObject.Total;
      if (datas.length > 0) {
        for (let j = 0; j < datas.length; j++) {
          datas[j].image = global.Tool.imageURLForId(datas[j].Head_PictureId);
        }
        this.setData({
          hasList: true,
          listArray: datas,
          dataIndex: datas.length,
          totalNum: totalNum,
        });
      } else {
        this.setData({
          hasList: false,
          listArray: [],
        });
      }
    }
    r.addToQueue();
  },

  /**
   * 查询咨询(上拉加载)
   */
  requestAdvisoryMoreInfo: function () {
    let self = this;
    let r = RequestReadFactory.advisoryRead(this.data.dataIndex);
    r.finishBlock = (req) => {
      let datas = req.responseObject.Datas;
      if (datas.length > 0) {
        for (let j = 0; j < datas.length; j++) {
          datas[j].image = global.Tool.imageURLForId(datas[j].Head_PictureId);
        }
        let totalDatas = self.data.carts.concat(datas);
        this.setData({
          hasList: true,
          listArray: totalDatas,
          dataIndex: this.data.dataIndex + datas.length,
        });
      }
    }
    r.addToQueue();
  },

  /**
   * 咨询详情
   */
  goDetail: function () {
    if (this.data.pageType == 0) {//便便诊所
      wx.navigateTo({
        url: '../clinic/clinic-detail/clinic-detail',
      })
    } else if (this.data.pageType == 1) {//爱牙卫士

    }

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