import ImagePicker from '../../../../components/image-picker/image-picker';
let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestData: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.imagePicker = new ImagePicker(this, 1);
    let requestData = undefined;
    if (options.type == '1') {
      requestData = Storage.getterFor("baby-diary-info");
      let imageArray = [requestData.imageUrl];
      this.setData({
        requestData: requestData,
        imageArray: imageArray
      });
    } else {
      let dateString = Tool.timeStringForDate(new Date(), "YYYY-MM-DD");
      let requestData = new Object();
      requestData.PhotoDate = dateString;
      this.setData({
        requestData: requestData
      });
    }
  },

  /**
   * 日期改变
   */
  onSelectChangeListener: function (e) {
    let requestData = this.data.requestData;
    requestData.PhotoDate = e.detail.value;
    this.setData({
      requestData: requestData
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
   * 修改记录
   */
  requestModify: function (requestData, temporaryIdArray) {
    let task = RequestWriteFactory.modifyBabyDiary(requestData, temporaryIdArray);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("修改成功！");
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
      let requestData = self.data.requestData;
      requestData.Content = info.content;
      if (Tool.isEmptyStr(requestData.Id)) {
        //新增
        requestData.Id = Tool.guid();
        requestData.MemberId = Storage.memberId();
        self.requestAdd(requestData, temporaryIdArray);
      } else {
        //修改
        self.requestModify(requestData, temporaryIdArray);
      }
    });
  }
})