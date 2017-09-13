//宝妈圈
let { Tool, Storage, RequestReadFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //选择的tab，0是热帖，1所有帖，2为所有圈，3为搜帖子
    hotPostList: [],//热帖数据
    allPostList: [],//所有帖数据
    searchPostList: [],//搜索的帖数据
    allCircleList: [], //所有圈的数据
    attentionList: [], //所有圈关注的数据
    recordList: [], //搜索记录的数据
    title: '这里还什么都没有哦', //无数据的显示文字
    isRecord: true, //是显示搜索记录，还是显示搜索结果
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
    this.setData1();
    // this.requestData();
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
   * 数据请求
   */
  requestData: function () {
    this.requestHotPost();
  },

  /**
   * 查询热帖
   */
  requestHotPost: function () {
    let task = RequestReadFactory.hotPostRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        hotPostList: responseData
      });
    };
    task.addToQueue();
  },

  /**
   * 查询所有贴
   */
  requestAllPost: function () {
    let task = RequestReadFactory.allPostRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        allPostList: responseData
      });
    };
    task.addToQueue();
  },

  /**
   * 查询关注订阅号
   */
  requestAttentionType: function () {
    let task = RequestReadFactory.allCircleAttentionRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        attentionList: responseData
      });
      //请求圈子数据
      this.requestAllType();
    };
    task.addToQueue();
  },

  /**
   * 查询所有订阅号
   */
  requestAllType: function () {
    let task = RequestReadFactory.allCircleRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      let attentionList = this.data.attentionList;
      responseData.forEach((item, index) => {
        attentionList.forEach((item2, index2) => {
          if (item.Id == item2.Id){
            item.isAttention = true;
            return;
          }
        });
      });
      this.setData({
        allCircleList: responseData
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
  requestSearchPost: function (keyword) {
    let task = RequestReadFactory.searchPostRead(keyword);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        isRecord:false,
        searchPostList: responseData
      });
    };
    task.addToQueue();
  },

  /**
  * swiper切换事件
  */
  onTabChangeListener: function (e) {
    let title = this.data.title;
    let momtype = this.data.momtype
    let currentIndex = e.detail.current;
    if (currentIndex == undefined) {
      currentIndex = e.currentTarget.dataset.current;
    }
    if (currentIndex != this.data.currentTab) {
      console.log(currentIndex);
      if (currentIndex == 0) {
        title = "这里还什么都没有哦～";
      } else if (currentIndex == 1) {
        title = "这里还什么都没有哦～";
      } else if (currentIndex == 2) {
        title = "这里还什么都没有哦～";
      } else if (currentIndex == 3) {
        title = "暂无您搜索的宝妈圈帖子～";
      }
      this.setData({
        title: title,
        currentTab: currentIndex
      });
    }
  },

  /**
   * 测试数据
   */
  setData1: function () {
    this.setData({
      hotPostList: [
        {
          Id: '83ff0a34-d4c7-463f-a89b-a7b0009fa3f9',
          headImgUrl: '',
          name: '姐就是拽',
          age: '宝宝1岁3个月23天',
          isReply: false,
          title: '一哄二骗三灌药？孩子小病小痛不如用这个方法！后悔知道晚了',
          content: '只有当了妈才知道但凡孩子不舒服了当妈的就整个人都不好了饭也吃不下了，觉也睡不着了，脾气也变差了直到经历这件事',
          isBottom: true,
          readNum: 1777,
          commemtNum: 0
        },
        {
          Id: 'd8c10e31-9943-472b-89b3-a7b0009b1145',
          headImgUrl: '',
          name: '承诺太假',
          age: '宝宝1岁3个月23天',
          isReply: false,
          title: '【孩子抽搐】不要着急，这样处理',
          content: '哪些原因会引起孩子抽搐抽搐是全身或局部肌肉不自主的阵发性强烈收缩，发作形式有强直性(肌肉持续的收缩)、阵挛性',
          isBottom: true,
          readNum: 1659,
          commemtNum: 0
        }
      ],
      allPostList: [
        {
          Id: '83ff0a34-d4c7-463f-a89b-a7b0009fa3f9',
          headImgUrl: '',
          name: '姐就是拽',
          age: '宝宝1岁3个月23天',
          isReply: false,
          title: '一哄二骗三灌药？孩子小病小痛不如用这个方法！后悔知道晚了',
          content: '只有当了妈才知道但凡孩子不舒服了当妈的就整个人都不好了饭也吃不下了，觉也睡不着了，脾气也变差了直到经历这件事',
          age: '1岁3个月23天',
          isBottom: true,
          readNum: 1777,
          commemtNum: 0
        },
        {
          Id: 'd8c10e31-9943-472b-89b3-a7b0009b1145',
          headImgUrl: '',
          name: '承诺太假',
          age: '宝宝1岁3个月23天',
          isReply: false,
          title: '【孩子抽搐】不要着急，这样处理',
          content: '哪些原因会引起孩子抽搐抽搐是全身或局部肌肉不自主的阵发性强烈收缩，发作形式有强直性(肌肉持续的收缩)、阵挛性',
          age: '1岁1个月5天',
          isBottom: true,
          readNum: 1659,
          commemtNum: 0
        }
      ],
      searchPostList: [
        {
          Id: '83ff0a34-d4c7-463f-a89b-a7b0009fa3f9',
          headImgUrl: '',
          name: '姐就是拽',
          age: '宝宝1岁3个月23天',
          isReply: false,
          title: '一哄二骗三灌药？孩子小病小痛不如用这个方法！后悔知道晚了',
          content: '只有当了妈才知道但凡孩子不舒服了当妈的就整个人都不好了饭也吃不下了，觉也睡不着了，脾气也变差了直到经历这件事',
          age: '1岁3个月23天',
          isBottom: true,
          readNum: 1777,
          commemtNum: 0
        },
        {
          Id: 'd8c10e31-9943-472b-89b3-a7b0009b1145',
          headImgUrl: '',
          name: '承诺太假',
          age: '宝宝1岁3个月23天',
          isReply: false,
          title: '【孩子抽搐】不要着急，这样处理',
          content: '哪些原因会引起孩子抽搐抽搐是全身或局部肌肉不自主的阵发性强烈收缩，发作形式有强直性(肌肉持续的收缩)、阵挛性',
          age: '1岁1个月5天',
          isBottom: true,
          readNum: 1659,
          commemtNum: 0
        }
      ],
      allCircleList: [
        {
          Id: '92b81d25-f94a-4785-825c-a64000ed7255',
          headImgUrl: '',
          title: '育儿',
          content: '育儿知识大本营',
          isAttention: false
        },
        {
          Id: '084f16b1-ff01-4cfe-8c87-a64b00eab6b9',
          headImgUrl: '',
          title: '辣妈',
          content: '你是时尚辣妈吗？看这里',
          isAttention: false
        },
        {
          Id: 'd79f67a7-232b-4a79-a5ab-a64000ed8fa1',
          headImgUrl: '',
          title: '辅食',
          content: '宝宝辅食小天地',
          isAttention: true
        }
      ],

      recordList: [
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
        {
          Name: '登录',
        },
      ],
    });
  },

  createPostTap: function () {
    console.log('发帖');
  },
  /**
   * 点击搜索记录
   */
  onKeywordListener: function (e) {
    let keyword = e.currentTarget.dataset.keyword;
    this.requestSearchPost(keyword);
  },
  /**
   * 搜索监听
   */
  onConfirmAction:function(e){
    let keyword = e.detail.value;
    this.requestSearchPost(keyword);
  },
  /**
   * item点击事件
   */
  onItemClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    let currentTab = this.data.currentTab;
    if (currentTab == 2) {
      //进入圈子
      console.log('进入圈子');
      wx.navigateTo({
        url: '../mom/mom-type/mom-type'
      })
    } else {
      //进入帖子详情
      console.log('进入帖子详情');
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