//app.js
import TCGlobal, {
    Storage,
    Tool,
    Network,
    Event,
    Touches,
    RequestWriteFactory,
    RequestReadFactory
} from './tools/tcglobal';

App({
    onLaunch: function () {
        //设置全局变量
        global.TCGlobal = TCGlobal;
        global.Storage = Storage;
        global.Tool = Tool;
        global.Event = Event;
        global.Touches = Touches;
        global.Network = Network;
        global.RequestWriteFactory = RequestWriteFactory;
        global.RequestReadFactory = RequestReadFactory;

        this.getSystemInfo();
    },
    onShow:function () {
        // if (!Storage.didLogin()){
        //     wx.redirectTo({
        //         url: '/pages/login/login',
        //     })
        // }
    },
    getUserInfo:function(cb){
        var that = this
        if(this.globalData.userInfo){
            typeof cb == "function" && cb(this.globalData.userInfo)
        }else{
            //调用登录接口
            //   wx.login({
            //     success: function () {
            //       wx.getUserInfo({
            //         success: function (res) {
            //           that.globalData.userInfo = res.userInfo
            //           typeof cb == "function" && cb(that.globalData.userInfo)
            //         }
            //       })
            //     }
            //   })
        }
    },

    /**
     * 调用微信接口，获取设备信息接口
     * @param cb
     */
    getSystemInfo:function(cb){
        var that = this
        try {
            //调用微信接口，获取设备信息接口
            var res = wx.getSystemInfoSync()
            res.screenHeight = res.screenHeight * res.pixelRatio;
            res.screenWidth = res.screenWidth * res.pixelRatio;
            res.windowHeight = res.windowHeight * res.pixelRatio;
            res.windowWidth = res.windowWidth * res.pixelRatio;
            let rate = 750.0 / res.screenWidth;
            res.rate = rate;
            res.screenHeight = res.screenHeight * res.rate;
            res.screenWidth = res.screenWidth * res.rate;
            res.windowHeight = res.windowHeight * res.rate;
            res.windowWidth = res.windowWidth * res.rate;
            console.log('getSystemInfo');
            console.log(res);
            Storage.setSysInfo(res);
            that.globalData.systemInfo = res
            typeof cb == "function" && cb(that.globalData.systemInfo)
        }
        catch (e) {

        }
    },

    globalData:{
        userInfo:null
    }
})