let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: undefined,
    selectRegion: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (global.Tool.isValidStr(options)) {
      let addressInfo = JSON.parse(options.extra);
      if (global.Tool.isValidObject(addressInfo)) {
        let selectRegion = new Object();
        selectRegion.Id = addressInfo.AreaId;
        selectRegion.FullName = addressInfo.Name;
        this.setData({
          selectRegion: selectRegion,
          addressInfo: addressInfo
        })
        wx.setNavigationBarTitle({
          title: "修改收货地址"
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let area = this.data.area;
    if (global.Tool.isValidObject(area)) {
      this.setData({
        selectRegion: area
      })
    }
  },

  /**
  * 新增地址
  */
  requestAdd: function (requestData) {
    let task = RequestWriteFactory.addAddress(requestData);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("新增成功！");
      Tool.navigationPop();

      Event.emit('refreshAddressList');//发出通知
    };
    task.addToQueue();
  },

  /**
  * 修改地址
  */
  requestModify: function (requestData) {
    let task = RequestWriteFactory.modifyAddress(requestData);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("修改成功！");
      Tool.navigationPop();

      Event.emit('refreshAddressList');//发出通知
    };
    task.addToQueue();
  },

  /**
   * 添加地址
   */
  onSubmitAction: function (e) {
    let info = e.detail.value;

    if (Tool.isEmptyStr(info.Consignee)) {
      Tool.showAlert("请填写收货人姓名");
      return false;
    };
    if (Tool.isEmptyStr(info.Mobile)) {
      Tool.showAlert("请填写收货人手机号码");
      return false;
    };
    if (Tool.isEmptyStr(info.Address)) {
      Tool.showAlert("请选择省市区");
      return false;
    };
    if (Tool.isEmptyStr(info.Street)) {
      Tool.showAlert("请填写详细地址");
      return false;
    };

    Tool.showLoading();
    let requestData = new Object();
    requestData.MemberId = Storage.memberId();
    requestData.Consignee = info.Consignee;
    requestData.Mobile = info.Mobile;
    requestData.Street = info.Street;
    requestData.Name = info.Address;
    requestData.ReciptAddress = info.Address + " " + info.Street;
    requestData.AreaId = this.data.selectRegion.Id;

    let addressInfo = this.data.addressInfo;
    if (addressInfo == undefined) {
      //新增
      this.requestAdd(requestData);
    } else {
      //修改
      requestData.Id = addressInfo.Id;
      this.requestModify(requestData);
    }
  },

  /**
   * 选择省市区
   */
  onSelectClickListener: function (e) {
    wx.navigateTo({
      url: '/pages/address/select-provinces/select-provinces',
    })
  }

})