/**
 * 悬浮创建按钮
 */
export default class CreateBtn {
  constructor(page, navigateUrl, icon = '/res/img/common/comm-create-icon.png') {
    this.page = page;

    this.page.setData({
      navigateUrl: navigateUrl,
      icon: icon
    })

    this.page.onCreateClickListener = this.onCreateClickListener.bind(this);
  }

  /**
   * 创建按钮点击事件
   */
  onCreateClickListener(e) {
    if (!Storage.didLogin()) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return;
    }
    wx.navigateTo({
      url: this.page.data.navigateUrl
    })
  }

  /**
   * 隐藏界面
   */
  setHide() {
    this.page.setData({
      isHide: true
    })
  }

}

