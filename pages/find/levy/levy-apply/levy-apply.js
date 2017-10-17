let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levyId:undefined,
    addressInfo: {
      'Id':'123123123123213123213',
      'Consignee': '普艳芳',
      'Mobile': '13646837967',
      'Address': '浙江省杭州市西湖区天目山路313号杭州照相机研究所8号楼培康食品'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      levyId: options.id
    });
  },

  /**
   * 地址选择
   */
  onAddressClickListener: function (e) {

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
    if (addressInfo==undefined) {
      Tool.showAlert("请选择地址");
      return false;
    };
    // 判断是否填写信息
    if (Tool.isEmptyStr(info.Content)) {
      Tool.showAlert("请填写内容");
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