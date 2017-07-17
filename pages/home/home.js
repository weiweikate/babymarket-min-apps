// home.js

/**
 * 首页
 */
import ProductSpecification from '../../components/product-specification/product-specification';

let {Tool, Storage, RequestReadFactory} = global;

Page({
    data: {
        //海报数据
        adArray: null,
        // 当前选中的tab
        currentTab: 0,
        //一级分类数据
        oneSortData: null
    },
    onLoad: function () {
        Tool.showLoading();
        this.requestOneSortData();
        this.requestHomeAdData();
    },

    onShow(){
        let r = RequestReadFactory.memberInfoRead();
        r.addToQueue();
    },

    /**
     * 获取一级分类数据
     */
    requestOneSortData: function () {
        let task = RequestReadFactory.homeOneSortRead();
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            this.setData({
                oneSortData: responseData
            });

            //循环请求分类的产品
            responseData.forEach((item, index) => {
                if (index > 0) {
                    this.requestOneSortProductData(item.Id, item.MaxShow, index);
                }
            });
        };
        task.addToQueue();
    },
    /**
     * 请求一级分类里面产品数据
     */
    requestOneSortProductData: function (categoryId, maxCount, index) {
        let task = RequestReadFactory.homeOneSortProductRead(categoryId, maxCount);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let oneSortData = this.data.oneSortData;
            oneSortData[index].productData = responseData;
            this.setData({
                oneSortData: oneSortData
            });
        };
        task.addToQueue();
    },
    /**
     * 请求分类广告位数据
     */
    requestSortAdData: function (categoryId) {
        let task = RequestReadFactory.sortAdRead(categoryId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let oneSortData = this.data.oneSortData;
            let bodyData = new Object();
            bodyData.adData = responseData;
            let oneSort = oneSortData[this.data.currentTab];
            oneSort.bodyData = bodyData;
            this.setData({
                oneSortData: oneSortData
            });
            //请求商品分类
            this.requestSortCategoryData(oneSort.Id);
        };
        task.addToQueue();
    },
    /**
     * 请求分类里面产品的分类数据
     */
    requestSortCategoryData: function (parentId) {
        let task = RequestReadFactory.homeTwoSortRead(parentId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                //查询每个分类对应的商品
                this.requestTwoSortProductData(item.Id, index);
            });
            let oneSortData = this.data.oneSortData;
            let bodyData = oneSortData[this.data.currentTab].bodyData;
            bodyData.sortData = responseData;
            this.setData({
                oneSortData: oneSortData
            });
        };
        task.addToQueue();
    },
    /**
     * 请求分类里面产品数据
     */
    requestTwoSortProductData: function (categoryId, index) {
        let task = RequestReadFactory.homeTwoSortProductRead(categoryId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let oneSortData = this.data.oneSortData;
            oneSortData[this.data.currentTab].bodyData.sortData[index].productData = responseData;
            this.setData({
                oneSortData: oneSortData
            });
        };
        task.addToQueue();
    },
    /**
    * 查询首页海报数据
    */
    requestHomeAdData: function () {
        let task = RequestReadFactory.homeAdRead();
        task.finishBlock = (req) => {
            let adArray = req.responseObject.Datas;
            this.setData({
                adArray: adArray
            });
        };
        task.addToQueue();
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
        let oneSort = this.data.oneSortData[currentIndex];
        if (oneSort.bodyData == undefined && currentIndex > 0) {
            Tool.showLoading();
            this.requestSortAdData(oneSort.Id);
        }
    },
    /**
     * 列表子视图点击事件
     */
    onChildClickListener: function (e) {
        let productId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/product-detail/product-detail?productId=' + productId
        })
    },
    /**
     * 添加到购物车
     */
    onAddCartClickListener: function (e) {
        let productId = e.currentTarget.dataset.id;

        let self = this;
        this.productSpecification = new ProductSpecification(this, productId);
        this.productSpecification.finishBlock = (specificationId, product, count, price) => {
            global.Tool.showAlert(specificationId);
        };

        this.productSpecification.showWithAction('ShoppingCart');
    },
    /**
     * 更多
     */
    onMoreClickListener: function (e) {
        let categoryId = e.currentTarget.dataset.id;
        let title = e.currentTarget.dataset.title;
        //跳到更多
        wx.navigateTo({
            url: '/pages/home/product-more/product-more?id=' + categoryId + "&title=" + title
        })
    },
    /**
     * 搜索点击
     */
    searchClicked: function (e) {
  //跳出搜索界面
        wx.navigateTo({
            url: '/pages/search/search'
        })
    }
})