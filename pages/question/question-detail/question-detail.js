// question-detail.js
let { Tool, Network, RequestReadFactory, RequestWriteFactory, Event } = global;
import WxParse from '../../../libs/wxParse/wxParse.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas:'',
        replyList:[],
        questionImageUrl:''
    },
    Id: '',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let questionId = options.Id;
        this.Id = questionId;

        this.requestQuestion();

        Event.on('LocalNotification_QA_Updated', this.requestQuestion, this);
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
        Event.off('LocalNotification_QA_Updated', this.requestQuestion);
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
     * 用户点击右上角分享 <div class="comment-container">
     */
    onShareAppMessage: function () {

    },

    /**
     * 我来回答
     */
    replyTap: function () {
        wx.navigateTo({
            url: '/pages/question/question-reply/question-reply?Id=' + this.Id,
        })
    },

    /**
     * 问题详情 查询
     */
    requestQuestion: function () {
        let condition = "${Id} == '" + this.Id + "'";

        let r = RequestReadFactory.requestQAWithCondition(condition, 0, 1);
        let self = this;
        r.finishBlock = (req, firstData) => {
            self.setData({
                datas: firstData
            })

            if (parseInt(firstData.ReplierNumber) > 0) {//问题回复 查询
                this.requestReplyList();
            }

            if (parseInt(firstData.Attachments) > 0){//附件查询
                this.requestAttachments(this.data.datas.Id);
            }   
        };
        r.addToQueue();
    },

    /**
     * 问题回复 查询
     */
    requestReplyList: function () {
        let condition = "${BreedQueAnsId} == '" + this.Id + "' && ${BelongAnswerId} == '" + global.TCGlobal.EmptyId + "'";
        let r = RequestReadFactory.requestQAWithCondition(condition, 0, 10000, true);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                item.isLiked = false;//是否点赞过
                item.likeNum = 0;//点赞数量
            });
            self.setData({
                replyList: datas
            })

            self.requestReplyCommentList();//所有问题回复的回复 查询

            //点赞数量，及是否点赞过查询
            datas.forEach((item, index) => {
                self.requestReplyLikeList(index);
            });
        };
        r.addToQueue();
    },

    /**
     * 问题回复的回复 查询
     */
    requestReplyCommentList: function () {
        let condition = "${BreedQueAnsId} == '" + this.Id + "' && ${BelongAnswerId} != '" + global.TCGlobal.EmptyId + "'";
        let r = RequestReadFactory.requestQAWithCondition(condition, 0, 10000, true);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let replyDatas = self.data.replyList;
            replyDatas.forEach((item, index) => {
                item.commentList = [];
            });

            datas.forEach((item, index) => {
                replyDatas.forEach((replyItem, replyIndex) => {
                    if (item.BelongAnswerId === replyItem.Id){
                        let commentArry = replyItem.commentList;
                        let arry = commentArry.concat(item);//回复评论的数组
                        replyItem.commentList = arry;
                        replyDatas.splice(replyIndex, 1, replyItem);
                    }
                });
            });

            self.setData({
                replyList: replyDatas
            })
        };
        r.addToQueue();
    },

    /**
     * 点赞 查询
     */
    requestReplyLikeList: function (replyItemIndex) {
        let replyList = this.data.replyList;
        let replyDatas = replyList[replyItemIndex];

        let r = RequestReadFactory.requestQuestionLike(replyDatas.Id);
        let self = this;
        r.finishBlock = (req, firstData) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            replyList.forEach((item, index) => {
                let datasTmp = replyList[index];
                if (Tool.isValid(firstData)) {
                    let belongAnsId = firstData.BreedQueAnsId;
                    if (item.Id === belongAnsId) {
                        datasTmp.isLiked = true;
                        datasTmp.likeNum = total;
                        replyList.splice(index, 1, datasTmp);
                    }
                }
            });

            self.setData({
                replyList: replyList
            })
        };
        r.addToQueue();
    },

    /**
     * 附件 查询 
     */
    requestAttachments: function (attachmentId) {
        let r = RequestReadFactory.attachmentsRead(attachmentId);
        let self = this;
        r.finishBlock = (req, firstData) => {
            this.setData({
                questionImageUrl: firstData.imageUrl
            })
        };
        r.addToQueue();
    },

    /**
     * 回复评论
     */
    replyAnswerTap:function(e){
        let index = e.currentTarget.dataset.index;
        let datas = this.data.replyList[index];

        wx.navigateTo({
            url: '/pages/question/question-reply/question-reply?isReplyComment=true&Id=' + datas.Id,
        })
    },

    /**
     * 点赞
     */
    likeTap:function(e){
        let index = e.currentTarget.dataset.index;
        let datas = this.data.replyList[index]; 
        let self = this;

        if(datas.isLiked){
            Tool.showSuccessToast("您已赞过此回答");
            return;
        }

        let rq = RequestWriteFactory.addQuestionReplyLike(datas.Id);
        rq.finishBlock = (req) => {
            Tool.showSuccessToast("已点赞");

            //刷新界面
            datas.isLiked = true;
            datas.likeNum += 1;
            let arry = self.data.replyList;
            arry.splice(index, 1, datas);

            self.setData({
                replyList: arry
            })
        };
        rq.addToQueue();
    }
})