// raise-detail.js
let { Tool, Storage, Network, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        product: '',
        images: [],
        tableList: ['图文详情', '往期揭晓'],
        joinStatus:'',
    },
    mainId:'',
    buyCount: 0,  //参与次数

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;
        this.requestRaiseProduct();
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

    cellTextViewTap: function (e) {
        let title = e.currentTarget.dataset.title;
        let Id = this.data.product.Id;
        if (title === '图文详情') {
            wx.request({
                url: Tool.generateURL(Network.sharedInstance().raiseURL, { 'Id': Id }),

                success: function (res) {
                    console.log(res.data)

                    wx.setStorageSync('vaccineDatas', res.data)
                    wx.navigateTo({
                        url: '/pages/find/vaccine/vaccine-detail/vaccine-detail',
                    })
                }
            })
        }
    },

    /**
     * 查询附件
     */
    requestAttachments: function (id) {
        let task = RequestReadFactory.attachmentsRead(id, 'Attachments2');
        task.finishBlock = (req) => {
            let imageUrls = req.responseObject.imageUrls;
            this.setData({
                images: imageUrls
            });
        }
        task.addToQueue();
    },

    /**
     * 众筹商品详情查询
     */
    requestRaiseProduct: function () {
        let task = RequestReadFactory.requestRaiseProductDetail(this.mainId);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let item = datas[0];
            this.setData({
                product: item
            });

            if (!item.isStart){
                this.setData({
                    joinStatus: '本期众筹即将开始'
                });
            }else{
                this.requestWinList();
            }

            this.requestAttachments(item.ProductId);//查询附件
        };
        task.addToQueue();
    },

    /**
     * 登录者是否参与是否中奖查询
     */
    requestRaiseOrderList: function () {
        let condition = "${Crowd_FundingId} == '" + this.mainId + "'";
        let task = RequestReadFactory.requestRaiseOrderList(condition, 99999, 0);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let memberId = Storage.sharedInstance().memberId;
            let totalNumber = 0;
            datas.forEach((item, index) => {
                if(item.MemberId == memberId){
                    totalNumber += item.Buy_Count;
                }
            });

            this.buyCount = totalNumber;
            let status = '';
            if (totalNumber == 0){
                status = "您没有参与本次众筹"
            }else{
                status = "本期众筹您参与了" + totalNumber + "人次"
            }
            this.setData({
                joinStatus: status,
            });
        };
        task.addToQueue();
    },
})