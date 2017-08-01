// add-clinic.js
let { Tool, RequestWriteFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nurse: '请选择',
        milk: '',
        food: '请选择',
        water: '请选择',
        num: '请选择',
        face: '请选择',
        detail: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 选择哺乳
     */
    selectNurse: function () {

    },

    /**
     * 选择辅食添加结构
     */
    selectFood: function () {

    },

    /**
     * 选择饮水量
     */
    selectWater: function () {

    },

    /**
     * 选择排便次数
     */
    selectNum: function () {

    },

    /**
     * 选择表情
     */
    selectFace: function () {

    },

    /**
     * 提交
     */
    submit: function (e) {
        let info = e.detail.value;
        let milk = info.advisorymilk;
        let detail = info.advisorydetail;
        let nurse = this.data.nurse;
        let food = this.data.food;
        let water = this.data.water;
        let num = this.data.num;
        let face = this.data.face;

        // 判断是否填写信息
        if (nurse === '请选择') {
            Tool.showAlert("请选择哺乳方式");
            return false;
        };
        if (Tool.isEmptyStr(milk)) {
            Tool.showAlert("请输入奶粉品牌及奶量");
            return false;
        };
        if (food === '请选择') {
            Tool.showAlert("请选择辅食添加结构");
            return false;
        };
        if (water === '请选择') {
            Tool.showAlert("请选择饮水量");
            return false;
        };
        if (num === '请选择') {
            Tool.showAlert("请选择排便次数");
            return false;
        };
        if (face === '请选择') {
            Tool.showAlert("请选择拉粑粑时的表情");
            return false;
        };

    },

    /**
     * 添加咨询
     */
    addAdvisory:function(){

    },
})