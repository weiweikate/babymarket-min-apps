Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initMenuArray();
  },

  /**
   * 进入便便诊所和爱牙卫士
   */
  onTopListener: function (e) {
    let position = e.currentTarget.dataset.position;
    switch (position) {
      case "0":
        console.log("0")
        wx.navigateTo({
          url: '/pages/find/clinic/stool/stool'
        })
        break;
      case "1":
        console.log("1")
        wx.navigateTo({
          url: '/pages/find/clinic/tooth/tooth'
        })
        break;
    }
  },

  /**
   * 点击进入详情
   */
  onMenuItemListener: function (e) {
    let position = e.currentTarget.dataset.index;
    console.log("=======" + position);

    if (position == 0) {
      wx.navigateTo({
        url: '../find/lottery/lottery',
      })
    } else if (position == 1) {
    } else if (position == 2) {
    } else if (position == 3) {
    } else if (position == 4) {
      wx.navigateTo({
        url: '../find/levy/levy',
      })
    } else if (position == 5) {
      wx.navigateTo({
        url: '../find/tool/tool',
      })
    } else if (position == 6) {
    }
  },
  /**
   * 初始化菜单数据
   */
  initMenuArray: function () {
    let menuArray = [
      {
        icon: "/res/img/find/find-turnable-icon.png",
        title: "天天转盘",
        hasArrow: true
      },
      {
        icon: "/res/img/find/find-seckill-icon.png",
        title: "TOP秒杀",
        hasArrow: true
      },
      {
        icon: "/res/img/find/find-crowd-icon.png",
        title: "TOP众筹",
        hasArrow: true
      },
      {
        icon: "/res/img/find/find-top-buy-icon.png",
        title: "TOP团购",
        hasArrow: true
      },
      {
        icon: "/res/img/find/find-levy-icon.png",
        title: "黄金便征集令",
        hasArrow: true
      },
      {
        icon: "/res/img/find/find-tool-icon.png",
        title: "育儿工具",
        hasArrow: true,
        hasDivide: true
      },
      {
        icon: "/res/img/find/find-knowledge-icon.png",
        title: "知识库",
        hasArrow: true
      }
    ];
    this.setData({
      menuArray: menuArray
    });
  }
})