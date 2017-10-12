let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
import WxParse from '../../../../libs/wxParse/wxParse.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    
    Tool.showLoading();
    this.requestKnowledgeContent(options.id);
  },
  /**
   * 查询知识内容
   */
  requestKnowledgeContent: function (id) {
    let self = this;
    let task = RequestReadFactory.knowledgeContentRead(id);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas;
        let content = responseData[0].Content;
        WxParse.wxParse('article', 'html', content, self, 5);
      }
    }
    task.addToQueue();
  }
})