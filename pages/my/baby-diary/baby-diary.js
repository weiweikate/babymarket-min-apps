mother - circle - eye - icon.pngmother - circle - eye - icon.pngmother - circle - eye - icon.pngmother - circle - eye - icon.pngmother - circle - eye - icon.pngmother - circle - eye - icon.pngmother - circle - eye - icon.pngmother - circle - eye - icon.pngmother - circle - eye - icon.pngmother - circle - eye - icon.png// baby-diary.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [
            {
                'content':'111距离放假大家发',
                'height':500
            }, 
            {
                'content': '222发动机将垃圾分类的时间啊浪费教师节快乐肌肤的啦撒娇',
                'height': 600
            },
            {
                'content': '333诶人诶人跑去问 i 人品味哦 i破 i 哦呃我脾气肉鹅抛弃我 i哦 i 我脾气肉为疲软肉恶趣味日票',
                'height': 650
            },
            {
                'content': '444距离放假大家发',
                'height': 500
            },
            {
                'content': '555椰肉如诶颧我 u 日文哦取肉俄武器肉为 iu 人',
                'height': 580
            }],
            leftDatas:[],
            rightDatas:[],
            leftHeight:0,
            rightHeight:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let leftArry = this.data.leftDatas;
        let rightArry = this.data.rightDatas;

        for(let i = 0; i < this.data.listDatas.length; i++){
            let item = this.data.listDatas[i];
            let height = item.height;
            
            let balance = this.data.leftHeight - this.data.rightHeight;
            if (balance > 0 && balance >= height || (this.data.leftHeight != 0 && this.data.rightHeight == 0) ){//放右边
                rightArry.push(item);
                this.setData({
                    rightHeight: this.data.rightHeight + height
                });
            }else{
                leftArry.push(item);
                this.setData({
                    leftHeight: this.data.leftHeight + height
                });
            }
        }

        this.setData({
            leftDatas: leftArry,
            rightDatas: rightArry
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

    diaryCellTap:function(e){
        let index = e.currentTarget.dataset.index;
        let coloum = e.currentTarget.dataset.coloum;
        console.log('index:' + index);
        console.log('coloum:' + coloum);

        wx.navigateTo({
            url: '../baby-diary/baby-diary-detail/baby-diary-detail',
        })
    },

    addTap:function(){
        wx.navigateTo({
            url: '../baby-diary/add-baby-diary/add-baby-diary',
        })
    }
})