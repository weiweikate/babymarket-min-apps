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
        ],
        signLeft:600,
        signTop:880
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
        wx.navigateTo({
            url: '../question/question',
        })
    },

    toolCellTap:function(e){
        let title = e.currentTarget.dataset.title;
        console.log(title);
        if(title == '能不能吃'){
            wx.navigateTo({
                url: '../eat/eat',
            })
        }
    },

    leftArrowTap:function(){
        console.log('日期减1');
    },

    rightArrowTap: function () {
        console.log('日期加1');
    },

    searchTap: function () {
        console.log('搜索');
    },

    signMove:function(e){ 
        let clientX = e.touches[0].clientX;
        let clientY = e.touches[0].clientY;
        let left = e.touches[0].clientX * 2;
        let top = e.touches[0].clientY * 2;
        if(left < 0){
            left = 0;
        }

        if (top < 0){
            top = 0;
        }
        if (left > 620) {
            left = 620;
        }
        if (top > 980) {
            top = 980;
        }

        this.setData({
            signLeft: left,
            signTop: top
        });
    },

    signTap:function(){
        wx.navigateTo({
            url: '../my/sign/sign',
        })
    }
})