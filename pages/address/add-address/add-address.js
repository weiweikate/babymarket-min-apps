// 新增地址
let {Tool, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        provinces: '请选择',
        area: {},
        name: '',
        mobile: '',
        detail: '',
        num: 0,// 0为新增，1为修改
        address: {},
    },

    /**
        * 生命周期函数--监听页面加载
        */
    onLoad: function (options) {
        if (global.Tool.isValidStr(options)) {
            let address = JSON.parse(options.extra);
            if (global.Tool.isValidObject(address)) {
                this.setData({
                    name: address.Consignee,
                    mobile: address.Mobile,
                    detail: address.Address1,
                    provinces: address.FullName,
                    num: 1,
                    address: address,
                })
                wx.setNavigationBarTitle({
                    title: "修改收货地址"
                });
            }
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let area = this.data.area;
        if (global.Tool.isValidObject(area)) {
            this.setData({
                provinces: area.FullName,
            })
        }
    },

    /**
     * 添加地址
     */
    addAddress: function (e) {
        let addressInfo = e.detail.value;
        let addressname = addressInfo.addressname;
        let addressmobile = addressInfo.addressmobile;
        let addressidentity = addressInfo.addressidentity;
        let addressdetail = addressInfo.addressdetail;

        // 判断是否填写信息
        if (Tool.isEmptyStr(addressname)) {
            Tool.showAlert("请填写收货人姓名");
            return false;
        };
        if (Tool.isEmptyStr(addressmobile)) {
            Tool.showAlert("请填写收货人手机号码");
            return false;
        };
        let pro = this.data.provinces;
        if (pro === '请选择') {
            Tool.showAlert("请选择省市区");
            return false;
        };
        if (Tool.isEmptyStr(addressdetail)) {
            Tool.showAlert("请填写收货人详细地址");
            return false;
        };
        let num = this.data.num;
        if (num == 1) {
            // 修改地址
            this.modify(addressname, addressmobile, addressdetail, addressidentity);
        } else {
            // 新增地址
            this.add(addressname, addressmobile, addressdetail, addressidentity);
        }

    },

    /**
     * 修改地址
     */
    modify: function (addressname, addressmobile, addressdetail, addressidentity) {
        let address = this.data.address;
        let area = this.data.area;

        let areaFullName = "";
        let areaId = "";

        if (global.Tool.isValidObject(area)) {
            // 修改地址修改省市区
            areaFullName = area.FullName;
            areaId = area.Id;
        } else {
            // 修改地址未修改省市区
            areaFullName = address.FullName;
            areaId = address.DistrictId;
        }
        let r = RequestWriteFactory.modifyDetailAddress(address.Default, addressname, addressmobile, areaFullName, addressdetail, areaId, address.Id, addressidentity);
        r.finishBlock = (req) => {
            let pages = getCurrentPages();
            let pageBOne = pages[pages.length - 2];// 前一页
            pageBOne.setData({
                num: 1
            })
            // 返回前一页面
            wx.navigateBack({
                delta: 1,
            })
        }
        r.addToQueue();
    },

    /**
     *
     *新增地址
     */
    add: function (addressname, addressmobile, addressdetail, addressidentity) {
        let area = this.data.area;
        let id = global.Tool.guid();
        let r = RequestWriteFactory.addAddress(id,addressname, addressmobile, area.FullName, addressdetail, area.Id, addressidentity);
        r.finishBlock = (req) => {
            let pages = getCurrentPages();
            let pageBOne = pages[pages.length - 2];// 前一页
            if (pageBOne.route == 'pages/order-confirm/order-confirm') {
                //返回确认订单
                pageBOne.setData({
                    addressData: {
                        Consignee: addressname,
                        Mobile: addressmobile,
                        Address: area.FullName + addressdetail,
                        addressId: id,
                        Card: addressidentity,
                    },
                    num: 1,
                })
            }
            if (pageBOne.route == 'pages/address/address') {
                //返回地址列表
                pageBOne.setData({
                    num: 1
                })
            }
            // 返回前一页面
            wx.navigateBack({
                delta: 1,
            })
        }
        r.addToQueue();
    },

    /**
     * 选择省市区 select-provinces
     */
    selectProvinces: function () {
        wx.navigateTo({
            url: '../select-provinces/select-provinces',
        })
    }

})