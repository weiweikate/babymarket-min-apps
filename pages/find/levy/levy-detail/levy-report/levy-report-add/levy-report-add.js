let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
import ImagePicker from '../../../../../../components/image-picker/image-picker';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    levyId: undefined,
    applyId: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let levyId = options.levyId;
    let applyId = options.applyId;
    this.setData({
      levyId: levyId,
      applyId: applyId
    });

    this.imagePicker = new ImagePicker(this);
  },

  /**
   * 新增试用报告
   */
  requestAdd: function (requestData, temporaryIdArray) {
    let task = RequestWriteFactory.addLevyReport(requestData, temporaryIdArray);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("提交成功！");
      Tool.navigationPop();

      Event.emit('refreshReportList');//发出通知
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
    if (Tool.isEmptyStr(info.Content)) {
      Tool.showAlert("请填写内容");
      return false;
    };

    Tool.showLoading();
    self.imagePicker.onUploadAction((temporaryIdArray) => {
      let requestData = new Object();
      requestData.Id = Tool.guid();
      requestData.MemberId = Storage.memberId();
      requestData.Content = info.Content;
      requestData.Wind_AlarmId = self.data.levyId;
      requestData.Apply_ForId = self.data.applyId;
      self.requestAdd(requestData, temporaryIdArray);
    });
  }

})