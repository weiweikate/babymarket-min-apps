// group-buy-detail.js
let { Tool, Storage, RequestReadFactory } = global
import WxParse from '../../../../libs/wxParse/wxParse.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        product: '',
        images: []
    },
    mainId:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let datas = wx.getStorageSync("groupBuyDatas");
        this.mainId = options.mainId;
        
        let relevancyId = this.mainId;
        if (Tool.isValidObject(datas) && Tool.isValidStr(datas.Id)){
            relevancyId = datas.Id;
            this.setData({
                product: datas
            })
            WxParse.wxParse('article', 'html', datas.ReadDescripition, this, 5);
            
        } else if (Tool.isValidStr(this.mainId)){
            //查询商品详情
            this.requestActivityDetail();
        }
        let conditon = "${RelevancyId} == '" + relevancyId + "' && ${RelevancyBizElement} == 'Attachments'"
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
        wx.removeStorageSync("groupBuyDatas")
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
     * 查询商品详情
     */
    requestActivityDetail: function () {
        let task = RequestReadFactory.requestActivityDetail(this.mainId);
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            datas.forEach((item, index) => {
                let imageUrl = Tool.imageURLForId(item.ImgId, '/res/img/common/common-avatar-default-icon.png');
                item.imageUrl = imageUrl;
            });

            this.setData({
                product: datas[0]
            });

            WxParse.wxParse('article', 'html', datas[0].ReadDescripition, this, 5);
        }
        task.addToQueue();
    },

    /**
     * 团购规则
     */
    ruleTap:function(){

        wx.navigateTo({
            url: '/pages/find/group-buy/group-buy-rule/group-buy-rule?type=1',
        })
    }
})