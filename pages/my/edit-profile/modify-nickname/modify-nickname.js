// modify-nickname.js
let { Tool, RequestWriteFactory, Event } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        modifyType:0,//0:修改昵称 1：修改宝宝姓名
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let value = options.type;
        let title = value == 0?'修改昵称':'宝宝姓名';
        this.setData({
            modifyType:value
        });
        wx.setNavigationBarTitle({
            title: title,
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

    okTap: function (e) {
        let name = e.detail.value.name;

        if (Tool.isEmptyStr(name)) {
            Tool.showAlert("昵称不能为空");
            return;
        }

        // if (!Tool.checkString(name)){
        //     Tool.showAlert("昵称由1-15个字符，可由中英文、数字组成");
        //     return;
        // }

        let r = RequestWriteFactory.modifyMemberInfo(name);
        r.finishBlock = (req) => {

            Event.emit('refreshMemberInfoNotice');//发出通知

            wx.navigateBack({
                delta:1
            })

        };
        r.addToQueue();
    }
})