let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
import ImagePicker from '../../../components/image-picker/image-picker';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleArray: [],
    selectCircle: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.imagePicker = new ImagePicker(this);

    //请求圈子数据
    this.requestAllCircle();
  },

  /**
   * 查询所有圈子
   */
  requestAllCircle: function () {
    let task = RequestReadFactory.allCircleRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        circleArray: responseData
      });
    };
    task.addToQueue();
  },

  /**
   * 新增帖子
   */
  requestAddPost: function (requestData, temporaryIdArray) {
    let task = RequestWriteFactory.addPost(requestData, temporaryIdArray);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("发布成功！");
      Tool.navigationPop();

      Event.emit('refreshPostList');//发出通知
    };
    task.addToQueue();
  },

  /**
   * 添加圈子
   */
  onSelectChangeListener: function (e) {
    let circleArray = this.data.circleArray;
    let selectCircle = circleArray[e.detail.value];
    this.setData({
      selectCircle: selectCircle
    });
  },

  /**
   * 提交
   */
  onSubmitAction: function (e) {
    let self = this;

    let info = e.detail.value;

    let selectCircle = this.data.selectCircle;
    if (selectCircle == undefined) {
      Tool.showAlert("请选择发帖的模块");
      return false;
    };
    if (Tool.isEmptyStr(info.title)) {
      Tool.showAlert("请输入文章标题");
      return false;
    };
    if (info.content.length < 10) {
      Tool.showAlert("发帖文字必须10字以上");
      return false;
    };

    Tool.showLoading();
    self.imagePicker.onUploadAction((temporaryIdArray) => {
      let requestData = new Object();
      requestData.Id = Tool.guid();
      requestData.ModuleappId = selectCircle.Id;
      requestData.Member_Article_SendId = Storage.memberId();
      requestData.Title_Article = info.title;
      requestData.Article_Content = info.content;
      self.requestAddPost(requestData, temporaryIdArray);
    });
  }
})