// levy-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        adArray: ['', ''],
        tableList: ['图文详情', '用户的试用报告', '中奖的用户', '试用规则'],
        bottomBtn:{
            'title':'立即申请',
            'enable':true
        }
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

    levyDetailCellTap:function(e){
        let title = e.currentTarget.dataset.title;

        if(title == '图文详情'){

        } else if (title == '用户的试用报告'){

            wx.navigateTo({
                url: '/pages/find/levy/levy-report/levy-report',
            })
        } else if (title == '中奖的用户') {
            wx.navigateTo({
                url: '/pages/find/levy/levy-winner/levy-winner',
            })
        } else if (title == '试用规则') {

        }
    },

    bottomBtnTap:function(){
        wx.navigateTo({
            url: '/pages/find/levy/levy-apply/levy-apply',
        })
    }
})