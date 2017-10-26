// my.js

let { Tool, Storage, RequestReadFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: undefined,
    menuArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initMenuArray();
    this.requestData();
  },

  /**
   * 菜单点击
   */
  onMenuItemListener: function (e) {
    let title = e.currentTarget.dataset.title;
    console.log('--------' + title);
    let url = '';
    if (title == '我的奖励') {
        url = '/pages/my/my-award/my-award'

    } else if (title == '赚金币') {
      url = '/pages/my/sign/sign'

    } else if (title == '宝宝日记') {
      url = '/pages/my/baby-diary/baby-diary'

    } else if (title == '我的秒杀') {

    } else if (title == '我的众筹') {
        url = '/pages/my/my-raise/my-raise'

    } else if (title == '我的团购') {

    } else if (title == '我的试用') {

    } else if (title == '我的积分订单') {
      url = '/pages/order/order-list/order-list'

    } else if (title == '我的问答') {
      url = '/pages/my/my-question/my-question'

    } else if (title == '发表的帖子') {
      url = '/pages/my/my-create-post/my-create-post'

    } else if (title == '回复的帖子') {
      url = '/pages/my-reply-post/my-reply-post'

    } else if (title == '收货地址管理') {
      url = '/pages/address/address'
    }

    wx.navigateTo({
        url: url,
    })
  },

  /**
   * 消息
   */
  onMessageClickListener: function () {
    wx.navigateTo({
      url: '/pages/message/message'
    })
  },

  /**
   * 扫码积分
   */
  onCodeClickListener: function () {
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        let code = '';
        if (result.length > 0) {
          //如果字符串中包含code.topmom.com.cn,那么说明是积分,跳转到扫码成功界面
          if (result.indexOf('code.topmom.com.cn') >= 0) {
            code = result.substring(result.indexOf('?') + 1);
          } else if (!result.indexOf('http') == 0) {
            code = result;
          } else {
            Tool.showAlert('二维码不符合规范');
          }
        } else {
          Tool.showAlert('二维码不符合规范');
        }
        if (code.length > 0) {
          wx.navigateTo({
            url: '/pages/code-success/code-success?code=' + code
          })
        }
      }
    })
  },

  /**
   * 设置
   */
  onSettingClickListener: function () {
    wx.navigateTo({
      url: '/pages/my/setting/setting'
    })
  },

  /**
   * 编辑资料
   */
  onEditClickListener: function () {
    wx.navigateTo({
      url: '/pages/my/edit-profile/edit-profile'
    })
  },
  /**
   * 金币
   */
  onCoinClickListener: function () {
    wx.navigateTo({
      url: '/pages/my/coins/coins'
    })
  },
  /**
   * 收藏
   */
  onCollectClickListener: function () {
    wx.navigateTo({
      url: '/pages/my/collect/collect'
    })
  },

  /**
   * 请求统一入口
   */
  requestData: function () {
    this.requestMemberInfo();
  },

  /**
   * 登录用户信息 
   */
  requestMemberInfo: function () {
    let r = RequestReadFactory.memberInfoRead();
    r.finishBlock = (req) => {
      let memberInfo = Storage.currentMember();

      this.setData({
        memberInfo: memberInfo
      });

    };
    r.addToQueue();
  },
  /**
 * 初始化菜单数据
 */
  initMenuArray: function () {
    let menuArray = [
      {
        icon: '/res/img/my/cell/my-cell-award-icon.png',
        title: '我的奖励',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-sign-icon.png',
        title: '赚金币',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-baby-diary-icon.png',
        title: '宝宝日记',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-seckill-icon.png',
        title: '我的秒杀',
        hasArrow: true,
        hasDivide: true
      },
      {
        icon: '/res/img/my/cell/my-cell-raise-icon.png',
        title: '我的众筹',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-group-buy-icon.png',
        title: '我的团购',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-free-trial-icon.png',
        title: '我的试用',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-points-order-icon.png',
        title: '我的积分订单',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-qa-icon.png',
        title: '我的问答',
        hasArrow: true,
        hasDivide: true
      },
      {
        icon: '/res/img/my/cell/my-cell-create-post-icon.png',
        title: '发表的帖子',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-reply-post-icon.png',
        title: '回复的帖子',
        hasArrow: true
      },
      {
        icon: '/res/img/my/cell/my-cell-address-icon.png',
        title: '收货地址管理',
        hasArrow: true,
        hasDivide: true
      }
    ];
    this.setData({
      menuArray: menuArray
    });
  }
})