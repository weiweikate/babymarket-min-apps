import RequestLogin from '../../../network/requests/request-login';
let { Tool, Storage, Event } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuArray: [],
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLogin: Storage.didLogin()
    })

    this.initMenuArray();
    //注册通知
    Event.on('loginSuccessEvent', this.loginSuccess, this)
    Event.on('logoutEvent', this.logoutSuccess, this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    Event.off('loginSuccessEvent', this.loginSuccess)
    Event.off('logoutEvent', this.logoutSuccess)
  },

  /**
   * 登录成功
   */
  loginSuccess: function () {
    this.setData({
      isLogin: true
    })
  },

  /**
   * 退出登录成功
   */
  logoutSuccess: function () {
    this.setData({
      isLogin: false
    })
    Tool.showSuccessToast("退出登录");
  },

  /**
   * 退出登录点击
   */
  onLogoutClickListener: function () {
    //登录游客账号
    Tool.showLoading();
    this.requestLogin();
  },

  /**
   * 登录
   */
  requestLogin: function () {
    let task = new RequestLogin("guest", "appguest");
    task.finishBlock = (req) => {
      let model = req.responseObject;
      let session = model.Session;
      let key = model.Person.Key;
      let id = Tool.idFromDataKey(key);

      Storage.setCurrentSession(session);
      Storage.setDidLogin(false);
      Storage.setMemberId(id);
      Storage.setCurrentMember('');

      Event.emit('logoutEvent');//发出通知,退出登录
    };
    task.addToQueue();
  },

  /**
   * 菜单点击
   */
  onMenuItemListener: function (e) {
    let title = e.currentTarget.dataset.title;
    let url = '';
    if (title == '服务认证') {
      if (Storage.didLogin()) {
        url = '/pages/my/complete-info/complete-info';
      } else {
        url = '/pages/login/login';
      }
    } else if (title == '关于TOPMOM') {
      url = '/pages/my/about-me/about-me';
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 初始化菜单数据
   */
  initMenuArray: function () {
    let menuArray = [
      {
        title: '服务认证',
        hasArrow: true
      },
      {
        title: '关于TOPMOM',
        hasArrow: true,
        hasDivide: true
      }
    ];
    this.setData({
      menuArray: menuArray
    });
  }
})