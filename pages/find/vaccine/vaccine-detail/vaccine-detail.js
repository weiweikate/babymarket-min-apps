// vaccine-detail.js
import WxParse from '../../../../libs/wxParse/wxParse.js';
let { Tool } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas:'',
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let datas = wx.getStorageSync('vaccineDatas');
        WxParse.wxParse('article', 'html', datas.Content, this, 5);

        this.setData({
            datas:datas
        })

        if (Tool.isValidStr(datas.Vaccine)){
            wx.setNavigationBarTitle({
                title: datas.Vaccine,
            })
        }
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
        wx.removeStorageSync('vaccineDatas')
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
        let self = this;
        return {
            title: self.data.datas.Vaccine + ' 疫苗简介',
            path: '/pages/find/vaccine/vaccine-detail/vaccine-detail',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})