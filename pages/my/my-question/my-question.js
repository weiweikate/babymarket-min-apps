// my-question.js
let { Tool, Storage, RequestReadFactory, Event } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        questionListDatas: [],
        replyListDatas: [],
        currentIndex: 0,//0:我的提问 1:我的回答
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData(this.data.currentIndex);
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
        this.loadmore(this.data.currentIndex);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    questionButtonTap: function () {
        this.setData({
            currentIndex: 0
        })

        if (this.data.questionListDatas.length == 0) {
            this.requestData(0);
        }
    },

    replyButtonTap: function () {
        this.setData({
            currentIndex: 1
        })

        if (this.data.replyListDatas.length == 0){
            this.requestData(1);
        }
    },

    /**
    * 孕育问答
    */
    requestData: function (tabIndex) {
        if (tabIndex == 0) {//我的提问
            let condition = "${BreedQueAnsId} == '" + global.TCGlobal.EmptyId 
            + "' && ${AskMemberId} == '" + global.Storage.memberId() + "' ";

            let r = RequestReadFactory.requestQAWithCondition(condition, 0, 20);
            let self = this;
            r.finishBlock = (req) => {
                let datas = req.responseObject.Datas;
                self.setData({
                    questionListDatas: datas
                })
            };
            r.addToQueue();

        } else {//我的回答
            let r = RequestReadFactory.requestMyQAReplyWithCondition(0, 20);
            let self = this;
            r.finishBlock = (req) => {
                let datas = req.responseObject.Datas;

                self.setData({
                    replyListDatas: datas
                })
            };
            r.addToQueue();
        }
    },

    loadmore: function (tabIndex) {
        if (tabIndex == 0) {//我的提问
            let condition = "${BreedQueAnsId} == '" + global.TCGlobal.EmptyId
                + "' && ${AskMemberId} == '" + global.Storage.memberId() + "' ";

            let r = RequestReadFactory.requestQAWithCondition(condition, this.data.questionListDatas.length, 20);
            let self = this;
            r.finishBlock = (req) => {
                let datas = req.responseObject.Datas;
                let arry = self.data.questionListDatas;

                arry = arry.concat(datas);
                self.setData({
                    questionListDatas: arry
                })
            };
            r.addToQueue();

        } else {//我的回答
            let r = RequestReadFactory.requestMyQAReplyWithCondition(this.data.replyListDatas.length, 20);
            let self = this;
            r.finishBlock = (req) => {
                let datas = req.responseObject.Datas;

                let arry = self.data.replyListDatas;
                arry = arry.concat(datas);
                self.setData({
                    replyListDatas: arry
                })
            };
            r.addToQueue();
        }
    }
})