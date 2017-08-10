// mom.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0, //选择的tab
        momList: [], //热帖和所有帖的数据
        typeList: [], //所有圈的数据
        recordList: [], //搜索记录的数据
        title: '这里还什么都没有哦', //无数据的显示文字
        momtype: 0, // 0是热帖和所有帖，1为所有圈，2为搜帖子
        isRecord: true, //是显示搜索记录，还是显示搜索结果
        hasSearchData: false,  //是否有搜索结果
        oneSortData: [
            {
                Name: '热帖',
            },
            {
                Name: '所有贴',
            },
            {
                Name: '所有圈',
            },
            {
                Name: '搜帖子',
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData1();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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

    /**
     * 数据请求
     */
    requestData: function () {

    },

    /**
     * 查询热帖
     */
    requestHotArticle: function () {

    },

    /**
     * 查询所有贴
     */
    requestAllArticle: function () {

    },

    /**
     * 查询所有订阅号
     */
    requestAllType: function () {

    },

    /**
     * 查询关注订阅号
     */
    requestAttentionType: function () {

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
        if (currentIndex == 0) {
            title = "这里还什么都没有哦～";
            momtype = 0;
        } else if (currentIndex == 1) {
            title = "这里还什么都没有哦～";
            momtype = 0;
        } else if (currentIndex == 2) {
            title = "这里还什么都没有哦～";
            momtype = 1;
        } else if (currentIndex == 3) {
            title = "暂无您搜索的宝妈圈帖子～";
            momtype = 2;
        }
        this.setData({
            title: title,
            currentTab: currentIndex,
            momtype: momtype,
        });
    },

    /**
     * 进入帖子详情
     */
    goDetail: function (e) {
        let index = e.currentTarget.dataset.index;
        let momList = this.data.momList;
    },

    /**
     * 进入圈详情
     */
    typeDetail: function (e) {
        let index = e.currentTarget.dataset.index;
        let typeList = this.data.typeList;
        wx.navigateTo({
            url: '../mom/mom-type/mom-type'
        })
    },

    /**
     * 点击搜索记录
     */
    searchResult: function (e) {
        let index = e.currentTarget.dataset.index;
        
    },

    /**
     * 测试数据
     */
    setData1: function () {
        this.setData({
            momList: [
                {
                    SendNickName: '姓名',
                    subtitle: '副标题',
                    Title_Article: '标题',
                    Article_Abstract: '内容',
                    TotalViews: '1299',
                    Commemt_Number: '23',
                },
                {
                    SendNickName: '姓名',
                    subtitle: '副标题',
                    Title_Article: '标题',
                    Article_Abstract: '内容',
                    TotalViews: '1299',
                    Commemt_Number: '23',
                },
            ],
            typeList: [
                {
                    Name: '标题',
                    Introduction: '介绍',
                    status: true,
                },
                {
                    Name: '标题',
                    Introduction: '介绍',
                    status: true,
                },
                {
                    Name: '标题',
                    Introduction: '介绍',
                    status: false,
                },
            ],

            recordList: [
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
                {
                    record: '登录',
                },
            ],
        });
    },

    createPostTap:function(){
        console.log('发帖');
    }

})