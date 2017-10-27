// second-kill-detail.js
let { Tool, Storage, RequestReadFactory } = global

import WxParse from '../../../../libs/wxParse/wxParse.js';
import RequestGetSystemTime from '../../../../network/requests/request-get-system-time';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        product:'',
        images:[]
    },
    mainId:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;

        this.requestProductDetail();
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
     * 查询秒杀商品详情
     */
    requestProductDetail: function () {
        let task = RequestReadFactory.requestSecKillProducts(this.mainId);
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let item = datas[0];

            this.setData({
                product: item
            });

            WxParse.wxParse('article', 'html', item.Description, this, 5);

            let conditon = "${RelevancyId} == '" + item.ProductId + "' && ${RelevancyBizElement} == 'Attachments2'"
            this.requestAttachments(conditon);//查询附件
            this.requestSystemTime();
        }
        task.addToQueue();
    },


    /**
     * 获取平台时间
     */
    requestSystemTime: function () {
        let task = new RequestGetSystemTime();
        task.finishBlock = (req) => {
            let time = req.responseObject.Now;
            let item = this.data.product;

            let timesInterval = Tool.timeIntervalFromString(time);
            let startInterval = Tool.timeIntervalFromString(item.Seckill_Datetime_Start);
            let endInterval = Tool.timeIntervalFromString(item.Seckill_Datetime_End);
            if (timesInterval >= startInterval
                && timesInterval <= endInterval) {
                if (parseInt(item.Surplus_Number) > 0) {
                    item.buyStatus = 0;//马上抢
                } else {
                    item.buyStatus = 1;//已结束
                }
            } else {
                item.buyStatus = 2;//即将开始
            }

            this.setData({
                product: item
            });

        }
        task.addToQueue();
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

            let requestData = [{
                'MemberId': Storage.memberId(),
                'ProductId': this.data.product.ProductId,
                'ProductImgUrl': this.data.product.imgUrl,
                'ProductName': this.data.product.Name,
                'Price': this.data.product.Need_Points,
                'Points': this.data.product.Need_Points,
                'Qnty': '1',
                'secondKillId':this.data.product.Id
            }];

            Storage.setterFor("orderLine", requestData);

            wx.navigateTo({
                url: '/pages/order/order-confirm/order-confirm?door=3',//3:秒杀
            })
        } 
    }
})