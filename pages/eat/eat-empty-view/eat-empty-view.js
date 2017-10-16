// eat-empty-view.js
let { Tool, Storage, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchKey: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let searchKey = options.searchKey;
        this.setData({
            searchKey: searchKey
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

    /**
     * 问问宝妈们
     */
    questionTap:function(){
        let content = this.data.searchKey + '能不能吃？';
        wx.navigateTo({
            url: '/pages/question/question-create/question-create?content=' + content + '&index=1',
        })
    },

    /**
  * 搜索
  */
    onConfirmAction: function (e) {
        console.log(e.detail.value);
        let value = e.detail.value;

        if (Tool.isEmptyStr(value)) {
            Tool.showSuccessToast('请输入搜索关键字');
            return;
        }

        this.searchFood(value);
    },

    /**
     * 食物查询
     */
    searchFood: function (text) {
        let condition = "StringIndexOf(${Hunt},'" + text + "') > 0";

        let r = RequestReadFactory.requestFoodList(0, 1, condition);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            if (total <= 0) {//没有搜索记录，跳转到空页面
                this.setData({
                    searchKey: text
                })
            } else if (total == 1) {//只有1条记录，跳转到食物详情页
                wx.setStorageSync('foodDatas', datas[0]);

                wx.navigateTo({
                    url: '/pages/eat/food-detail/food-detail',
                })
            } else {//有多条记录，跳转到列表页
                wx.navigateTo({
                    url: '../eat/eat-food-list/eat-food-list?searchKey=' + text,
                })
            }
        };
        r.addToQueue();
    }
})