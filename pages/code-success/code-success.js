let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fourteenCode: undefined,
    codeType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let code = options.code
      let codeType = (code.length == 14)?1:2
    this.setData({
      fourteenCode: code,
      codeType: codeType
    });
  },

  /**
  * 新增积分
  */
  requestAdd: function (requestData) {
    let task = RequestWriteFactory.addIntegral(requestData);
    task.finishBlock = (req) => {
      this.requestIntegralDetail(requestData.Id, requestData.CXSJ);
    };
    task.addToQueue();
  },

  /**
  * 查询积分
  */
  requestIntegralDetail: function (id, time) {
    let task = RequestReadFactory.integralDetailRead(id, time);
    task.finishBlock = (req, firstData) => {
      //积分成功，跳转到积分成功界面
      if (req.result) {
        //积分成功，跳转到积分成功界面
        let productName = firstData.productName;
        let thisIntegral = firstData.BCJF;
        let usedIntegral = firstData.usedIntegral;
        wx.redirectTo({
          url: '/pages/integral-success/integral-success?productName=' + productName + "&thisIntegral=" + thisIntegral + "&usedIntegral=" + usedIntegral
        })
      } else {
        //提示积分失败,有原因显示原因，没原因只提示失败
        if (req.reason.length > 0) {
          Tool.showAlert("积分失败，原因：" + req.reason);
        } else {
          Tool.showAlert("积分失败");
        }
      }
    };
    task.addToQueue();
  },

  /**
   * 提交
   */
  onSubmitAction: function (e) {
    let fourCode = e.detail.value.fourCode;
    if (this.data.codeType == 1 && fourCode.length != 4) {
      Tool.showAlert("请输入正确的后4位积分码");
      return false;
    };
    if (this.data.codeType == 2 && fourCode.length != 6) {
        Tool.showAlert("请输入正确的后6位积分码");
        return false;
    };
    let mobile = e.detail.value.mobile;
    if (Tool.isEmptyStr(mobile)) {
      Tool.showAlert("请输入手机号码");
      return false;
    };

    Tool.showLoading();
    let requestData = new Object();
    requestData.Id = Tool.guid();
    requestData.CodePart1 = this.data.fourteenCode;
    requestData.CodePart2 = fourCode;
    requestData.SJHM = mobile;
    requestData.CXSJ = Tool.getNowFormatDate();
    requestData.CXFSKey = '7';
    let memberInfo = Storage.currentMember();
    // 判断是否是店员
    if (Storage.didLogin() && memberInfo.IsSalesclerk == 'True') {
      requestData.ClerkId = memberInfo.Id;
      requestData.IsClerk = 'True';
    }
    console.log('requestData= ' + requestData);
    this.requestAdd(requestData);
  }

})