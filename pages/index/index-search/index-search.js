// index-search.js
let { Tool, Storage, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 0,
        titleArry: ['帖子', '知识', '问答'],
        //搜索关键字
        searchPlaceholder: "请输入关键字",
        keyword:'',
        listdatas: []
    },
    hasMore:true,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
      let index = this.data.currentIndex;
      
        if (this.hasMore){
            if (index == 0) {
              //查询帖子列表
              this.requestSearchPost(this.data.listdatas.length);
            } else if (index == 1) {
              //查询知识列表
              this.requestSearchKnowledge(this.data.listdatas.length);
            } else {
              //查询问答列表
              this.requestSearchQuestion(this.data.listdatas.length);
            }
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 分段控制器item点击
     */
    segmentItemTap: function (e) {
        let index = e.currentTarget.dataset.index;

        this.setData({
            currentIndex: index,
            listdatas: []
        })

        if (index == 0) {
            //查询帖子列表
            this.requestSearchPost(0);
        } else if (index == 1) {
            //查询知识列表
            this.requestSearchKnowledge(0);
        } else {
            //查询问答列表
            this.requestSearchQuestion(0);
        }
    },

    /**
     * 搜索框搜索
     */
    onConfirmAction: function (e) {
        let keyword = e.detail.value;
        let index = this.data.currentIndex;

        this.setData({
            keyword: keyword,
            listdatas:[]
        })
        
        Tool.showLoading();
        if (index == 0) {
            //查询帖子列表
            this.requestSearchPost(0);
        } else if (index == 1) {
            //查询知识列表
            this.requestSearchKnowledge(0);
        } else {
            //查询问答列表
            this.requestSearchQuestion(0);
        }
    },

    /**
     * item点击事件
     */
    onItemClickListener: function (e) {
        let id = e.currentTarget.dataset.id;
        let currentIndex = this.data.currentIndex;
        if (currentIndex == 0) {
            //进入帖子详情
            wx.navigateTo({
                url: '/pages/mom/post-detail/post-detail?id=' + id
            })
        } else if (currentIndex == 1) {
            //进入知识详情
            wx.navigateTo({
                url: '/pages/find/knowledge/knowledge-detail/knowledge-detail?id=' + id
            })
        } 
    },


    /**
     * item点击事件
     */
    cellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let item = this.data.listdatas[index];

        //进入问答详情
        wx.navigateTo({
            url: '/pages/question/question-detail/question-detail?Id=' + item.Id
        })

    },

    /**
     * 搜索贴子
     */
    requestSearchPost: function (index) {
      let task = RequestReadFactory.searchPostRead2(this.data.keyword, index);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            if (responseData.length > 0) {

                let tempArray = this.data.listdatas;
                tempArray = tempArray.concat(responseData);

                let total = req.responseObject.Total;
                //如果数据的长度小于total，那么还能下拉刷新
                this.hasMore = tempArray.length < total;

                this.setData({
                    listdatas: tempArray
                });
            } else {
                this.setData({
                    listdatas: [],
                    searchPostIndex: 0
                });
                this.hasMore = false;
                Tool.showAlert("暂无您搜索的关键词数据");
            }
        };
        task.addToQueue();
    },

    /**
     * 搜索知识
    */
    requestSearchKnowledge: function (index) {
        let task = RequestReadFactory.searchKnowledgeListRead2(this.data.keyword, index);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            if (responseData.length > 0) {

                let tempArray = this.data.listdatas;
                tempArray = tempArray.concat(responseData);

                let total = req.responseObject.Total;
                //如果数据的长度小于total，那么还能下拉刷新
                this.hasMore = tempArray.length < total;

                this.setData({
                    listdatas: tempArray
                });
            } else {
                this.setData({
                    listdatas: [],
                    searchPostIndex: 0
                });
                this.hasMore = false;
                Tool.showAlert("暂无您搜索的关键词数据");
            }
        };
        task.addToQueue();
    },

    /**
     * 搜索问答
     */
    requestSearchQuestion: function (index) {
        let condition = "StringIndexOf(${Que},'" + this.data.keyword + "') > 0"
        let task = RequestReadFactory.requestQAWithCondition(condition, index);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            if (responseData.length > 0) {

                let tempArray = this.data.listdatas;
                tempArray = tempArray.concat(responseData);

                let total = req.responseObject.Total;
                //如果数据的长度小于total，那么还能下拉刷新
                this.hasMore = tempArray.length < total;

                this.setData({
                    listdatas: tempArray
                });
            } else {
                this.setData({
                    listdatas: [],
                    searchPostIndex: 0
                });
                this.hasMore = false;
                Tool.showAlert("暂无您搜索的关键词数据");
            }
        };
        task.addToQueue();
    },
})