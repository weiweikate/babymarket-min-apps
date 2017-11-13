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
        sex:1,
        shopName:'请选择',
        shopId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
         this.requestData();
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
            url: '/pages/address/select-provinces/select-provinces',
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
        let areaId = this.data.area.AreaId;
        let birthDate = this.data.birthDate;
        let shopName = this.data.shopName;
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

        let params = {
            "MemberId": global.Storage.memberId(),
            "SexKey": this.data.sex+'',
            "Name": name,
            "DateOfBirth": birthDate,
            "IdCard": idCard,
            "AlipayAccount": alipay,
            "AreaId": areaId,
            "ShopName": shopName,
            "ShopId": this.data.shopId,
        };

        let r = RequestWriteFactory.addLevyApply(params);
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
        let r = RequestReadFactory.requestStoreMemberInfo();
        r.finishBlock = (req, firstData) => {

            this.setData({
                sex: firstData.SexKey,
                birthDate: Tool.timeStringForDateString(firstData.DateOfBirth, 'YYYY-MM-DD'),
                shopName: firstData.ShopName,
                shopId: firstData.ShopId,

                'datas[0].value': firstData.Name,
                'datas[4].value': firstData.IdCard,
                'datas[5].value': firstData.AlipayAccount,

                area: {
                    'FullName': firstData.FullName,
                    'AreaId': firstData.AreaId
                }

            });
        };
        
        r.addToQueue();
    },

    maleTap:function(){
        this.setData({
            sex: 1
        });
    },

    femaleTap: function () {
        this.setData({
            sex: 2
        });
    },

    dateChanged:function(e){
        this.setData({
            birthDate: e.detail.value
        });
    },

    shopTap:function(){
        let areaId = this.data.area.AreaId;
        if(Tool.isEmpty(areaId)){
            Tool.showSuccessToast('请先选择所在地区');
            return;
        }

        wx.navigateTo({
            url: '/pages/my/complete-info/shop-list/shop-list?cityId=' + this.data.area.AreaId
        })
    }
})