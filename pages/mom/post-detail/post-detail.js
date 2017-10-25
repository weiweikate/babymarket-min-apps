let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
import WxParse from '../../../libs/wxParse/wxParse.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: null,
    discussArray: [],
    focus: false,
    discussContent: '',
    discussHint: '添加回复',
    discussId: '',
    isPraise: false,
    isCollect: false,
    collectId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询帖子详情
    this.requestPostDetail(options.id);
    if (Storage.didLogin()) {
      //查询帖子是否被我点赞
      this.requestIsPostPraiseRead(options.id);
      //查询帖子是否被我收藏
      this.requestIsPostCollectRead(options.id);
    }
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
        WxParse.wxParse('article', 'html', postData.Article_Content, self, 5);
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
   * 新增热帖评论
   */
  requestAddPostDiscuss: function (requestData) {
    let post = this.data.postData;
    let self = this;
    let task = RequestWriteFactory.addPostDiscuss(requestData);
    task.finishBlock = (req) => {
      this.setData({
        focus: false,
        discussContent: '',
        discussHint: '添加回复',
        discussId: ''
      });
      self.requestPostDiscuss(post.Id);
    };
    task.addToQueue();
  },
  /**
   * 查询帖子是否被我点赞
   */
  requestIsPostPraiseRead: function (postId) {
    let task = RequestReadFactory.isPostPraiseRead(postId);
    task.finishBlock = (req) => {
      let isPraise = req.responseObject.isPraise;
      this.setData({
        isPraise: isPraise
      });
    };
    task.addToQueue();
  },
  /**
   * 新增热帖点赞
   */
  requestAddPostPraise: function (requestData) {
    let task = RequestWriteFactory.addPostPraise(requestData);
    task.finishBlock = (req) => {
      this.setData({
        isPraise: true
      });
      Tool.showSuccessToast("已点赞");
    };
    task.addToQueue();
  },
  /**
   * 查询帖子是否被我收藏
   */
  requestIsPostCollectRead: function (postId) {
    let task = RequestReadFactory.isPostCollectRead(postId);
    task.finishBlock = (req) => {
      let isCollect = req.responseObject.isCollect;
      let collectId = req.responseObject.collectId;
      this.setData({
        isCollect: isCollect,
        collectId: collectId
      });
    };
    task.addToQueue();
  },
  /**
   * 新增热帖收藏
   */
  requestAddPostCollect: function (requestData) {
    let task = RequestWriteFactory.addPostCollect(requestData);
    task.finishBlock = (req) => {
      this.setData({
        isCollect: true
      });
      Tool.showSuccessToast("已收藏");
    };
    task.addToQueue();
  },
  /**
  * 删除热帖收藏
  */
  requestDeletePostCollect: function (collectId) {
    let task = RequestWriteFactory.deletePostCollect(collectId);
    task.finishBlock = (req) => {
      this.setData({
        isCollect: false
      });
      Tool.showSuccessToast("取消收藏");
    };
    task.addToQueue();
  },
  /**
   * 回复
   */
  onReplyListener: function (e) {
    if (Storage.didLogin()) {
      let discussId = e.currentTarget.dataset.id;
      let discussName = e.currentTarget.dataset.name;
      let focus = this.data.focus;
      if (!focus) {
        this.setData({
          focus: true,
          discussHint: '回复' + discussName,
          discussId: discussId
        });
      }
    } else {
      Tool.showAlert("请先登录");
    }
  },
  /**
   * 评论
   */
  onDiscussListener: function (e) {
    if (Storage.didLogin()) {
      let focus = this.data.focus;
      if (!focus) {
        this.setData({
          focus: true,
          discussHint: '添加回复',
          discussId: ''
        });
      }
    } else {
      Tool.showAlert("请先登录");
    }
  },
  /**
   * 收藏
   */
  onCollectListener: function (e) {
    if (Storage.didLogin()) {
      let isCollect = this.data.isCollect;
      let collectId = this.data.collectId;
      if (isCollect) {
        //取消收藏
        this.requestDeletePostCollect(collectId);

        this.setData({
          collectId: ''
        });
      } else {
        //新增收藏
        collectId = Tool.guid();

        Tool.showLoading();
        let requestData = new Object();
        requestData.Id = collectId;
        requestData.SourceId = e.currentTarget.dataset.id;
        requestData.SourceType = "Article";
        requestData.Collect_MemberId = Storage.memberId();

        this.requestAddPostCollect(requestData);

        this.setData({
          collectId: collectId
        });
      }
    } else {
      Tool.showAlert("请先登录");
    }
  },
  /**
   * 点赞
   */
  onPraiseListener: function (e) {
    let isPraise = this.data.isPraise;
    if (!isPraise) {
      if (Storage.didLogin()) {
        //新增点赞
        Tool.showLoading();
        let requestData = new Object();
        requestData.MemberId = Storage.memberId();
        requestData.ArticleId = e.currentTarget.dataset.id;

        this.requestAddPostPraise(requestData);
      } else {
        Tool.showAlert("请先登录");
      }
    }
  },
  /**
   * 猜你喜欢点击，进入下个帖子
   */
  onGuessListener: function (e) {
    let postId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/mom/post-detail/post-detail?id=' + postId
    })
  },
  /**
   * 发送回复或者评论监听
   */
  onSendListener: function (e) {
    //必须登录才能评论
    if (Storage.didLogin()) {
      let content = e.detail.value;
      let postId = e.currentTarget.dataset.postId;
      let discussId = this.data.discussId;

      if (content.length > 0) {
        Tool.showLoading();
        let requestData = new Object();
        requestData.Replier_MemberId = Storage.memberId();
        requestData.Belong_ArticleId = postId;
        requestData.Commemt_Content = content;
        requestData.BelongCommentId = discussId;

        this.requestAddPostDiscuss(requestData);
      }
    } else {
      Tool.showAlert("请先登录");
    }
  },
  /**
   * 聚焦监听
   */
  onFocusListener: function (e) {
  },
  /**
   * 失去焦点监听
   */
  onFocusNoListener: function (e) {
    this.setData({
      focus: false,
      discussHint: '添加回复',
      discussId: ''
    });
  }

})