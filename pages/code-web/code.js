Page({
  data: {
    motto: '',
    fourteenCode: undefined,
    codeType: 0
  },
  onLoad: function (options) {
    let code = options.code
    let codeType = (code.length == 14) ? 1 : 2
    let url = 'https://erp.takecare.com.cn/code/qr?' + code
    this.setData({
      fourteenCode: code,
      codeType: codeType,
      motto:url
    });
  }
})