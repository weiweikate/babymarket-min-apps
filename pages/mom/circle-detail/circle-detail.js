/**
 * 宝妈圈详情
 */
let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    circleData: undefined,//圈子详情数据
    attentionId: '',//关注的ID
    isAttention: false,//是否关注
    currentTab: 0//当前选中项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title,
      attentionId: options.attentionId,
      isAttention: options.attention
    })

    //查询圈子详情
    this.requestCircleDetail(options.id);
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
 * 查询圈子详情
 */
  requestCircleDetail: function (id) {
    let task = RequestReadFactory.circleDetailRead(id);
    task.finishBlock = (req) => {
      let count = req.responseObject.Count;
      if (count > 0) {
        let circleData = req.responseObject.Datas[0];
        this.setData({
          circleData: circleData
        });
      }
    };
    task.addToQueue();
  },

  /**
  * tab切换事件
  */
  onTabChangeListener: function (e) {
    let currentTab = e.currentTarget.dataset.position;
    switch (currentTab) {
      case "0":
        //全部帖子
        console.log("全部帖子");
        break
      case "1":
        //精华帖
        console.log("精华帖");
        break
    }
    this.setData({
      currentTab: currentTab
    });
  },

})