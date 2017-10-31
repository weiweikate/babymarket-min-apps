// award-detail.js
let { Tool, RequestReadFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas:[],
        startDate: '',
        endDate: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    datePickerChange:function(e){
        let typeInput = e.currentTarget.dataset.type;
        let date = e.detail.value;
        if (typeInput =='start'){
            this.setData({
                startDate: date
            })
        }else{
            this.setData({
                endDate: date
            })
        }
    },

    /**
     * 确定
     */
    submitTap:function(){
        let condition = "${Date} >= '" + this.data.startDate + "' && ${Date} <= '" + this.data.endDate + "'";
        let r = RequestReadFactory.requestAwardFilterList(condition);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let item = {
                "Brand":"品牌",
                "RewardMoney":"奖励"
            }

            datas.unshift(item);

            this.setData({
                listDatas: datas
            });
        };
        r.addToQueue();
    }

})