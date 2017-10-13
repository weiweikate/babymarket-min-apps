// question.js

let { Tool, Storage, RequestReadFactory, Event } = global

Page({

    /**
     * 页面的初始数据 
     */
    data: {
        navTabs: [
            {
                'Name': '最新'
            },
            {
                'Name': '同龄'
            }, 
            {
                'Name': '精选'
            },
        ],
        currentTab:0,
        dataArry:['','',''],
        listDatas:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData(this.data.currentTab);
        Event.on('LocalNotification_QA_Updated', this.requestData, this);
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
        Event.off('LocalNotification_QA_Updated', this.requestData);
    },
    

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.requestData(this.data.currentTab);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadmore(this.data.currentTab);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * swiper切换事件
     */
    onTabChangeListener: function (e) {
        let currentIndex = e.detail.current;
        if (currentIndex == undefined) {
            currentIndex = e.currentTarget.dataset.current;
        }
        this.setData({
            currentTab: currentIndex
        });

        //如果分类的主体数据为空，那么去请求主体数据
        let oneSort = this.data.dataArry[currentIndex];
        if (oneSort.bodyData == undefined && currentIndex > 0) {
             Tool.showLoading();
             this.requestData(currentIndex);
        }else{
            this.setData({
                listDatas: oneSort
            });
        }
    },

    replyTap:function(e){
        let index = e.currentTarget.dataset.index;
        wx.setStorageSync('questionDatas', this.data.listDatas[index]);

        wx.navigateTo({
            url: '/pages/question/question-reply/question-reply',
        })
    },

    cellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let datas = this.data.listDatas[index];
        wx.navigateTo({
            url: '/pages/question/question-detail/question-detail?Id=' + datas.Id,
        })
    },

    /**
     * 提问
     */
    createquestionTap:function(){
        wx.showActionSheet({
            itemList: ['向专家提问', '向其他宝妈提问'],
            success: function (res) {
                console.log(res.tapIndex)
                wx.navigateTo({
                    url: '/pages/question/question-create/question-create?index=' + res.tapIndex,
                })
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    /**
    * 孕育问答
    */
    requestData: function (tabIndex) {
        let condition = "${BreedQueAnsId} == '" + global.TCGlobal.EmptyId + "'";
        
        let babyDays = '1';
        if (Storage.didLogin){
            let memberInfo = Storage.currentMember();
            babyDays = memberInfo.BabyBirthDays; 
        }

        if(tabIndex == 1){//同龄
            condition = condition + "&& ${BabyDay} == ' " + babyDays + "'";
        } else if (tabIndex == 2) {//精选
            condition = condition + "&& ${IsHandpick} == 'True' ";
        }

        let r = RequestReadFactory.requestQAWithCondition(condition, 0, 20);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            let arry = self.data.dataArry;
            arry.splice(tabIndex,1,datas);
            self.setData({
                listDatas: datas,
                dataArry:arry
            })
        };
        r.addToQueue();
    },

    loadmore: function (tabIndex) {
        let condition = "${BreedQueAnsId} == '" + global.TCGlobal.EmptyId + "'";

        let babyDays = '1';
        if (Storage.didLogin) {
            let memberInfo = Storage.currentMember();
            babyDays = memberInfo.BabyBirthDays;
        }

        if (tabIndex == 1) {//同龄
            condition = condition + "&& ${BabyDay} == ' " + babyDays + "'";
        } else if (tabIndex == 2) {//精选
            condition = condition + "&& ${IsHandpick} == 'True' ";
        }

        let r = RequestReadFactory.requestQAWithCondition(condition, this.data.listDatas.length, 20);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {

            });

            let listDatas = self.data.listDatas.concat(datas);
            let arry = self.data.dataArry;
            arry.splice(tabIndex, 1, listDatas);
            self.setData({
                listDatas: listDatas,
                dataArry: arry
            })
        };
        r.addToQueue();
    },
})