//宝妈圈
let { Tool, Storage, RequestReadFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //选择的tab，0是热帖，1所有帖，2为所有圈，3为搜帖子
    hotPostIndex: 0,//热帖位置标记
    allPostIndex: 0,//所有帖位置标记
    searchPostIndex: 0,//搜索的帖位置标记
    hasMoreHotPost: false,//是否有更多热帖
    hasMoreAllPost: false,//是否有更多所有帖
    hasMoreSearchPost: false,//是否有更多搜索的帖
    hotPostList: [],//热帖数据
    allPostList: [],//所有帖数据
    allCircleList: [], //所有圈的数据
    searchPostList: [],//搜索的帖数据
    recordList: [], //搜索记录的数据
    keyword: '',
    oneSortData: [
      {
        Name: '热帖'
      },
      {
        Name: '所有贴'
      },
      {
        Name: '所有圈'
      },
      {
        Name: '搜帖子'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData();
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
   * scrollview上拉触底事件的处理函数
   */
  onScrollReachBottom: function () {
    let currentTab = this.data.currentTab;
    switch (currentTab) {
      case 0:
        this.updateHotPost();
        break;
      case 1:
        this.updateAllPost();
        break;
      case 2:
        break;
      case 3:
        this.updateSearchPost();
        break;
    }
  },

  /**
   * 数据请求
   */
  requestData: function () {
    this.requestHotPost(0);
  },

  /**
   * 查询热帖
   */
  requestHotPost: function (index) {
    let task = RequestReadFactory.hotPostRead(index);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let tempArray = this.data.hotPostList;
      responseData.forEach((item, index) => {
        tempArray.push(item);
      });

      let total = req.responseObject.Total;
      let hasMoreHotPost = this.data.hasMoreHotPost;
      //如果数据的长度小于total，那么还能下拉刷新
      hasMoreHotPost = tempArray.length < total;

      this.setData({
        hotPostList: tempArray,
        hasMoreHotPost: hasMoreHotPost
      });
    };
    task.addToQueue();
  },

  /**
   * 更新热帖数据
   */
  updateHotPost: function () {
    let hasMoreHotPost = this.data.hasMoreHotPost;
    if (hasMoreHotPost) {
      let index = this.data.hotPostIndex;
      index++;
      this.setData({
        hotPostIndex: index
      });
      this.requestHotPost(index);
    } else {
      console.log('数据到底喽~~~')
    }
  },

  /**
   * 查询所有贴
   */
  requestAllPost: function (index) {
    let task = RequestReadFactory.allPostRead(index);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let tempArray = this.data.allPostList;
      responseData.forEach((item, index) => {
        tempArray.push(item);
      });

      let total = req.responseObject.Total;
      let hasMoreAllPost = this.data.hasMoreAllPost;
      //如果数据的长度小于total，那么还能下拉刷新
      hasMoreAllPost = tempArray.length < total;

      this.setData({
        allPostList: tempArray,
        hasMoreAllPost: hasMoreAllPost
      });
    };
    task.addToQueue();
  },

  /**
   * 更新所有贴数据
   */
  updateAllPost: function () {
    let hasMoreAllPost = this.data.hasMoreAllPost;
    if (hasMoreAllPost) {
      let index = this.data.allPostIndex;
      index++;
      this.setData({
        allPostIndex: index
      });
      this.requestAllPost(index);
    } else {
      console.log('数据到底喽~~~')
    }
  },

  /**
   * 查询所有圈子
   */
  requestAllCircle: function () {
    let task = RequestReadFactory.allCircleRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        allCircleList: responseData
      });
      //如果登录的话，去查我关注的圈子
      if (Storage.didLogin()) {
        this.requestCircleAttention();
      }
    };
    task.addToQueue();
  },

  /**
   * 查询关注订阅号
   */
  requestCircleAttention: function () {
    let task = RequestReadFactory.allCircleAttentionRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let allCircleList = this.data.allCircleList;
      allCircleList.forEach((item, index) => {
        responseData.forEach((item2, index2) => {
          if (item.Id == item2.Id) {
            item.isAttention = true;
            return;
          }
        });
      });
      this.setData({
        allCircleList: allCircleList
      });
    };
    task.addToQueue();
  },

  /**
   * 查询大家都在搜
   */
  requestRecord: function () {
    let task = RequestReadFactory.recordRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        recordList: responseData
      });
    };
    task.addToQueue();
  },

  /**
   * 搜索贴子
   */
  requestSearchPost: function (keyword, index) {
    let task = RequestReadFactory.searchPostRead(keyword, index);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      if (responseData.length > 0) {

        let tempArray = this.data.searchPostList;
        responseData.forEach((item, index) => {
          tempArray.push(item);
        });

        let total = req.responseObject.Total;
        let hasMoreSearchPost = this.data.hasMoreSearchPost;
        //如果数据的长度小于total，那么还能下拉刷新
        hasMoreSearchPost = tempArray.length < total;

        this.setData({
          searchPostList: tempArray,
          hasMoreSearchPost: hasMoreSearchPost
        });
      } else {
        this.setData({
          searchPostList: [],
          hasMoreSearchPost: false,
          searchPostIndex: 0
        });
        Tool.showAlert("暂无您搜索的关键词数据");
      }
    };
    task.addToQueue();
  },

  /**
   * 更新搜索贴数据
   */
  updateSearchPost: function () {
    let hasMoreSearchPost = this.data.hasMoreSearchPost;
    if (hasMoreSearchPost) {
      let index = this.data.searchPostIndex;
      index++;
      this.setData({
        searchPostIndex: index
      });
      let keyword = this.data.keyword;
      this.requestSearchPost(keyword, index);
    } else {
      console.log('数据到底喽~~~')
    }
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
      let tempList;
      switch (currentIndex) {
        case 0:
          break
        case 1:
          tempList = this.data.allPostList;
          if (tempList.length == 0) {
            this.requestAllPost(0);
          }
          break
        case 2:
          tempList = this.data.allCircleList;
          if (tempList.length == 0) {
            this.requestAllCircle();
          }
          break
        case 3:
          tempList = this.data.recordList;
          if (tempList.length == 0) {
            this.requestRecord();
          }
          break
      }
      this.setData({
        currentTab: currentIndex
      });
    }
  },

  createPostTap: function () {
    console.log('发帖');
  },
  /**
   * 点击搜索记录
   */
  onKeywordListener: function (e) {
    let keyword = e.currentTarget.dataset.keyword;
    if (keyword.length > 0) {
      this.setData({
        keyword: keyword,
        searchPostIndex: 0
      });
      this.requestSearchPost(keyword, 0);
    } else {
      Tool.showAlert("请输入搜索内容");
    }
  },
  /**
   * 搜索监听
   */
  onConfirmAction: function (e) {
    let keyword = e.detail.value;
    if (keyword.length > 0) {
      this.setData({
        keyword: keyword,
        searchPostIndex: 0
      });
      this.requestSearchPost(keyword, 0);
    } else {
      Tool.showAlert("请输入搜索内容");
    }
  },
  /**
   * item点击事件
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    let currentTab = this.data.currentTab;
    if (currentTab == 2) {
      //进入圈子
      console.log('进入圈子' + id);
      wx.navigateTo({
        url: '../mom/mom-type/mom-type'
      })
    } else {
      //进入帖子详情
      console.log('进入帖子详情' + id);
      wx.navigateTo({
        url: '/pages/mom/post-detail/post-detail?id=' + id
      })
    }
  },
  /**
   * 是否关注
   */
  onAttentionListener: function (e) {
    let id = e.currentTarget.dataset.id;
    let attention = e.currentTarget.dataset.attention;
    console.log(e.currentTarget.dataset);
    console.log(id);
    console.log(attention);
    if (Storage.didLogin()) {
      //已登录，取消关注或关注
      if (attention) {
        //取消关注
        console.log('取消关注');
      } else {
        //取消关注
        console.log('关注');
      }
    } else {
      //请先登录
      console.log('请先登录');
    }
  }

})