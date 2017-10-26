let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: undefined,
    imagesArray: [],
    discussArray: [],
    discussContent: '',
    isExpand: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestToothDetail(options.id);
    this.requestAttachments(options.id);
  },

  /**
   * 查询咨询
   */
  requestToothDetail: function (id) {
    let self = this;
    let task = RequestReadFactory.toothDetailRead(id);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas;
        this.setData({
          detailInfo: responseData[0]
        });
        self.requestToothDiscuss(id);
      }
    }
    task.addToQueue();
  },

  /**
   * 查询留言
   */
  requestToothDiscuss: function (id) {
    let task = RequestReadFactory.toothDiscussRead(id);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        discussArray: responseData
      });
    }
    task.addToQueue();
  },

  /**
   * 新增评论
   */
  requestAddDiscuss: function (requestData) {
    let detailInfo = this.data.detailInfo;
    let self = this;
    let task = RequestWriteFactory.addToothDiscuss(requestData);
    task.finishBlock = (req) => {
      this.setData({
        discussContent: ''
      });
      Tool.showSuccessToast("留言成功！");
      self.requestToothDiscuss(detailInfo.Id);
    };
    task.addToQueue();
  },

  /**
   * 查询附件
   */
  requestAttachments: function (id) {
    let task = RequestReadFactory.attachmentsRead(id);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        imagesArray: responseData
      });
    }
    task.addToQueue();
  },

  /**
   * 附加图片的显示隐藏
   */
  onExpandListener: function (e) {
    let isExpand = this.data.isExpand
    this.setData({
      isExpand: !isExpand
    });
  },
  /**
  * 发送评论
  */
  onSendListener: function (e) {
    //必须登录才能评论
    if (Storage.didLogin()) {
      let content = e.detail.value;
      let id = e.currentTarget.dataset.id;

      if (content.length >= 10) {
        Tool.showLoading();
        let requestData = new Object();
        requestData.MemberMessageId = Storage.memberId();
        requestData.ToothAdvisoryId = id;
        requestData.Content = content;

        this.requestAddDiscuss(requestData);
      } else {
        Tool.showAlert("评论必须在10个字以上");
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
})