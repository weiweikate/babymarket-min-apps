// my.js

let { Tool, Storage, RequestReadFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuArray: [],
    nickName: '',
    avatarUrl: '/res/img/common/common-avatar-default-icon.png',
    sign: '',
    shopName: '',
    idDesp: '',
    inviteCode: '',
    points: '12367',
    coins: '500',
    fav: '10'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initMenuArray();
    this.requestData();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  coinsTap: function () {
    wx.navigateTo({
      url: '../my/coins/coins',
    })
  },

  favTap: function () {
    wx.navigateTo({
      url: '../my/my-fav/my-fav',
    })
  },

  /**
   * 菜单点击
   */
  onMenuItemListener: function (e) {
    let title = e.currentTarget.dataset.title;
    console.log('--------' + title);
    if (title == '我的奖励') {
      wx.navigateTo({
        url: '../my/my-award/my-award',
      })

    } else if (title == '赚金币') {
      wx.navigateTo({
        url: '../my/sign/sign',
      })

    } else if (title == '宝宝日记') {
      wx.navigateTo({
        url: '../my/baby-diary/baby-diary',
      })

    } else if (title == '我的秒杀') {

    } else if (title == '我的众筹') {

    } else if (title == '我的团购') {

    } else if (title == '我的试用') {

    } else if (title == '我的积分订单') {
      wx.navigateTo({
        url: '/pages/order/order-list/order-list'
      })

    } else if (title == '我的问答') {
      wx.navigateTo({
        url: '../my/my-question/my-question',
      })

    } else if (title == '发表的帖子') {
      wx.navigateTo({
        url: '/pages/my/my-create-post/my-create-post',
      })

    } else if (title == '回复的帖子') {
      wx.navigateTo({
        url: '../my/my-reply-post/my-reply-post',
      })

    } else if (title == '收货地址管理') {
      wx.navigateTo({
        url: '../address/address',
      })
    }
  },

  /**
   * 消息
   */
  messageTap: function () {
    console.log('----消息----');
  },

  /**
   * 设置
   */
  settingTap: function () {
    console.log('----设置----');

    wx.navigateTo({
      url: '../my/setting/setting',
    })
  },

  /**
   * 编辑资料
   */
  editProfileTap: function () {
    console.log('----编辑资料----');

    wx.navigateTo({
      url: '../my/edit-profile/edit-profile',
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
      let datas = req.responseObject.Datas;
      datas.forEach((item, index) => {

        //是否为内部员工
        Storage.setInsideMember(item.Inside);

        //头像url
        let url = Tool.imageURLForId(item.PictureId);

        //身份描述设置
        let name = '';
        let desp = '';
        if (item.MemberTypeKey == 0) {//普通员工
          name = item.Nickname;
        } else if (item.MemberTypeKey == 1 || item.MemberTypeKey == 3) {//内部员工和门店
          name = item.ShopName;
          desp = '零售合伙人';
        } else if (item.MemberTypeKey == 2) {//经销商
          name = item.ShopName;
          desp = '城市合伙人';

        }

        this.setData({
          nickName: item.Nickname,
          sign: item.Sign,
          avatarUrl: url,
          shopName: name,
          idDesp: desp,
          inviteCode: item.InvitationCode,
          'myDatasItems0[1].detail.amount': item.Balance,
          'myDatasItems0[2].detail.amount': item.Commission,
          'myDatasItems0[3].detail.amount': item.BuyerCommission,
          'myDatasItems0[4].detail.amount': item.PartnerCommission,
          'myDatasItems1[0].detail.amount': item.FirstFriend,
          'myDatasItems1[1].detail.amount': item.ShopPersonCount,
          'myDatasItems1[2].detail.amount': item.SecondFriends,
        });

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