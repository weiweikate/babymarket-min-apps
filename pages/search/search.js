let {Tool, Storage, RequestReadFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        historySearchData: null,
        hotSearchData: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        Tool.showLoading();
        this.setData({
            historySearchData: Storage.getHistorySearch()
        });
        this.requestHotSearchData();
    },
    /**
     * 获取热门搜索数据
     */
    requestHotSearchData: function () {
        let task = RequestReadFactory.hotSearchRead();
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            this.setData({
                hotSearchData: responseData
            });
        };
        task.addToQueue();
    },
    /**
     * 清空历史记录
     */
    onDeleteClickListener: function (e) {
        Storage.clearHistorySearch();
        this.setData({
            historySearchData: null
        });
    },
    /**
     * 关键词点击
     */
    onKeywordListener: function (e) {
        let keyword = e.currentTarget.dataset.keyword;
        //先判断keyword是否在历史记录中
        let historySearchData = this.data.historySearchData;
        let historyKeyword = undefined;
        if (historySearchData == undefined) {
            historySearchData = new Array();
            historySearchData.unshift(keyword);
        } else {
            historySearchData.forEach((item, index) => {
                if (keyword == item) {
                    historyKeyword = item;
                    historySearchData.splice(index, 1);
                    return;
                }
            });
            historySearchData.unshift(keyword);
        }
        Storage.setHistorySearch(historySearchData);
        this.setData({
            historySearchData: historySearchData
        });
        //跳到搜索结果
        wx.navigateTo({
            url: '/pages/search/search-result/search-result?keyword=' + keyword
        })
    }
})