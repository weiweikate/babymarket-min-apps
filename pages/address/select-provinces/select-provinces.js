// 选择地区
let {Tool, RequestReadFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        areas: [], // 地区列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let con = "${CJS} == '1'";
        if (global.Tool.isValidStr(options)) {
            let area = JSON.parse(options.extra);
            con = "${ParentId} == '" + area.Id + "'"
            wx.setNavigationBarTitle({
                title: area.FullName
            });
        }
        this.requestData(con);
    },

    /**
     * 数据请求
     */
    requestData: function (condition) {
        this.requestAreaInfo(condition);
    },

    /**
     * 查询地区
     */
    requestAreaInfo: function (condition) {
        let self = this;
        let r = RequestReadFactory.areaRead(condition);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                this.setData({
                    areas: datas,
                });
            }
        }
        r.addToQueue();
    },

    /**
     * 选中地区
     */
    selectArea: function (e) {
        let index = e.currentTarget.dataset.index;
        let areas = this.data.areas;
        if (areas[index].ZJS === "0") {
            //最后一级,返回数据
            let pages = getCurrentPages();
            let pageBOne = pages[pages.length - 2];// 前一页
            if (pageBOne.route == 'pages/address/add-address/add-address') {
                pageBOne.setData({
                    area: areas[index],
                })
                wx.navigateBack({
                    delta: 1,
                })
            }
        } else {
            //继续向下一层
            wx.redirectTo({
                url: '../select-provinces/select-provinces?extra=' + JSON.stringify(areas[index]),
            })
        }
    },
})