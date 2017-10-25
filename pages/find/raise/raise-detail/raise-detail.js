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
        buyViewShow:false,

        count:1, //购买数量
        buyNumbers: [10, 20, 50],
        buyNumberSelectIndex:100,

        remainPoins:0, //可用积分

        joinRecords:['',''], //参与记录

        winInfo:''//中奖信息
    },
    mainId:'',
    buyCount: 0,  //参与次数

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;
        this.requestRaiseProduct();

        let memberInfo = Storage.currentMember();
        let points = memberInfo.Point;
        this.setData({
            remainPoins:points
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

    dismissTap:function(){
        this.setData({
            buyViewShow: false
        });
    },

    cellTextViewTap: function (e) {
        let title = e.currentTarget.dataset.title;
        let Id = this.data.product.Id;
    
        if (title === '图文详情') {
            wx.navigateTo({
                url: '/pages/find/raise/raise-product-detail/raise-product-detail?mainId=' + Id,
            })
        }
    },

    /**
     * 立即参与
     */
    onApplyClickListener:function(){
        let hidden = this.data.buyViewShow;
        this.setData({
            buyViewShow: !hidden
        });
    },

    /**
     * 立即参与
     */
    joinTap:function(){
        this.setData({
            buyViewShow: false
        });

        let needPoints = this.data.count * parseInt(this.data.product.Price);
        if (needPoints > this.data.remainPoins){
            Tool.showSuccessToast('积分不足，兑换失败！');
        }
        
        wx.navigateTo({
            url: '/pages/find/raise/raise-confirm-order/raise-confirm-order?mainId=' 
            + this.data.product.Id + '&num=' + this.data.count,
        })
    },

    /**
     * 数量减点击
     */
    counterSubClicked() {
        let count = this.data.count - 1;
        if (count < 1 || count == undefined) {
            count = 1;
        }

        //盘算圆盘选中index
        let index = 100;
        if (count >= this.data.buyNumbers[2]){
            index = 2;
        } else if (count >= this.data.buyNumbers[1]){
            index = 1;
        } else if (count >= this.data.buyNumbers[0]) {
            index = 0;
        }

        this.setData({
            count: count,
            buyNumberSelectIndex:index
        })
    },

    /**
     * 数量加点击
     */
    counterAddClicked() {
        let count = this.data.count  +1;
        let maxCount = this.data.product.Remain_Need_Count;
        if (count > maxCount) {
            count = maxCount;
        }

        //盘算圆盘选中index
        let index = 100;
        if (count >= this.data.buyNumbers[2]) {
            index = 2;
        } else if (count >= this.data.buyNumbers[1]) {
            index = 1;
        } else if (count >= this.data.buyNumbers[0]) {
            index = 0;
        }

        this.setData({
            count: count,
            buyNumberSelectIndex: index
        })
    },

    /**
     * 数量加点击
     */
    counterInputOnChange:function(e){

    },

    /**
     * 购买次数选择
     */
    buyNumbersTap: function(e){
        let index = e.currentTarget.dataset.index;
        let maxCount = this.data.product.Remain_Need_Count;
        if (count > maxCount) {
            return;
        }

        this.setData({
            count: count,
            buyNumberSelectIndex:index
        })
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
                this.requestRaiseOrderList();
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

            let memberId = Storage.memberId();
            let totalNumber = 0;
            let winInfo = {};
            datas.forEach((item, index) => {//判断登录者是否参与
                if(item.MemberId == memberId){
                    totalNumber += parseInt(item.Buy_Count);
                }

                if (Tool.isTrue(item.Is_Win)) {//获取中奖信息
                    winInfo.Win_Number = item.Win_Number;
                    winInfo.NickName = item.NickName;
                    winInfo.CreateTime = item.CreateTime;
                    winInfo.Buy_Count = item.Buy_Count;
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
                joinRecords: datas,
                winInfo:winInfo
            });
        };
        task.addToQueue();
    },
})