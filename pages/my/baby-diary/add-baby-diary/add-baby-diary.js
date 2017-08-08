// add-baby-diary.js
let { Tool } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isModify:false,
        date:'2017-08-08',
        endDate:'',
        imageUrl:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let pageType = options.type;
        if (pageType == 1){
            this.setData({
                isModify:true
            });

            wx.setNavigationBarTitle({
                title: '修改',
            })
        }

        let dateString = Tool.timeStringForDate(new Date(), "YYYY-MM-DD");
        this.setData({
            date: dateString,
            endDate: dateString,
        });
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

    dateChange:function(e){
        this.setData({
            date:e.detail.value
        });
    },

    selectImageTap:function(){
        let self = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                self.setData({
                    imageUrl: tempFilePaths[0]
                });
            }
        })
    }
})