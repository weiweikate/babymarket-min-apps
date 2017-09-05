// clinic-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        babyInfoList:[
            {
                'name':'宝宝姓名:',
                'value':'baby'
            },
            {
                'name': '年龄:',
                'value': '1个月5天'
            },
            {
                'name': '哺乳:',
                'value': '混合'
            },
            {
                'name': '辅食:',
                'value': '未添加辅食'
            },
            {
                'name': '饮水量:',
                'value': '约200ml'
            },
            {
                'name': '便便次数:',
                'value': '1天4次'
            },
            {
                'name': '拉粑粑时的表情:',
                'value': '皱眉'
            },
            {
                'name': '奶粉品牌:',
                'value': 'takecare'
            },
        ],

        attachments:['',''],
        attachmentShow:false,
        comments:['','']
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
     * 附加图片的显示隐藏
     */
    attachmentTap:function(){
        let show = this.data.attachmentShow
        this.setData({
            attachmentShow: !show
        });
    }
})