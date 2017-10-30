
// question-reply.js
let { Tool, Storage, RequestWriteFactory, RequestReadFactory, Event } = global
import ImagePicker from '../../../components/image-picker/image-picker';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas:''
    },
    content: '',
    isReplyComment:false,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.imagePicker = new ImagePicker(this, 1);

        let datas = wx.getStorageSync('questionDatas');

        if (Tool.isEmpty(datas)){
            let Id = options.Id;
            this.isReplyComment = Tool.isTrue(options.isReplyComment);

            if (Tool.isValidStr(Id)){
                //获取问题详情
                this.requestQuestionDetail(Id);
            }

        }else{
            wx.setNavigationBarTitle({
                title: '回复' + datas.NickName,
            })

            this.setData({
                datas: datas
            })
        }
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
        wx.removeStorageSync('questionDatas');
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
     * 输入改变
     */
    inputTap:function(e){
        let value = e.detail.value;
        this.content = value;
    },

    /**
     * 回答
     */
    replyTap:function(e){
        if (Tool.isEmptyStr(this.content)){
            wx.showToast({
                title: '请输入回复内容'
            })
            return;
        }

        if (this.content.length < 10) {
            wx.showToast({
                title: '字数需10字以上'
            })
            return;
        }

        if (Storage.didLogin()) {
            let belongAnswerId = '';
            let belongQueAnswerId = '';
            if (this.isReplyComment) {
                belongAnswerId = this.data.datas.Id;
                belongQueAnswerId = this.data.datas.BreedQueAnsId;
            } else {
                belongQueAnswerId = this.data.datas.Id;
            }

            let rq = RequestWriteFactory.addQuestionReply(
                this.content, belongQueAnswerId, belongAnswerId);
            rq.finishBlock = (req) => {
                wx.navigateBack({
                    delta: 1,
                })

                wx.removeStorageSync('questionDatas');

                Tool.showSuccessToast("回答问题完成，金币+2");

                Event.emit('LocalNotification_QA_Updated');
            };
            rq.addToQueue();
        } else {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
    },

    /**
    * 孕育问答
    */
    requestQuestionDetail: function (Id) {
        let condition = "${Id} == '" + Id + "'";

        let r = RequestReadFactory.requestQAWithCondition(condition, 0, 1, this.isReplyComment);
        let self = this;
        r.finishBlock = (req, firstData) => {
            self.setData({
                datas: firstData
            })
        };
        r.addToQueue();
    },
})