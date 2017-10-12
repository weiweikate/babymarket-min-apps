let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 新增咨询
   */
  requestAddTooth: function (requestData) {
    let task = RequestWriteFactory.addTooth(requestData);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("咨询成功！");
    };
    task.addToQueue();
  },

  /**
   * 提交
   */
  onSubmitAction: function (e) {
    let info = e.detail.value;

    // 判断是否填写信息
    if (Tool.isEmptyStr(info.TeethingNumber)) {
      Tool.showAlert("请填写出牙个数");
      return false;
    };
    if (Tool.isEmptyStr(info.AdvisoryDetail)) {
      Tool.showAlert("请填写咨询详情");
      return false;
    };

    // Tool.showLoading();
    // let requestData = new Object();
    // requestData.Member_MessageId = Storage.memberId();
    // requestData.TeethingNumber = info.TeethingNumber;
    // requestData.AdvisoryDetail = info.AdvisoryDetail;

    // this.requestAddTooth(requestData);
  }
})