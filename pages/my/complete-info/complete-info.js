// complete-info.js

let {Tool, Storage, RequestWriteFactory, RequestReadFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas:[
            {
                'inputName':'name',
                'title':'姓名',
                'placeholder':'请输入',
                'value':'',
            },
            {
                'inputName': 'birthDate',
                'title': '出生日期',
                'placeholder': '请选择',
                'value': '',
                'arrowShow': true
            },
            {
                'inputName': 'area',
                'title': '所在地区',
                'placeholder': '请选择',
                'value': '',
                'arrowShow': true
            },
            {
                'inputName': 'shopName',
                'title': '门店名称',
                'placeholder': '请选择',
                'value': '',
                'arrowShow': true
            },
            {
                'inputName': 'idCard',
                'title': '身份证号码',
                'placeholder': '请输入',
                'value': ''
            },
            {
                'inputName': 'alipay',
                'title': '支付宝账号',
                'placeholder': '请输入',
                'value': ''
            }
        ],
        area: {
            'FullName':'请选择'
        },
        birthDate:'请选择',
        sex:0,
        shopName:'请选择'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.requestData();
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
     * 地区选择
     */
    areaTap:function(){
        wx.navigateTo({
            url: '../../select-provinces/select-provinces',
        })
    },

    /**
     * 确定
     */
    formSubmit: function (e) {
        let value = e.detail.value;
        console.log('====form=====' + value);
        
        let name = value.name;
        let area = this.data.area.FullName;
        let areaId = this.data.area.SQId;
        let birthDate = value.birthDate;
        let shopName = value.shopName;
        let idCard = value.idCard;
        let alipay = value.alipay;
        
        if (Tool.isEmptyStr(name)){
            Tool.showAlert("请填写姓名");
            return;
        }

        if (Tool.isEmptyStr(birthDate)) {
            Tool.showAlert("请选择出生日期");
            return;
        }

        if (area == '请选择') {
            Tool.showAlert("请选择客户区域");
            return;
        }

        if (Tool.isEmptyStr(shopName)) {
            Tool.showAlert("请填写门店名称");
            return;
        }

        if (Tool.isEmptyStr(idCard)) {
            Tool.showAlert("请填写身份证号码");
            return;
        }

        if (Tool.isEmptyStr(alipay)) {
            Tool.showAlert("请填写支付宝账号");
            return;
        }

        if (Tool.isEmptyStr(companyTel)) {
            Tool.showAlert("请填写法人手机号码");
            return;
        }

        if (Tool.isEmptyStr(alipayAccount)) {
            Tool.showAlert("请填写法人支付宝账号");
            return;
        }

        let r = RequestWriteFactory.completeInfomationRequest(customName, areaId, receiptAddress, receiptName, receiptTel, companyName, companyTel, alipayAccount, withdrawPassword, confirmPassword);
        r.finishBlock = (req) => {
            wx.showToast({
                title: '操作成功！',
            })
            wx.navigateBack({
                delta:1
            })
        };
        r.addToQueue();
    },

    requestData:function(){
        let r = RequestReadFactory.completeInfoRead();
        r.finishBlock = (req, firstData) => {
            if (Tool.isValidStr(firstData.CityId)){
                let condition = "${Id} = '" + firstData.CityId + "'";
                let r = RequestReadFactory.areaRead(condition);
                r.finishBlock = (req, firstData) => {
                    this.setData({
                        area: {
                            'FullName': firstData.FullName,
                            'SQId': firstData.SQId
                        }
                    });
                };
                r.addToQueue();
            }

            this.setData({
                'datas[0].value': firstData.Name,
                'datas[1].value': firstData.CityId,
                'datas[2].value': firstData.ConsigneeAddress,
                'datas[3].value': firstData.Consignee,
                'datas[4].value': firstData.ConsigneeMobile,
                'datas[5].value': firstData.LegalRepresentative,
                'datas[6].value': firstData.LegalMobile,
                'datas[7].value': firstData.AlipayAccount,
            });
        };
        
        r.addToQueue();
    },

    maleTap:function(){
        this.setData({
            sex: 0
        });
    },

    femaleTap: function () {
        this.setData({
            sex: 1
        });
    },

    dateChanged:function(e){
        this.setData({
            birthDate: e.detail.value
        });
    },

    shopTap:function(){
        wx.navigateTo({
            url: '../complete-info/shop-list/shop-list',
        })
    }
})