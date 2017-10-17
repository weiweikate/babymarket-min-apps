// tool.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        listData: [
            {
                image: '/res/img/find/tool/tool-vaccine-icon.png',
                name: '疫苗',
            },
            {
                image: '/res/img/find/tool/tool-food-icon.png',
                name: '月子餐',
            },
            {
                image: '/res/img/find/tool/tool-meal-icon.png',
                name: '辅食大全',
            },
        ],
    },

    /**
     * 进入详情
     */
    goDetail: function (e) {
        let index = e.currentTarget.dataset.index;
        if (index == 0) {
            // 疫苗
            wx.navigateTo({
                url: '/pages/find/vaccine/vaccine',
            })
        } else if (index == 1) {
            // 月子餐
            wx.navigateTo({
                url: '/pages/find/confinement-food/confinement-food',
            })
        } else if (index == 2) {
            // 辅食大全
            wx.navigateTo({
                url: '/pages/baby-food/baby-food',
            })
        }
    }
})