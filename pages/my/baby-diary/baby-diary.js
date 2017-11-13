let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;
import CreateBtn from '../../../components/create-btn/create-btn';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new CreateBtn(this, '/pages/my/baby-diary/add-baby-diary/add-baby-diary');

    this.requestList();

    //注册通知
    Event.on('refreshBabyDiaryList', this.requestList, this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    Event.off('refreshBabyDiaryList', this.requestList)
  },

  /**
   * 进入详情
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/my/baby-diary/baby-diary-detail/baby-diary-detail?id=' + id
    })
  },

  /**
   * 宝宝日记查询
   */
  requestList: function () {
    let task = RequestReadFactory.babyDiaryRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        listArray: responseData
      });
    }
    task.addToQueue();
  }
})