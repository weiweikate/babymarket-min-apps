let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
import ImagePicker from '../../../../../components/image-picker/image-picker';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.imagePicker = new ImagePicker(this);

    this.requestAdvisoryType();
  },

  /**
   * 查询咨询
   */
  requestAdvisoryType: function () {
    let task = RequestReadFactory.advisoryTypeRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let typeArray = new Array();
      responseData.forEach((item, index) => {
        console.log(item.Select.split(';'));
        switch (item.Value){
          case "0":
          //哺乳
            console.log("哺乳");
            typeArray[0] = item.Select.split(';');
          break;
          case "1":
            //排便次数
            typeArray[3] = item.Select.split(';');
            break;
          case "2":
            //辅食添加结构
            typeArray[1] = item.Select.split(';');
            break;
          case "3":
            //饮水量
            typeArray[2] = item.Select.split(';');
            break;
          case "4":
            //拉粑粑时的表情
            typeArray[4] = item.Select.split(';');
            break;
        }
      });
      this.setData({
        typeArray: typeArray
      });
      console.log(typeArray);
    }
    task.addToQueue();
  },

  /**
   * 新增咨询
   */
  requestAddAdvisory: function (requestData, temporaryIdArray) {
    let task = RequestWriteFactory.addAdvisory(requestData, temporaryIdArray);
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
    if (Tool.isEmptyStr(info.Nurse_Condition)) {
      Tool.showAlert("请选择哺乳方式");
      return false;
    };
    if (Tool.isEmptyStr(info.Milk_Powder_Brand)) {
      Tool.showAlert("请输入奶粉品牌及奶量");
      return false;
    };
    if (Tool.isEmptyStr(info.Assisted_Food)) {
      Tool.showAlert("请选择辅食添加结构");
      return false;
    };
    if (Tool.isEmptyStr(info.WaterIntake)) {
      Tool.showAlert("请选择饮水量");
      return false;
    };
    if (Tool.isEmptyStr(info.Cacation_Number)) {
      Tool.showAlert("请选择排便次数");
      return false;
    };
    if (Tool.isEmptyStr(info.Pull_Expression)) {
      Tool.showAlert("请选择拉粑粑时的表情");
      return false;
    };

    Tool.showLoading();
    self.imagePicker.onUploadAction((temporaryIdArray) => {
      let requestData = new Object();
      requestData.Id = Tool.guid();
      requestData.Member_MessageId = Storage.memberId();
      requestData.Nurse_Condition = info.Nurse_Condition;
      requestData.Milk_Powder_Brand = info.Milk_Powder_Brand;
      requestData.Assisted_Food = info.Assisted_Food;
      requestData.WaterIntake = info.WaterIntake;
      requestData.Cacation_Number = info.Cacation_Number;
      requestData.Pull_Expression = info.Pull_Expression;
      self.requestAddAdvisory(requestData, temporaryIdArray);
    });
  },

  /**
   * 添加咨询
   */
  onSelectClickListener: function (e) {
    let position = e.currentTarget.dataset.position;
    switch (position) {
      case 0:
        console.log(0)
        break;
      case 1:
        console.log(1)
        break;
      case 2:
        console.log(2)
        break;
      case 3:
        console.log(3)
        break;
      case 4:
        console.log(4)
        break;
    }
  },
})