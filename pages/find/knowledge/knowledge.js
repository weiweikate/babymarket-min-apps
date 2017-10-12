//宝妈圈
let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //选择的tab
    oneSortData: [],
    listArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Tool.showLoading();
    this.requestData();
  },

  /**
   * 数据请求
   */
  requestData: function () {
    this.requestKnowledgeClassify();
  },

  /**
   * 查询知识分类
   */
  requestKnowledgeClassify: function () {
    let self = this;
    let task = RequestReadFactory.knowledgeClassifyRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;

      this.setData({
        oneSortData: responseData
      });

      if (responseData.length > 0) {
        //查询第一个分类
        self.requestKnowledge(responseData[0].Value);
      }
    };
    task.addToQueue();
  },

  /**
   * 根据分类查询知识
   */
  requestKnowledge: function (key) {
    let task = RequestReadFactory.knowledgeRead(key);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let currentTab = this.data.currentTab;
      let oneSortData = this.data.oneSortData;
      oneSortData[currentTab].listArray = responseData;

      this.setData({
        oneSortData: oneSortData,
        listArray: responseData
      });
    };
    task.addToQueue();
  },
  /**
  * swiper切换事件
  */
  onTabChangeListener: function (e) {
    let currentIndex = e.detail.current;
    if (currentIndex == undefined) {
      currentIndex = e.currentTarget.dataset.current;
    }
    if (currentIndex != this.data.currentTab) {
      this.setData({
        currentTab: currentIndex
      });

      let oneSort = this.data.oneSortData[currentIndex];
      let tempList = oneSort.listArray;
      if (tempList == undefined || tempList.length == 0) {
        Tool.showLoading();
        this.requestKnowledge(oneSort.Value);
      } else {
        this.setData({
          listArray: tempList
        });
      }
    }
  },

  /**
   * 知识详情
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/find/knowledge/knowledge-list/knowledge-list?id=' + id + "&title=" + title
    })
  }

})