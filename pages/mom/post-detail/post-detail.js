let { Tool, Storage, RequestReadFactory } = global;
import WxParse from '../../../libs/wxParse/wxParse.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: null,
    discussArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestPostDetail(options.id);
  },
  /**
   * 查询热帖
   */
  requestPostDetail: function (id) {
    let self = this;
    let task = RequestReadFactory.postDetailRead(id);
    task.finishBlock = (req) => {
      let count = req.responseObject.Count;
      if (count > 0) {
        let responseData = req.responseObject.Datas;
        let postData = responseData[0];
        this.setData({
          postData: postData
        });
        WxParse.wxParse('article', 'html', postData.Article_Content, self, 0);
      }
      self.requestPostDiscuss(id);
    };
    task.addToQueue();
  },
  /**
   * 查询热帖的评论
   */
  requestPostDiscuss: function (id) {
    let self = this;
    let task = RequestReadFactory.postDiscussRead(id);
    task.finishBlock = (req) => {
      let count = req.responseObject.Count;
      if (count > 0) {
        let responseData = req.responseObject.Datas;
        this.setData({
          discussArray: responseData
        });
      }
    };
    task.addToQueue();
  },
  /**
   * 回复
   */
  onReplyListener: function (e) {
    console.log(e)
  },
  /**
   * 评论
   */
  onDiscussListener: function (e) {
    console.log(e)
  },
  /**
   * 点赞
   */
  onPraiseListener: function (e) {
    console.log(e)
  },
  /**
   * 猜你喜欢点击，进入下个帖子
   */
  onGuessListener: function (e) {
    let postId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/mom/post-detail/post-detail?id=' + postId
    })
  }

})