//宝妈圈
let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Tool.showLoading();
    this.requestPost();
  },
  /**
   * 查询我发表的帖子
   */
  requestPost: function () {
    let task = RequestReadFactory.postMyRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;

      this.setData({
        postArray: responseData
      });
    };
    task.addToQueue();
  },
  /**
   * item点击事件
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    //进入帖子详情
    wx.navigateTo({
      url: '/pages/mom/post-detail/post-detail?id=' + id
    })
  },
})