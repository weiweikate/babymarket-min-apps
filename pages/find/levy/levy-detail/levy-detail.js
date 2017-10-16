import RequestGetSystemTime from '../../../../network/requests/request-get-system-time';
let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: undefined,
    bannerArray: [],
    menuArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initMenuArray();
    this.requestSystemTime(options.id);
  },
  /**
   * 获取平台时间
   */
  requestSystemTime: function (id) {
    let task = new RequestGetSystemTime();
    task.finishBlock = (req) => {
      let time = req.responseObject.Now;
      if (Storage.didLogin()) {
        //先查询申请列表
        this.requestApplyList(id, time);
      } else {
        this.requestLevy(id, time);
      }
    }
    task.addToQueue();
  },
  /**
   * 获取我的申请
   */
  requestApplyList: function (id, time) {
    let task = RequestReadFactory.levyApplyRead(id);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        this.requestLevy(id, time, req.responseObject.Datas[0]);
      } else {
        this.requestLevy(id, time);
      }
    }
    task.addToQueue();
  },

  /**
   * 黄金便征集令查询
   */
  requestLevy: function (id, time, apply) {
    let task = RequestReadFactory.levyDetailRead(id, time, apply);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas[0];
        this.setData({
          detailInfo: responseData
        });
        this.requestAttachments(responseData.ProductId);
      }
    }
    task.addToQueue();
  },

  /**
   * 查询附件
   */
  requestAttachments: function (id) {
    let task = RequestReadFactory.attachmentsRead(id, 'Attachments2');
    task.finishBlock = (req) => {
      let imageUrls = req.responseObject.imageUrls;
      this.setData({
        bannerArray: imageUrls
      });
    }
    task.addToQueue();
  },

  /**
   * 立即申请
   */
  onApplyClickListener: function (e) {
    let typed = e.currentTarget.dataset.type;
    switch (typed) {
      case 0:
        if (Storage.didLogin()) {
          //立即申请
          wx.navigateTo({
            url: '/pages/find/levy/levy-apply/levy-apply',
          })
        } else {
          //请先登录
          Tool.showAlert("请先登录");
        }
        break;
      case 1:
        //已结束
        Tool.showAlert('该商品申请已结束');
        break;
      case 2:
        //已申请
        Tool.showAlert('您已申请了该商品');
        break;
    }
  },

  /**
   * 点击进入详情
   */
  onMenuItemListener: function (e) {
    let position = e.currentTarget.dataset.position;
    let url = undefined;
    switch (position) {
      case 0:
        //图文详情
        let id = this.data.detailInfo.Id;
        url = '/pages/find/levy/levy-product-detail/levy-product-detail?id=' + id;
        break;
      case 1:
        //用户的试用报告
        url = '/pages/find/levy/levy-report/levy-report';
        break;
      case 2:
        //中奖的用户
        url = '/pages/find/levy/levy-winner/levy-winner';
        break;
      case 3:
        //试用规则
        break;
    }
    if (url != undefined) {
      wx.navigateTo({
        url: url
      })
    }
  },

  /**
   * 初始化菜单数据
   */
  initMenuArray: function () {
    let menuArray = [
      {
        title: "图文详情",
        hasArrow: true
      },
      {
        title: "用户的试用报告",
        hasArrow: true
      },
      {
        title: "中奖的用户",
        hasArrow: true
      },
      {
        title: "试用规则",
        hasArrow: true
      }
    ];
    this.setData({
      menuArray: menuArray
    });
  }
})