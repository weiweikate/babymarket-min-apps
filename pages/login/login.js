import RequestLogin from '../../network/requests/request-login';
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
   * 登录
   */
  requestLogin: function (username, password, door = 0) {
    let task = new RequestLogin(username, password);
    task.finishBlock = (req) => {
      let model = req.responseObject;
      let session = model.Session;
      let key = model.Person.Key;
      let id = Tool.idFromDataKey(key);

      Storage.setCurrentSession(session);
      Storage.setDidLogin(true);
      Storage.setMemberId(id);

      Tool.showLoading();
      this.requestMemberInfo(door);
    };
    task.addToQueue();
  },

  /**
   * 登录用户信息
   */
  requestMemberInfo: function (door = 0) {
    let task = RequestReadFactory.memberInfoRead();
    task.finishBlock = (req) => {
      let datas = req.responseObject.Datas;
      if (req.responseObject.Count > 0) {
        Storage.setCurrentMember(req.responseObject.Datas[0]);

        if (door == 0) {
          Tool.showSuccessToast("登录成功！");
        } else if (door == 1) {
          Tool.showSuccessToast("注册成功！");
        }

        Tool.navigationPop();

        Event.emit('loginSuccessEvent');//发出通知
      }
    };
    task.addToQueue();
  },

  /**
   * 查询手机号是否被注册
   */
  requestCheckMemberByPhone: function (mobile) {
    let task = RequestReadFactory.checkMemberByPhone(mobile);
    task.finishBlock = (req) => {
      if (req.responseObject.Count > 0) {
        Tool.showAlert("该号码已经注册，请直接登录");
      } else {
        //获取验证码
        Tool.showLoading();
        this.requestGetCode(mobile);
      }
    };
    task.addToQueue();
  },

  /**
   * 获取验证码
   */
  requestGetCode: function (mobile) {
    let task = RequestWriteFactory.verifyCodeGet(mobile, 1);
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
   * 新增会员
   */
  requestAddMember: function (requestData) {
    let task = RequestWriteFactory.addMember(requestData);
    task.finishBlock = (req) => {
      Tool.showLoading();
      //注册成功，开始登录
      this.requestLogin(requestData.Mobile, requestData.Password, 1);
    };
    task.addToQueue();
  },

  /**
   * 登录和注册切换
   */
  onTabChangeListener: function (e) {
    let position = e.currentTarget.dataset.position;
    let currentTab = 0;
    switch (position) {
      case '0':
        currentTab = 0;
        break
      case '1':
        currentTab = 1;
        break
    }
    if (currentTab != this.data.currentTab) {
      this.setData({
        currentTab: currentTab
      });
    }
  },
  /**
   * 登录按钮点击
   */
  onLoginClickListener: function (e) {
    let userInfo = e.detail.value
    let username = userInfo.username
    let password = userInfo.password

    if (Tool.isEmptyStr(username)) {
      Tool.showAlert("请输入登录账号");
      return;
    };
    if (Tool.isEmptyStr(password)) {
      Tool.showAlert("请输入密码");
      return;
    };

    Tool.showLoading();
    this.requestLogin(username, password);
  },
  /**
   * 注册按钮点击
   */
  onRegisterClickListener: function (e) {
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
      Tool.showAlert("请输入密码");
      return;
    }

    let requestData = {
      "Mobile": mobile,
      "Password": password,
      "Password2": password,
      "CodeInput": code
    };
    Tool.showLoading();
    this.requestAddMember(requestData);
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
   * 忘记密码
   */
  onFindPasswordListener: function (e) {
    console.log('忘记密码？');
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