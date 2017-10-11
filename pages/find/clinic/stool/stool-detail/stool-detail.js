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
    this.requestAdvisoryDetail(options.id);
    this.requestAttachments(options.id);
  },

  /**
   * 查询咨询
   */
  requestAdvisoryDetail: function (id) {
    let self = this;
    let task = RequestReadFactory.advisoryDetailRead(id);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas;
        this.setData({
          detailInfo: responseData[0]
        });
        self.requestAdvisoryDiscuss(id);
      }
    }
    task.addToQueue();
  },

  /**
   * 查询留言
   */
  requestAdvisoryDiscuss: function (id) {
    let task = RequestReadFactory.advisoryDiscussRead(id);
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
    let task = RequestWriteFactory.addAdvisoryDiscuss(requestData);
    task.finishBlock = (req) => {
      this.setData({
        discussContent: ''
      });
      Tool.showSuccessToast("留言成功！");
      self.requestAdvisoryDiscuss(detailInfo.Id);
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
        requestData.Member_MessageId = Storage.memberId();
        requestData.AdvisoryId = id;
        requestData.Content = content;

        this.requestAddDiscuss(requestData);
      } else {
        Tool.showAlert("评论必须在10个字以上");
      }
    } else {
      Tool.showAlert("请先登录");
    }
  }
})