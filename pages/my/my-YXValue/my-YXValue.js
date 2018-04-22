// pages/my/my-YXValue/my-YXValue.js
let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFilterVisiable: false,
    selectMonth:'2018-4',
    YXValueLog:'',
    totalXYValue:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestTotalYXValue()
    this.requestBabyYXValueMonthSum()
  },
  requestTotalYXValue(){
    // 获取总的婴雄值
    let r = RequestReadFactory.requestTotalYXValue();
    r.finishBlock = (req) => {
      //console.log(req.responseObject.Datas)
      let totalXYValue = req.responseObject.Datas[0]
      this.setData({
        totalXYValue: totalXYValue.TrueValue
      });

    };
    r.addToQueue();
  },
  requestBabyYXValueMonthSum(month){
    // 按月获取明细
    let r = RequestReadFactory.requestYXValueMonthSum(month);
    r.finishBlock = (req) => {
      //console.log(req.responseObject.Datas)
      let YXValueLog = req.responseObject.Datas
      this.setData({
        YXValueLog: YXValueLog
      });

    };
    r.addToQueue();
  },
  filterClicked() {
    this.setData({
      isFilterVisiable: true,
    })
  },
  dismissFilterClicked(e) {
    this.setData({
      isFilterVisiable: false,
    })
  },
  datePickerChange(e) {
    console.log('datePickerChange:', e.detail.value)
    this.setData({
      selectMonth: e.detail.value
    })
    this.requestBabyYXValueMonthSum(e.detail.value)
  },
  cellClicked(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let section = parseInt(e.currentTarget.dataset.section);
    let item = this.data.YXValueLog[section].LogDetail[index];
    let value = item.Reduce < 0 ? item.Reduce : item.Increase
    wx.navigateTo({
      url: '/pages/my/my-YXValue/detail/award-detail/award-detail?Id=' + item.OrignId + '&title=' + item.Title + '&value=' + value + '&iconUrl=' + item.IconId
    })
  },
  thumbClicked(e){
    let index = e.detail.index;
    let thumb = e.detail.thumb;
    wx.navigateTo({
      url: '/pages/my/my-YXValue/detail/type-detail/type-detail?key=' + thumb.Value + '&type=' + thumb.Name + '&icon=' + thumb.IconId
    })
    this.dismissFilterClicked();
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