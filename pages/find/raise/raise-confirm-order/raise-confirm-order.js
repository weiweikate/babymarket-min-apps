// raise-confirm-order.js
let { Tool, Storage, Network, RequestReadFactory, RequestWriteFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        product:'',
        count: '', //购买次数
        addressInfo:'',
        visiable:false,
        placeholder:'请输入密码'
    },
    mainId:'',
    password:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.mainId = options.mainId;
        this.setData({
            count: options.num
        })

        this.requestRaiseProduct();
        this.requestAddressInfo();
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
    * 众筹商品详情查询
    */
    requestRaiseProduct: function () {
        let task = RequestReadFactory.requestRaiseProductDetail(this.mainId);
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let item = datas[0];
            this.setData({
                product: item
            });
        };
        task.addToQueue();
    },

    /**
     * 查询地址
     */
    requestAddressInfo: function () {
        let self = this;
        let r = RequestReadFactory.addressRead();
        r.finishBlock = (req) => {
            if (req.responseObject.Count > 0) {
                let responseData = req.responseObject.Datas;
                this.setData({
                    addressInfo: responseData[0]
                });
            }
        }
        r.addToQueue();
    },

    /**
     * 地址选择
     */
    addressViewTap: function (e) {
        wx.navigateTo({
            url: '/pages/address/address?door=1'
        })
    },

    /**
     * 立即下单
     */
    submitTap:function(e){
        let hidden = this.data.visiable;
        this.setData({
            visiable: !hidden
        })
    },

    dismissInputAlert: function () {
        this.setData({
            showInputAlert: false//隐藏
        });
    },

    alertInputOnChange: function (e) {
        this.password = e.detail.value;

    },

    inputAlertBtnClicked: function (e) {
        let index = e.currentTarget.dataset.index;
        this.dismissInputAlert();

        if (index == 1) {//确定

            if (Tool.isEmptyStr(this.data.addressInfo)) {
                Tool.showSuccessToast('请填写地址');
                return;
            }

            let orderId = Tool.guid();
            let task = RequestWriteFactory.addRaiseOrder(this.data.count,
                this.mainId, this.data.addressInfo.Id, orderId, this.password);

            task.finishBlock = (req) => {

                wx.redirectTo({
                    url: '/pages/find/raise/raise-pay-success/raise-pay-success?mainId=' + orderId,
                })
            };
            task.addToQueue();
        }
    }

})