// my-property.js
let {Tool, RequestReadFactory, Event} = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      listDatas:[],
      balance:'',
      index:0,
      noMoreData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      Event.on('addWithdrawFinish', this.requestData, this)
      this.requestData();
      let self = this;
      wx.getStorage({
          key: 'memberInfo',
          success: function (res) {
              self.setData({
                  balance: res.data.Balance
              })
          },
      })
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
      Event.off('addWithdrawFinish', this.requestData)
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
      if (!this.data.noMoreData){
          this.loadMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 提现
   */
  withdrawTap:function(){
    wx.navigateTo({
        url: '../withdraw/withdraw',
    })
  },

  /**
    * 我的资产查询
    */
  requestData: function () {
      let r = RequestReadFactory.myPropertyRead(0);
      r.finishBlock = (req) => {
          let datas = req.responseObject.Datas;
          let total = req.responseObject.Total;

          for(let i = 0; i < datas.length; i++){
            let property = datas[i];
            let date = property.Month;
            let month = date.substring(0,7);
            property.dealMonth = month;

            let details = property.Detail;
            for (let j = 0; j < details.length; j++){
                let detail = details[j];
                let dateTime = detail.DateTime;
                let date = dateTime.substring(0, 10);
                let time = dateTime.substring(11);
                detail.date = date;
                detail.time = time;
            }
          }

          let nomoredata = false;
          if(datas.length >= total){
            nomoredata = true;
          }
          this.setData({
              'listDatas': datas,
              noMoreData: nomoredata,
              index: datas.length
          });
      };
      r.addToQueue();
  },

  loadMore: function () {
      let r = RequestReadFactory.myPropertyRead(this.data.index);
      r.finishBlock = (req) => {
          let datas = req.responseObject.Datas;
          let total = req.responseObject.Total;

          for (let i = 0; i < datas.length; i++) {
              let property = datas[i];
              let date = property.Month;
              let month = date.substring(0, 7);
              property.dealMonth = month;

              let details = property.Detail;
              for (let j = 0; j < details.length; j++) {
                  let detail = details[j];
                  let dateTime = detail.DateTime;
                  let date = dateTime.substring(0, 10);
                  let time = dateTime.substring(11);
                  detail.date = date;
                  detail.time = time;
              }
          }

          let nomoredata = false;
          if (datas.length + this.data.index >= total) {
              nomoredata = true;
          }

          this.setData({
              'listDatas': this.data.listDatas.concat(datas),
              noMoreData: nomoredata,
              index: datas.length + this.data.index
          });
      };
      r.addToQueue();
  },
})