let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    isTiming: false,//是否正在计时,
    time: 60,//倒数计时
    mobile: ''//注册时获取验证码用到
  },

  /**
   * 查询手机号是否被注册
   */
  requestCheckMemberByPhone: function (mobile) {
    let task = RequestReadFactory.checkMemberByPhone(mobile);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        //获取验证码
        Tool.showLoading();
        this.requestGetCode(mobile);
      } else {
        Tool.showAlert("该号码还未注册,请注册");
      }
    };
    task.addToQueue();
  },

  /**
   * 获取验证码
   */
  requestGetCode: function (mobile) {
    let task = RequestWriteFactory.verifyCodeGet(mobile, 2);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("验证码已发送");
      this.setData({
        isTiming: true,
        time: 60
      });
      this.startTiming();
    };
    task.addToQueue();
  },

  /**
   * 修改密码
   */
  requestModifyPassword: function (requestData) {
    let task = RequestWriteFactory.modifyPassword(requestData);
    task.finishBlock = (req) => {
      //修改成功，返回上一层
      Tool.showAlert("密码已修改, 请重新登录", (req) => {
        Tool.navigationPop();
      });
    };
    task.addToQueue();
  },

  /**
   * 确定按钮点击
   */
  onSubmitClickListener: function (e) {
    let userInfo = e.detail.value;
    let mobile = userInfo.mobile;
    let code = userInfo.code;
    let password = userInfo.password;

    if (Tool.isEmptyStr(mobile)) {
      Tool.showAlert("请输入手机号码");
      return;
    }
    if (mobile.length != 11) {
      Tool.showAlert("请输入正确的手机号码");
      return;
    }
    if (Tool.isEmptyStr(code)) {
      Tool.showAlert("请输入验证码");
      return;
    }
    if (Tool.isEmptyStr(password)) {
      Tool.showAlert("请输入新密码");
      return;
    }

    //新增修改密码表
    let requestData = {
      "Mobile": mobile,
      "PasswordCheck": password,
      "NewPassword": password,
      "CheckCode": code
    };
    Tool.showLoading();
    this.requestModifyPassword(requestData);
  },
  /**
   * 获取验证码
   */
  onCodeClickListener: function (e) {
    let isTiming = this.data.isTiming;
    if (!isTiming) {
      // 判断是否输入手机号码
      let mobile = this.data.mobile;
      if (Tool.isEmptyStr(mobile)) {
        Tool.showAlert("请输入手机号码");
        return;
      }
      if (mobile.length != 11) {
        Tool.showAlert("请输入正确的手机号码");
        return;
      }

      Tool.showLoading();
      this.requestCheckMemberByPhone(mobile);
    }
  },

  /**
   * 监听文本改变
   */
  onTextChangeListener: function (e) {
    let name = e.currentTarget.dataset.name;
    if (name == "mobile") {
      this.setData({
        mobile: e.detail.value
      });
    }
  },
  /**
   * 开始计时
   */
  startTiming: function () {
    let self = this;
    let time = this.data.time;
    if (time == 0) {
      time = 60;
      self.setData({
        isTiming: false,
        time: time
      });
      return;
    } else {
      time--;
    }

    setTimeout(function () {
      self.setData({
        isTiming: true,
        time: time
      });
      self.startTiming();
    }, 1000)
  }

})