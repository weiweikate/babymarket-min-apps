// second-kill.js
let { Tool, Storage, RequestReadFactory } = global
import RequestGetSystemTime from '../../../network/requests/request-get-system-time';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navTabs:[],
        currentTab:0,
        listDatas:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestSecKillTimes();
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

    onTabChangeListener: function (e) {
        let currentIndex = e.detail.current;
        if (currentIndex == undefined) {
            currentIndex = e.currentTarget.dataset.current;
        }
        this.setData({
            currentTab: currentIndex
        });

        this.requestSecKillProducts();
    },

    /**
    * 秒杀时间段查询
    */
    requestSecKillTimes: function () {
        let task = RequestReadFactory.requestSecKillTime();
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            datas.forEach((item, index) => {
                item.MonthDay = Tool.timeStringForDateString(item.Seckill_Datetime, "MM.DD");
                item.date = Tool.timeStringForDateString(item.Seckill_Datetime, "HH:mm");
            });

            this.setData({
                navTabs: datas
            });

            this.requestSecKillProducts();
        };
        task.addToQueue();
    },

    /**
    * 秒杀商品列表查询
    */
    requestSecKillProducts: function (isLoadMore) {
        let index = 0;
        let productList = this.data.listDatas;
        let timeList = this.data.navTabs;
        let currentIndex = this.data.currentTab;
        if(isLoadMore){
            index = productList.length;
        }
        let item = timeList[currentIndex];

        let task = RequestReadFactory.requestSecKillProductsList(20, index, item.Id);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let arry = this.data.listDatas;
            if(isLoadMore){
                arry = arry.concat(datas);
            }else{
                arry = datas;
            }
            this.setData({
                listDatas: arry
            });

            //获取平台时间
            this.requestSystemTime();
        };
        task.addToQueue();
    },

    /**
     * 获取平台时间
     */
    requestSystemTime: function () {
        let task = new RequestGetSystemTime();
        task.finishBlock = (req) => {
            let time = req.responseObject.Now;
            let listDatas = this.data.listDatas;

            listDatas.forEach((item, index) => {
                let timesInterval = Tool.timeIntervalFromString(time);
                let startInterval = Tool.timeIntervalFromString(item.Seckill_Datetime_Start);
                let endInterval = Tool.timeIntervalFromString(item.Seckill_Datetime_End);
                if (timesInterval >= startInterval
                    && timesInterval <= endInterval){
                    if (parseInt(item.Surplus_Number) > 0){
                        item.buyStatus = 0;//马上抢
                    }else{
                        item.buyStatus = 1;//已结束
                    }
                }else{
                    item.buyStatus = 2;//即将开始
                }
            });

            this.setData({
                listDatas: listDatas
            });
 
        }
        task.addToQueue();
    },

    onItemClickListener:function(e){
        let index = e.currentTarget.dataset.index;

        let datas = this.data.listDatas[index];
        wx.navigateTo({
            url: '/pages/find/second-kill/second-kill-detail/second-kill-detail?mainId=' + datas.Id,
        })
    },

    /**
     * 马上抢、即将开始、已结束
     */
    onApplyClickListener:function(e){
        let status = e.currentTarget.dataset.type;
        let index = e.currentTarget.dataset.index;

        let datas = this.data.listDatas[index];
        if(status == 0){
            console.log("马上抢");

            let requestData = [{
                'MemberId': Storage.memberId(),
                'ProductId': datas.ProductId,
                'ProductImgUrl': datas.imgUrl,
                'ProductName': datas.Name,
                'Price': datas.Need_Points,
                'Points': datas.Need_Points,
                'Qnty': '1',
                'secondKillId': datas.Id
            }];

            Storage.setterFor("orderLine", requestData);

            wx.navigateTo({
                url: '/pages/order/order-confirm/order-confirm?door=3',//3:秒杀
            })

        }else{
            wx.navigateTo({
                url: '/pages/find/second-kill/second-kill-detail/second-kill-detail?mainId=' + datas.Id,
            })
        }
    }

})