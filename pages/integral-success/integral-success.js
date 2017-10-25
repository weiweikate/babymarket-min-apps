Page({

  /**
   * 页面的初始数据
   */
  data: {
    productName: undefined,
    thisIntegral: 0,
    usedIntegral: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productName: options.productName,
      thisIntegral: options.BCJF,
      usedIntegral: options.usedIntegral
    });
  },

  /**
   * 继续积分
   */
  onGoOnClickListener: function () {
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
          wx.redirectTo({
            url: '/pages/code-success/code-success?code=' + code
          })
        }
      }
    })
  },
  /**
   * 关闭
   */
  onCloseClickListener: function () {
    wx.switchTab({
      url: '/pages/my/my'
    })
  },

})