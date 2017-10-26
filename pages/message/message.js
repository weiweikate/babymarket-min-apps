let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Tool.showLoading();
    this.requestMessageData();
  },

  /**
   * 查询消息
   */
  requestMessageData: function () {
    let task = RequestReadFactory.messageRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        messageArray: responseData
      });

      this.requestAddMessageBatch();
    };
    task.addToQueue();
  },

  /**
   * 新增消息阅读
   */
  requestAddMessageBatch: function () {
    let responseData = new Object();
    responseData.CreatorId = Storage.memberId();
    let task = RequestWriteFactory.addMessageBatch(responseData);
    task.addToQueue();
  },

  /**
   * 进入详情
   */
  onItemClickListener: function (e) {
    let position = e.currentTarget.dataset.position;
    let message = this.data.messageArray[position];
    let id = message.RelevancyId;
    if (Tool.isEmptyId(id)) {
      return;
    }
    let url = '';
    switch (message.RelevancyType) {
      case 'BreedQueAns':
        //孕育问答(问题详情)
        url = '/pages/question/question-detail/question-detail?Id=' + id;
        break;
      case 'IndexArticle':
        //首页文章(当天)
        url = '/pages/index/index-artical/index-artical?Id=' + id +"&title=文章详情";
        break;
      case 'ToothAdvisory':
      case 'ToothAdvisoryMessage':
        // 爱牙咨询(问题详情)   爱牙咨询(回复留言)
        url = '/pages/find/clinic/tooth/tooth-detail/tooth-detail?id=' + id;
        break;
      case 'Article':
        // 帖子文章(问题详情)
        url = '/pages/mom/post-detail/post-detail?id=' + id;
        break;
      case 'Advisory':
      case 'Advisory_Message':
        // 便便咨询(问题详情) 便便咨询(回复留言)
        url = '/pages/find/clinic/stool/stool-detail/stool-detail?id=' + id;
        break;
      case 'Crowd_Order':
        // 众筹订单(订单详情)
        url = '';
        break;
      case 'ExchangeOrder':
        // 兑换订单(订单详情)
        url = '';
        break;
      case 'Seckill_Order':
        // 秒杀订单(订单详情)
        url = '';
        break;
      case 'Apply_For':
        // 试用订单(订单详情)
        url = '';
        break;
      case 'Wind_Alarm':
        // 征集令(征集令主页)
        url = '/pages/find/levy/levy';
        break;
      case 'Crowd_Funding':
        // 众筹表(众筹主页)
        url = '/pages/find/raise/raise';
        break;
      case 'Seckill_Product':
        // 秒杀商品表(秒杀主页)
        url = '/pages/find/second-kill/second-kill';
        break;
    }
    if (url.length > 0) {
      wx.navigateTo({
        url: url
      })
    }
  }
})