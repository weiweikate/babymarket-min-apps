// index.js
let { Tool, Storage, RequestReadFactory} = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [],
        toolList: [
            {
                'imageUrl': '/res/img/index/index-tool-eat-icon.png',
                'title': '能不能吃'
            },
            {
                'imageUrl': '/res/img/index/index-tool-vaccine-icon.png',
                'title': '宝贝疫苗'
            }, 
            {
                'imageUrl': '/res/img/index/index-tool-baby-food-icon.png',
                'title': '辅食大全'
            }, 
            {
                'imageUrl': '/res/img/index/index-tool-lib-icon.png',
                'title': '工具库'
            },
        ],
        babyImageUrl:'/res/img/index/index-baby-avatar-icon.png',
        weightHeight:'',
        babyAge:'',
        babyName:'',
        ageDesp:'',

        questionContent:'',

        signLeft:600,
        signTop:880,
        today:'',
        todayHidden:true
    },
    currentDate: new Date(),
    days:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取今天日期
        this.updateDate(new Date());

        if (global.Storage.didLogin()) {//如果登陆状态，获取用户信息
            this.readMemberInfo();
        }else{//未登录状态，默认展示宝宝1天年龄的信息
            this.setData({
                babyImageUrl: '/res/img/index/index-baby-avatar-icon.png'
            });

            //更新宝宝年龄
            this.readBabyAgeDescriptionWithDay(1);
        }

        //获取今天的孕育问答头条
        this.readQAList();
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
     * 我要提问
     */
    questionTap:function(){
        console.log('我要提问');
    },

    questionListTap:function(){
        wx.navigateTo({
            url: '../question/question',
        })
    },

    /**
     * 四个工具 点击
     */
    toolCellTap:function(e){
        let title = e.currentTarget.dataset.title;
        console.log(title);
        if(title == '能不能吃'){
            wx.navigateTo({
                url: '../eat/eat',
            })
        }
    },

    leftArrowTap:function(){
        console.log('日期减1');

        if(this.days - 1 > 0){
            let timeInterval = Tool.timeIntervalFromDate(this.currentDate, -24 * 3600);
            let dateString = Tool.timeStringFromInterval(timeInterval, 'YYYY MM-DD HH:mm');
            let date = Tool.dateFromString(dateString);

            this.updateDate(date);
            this.readBabyAgeDescriptionWithDay(this.days - 1);
        }
    },

    rightArrowTap: function () {
        console.log('日期加1');

        let timeInterval = Tool.timeIntervalFromDate(this.currentDate, 24 * 3600);
        let dateString = Tool.timeStringFromInterval(timeInterval, 'YYYY MM-DD HH:mm');
        let date = Tool.dateFromString(dateString);

        this.updateDate(date);
        this.readBabyAgeDescriptionWithDay(this.days + 1);
    },

    searchTap: function () {
        console.log('搜索');
    },

    /**
     * 签到图标 拖动
     */
    signMove:function(e){ 
        let clientX = e.touches[0].clientX;
        let clientY = e.touches[0].clientY;
        let left = e.touches[0].clientX * 2;
        let top = e.touches[0].clientY * 2;
        if(left < 0){
            left = 0;
        }

        if (top < 0){
            top = 0;
        }
        if (left > 620) {
            left = 620;
        }
        if (top > 980) {
            top = 980;
        }

        this.setData({
            signLeft: left,
            signTop: top
        });
    },

    /**
     * 签到 点击
     */
    signTap:function(){
        wx.navigateTo({
            url: '../my/sign/sign',
        })
    },

    /**
     * 今天图标 点击
     */
    todayTap:function(){
        console.log('今天');

        //获取今天日期
        this.updateDate(new Date());

        if (global.Storage.didLogin()) {//如果登陆状态，获取用户信息
            //更新宝宝年龄
            let memberInfo = global.Storage.currentMember();
            this.readBabyAgeDescriptionWithDay(parseInt(memberInfo.BabyBirthDays));

        } else {//未登录状态，默认展示宝宝1天年龄的信息
            this.setData({
                babyImageUrl: '/res/img/index/index-baby-avatar-icon.png'
            });

            //更新宝宝年龄
            this.readBabyAgeDescriptionWithDay(1);
        }
    },

    /**
     * 更新当前日期
     */
    updateDate:function(date){
        this.currentDate = date;
        let dateString = Tool.timeStringForDate(date, 'MM月DD号');

        let todayHidden = false;
        let currentDateString = Tool.timeStringForDate(date, 'MM-DD');
        let todayDateString = Tool.timeStringForDate(new Date(), 'MM-DD');
        if (currentDateString === todayDateString){
            todayHidden = true;
        }

        this.setData({
            today:dateString,
            todayHidden: todayHidden
        })
    },

    /**
     * 更新头部信息
     */
    updateHeader:function(datas){
        if(Tool.isEmpty(datas)){
            return;
        }

        this.setData({
            weightHeight: datas.Height + '/' + datas.Weight,
            babyAge: datas.MonthDay === '3岁' ? '3岁+' : datas.MonthDay,
            ageDesp: datas.Explain
        });
    },

    /**
     * 更新宝宝年龄
     */
    readBabyAgeDescriptionWithDay: function (days) {
        this.days = days;

        let r = RequestReadFactory.requestAgeDescriptionWithDay(days.toString());
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;

            if (datas.length == 0) {//宝宝超过数据库录入的最大年龄了，取最后一天的数据
                self.readBabyAgeMax();
            }else{
                self.updateHeader(datas[0]);
                self.readHomeArticals();
            }
        };
        r.addToQueue(); 
    },

    /**
     * 获取用户信息
     */
    readMemberInfo:function(){
        let r = RequestReadFactory.memberInfoRead();
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {

                //宝宝头像url
                let url = Tool.imageURLForId(item.BabyImgId);
                if (Tool.isEmptyId(item.BabyImgId)) {
                    url = '/res/img/index/index-baby-avatar-icon.png';
                }

                self.setData({
                    babyImageUrl: url,
                    babyName: Tool.isEmptyStr(item.Name_baby) ? '未取名' : item.Name_baby
                });

                //更新宝宝年龄
                self.readBabyAgeDescriptionWithDay(parseInt(item.BabyBirthDays));
            });
        };
        r.addToQueue(); 
    },

    /**
     * 最大录入年龄获取
     */
    readBabyAgeMax:function(){
        let r = RequestReadFactory.requestAgeMax();
        let self = this;
        r.finishBlock = (req) => {
            let total = req.responseObject.Total;
            self.days = total;
            self.readBabyAgeDescriptionWithDay(self.days);
        };
        r.addToQueue();
    },

    /**
     * 获取文章
     */
    readHomeArticals:function(){
        let r = RequestReadFactory.requestHomeArticalWithDays(this.days.toString());
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                if (item.ArticalName === '育儿头条'){
                    item.imageUrl = '/res/img/index/index-cell-teach-icon.png'
                } else if (item.ArticalName === '宝妈必读') {
                    item.imageUrl = '/res/img/index/index-cell-must-read-icon.png'
                } else if (item.ArticalName === '热点关注') {
                    item.imageUrl = '/res/img/index/index-cell-attention-icon.png'
                }
            });

            self.setData({
                listDatas:datas
            })
        };
        r.addToQueue();
    },

    /**
     * 孕育问答
     */
    readQAList:function(){
        let condition = "${BreedQueAnsId} == '" + global.TCGlobal.EmptyId + "'";
        let r = RequestReadFactory.requestQAWithCondition(condition, 0, 1);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if(datas.length > 0){
                let item = datas[0];

                self.setData({
                    questionContent: item.Que
                })
            }
        };
        r.addToQueue();
    }

})