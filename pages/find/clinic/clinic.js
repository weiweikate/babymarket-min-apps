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
        pageType:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.requestData();
        let type = options.type
        if(type == 0){//便便诊所
            wx.setNavigationBarTitle({
                title: '便便诊所',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
            })
        }else if(type == 1){//爱牙卫士
            wx.setNavigationBarTitle({
                title: '爱牙卫士',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        }

        this.setData({
            pageType: options.type
        });
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
        if (this.data.pageType == 0) {//便便诊所
            wx.navigateTo({
                url: '../clinic/clinic-detail/clinic-detail',
            })
        } else if (this.data.pageType == 1){//爱牙卫士

        }

    },

    /**
     * 发起咨询
     */
    add: function () {
        if (this.data.pageType == 0) {//便便诊所
            wx.navigateTo({
                url: '../clinic/add-clinic/add-clinic',
            })
        } else if (this.data.pageType == 1) {//爱牙卫士
            wx.navigateTo({
                url: '../clinic/add-tooth-concult/add-tooth-concult',
            })
        }
    },

    /**
     * 我的咨询
     */
    mine: function () {
        if (this.data.pageType == 0) {//便便诊所
            wx.navigateTo({
                url: '../clinic/my-clinic/my-clinic',
            })
        } else if (this.data.pageType == 1) {//爱牙卫士

        }
    },
    /**
     * 知识库
     */
    knowledge: function () {

    },
})