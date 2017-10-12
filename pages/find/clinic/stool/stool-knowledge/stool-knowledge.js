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
    this.requestData();
  },

  /**
   * 数据请求
   */
  requestData: function () {
    this.requestKnowledge(4);
  },

  /**
   * 查询知识库
   */
  requestKnowledge: function (key) {
    let task = RequestReadFactory.knowledgeRead(key);
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
      url: '/pages/find/knowledge/knowledge-list/knowledge-list?id=' + id + "&title=" + title
    })
  },
})