Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData: [
            {
                image: "/res/img/find/find-turnable-icon.png",
                name: "天天转盘",
                arrowHidden: true,
                isShow: false,
            },
            {
                image: "/res/img/find/find-seckill-icon.png",
                name: "TOP秒杀",
                arrowHidden: true,
                isShow: false,
            },
            {
                image: "/res/img/find/find-crowd-icon.png",
                name: "TOP众筹",
                arrowHidden: true,
                isShow: false,
            },
            {
                image: "/res/img/find/find-top-buy-icon.png",
                name: "TOP团购",
                arrowHidden: true,
                isShow: false,
            },
            {
                image: "/res/img/find/find-levy-icon.png",
                name: "黄金便征集令",
                arrowHidden: true,
                isShow: true,
            },
            {
                image: "/res/img/find/find-tool-icon.png",
                name: "育儿工具",
                arrowHidden: true,
                isShow: false,
            },
            {
                image: "/res/img/find/find-knowledge-icon.png",
                name: "知识库",
                arrowHidden: true,
                isShow: false,
            },
        ],
    },

    /**
     * 便便诊所
     */
    goClinic: function () {
        wx.navigateTo({
            url: '../find/clinic/clinic',
        })
    },

    /**
     * 爱牙卫士
     */
    goTooth: function () {

    },

    /**
     * 点击进入详情
     */
    goDetail: function (e) {
        let position = e.currentTarget.dataset.index;
        console.log("=======" + position);

        if (position == 0) {
            wx.navigateTo({
                url: '../find/lottery/lottery',
            })
        } else if (position == 1) {
        } else if (position == 2) {
        } else if (position == 3) {
        } else if (position == 4) {
            wx.navigateTo({
                url: '../find/levy/levy',
            })
        } else if (position == 5) {
            wx.navigateTo({
                url: '../find/tool/tool',
            })
        } else if (position == 6) {
        }
    }
})