let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })

    Tool.showLoading();
    this.requestData(options);
  },

  /**
   * 数据请求
   */
  requestData: function (options) {
    this.requestKnowledgeList(options.id);
  },

  /**
   * 查询知识列表
   */
  requestKnowledgeList: function (specialId) {
    let task = RequestReadFactory.knowledgeListRead(specialId);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        listArray: responseData
      });
    }
    task.addToQueue();
  },
  /**
   * 知识详情
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/find/knowledge/knowledge-detail/knowledge-detail?id=' + id + "&title=" + title
    })
  },
})