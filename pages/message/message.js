let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Tool.showLoading();
    this.requestMessageData();
  },

  /**
   * 查询消息
   */
  requestMessageData: function () {
    let task = RequestReadFactory.myCollectListRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        messageArray: responseData
      });
    };
    task.addToQueue();
  },

  /**
   * 进入详情
   */
  onItemClickListener: function (e) {
    let position = e.currentTarget.dataset.position;
    let message = this.data.messageArray[position];
    let id = message.SourceId;
    let url = '';
    switch (message.SourceType) {
      case 'Knowledge':
        //进入知识详情
        url = '/pages/find/knowledge/knowledge-detail/knowledge-detail?id=' + id;
        break;
      case 'IndexArticle':
        //进入首页文章详情
        url = '/pages/mom/post-detail/post-detail?id=' + id
        break;
      case 'Article':
        //进入帖子详情
        url = '/pages/mom/post-detail/post-detail?id=' + id
        break;
    }
    if (url.length > 0) {
      wx.navigateTo({
        url: url
      })
    }
  }
})