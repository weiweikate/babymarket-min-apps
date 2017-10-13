let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
import ImagePicker from '../../../../../components/image-picker/image-picker';

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
    this.imagePicker = new ImagePicker(this);
  },

  /**
   * 新增咨询
   */
  requestAddTooth: function (requestData, temporaryIdArray) {
    let task = RequestWriteFactory.addTooth(requestData, temporaryIdArray);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("咨询成功！");
      Tool.navigationPop();

      Event.emit('refreshClinicList');//发出通知
    };
    task.addToQueue();
  },

  /**
   * 提交
   */
  onSubmitAction: function (e) {
    let self = this;

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

    Tool.showLoading();
    self.imagePicker.onUploadAction((temporaryIdArray) => {
      let requestData = new Object();
      requestData.Id = Tool.guid();
      requestData.MemberId = Storage.memberId();
      requestData.TeethingNumber = info.TeethingNumber;
      requestData.AdvisoryDetail = info.AdvisoryDetail;
      self.requestAddTooth(requestData, temporaryIdArray);
    });
  }
})