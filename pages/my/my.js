// my.js

let {Tool, Storage, RequestReadFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName:'',
        avatarUrl:'/res/img/common/common-avatar-default-icon.png',
        sign:'',
        shopName:'',
        idDesp:'',
        inviteCode:'',

        orderStatusItems: [
            {
                status: '我的订单',
                image: '/res/img/my/my-four-cell-order-icon.png',
            },
            {
                status: '我的收藏',
                image: '/res/img/my/my-four-cell-fav-icon.png',
            },
            {
                status: '地址管理',
                image: '/res/img/my/my-four-cell-address-icon.png'
            },
            {
                status: '邀请好友',
                image: '/res/img/my/my-four-cell-invite-icon.png'
            },
        ],
        myDatasItems0: [
            {
                image: '/res/img/my/my-cell-property-icon.png',
                name: '我的优惠券',
                detail: {
                    leftText: '',
                    amount: '',
                    rightText: ''
                }
            },
            {
                image: '/res/img/my/my-cell-property-icon.png',
                name: '我的资产',
                detail: {
                    leftText: '余额',
                    amount: '0',
                    rightText: '元'
                }
            },
            {
                image: '/res/img/my/my-cell-award-icon.png',
                name: '收到奖励',
                detail: {
                    leftText:'已收',
                    amount:'0',
                    rightText:'元'
                }
            },
            {
                image: '/res/img/my/my-cell-save-icon.png',
                name: '已省金额',
                detail: {
                    leftText: '已省',
                    amount: '0',
                    rightText: '元'
                }
            },
            {
                image: '/res/img/my/my-cell-hehuoren-icon.png',
                name: '城市合伙人',
                detail: {
                    leftText: '待领',
                    amount: '0',
                    rightText: '元'
                }
            },
        ],
        myDatasItems1: [
            {
                image: '/res/img/my/my-cell-frist-friends-icon.png',
                name: '我的好友',
                detail: {
                    leftText: '共',
                    amount: '0',
                    rightText: '人'
                }
            },
            {
                image: '/res/img/my/my-cell-employee-icon.png',
                name: '我的店员',
                detail: {
                    leftText: '共',
                    amount: '0',
                    rightText: '人'
                }
            },
            {
                image: '/res/img/my/my-cell-second-friends-icon.png',
                name: '好友的好友',
                detail: {
                    leftText: '共',
                    amount: '0',
                    rightText: '人'
                },
                arrowHidden:true
            },
        ],
        myDatasItems2: [
            {
                image: '/res/img/my/my-cell-feedback-icon.png',
                name: '意见和反馈'
            },
            // {
            //     image: '/res/img/my/my-cell-agreement-icon.png',
            //     name: '联系客服'
            // }
        ]
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
     * four cells
     */
    orderStatusTap: function (e) {
        let status = e.currentTarget.dataset.index;
        if (status == 0) {//我的订单
            console.log('----我的订单----');
            wx.navigateTo({
                url: '../my/myOrder/myOrder',
            })

        } else if (status == 1) {//我的收藏
            console.log('----我的收藏----');
            wx.navigateTo({
                url: '../my/my-fav/my-fav',
            })

        } else if (status == 2) {//地址管理
            console.log('----地址管理----');
            wx.navigateTo({
                url: '../address/address' 
            })

        } else if (status == 3) {//邀请好友
            console.log('----邀请好友----');
            wx.navigateTo({
                url: '../my/invite-friends/invite-friends',
            })
        }
    },

    /**
     * 退出登录
     */
    loginoutTap: function () {
        Storage.setDidLogin(false);
        Storage.setCurrentSession('');

        wx.redirectTo({
            url: '/pages/login/login',
        })
    },

    /**
     * cell点击
     */
    cellTap: function (e) {
        let title = e.currentTarget.dataset.title;
        if (title =='我的资产'){
            console.log('----我的资产----');
            wx.navigateTo({
                url: '../my/my-property/my-property',
            })
        } else if (title == '收到奖励'){
            console.log('----收到奖励----');
            wx.navigateTo({
                url: '../my/my-award/my-award',
            })

        } else if (title == '已省金额') {
            console.log('----已省金额----');
            wx.navigateTo({
                url: '../my/my-save/my-save',
            })

        } else if (title == '城市合伙人') {
            console.log('----城市合伙人----');

        } else if (title == '我的好友') {
            console.log('----我的好友----');

        } else if (title == '我的店员') {
            console.log('----我的店员----');

        } else if (title == '好友的好友') {
            console.log('----好友的好友----');

        } else if (title == '意见和反馈') {
            console.log('----意见和反馈----');

        } else if (title == '我的优惠券') {
            console.log('----我的优惠券----');
            wx.navigateTo({
                url: '../coupon/coupon',
            })

        } 
    },

    /**
     * 消息
     */
    messageTap: function () {
        console.log('----消息----');
    },

    /**
     * 设置
     */
    settingTap: function () {
        console.log('----设置----');
    },

    /**
     * 编辑资料
     */
    editProfileTap: function () {
        console.log('----编辑资料----');
    },

    /**
     * 二维码
     */
    qrcodeTap: function () {
        console.log('----二维码----');
        wx.navigateTo({
            url: '../my/my-qrcode/my-qrcode',
        })
    },

    /**
     * 请求统一入口
     */
    requestData: function () {
        this.requestMemberInfo();
    },

    /**
     * 登录用户信息 
     */
    requestMemberInfo: function () {
        let r = RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                // console.log('money1 :' + item.Money1);
                // console.log('name :' + item.KHMC);

                wx.setStorage({
                    key: 'memberInfo',
                    data: item,
                })

                //是否为内部员工
                Storage.setInsideMember(item.Inside);

                //头像url
                let url = Tool.imageURLForId(item.PictureId);

                //身份描述设置
                let name = '';
                let desp= '';
                if (item.MemberTypeKey == 0){//普通员工
                    name = item.Nickname;
                } else if (item.MemberTypeKey == 1 || item.MemberTypeKey == 3) {//内部员工和门店
                    name = item.ShopName;
                    desp = '零售合伙人';
                } else if (item.MemberTypeKey == 2) {//经销商
                    name = item.ShopName;
                    desp = '城市合伙人';

                }

                this.setData({
                    nickName: item.Nickname,
                    sign: item.Sign,
                    avatarUrl: url,
                    shopName: name,
                    idDesp: desp,
                    inviteCode: item.InvitationCode,
                    'myDatasItems0[1].detail.amount':item.Balance,
                    'myDatasItems0[2].detail.amount': item.Commission,
                    'myDatasItems0[3].detail.amount': item.BuyerCommission,
                    'myDatasItems0[4].detail.amount': item.PartnerCommission,
                    'myDatasItems1[0].detail.amount': item.FirstFriend,
                    'myDatasItems1[1].detail.amount': item.ShopPersonCount,
                    'myDatasItems1[2].detail.amount': item.SecondFriends,
                });

            });
        };
        r.addToQueue();
    },
})