// edit-profile.js

let { Tool, Storage, RequestReadFactory, RequestWriteFactory, Event } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl:'',
        listDatas: [
            {
                'title': '昵称',
                'desp': ''
            },
            {
                'title': '当前状态',
                'desp': ''
            },
            {
                'title': '宝宝姓名',
                'desp': ''
            },
            {
                'title': '宝宝出生日期',
                'desp': ''
            },
            {
                'title': '宝宝性别',
                'desp': ''
            }
        ],
        modifyPasswordLists: [
            {
                'title': '修改登录密码',
                'desp': ''
            },
            {
                'title': '修改支付密码',
                'desp': ''
            }
        ],
        statusArry:['备孕','怀孕','育儿'],
        sexArry: ['保密', '男', '女'],
        endDate: Tool.timeStringForDate(new Date(), 'YYYY-MM-DD'),
        statusIndex:'0',
        sexIndex: '0',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.updateInfo();
    
        Event.on('refreshMemberInfoNotice', this.requestMemberInfo, this)
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
        Event.off('refreshMemberInfoNotice', this.requestMemberInfo)
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

    bindPickerChange:function(e){
        let value = e.detail.value;
        let title = e.currentTarget.dataset.title;
        console.log('-----value:' + value);
        console.log('----title:' + title);

        let params = {}
        if (title == '当前状态') { 
            let ParentingProcessKey = parseInt(value)+1
            params = {
                'ParentingProcessKey': ParentingProcessKey.toString()
            };

        } else if (title == '宝宝出生日期') {
            params = {
                'BabyBirthday': value
            };
        } else if (title == '宝宝性别') {
            params = {
                'GenderKey': value
            };
        }

        this.modifyInfo(params, title);
    },

    cellTap:function(e){
        let title = e.currentTarget.dataset.title;
        console.log('----title:' + title);

        if(title == '昵称'){ //修改昵称
            wx.navigateTo({
                url: '../edit-profile/modify-nickname/modify-nickname?type=0',
            })
        }else if(title == '宝宝姓名'){
            wx.navigateTo({
                url: '../edit-profile/modify-nickname/modify-nickname?type=1',
            })
        } else if (title == '修改登录密码') {
            wx.navigateTo({
                url: '../edit-profile/modify-password/modify-password',
            })
        } else if (title == '修改支付密码') {
            wx.navigateTo({
                url: '../edit-profile/modify-pay-password/modify-pay-password',
            })
        }
    },

    // 修改头像
    modifyImageTap:function(){
        let self = this;

        wx.showActionSheet({
            itemList: ['拍照', '从相册选择'],
            success: function (res) {
                console.log(res.tapIndex),
                 wx.chooseImage({
                    count: 1, // 默认9
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function(res) {
                        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                        var tempFilePaths = res.tempFilePaths;
                        self.setData({
                            imageUrl: tempFilePaths[0],
                        });

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var arrayBuffer = reader.result;
                            var base64 = wx.arrayBufferToBase64(arrayBuffer);
                            console.log('------base64----:' + base64);

                            //上传到服务器
                            wx.request({
                                url: 'https://www.babymarkt.com.cn/Libra.Web.Api.ApiWriteBlob.aspx',
                                data: {
                                    '_SESSION_': global.Storage.currentSession(),
                                    'format':'BASE64',
                                    base64
                                },
                                success: function (res) {
                                    console.log('---------临时Id:' + res.data.TemporaryId);

                                    let temporaryId = res.data.TemporaryId;//临时Id
                                    let r = RequestWriteFactory.modifyAcatar(temporaryId);
                                    r.finishBlock = (req) => {
                                        Event.emit('refreshMemberInfoNotice');//发出通知

                                        wx.navigateBack({
                                            delta:1
                                        })
                                    };
                                    r.addToQueue();
                                }
                            })
                        }
                        reader.readAsArrayBuffer(new Blob(tempFilePaths))
                        // reader.readAsBinaryString(new Blob(tempFilePaths));
                     },
                 })
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    // 获取文件二进制数据
    getFileBinary:function(file, cb) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            if (typeof cb === "function") {
                cb.call(this, this.result);
            }
        }
    },

    /**
     * 登录用户信息 
     */
    requestMemberInfo: function () {
        let r = RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
            this.updateInfo();
        };

        r.addToQueue();
    },

    updateInfo:function(){
        let self = this;
        let memberInfo = Storage.currentMember()
        self.setData({
            imageUrl: Tool.imageURLForId(memberInfo.ImgId, '/res/img/common/common-avatar-default-icon.png'),
            listDatas: [
                {
                    'title': '昵称',
                    'desp': memberInfo.NickName
                },
                {
                    'title': '当前状态',
                    'desp': self.data.statusArry[parseInt(memberInfo.ParentingProcessKey) - 1]
                },
                {
                    'title': '宝宝姓名',
                    'desp': memberInfo.Name_baby
                },
                {
                    'title': '宝宝出生日期',
                    'desp': memberInfo.BabyBirthday
                },
                {
                    'title': '宝宝性别',
                    'desp': self.data.sexArry[parseInt(memberInfo.GenderKey)]
                }
            ],
        })
    },

    modifyInfo: function (params, title){
        let r = RequestWriteFactory.modifyMemberInfo(params);
        r.finishBlock = (req) => {
            this.requestMemberInfo();
        };
        r.addToQueue();
    }
})