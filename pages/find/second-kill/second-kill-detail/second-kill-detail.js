// second-kill-detail.js
let { Tool, Storage, RequestReadFactory } = global

import WxParse from '../../../../libs/wxParse/wxParse.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        product:'',
        images:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let datas = wx.getStorageSync("secondKillDatas");
        this.setData({
            product:datas
        })

        WxParse.wxParse('article', 'html', datas.Description, this, 5);

        let conditon = "${RelevancyId} == '" + datas.ProductId + "' && ${RelevancyBizElement} == 'Attachments2'"
        this.requestAttachments(conditon);//查询附件
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
        wx.removeStorageSync("secondKillDatas")
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
     * 查询附件
     */
    requestAttachments: function (conditon) {
        let task = RequestReadFactory.attachmentsByIdRead(conditon);
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let arry = [];
            datas.forEach((item, index) => {
                arry = arry.concat(item.imageUrl);
            });
            this.setData({
                images: arry
            });
        }
        task.addToQueue();
    },

    /**
     * 马上抢、即将开始、已结束
     */
    onApplyClickListener: function (e) {
        let status = e.currentTarget.dataset.type;
        if (status == 0) {
            console.log("马上抢");
        } 
    }
})