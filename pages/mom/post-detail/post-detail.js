let { Tool, Storage, RequestReadFactory } = global;
import WxParse from '../../../libs/wxParse/wxParse.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let self = this;

    // let urlStr = "http://mobile.topmom.com.cn/ArticleShare.aspx?Id=" + options.id;
    // if (Storage.didLogin()) {
    //   urlStr += "&MemberId=" + Storage.memberId();
    // }
    // wx.request({
    //   url: urlStr,
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     let response = res.data;
    //     let arry = response.split('<div class="ImgM" style="font-family: 微软雅黑;font-size: 16px;">');
    //     let html = arry[1];
    //     WxParse.wxParse('article', 'html', html, self, 0);
    //   }
    // })
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
    };
    task.addToQueue();
  },

})