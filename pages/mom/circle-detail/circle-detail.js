/**
 * 宝妈圈详情
 */
let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    circleData: undefined,//圈子详情数据
    postTopArray: [],//置顶帖列表
    postOtherArray: [],//其他帖子
    postAllArray: [],//全部帖子
    postEssenceArray: [],//精华帖子
    attentionId: '',//关注的ID
    isAttention: false,//是否关注
    currentTab: 0//当前选中项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })

    this.setData({
      attentionId: options.attentionId,
      isAttention: options.isAttention == "true"
    });

    let circleId = options.id;

    //查询圈子详情
    this.requestCircleDetail(circleId);
    //查询置顶帖
    this.requestPostTop(circleId);
    //查询全部帖子
    this.requestPostAll(circleId);
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
  requestCircleDetail: function (circleId) {
    let task = RequestReadFactory.circleDetailRead(circleId);
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
   * 查询置顶帖子
   */
  requestPostTop: function (circleId) {
    let task = RequestReadFactory.postTopRead(circleId);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        postTopArray: responseData
      });
    };
    task.addToQueue();
  },
  /**
   * 根据圈子ID查询所有帖子列表
   */
  requestPostAll: function (circleId) {
    let task = RequestReadFactory.postAllRead(circleId);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        postAllArray: responseData,
        postOtherArray: responseData
      });
    };
    task.addToQueue();
  },
  /**
   * 根据圈子ID查询精华帖子列表
   */
  requestPostEssence: function (circleId) {
    let task = RequestReadFactory.postEssenceRead(circleId);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        postEssenceArray: responseData,
        postOtherArray: responseData
      });
    };
    task.addToQueue();
  },
  /**
   * 新增圈子关注
   */
  requestAddCircleAttention: function (requestData) {
    let task = RequestWriteFactory.addCircleAttention(requestData);
    task.finishBlock = (req) => {
      this.setData({
        isAttention: true
      });

      Tool.showSuccessToast("已关注");

      Event.emit('refreshAttentionList');//发出通知,刷新关注列表
    };
    task.addToQueue();
  },
  /**
   * 取消圈子关注
   */
  requestDeleteCircleAttention: function (attentionId) {
    let task = RequestWriteFactory.deleteCircleAttention(attentionId);
    task.finishBlock = (req) => {
      this.setData({
        isAttention: false
      });

      Tool.showSuccessToast("取消关注");

      Event.emit('refreshAttentionList');//发出通知,刷新关注列表
    };
    task.addToQueue();
  },
  /**
  * tab切换事件
  */
  onTabChangeListener: function (e) {
    let currentTab = e.currentTarget.dataset.position;
    let circleId = this.data.circleData.Id;
    let postOtherArray = [];
    if (currentTab != this.data.currentTab) {
      switch (currentTab) {
        case "0":
          //全部帖子
          postOtherArray = this.data.postAllArray;
          if (postOtherArray.length == 0) {
            Tool.showLoading();
            this.requestPostAll(circleId);
          } else {
            this.setData({
              postOtherArray: postOtherArray
            });
          }
          break
        case "1":
          //精华帖
          postOtherArray = this.data.postEssenceArray;
          if (postOtherArray.length == 0) {
            Tool.showLoading();
            this.requestPostEssence(circleId);
          } else {
            this.setData({
              postOtherArray: postOtherArray
            });
          }
          break
      }
      this.setData({
        currentTab: currentTab
      });
    }
  },
  /**
   * 关注和取消关注
   */
  onAttentionListener: function (e) {
    let id = this.data.circleData.Id;
    let attentionId = this.data.attentionId;
    let isAttention = this.data.isAttention;
    if (Storage.didLogin()) {
      //已登录，取消关注或关注
      Tool.showLoading();

      if (isAttention) {
        //取消关注
        this.requestDeleteCircleAttention(attentionId);
      } else {
        //关注
        attentionId = Tool.guid();
        let requestData = new Object();
        requestData.Id = attentionId;
        requestData.ModuleappId = id;
        requestData.MemberId = Storage.memberId();

        this.requestAddCircleAttention(requestData);

        this.setData({
          attentionId: attentionId
        });
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  /**
   * 进入帖子详情
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    //进入帖子详情
    wx.navigateTo({
      url: '/pages/mom/post-detail/post-detail?id=' + id
    })
  }

})