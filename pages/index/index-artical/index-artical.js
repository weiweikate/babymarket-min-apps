// index-artical.js
let { Tool, Storage, RequestReadFactory, RequestWriteFactory, Network } = global
import WxParse from '../../../libs/wxParse/wxParse.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        titleList: [],
        notLikeList: [
            '没有讲全，看不到我想了解的知识',
            '学不到方法，看了我也不知道怎么做',
            '文字不够直白，读不懂也看不下去',
            '看不到专家的观点，觉得不可靠'],
        index: 0,
        currentTab:0,
        isPraise: false,//点赞
        isComplain: false,//吐槽
        isCollect: false//收藏
    },
    mainId:'',
    currentDay:0,
    totalCount:0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.Id;
        let title = options.title;
        this.currentDay = parseInt(options.currentDay);

        wx.setNavigationBarTitle({
            title: title,
        })

        this.requestArticalMaxDays();
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onTabChangeListener:function(e){
        let currentIndex = e.detail.current;
        if (currentIndex == undefined) {
            currentIndex = e.currentTarget.dataset.current;
        }
        this.setData({
            currentTab: currentIndex
        });

        let item = this.data.titleList[currentIndex];
        this.requestArticalDetail(item.Id);
        this.requestIsPostCollectRead(item.Id);
    },

    /**
     * 获取文章最大天数
     */
    requestArticalMaxDays: function () {
        let r = RequestReadFactory.requestHomeArticalCount(this.mainId);
        let self = this;
        r.finishBlock = (req, firstData) => {
            self.setData({
                totalCount: parseInt(firstData.Day)
            })
            
            self.requestArtical();
        };
        r.addToQueue();
    },

    /**
     * 获取文章
     */
    requestArtical: function () {
        let fontCount = 15;//往右
        let backCount = 15; //往左

        if (this.currentDay <= 15) {
            backCount = this.currentDay - 1;
            fontCount = 31 - backCount - 1;
        }

        let startDayB = 0;
        let endDayF = 0;

        if (this.currentDay < 731) {
            startDayB = this.currentDay - backCount;
            endDayF = this.currentDay + fontCount;

            if (this.currentDay > 716) {//后15天跨过2岁，重新计算fontCount
                endDayF = this.currentDay * 2 - 700;
            }

        } else if (this.currentDay >= 731 && this.currentDay <= 759) {//前15天跨过2岁，2岁28天（包括）前，14天（不足15天）
            startDayB = 716 + (this.currentDay - 731) / 2;
            endDayF = this.currentDay + 30;

        } else {
            startDayB = this.currentDay - 30;
            endDayF = this.currentDay + 30;

            if (endDayF >= this.totalCount) {
                endDayF = this.totalCount;
                startDayB = endDayF - 31 * 2;
            }
        }

        let condition = "(${Day} >= '" + startDayB + "' && ${Day} <= '" + endDayF 
        + "') && ${IndexArticleClassifyId} == '" + this.mainId + "'"

        let r = RequestReadFactory.requestHomeArticalList(condition);
        let self = this;
        r.finishBlock = (req, firstData) => {
            let datas = req.responseObject.Datas;
            let arry = [];
            datas.forEach((item, index) => {//2岁后,隔一天展示一条数据
                //item.articalUrl = Tool.generateURL(Network.sharedInstance.articalURL, {'Id':item.Id})

                //计算日期
                let sinceDate;
                if (Storage.didLogin()) {
                    let memeberInfo = Storage.currentMember();
                    sinceDate = Tool.dateFromString(memeberInfo.BabyBirthday);
                } else {
                    sinceDate = new Date();
                }
                let timeInteval = Tool.timeIntervalFromDate(sinceDate, (parseInt(item.Day) - 1) * 24 * 3600);
                let date = Tool.timeStringFromInterval(timeInteval, 'MM月DD日');
                item.date = date;
                
                if (parseInt(item.Day) == self.totalCount) {//3岁这天保留，不筛选
                    arry = arry.concat(item);
                }else{
                    if (parseInt(item.Day) >= 731){
                        if (self.currentDay % 2 == 0 && parseInt(item.Day) % 2 == 0){
                            arry = arry.concat(item);
                        } else if (self.currentDay % 2 != 0 && parseInt(item.Day) % 2 != 0){
                            arry = arry.concat(item);
                        }
                    }else{
                        arry = arry.concat(item);
                    }
                }
            });

            //默认选中当前日期
            arry.forEach((item, index) => {
                if (parseInt(item.Day) == self.currentDay) {
                    item.isToday = true;
                    self.setData({
                        currentTab: index
                    })

                    self.requestArticalDetail(item.Id);
                    self.requestIsPostCollectRead(item.Id);
                }
            });

            this.setData({
                titleList: arry
            })
        };
        r.addToQueue();
    },

    requestArticalDetail:function(articalId){
        let articalUrl = Tool.generateURL(Network.sharedInstance().articalURL, {'Id': articalId})
        let self = this;
        wx.request({
            url: articalUrl,
            success: function (res) {
                console.log(res.data);
                let data0 = res.data;
                let arry0 = data0.split('</script>');
                let data1 = arry0[3];
                let arry1 = data1.split('<div class="guess-u-like">');

                WxParse.wxParse('article', 'html', arry1[0], self, 5);
                WxParse.wxParse('guess', 'html', arry1[1], self, 5);
            }
        })
    },

    /**
     * 猜你喜欢
     */
    guessTap:function(){

    },

    /**
     * 查询文章是否被我点赞
     */
    requestIsPostPraiseRead: function (postId) {
        let task = RequestReadFactory.isPostPraiseRead(postId);
        task.finishBlock = (req) => {
            let isPraise = req.responseObject.isPraise;
            this.setData({
                isPraise: isPraise
            });
        };
        task.addToQueue();
    },
    /**
     * 新增文章点赞
     */
    requestAddPostPraise: function (articalId) {
        let task = RequestWriteFactory.addArticalLike(articalId);
        task.finishBlock = (req) => {
            this.setData({
                isPraise: true
            });
            Tool.showSuccessToast("已点赞");
        };
        task.addToQueue();
    },

    /**
     * 查询文章是否被我收藏
     */
    requestIsPostCollectRead: function (postId) {
        let task = RequestReadFactory.isPostCollectRead(postId);
        task.finishBlock = (req) => {
            let isCollect = req.responseObject.isCollect;
            let collectId = req.responseObject.collectId;
            this.setData({
                isCollect: isCollect,
                collectId: collectId
            });
        };
        task.addToQueue();
    },

    /**
     * 新增文章收藏
     */
    requestAddPostCollect: function (requestData) {
        let task = RequestWriteFactory.addPostCollect(requestData);
        task.finishBlock = (req) => {
            this.setData({
                isCollect: true
            });
            Tool.showSuccessToast("已收藏");
        };
        task.addToQueue();
    },
    /**
    * 删除文章收藏
    */
    requestDeletePostCollect: function (collectId) {
        let task = RequestWriteFactory.deletePostCollect(collectId);
        task.finishBlock = (req) => {
            this.setData({
                isCollect: false
            });
            Tool.showSuccessToast("取消收藏");
        };
        task.addToQueue();
    },

    /**
     * 收藏
     */
    onCollectListener: function (e) {
        if (Storage.didLogin()) {
            let isCollect = this.data.isCollect;
            let collectId = this.data.collectId;
            if (isCollect) {
                //取消收藏
                this.requestDeletePostCollect(collectId);

                this.setData({
                    collectId: ''
                });
            } else {
                //新增收藏
                collectId = Tool.guid();

                Tool.showLoading();
                let requestData = new Object();
                requestData.Id = collectId;
                requestData.SourceId = this.data.titleList[this.data.currentTab].Id;
                requestData.Collect_MemberId = Storage.memberId();

                this.requestAddPostCollect(requestData);

                this.setData({
                    collectId: collectId
                });
            }
        } else {
            Tool.showAlert("请先登录");
        }
    },
    /**
     * 点赞
     */
    onPraiseListener: function (e) {
        let isPraise = this.data.isPraise;
        if (!isPraise) {
            if (Storage.didLogin()) {
                //新增点赞
                Tool.showLoading();
                let articalId = this.data.titleList[this.data.currentTab].Id;

                this.requestAddPostPraise(articalId);
            } else {
                Tool.showAlert("请先登录");
            }
        }
    },

    /**
     * 吐槽
     */
    bindPickerChange:function(e){
        console.log(e.detail.value);

        if (!this.data.isComplain) {
            if (Storage.didLogin()) {
                let articalId = this.data.titleList[this.data.currentTab].Id;
                let content = this.data.notLikeList[e.detail.value];
                let task = RequestWriteFactory.addArticalComplain(articalId, content);
                task.finishBlock = (req) => {
                    this.setData({
                        isComplain: true
                    });
                    Tool.showSuccessToast("已提交");
                };
                task.addToQueue();
            } else {
                Tool.showAlert("请先登录");
            }
        }
    }
})