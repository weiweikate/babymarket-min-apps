import ImagePicker from '../../../../components/image-picker/image-picker';
let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.imagePicker = new ImagePicker(this, 1);

    let dateString = Tool.timeStringForDate(new Date(), "YYYY-MM-DD");
    this.setData({
      date: dateString
    });
  },

  /**
   * 日期改变
   */
  onSelectChangeListener: function (e) {
    this.setData({
      date: e.detail.value
    });
  },

  /**
   * 新增记录
   */
  requestAdd: function (requestData, temporaryIdArray) {
    let task = RequestWriteFactory.addBabyDiary(requestData, temporaryIdArray);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("发布成功！");
      Tool.navigationPop();

      Event.emit('refreshBabyDiaryList');//发出通知
    };
    task.addToQueue();
  },

  /**
   * 提交
   */
  onSubmitAction: function (e) {
    let self = this;

    let info = e.detail.value;

    if (Tool.isEmptyStr(info.content)) {
      Tool.showAlert("请输入内容哦~");
      return false;
    };

    Tool.showLoading();
    self.imagePicker.onUploadAction((temporaryIdArray) => {
      let requestData = new Object();
      requestData.Id = Tool.guid();
      requestData.PhotoDate = self.data.date;
      requestData.MemberId = Storage.memberId();
      requestData.Content = info.content;
      self.requestAdd(requestData, temporaryIdArray);
    });
  }
})