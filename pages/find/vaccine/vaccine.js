// vaccine.js
let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [],
        toDay: 0,
        finishList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestVaccineTime();
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
     * 疫苗时间列表查询
     */
    requestVaccineTime: function () {
        let task = RequestReadFactory.requestVaccineTime();
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let memberInfo = Storage.currentMember();
            let babyBirthday = Tool.timeStringForDateString(memberInfo.BabyBirthday, "YYYY-MM-DD");
            if (!Storage.didLogin()) {
                babyBirthday = Tool.timeStringForDate(new Date(), "YYYY-MM-DD");
            }

            datas.forEach((item, index) => {//头部日期处理
                let day = parseInt(item.Day);
                if (day == 1) {
                    item.time = Tool.timeStringForDateString(babyBirthday, "YYYY.MM月DD日") + '  出生当天';
                } else {
                    let date = Tool.dateFromString(babyBirthday);
                    let timeInterval = Tool.timeIntervalFromDate(date, (day - 1) * 24 * 3600);
                    let dateStr = Tool.timeStringFromInterval(timeInterval, "YYYY.MM月DD日");
                    item.time = dateStr + '  ' + item.Name;
                }
            });

            this.setData({
                listDatas: datas
            });

            self.requestVaccineRecord();
        };
        task.addToQueue();
    },

    /**
     * 疫苗记录查询
     */
    requestVaccineRecord: function () {
        let task = RequestReadFactory.requestVaccineRecord();
        let self = this;
        task.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let timeDatas = self.data.listDatas;

            datas.forEach((item, index) => {
                timeDatas.forEach((timeItem, timeIndex) => {
                    let subDatas = timeItem.Sub;

                    subDatas.forEach((subItem, subIndex) => {
                        if (subItem.Id == item.VaccineId) {
                            subItem.isFinish = true;//已完成
                        }
                    });
                });
            });

            self.setData({
                listDatas: timeDatas,
                finishList: datas
            });

            self.updateNextTimeDays();
        };
        task.addToQueue();
    },

    /**
     * 距离下次疫苗的时间
     */
    updateNextTimeDays: function () {
        let datas = this.data.listDatas;
        let memberInfo = Storage.currentMember();
        let babyDays = 1;
        if (Storage.didLogin()) {
            babyDays = parseInt(memberInfo.BabyBirthDays);
        }

        let isFind = false;
        for (let i = 0; i < datas.length && !isFind; i++) {
            let item = datas[i];
            let subDatas = item.Sub;
            for (let j = 0; j < subDatas.length && !isFind; j++) {
                let subItem = subDatas[j];
                let day = parseInt(subItem.Day) - babyDays;//还需要多少天打此疫苗
                if (day >= 0 && (!subItem.isFinish || subItem.isFinish == 'undefined')) {
                    this.setData({
                        toDay: day
                    })
                    isFind = true;
                    item.select = parseInt(item.Day) - day == babyDays;
                }
            }
        }

        this.setData({
            listDatas: datas
        })
    },

    /**
     * 选中、取消
     */
    checkButtonTap: function (e) {
        let index = e.currentTarget.dataset.mainindex;
        let subIdx = e.currentTarget.dataset.subidx;

        let listDatas = this.data.listDatas;
        let datas = listDatas[index];
        let sub = datas.Sub[subIdx];

        let self = this;
        if (sub.isFinish) {//--->取消疫苗记录
            let recordId = '';
            let finishList = this.data.finishList;
            for (let i = 0; i < finishList.length; i++) {
                let item = finishList[i];
                if (item.VaccineId == sub.Id) {
                    recordId = item.Id;
                    break;
                }
            }

            let task = RequestWriteFactory.cancelVaccineRecord(recordId);
            task.finishBlock = (req) => {
                Tool.showSuccessToast("疫苗未完成");

                sub.isFinish = false;
                datas.Sub.splice(subIdx, 1, sub);
                listDatas.splice(index, 1, datas);
                self.setData({
                    listDatas: listDatas
                })

                //更新疫苗记录表
                self.requestVaccineRecord();
            };
            task.addToQueue();
        } else {//--->新增疫苗记录
            let vaccineId = Tool.guid();
            let task = RequestWriteFactory.addVaccineRecord(sub.Id);
            task.finishBlock = (req) => {
                Tool.showSuccessToast("完成了一个疫苗，棒棒~");

                sub.isFinish = true;
                datas.Sub.splice(subIdx, 1, sub);
                listDatas.splice(index, 1, datas);
                self.setData({
                    listDatas: listDatas
                })

                //更新疫苗记录表
                self.requestVaccineRecord();
            };
            task.addToQueue();
        }
    },

    vaccineCellTap: function (e) {
        let index = e.currentTarget.dataset.mainindex;
        let subIdx = e.currentTarget.dataset.subidx;

        let datas = this.data.listDatas[index];
        let sub = datas.Sub[subIdx];

        wx.setStorageSync('vaccineDatas', sub)
        wx.navigateTo({
            url: '/pages/find/vaccine/vaccine-detail/vaccine-detail',
        })
    },

})