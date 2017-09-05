// clinic.js
let { Tool, Event, RequestReadFactory} = global;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dataList: ['',''],
        hasList:true,
        dataIndex:0,
        totalNum:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.requestData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
        // this.requestData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
         //this.requestAdvisoryMoreInfo();
    },

    /**
     * 数据请求
     */
    requestData: function () {
        // 清空数据
        this.setData({
            dataList: [],
        });
        //this.requestAdvisoryInfo();
    },

    /**
     * 查询咨询
     */
    requestAdvisoryInfo: function () {
        let self = this;
        let r = RequestReadFactory.advisoryRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let totalNum = req.responseObject.Total;
            if (datas.length > 0) {
                for (let j = 0; j < datas.length; j++) {
                    datas[j].image = global.Tool.imageURLForId(datas[j].Head_PictureId);
                }
                this.setData({
                    hasList: true,
                    dataList: datas,
                    dataIndex: datas.length,
                    totalNum: totalNum,
                });
            } else {
                this.setData({
                    hasList: false,
                    dataList: [],
                });
            }
        }
        r.addToQueue();
    },

    /**
     * 查询咨询(上拉加载)
     */
    requestAdvisoryMoreInfo: function () {
        let self = this;
        let r = RequestReadFactory.advisoryRead(this.data.dataIndex);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                for (let j = 0; j < datas.length; j++) {
                    datas[j].image = global.Tool.imageURLForId(datas[j].Head_PictureId);
                }
                let totalDatas = self.data.carts.concat(datas);
                this.setData({
                    hasList: true,
                    dataList: totalDatas,
                    dataIndex: this.data.dataIndex + datas.length,
                });
            }
        }
        r.addToQueue();
    },

    /**
     * 咨询详情
     */
    goDetail: function () {
        wx.navigateTo({
            url: '../clinic/clinic-detail/clinic-detail',
        })
    },

    /**
     * 发起咨询
     */
    add: function () {
        wx.navigateTo({
            url: '../clinic/add-clinic/add-clinic',
        })
    },

    /**
     * 我的咨询
     */
    mine: function () {
        wx.navigateTo({
            url: '../clinic/my-clinic/my-clinic',
        })
    },
    /**
     * 知识库
     */
    knowledge: function () {

    },
})