// raise-previous.js
let { Tool, Storage, Network, RequestReadFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas:[],
        unWinPeriod:''
    },
    mainId: '',
    hasMore:true,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;

        this.requestRaiseProducts(false);
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
        if(this.hasMore){
            this.requestRaiseProducts(true);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 众筹商品列表查询
     */
    requestRaiseProducts: function (isLoadMore) {
        let index = 0;
        let order;
        let productList = this.data.listDatas;
        if (isLoadMore) {
            index = productList.length;
        }

        let condition = "${ProductId} == '" + this.mainId + "'";
        let task = RequestReadFactory.requestRaiseProducts(20, index, '${Periods_Number} DESC', condition);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let arry = self.data.listDatas;
            if (isLoadMore) {
                arry = arry.concat(datas);
            } else {
                //去除未揭晓的期数
                arry = datas;

                let item = datas[0];
                if (item.Win_Number == '0'){
                    self.setData({
                        unWinPeriod: item.Periods_Number
                    })

                    arry.splice(0,1)
                }
            }
            self.setData({
                listDatas: arry
            });

            self.hasMore = true;
            if (arry.length >= req.responseObject.Total) {
                self.hasMore = false;
            }
        };
        task.addToQueue();
    },

})