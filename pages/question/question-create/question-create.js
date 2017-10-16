// question-create.js
let { Tool, Storage, RequestWriteFactory, Event } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isHideName:false,
        content: '',
    },
    index: 0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let index = options.index;
        this.index = index;

        let content = options.content;
        this.setData({
            content: content
        })
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

    nimingTap: function () {
        this.setData({
            isHideName: !this.data.isHideName
        })
    },

    inputTap:function(e){
        console.log(e.detail);
        this.setData({
            content: e.detail.value
        })
    },

    questionTap:function(){
        if (Tool.isEmptyStr(this.data.content)) {
            wx.showToast({
                title: '请输入内容'
            })
            return;
        }

        if (Storage.didLogin()) {
            let queId = Tool.guid();
            let isExpertAns = this.index==0?'True':'False';
            let isAnonymity = this.data.isHideName?'True':'False';

            let rq = RequestWriteFactory.addQuestion(this.data.content, isExpertAns, isAnonymity, queId);
            rq.finishBlock = (req) => {
                wx.navigateBack({
                    delta:1
                })

                Tool.showSuccessToast("提问成功");

                //跳转到问题详情页面 todo
                wx.navigateTo({
                    url: '/pages/question/question-detail/question-detail?Id=' + queId,
                })

                Event.emit('LocalNotification_QA_Updated');
            };
            rq.addToQueue();
        } else {
            //请先登录
            Tool.showAlert("请先登录");
        }
    }
})