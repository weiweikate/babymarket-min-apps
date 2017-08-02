// index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: ['', ''],
        toolList: [
            {
                'imageUrl': '/res/img/index/index-tool-eat-icon.png',
                'title': '能不能吃'
            },
            {
                'imageUrl': '/res/img/index/index-tool-vaccine-icon.png',
                'title': '宝贝疫苗'
            }, 
            {
                'imageUrl': '/res/img/index/index-tool-baby-food-icon.png',
                'title': '辅食大全'
            }, 
            {
                'imageUrl': '/res/img/index/index-tool-lib-icon.png',
                'title': '工具库'
            },

        ]
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

    /**
     * 我要提问
     */
    questionTap:function(){
        console.log('我要提问');
    },

    questionListTap:function(){
        console.log('进入孕育问答页面');
        wx.navigateTo({
            url: '../question/question',
        })
    },

    toolCellTap:function(e){
        let title = e.currentTarget.dataset.title;
        console.log(title);
    },

    leftArrowTap:function(){
        console.log('日期减1');
    },

    rightArrowTap: function () {
        console.log('日期加1');
    },

    searchTap: function () {
        console.log('搜索');
    }
})