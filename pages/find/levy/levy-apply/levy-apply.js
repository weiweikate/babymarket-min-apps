let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levyId: undefined,
    addressInfo: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      levyId: options.id
    });

    this.requestAddressInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let addressInfo = this.data.addressInfo;
    if (global.Tool.isValidObject(addressInfo)) {
      this.setData({
        addressInfo: addressInfo
      })
    }
  },

  /**
   * 查询地址
   */
  requestAddressInfo: function () {
    let self = this;
    let r = RequestReadFactory.addressRead();
    r.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        let responseData = req.responseObject.Datas;
        this.setData({
          addressInfo: responseData[0]
        });
      }
    }
    r.addToQueue();
  },

  /**
   * 地址选择
   */
  onAddressClickListener: function (e) {
    wx.navigateTo({
      url: '/pages/address/address?door=1'
    })
  },

  /**
  * 新增申请
  */
  requestAdd: function (requestData) {
    let task = RequestWriteFactory.addLevyApply(requestData);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("提交成功！");
      Tool.navigationPop();

      Event.emit('refreshApplyList');//发出通知
    };
    task.addToQueue();
  },

  /**
   * 提交
   */
  onSubmitAction: function (e) {
    let info = e.detail.value;
    let addressInfo = this.data.addressInfo;

    // 判断地址填写信息
    if (addressInfo == undefined) {
      Tool.showAlert("请选择地址");
      return false;
    };
    // 判断是否填写信息
    if (Tool.isEmptyStr(info.Content)) {
      Tool.showAlert("请填写申请理由");
      return false;
    };

    Tool.showLoading();
    let requestData = new Object();
    requestData.MemberId = Storage.memberId();
    requestData.Wind_AlarmId = this.data.levyId;
    requestData.ReceiptAddressId = addressInfo.Id;
    requestData.Reason = info.Content;

    this.requestAdd(requestData);
  }
})