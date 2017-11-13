let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
import WxParse from '../../../../libs/wxParse/wxParse.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  title:'',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.title = options.title
    wx.setNavigationBarTitle({
      title: options.title
    })
    
    Tool.showLoading();
    this.requestKnowledgeContent(options.id);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
          title: this.title,
          path: '/pages/find/knowledge-detail/knowledge-detail',
          success: function (res) {
              // 转发成功
          },
          fail: function (res) {
              // 转发失败
          }
      }
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