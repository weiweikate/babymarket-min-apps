/**
 * Created by coin on 1/13/17.
 */

import RequestRead from '../base-requests/request-read'
import Operation from '../operation'
import RequestLogin from '../requests/request-login'
import RequestDeliveryInfoRead from '../requests/request-delivery-info-read'

//读取请求具体封装
export default class RequestReadFactory {

    //登陆
    static login(username, pasword) {
        let req = new RequestLogin(username, pasword);
        req.name = '登陆';//用于日志输出
        return req;
    }

    /**
     * 查询手机号是否被注册
     * @param phone
     * @returns {RequestRead}
     */
    static checkMemberByPhone(phone){
        let operation = Operation.sharedInstance().memberInfoReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Mobile": phone,
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '查询手机号是否被注册';//用于日志输出
        req.items = ['Id'];
        return req;
    }

    //积分查询
    static pointUploadRead(theId) {
        let operation = Operation.sharedInstance().pointReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Id": theId,
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '积分查询';//用于日志输出
        req.items = ['Id', 'Reason', 'SFJHCG'];
        return req;
    }

    //宝贝码头商品详情
    static productDetailRead(theId) {
        let operation = Operation.sharedInstance().bmProductReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Id": theId,
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头商品详情';//用于日志输出
        req.items = ['Id', 'ShowName', 'LYPrice', 'SalePrice', 'ImgId', 'Warehouse', 'Des1', 'Des', 'Tax', 'Subtitle', 'NationalKey', 'StoreId', 'TaxRate', 'Import', 'PriceInside'];
        req.preprocessCallback = (req, firstData) => {
            if (global.Tool.isValidObject(firstData)) {
                if (global.Storage.didLogin()) {
                    let tempPrice = firstData.SalePrice;
                    firstData.SalePrice = firstData.LYPrice;
                    firstData.LYPrice = tempPrice;
                }
                else {
                    firstData.LYPrice = "0";
                }
            }
        }
        return req;
    }

    /**
     * 规格组
     */
    static specificationGroup(theId){
        let operation = Operation.sharedInstance().productSpecificationGroupRead;
        let bodyParameters = {
            "Operation": operation,
            "ProductId": theId,
            "IsReturnTotal":true,
            "IsIncludeSubtables":true,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头商品规格组';//用于日志输出

        return req;
    }

    /**
     * 全部规格
     */
    static allSpecificationRead(theId) {
        let operation = Operation.sharedInstance().productSpecificationRead;
        let bodyParameters = {
            "Operation": operation,
            "ProductId": theId,
            "IsReturnTotal":true,
            "IsIncludeSubtables":true,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头商品全部规格';//用于日志输出
        req.preprocessCallback = (req)=>{
            let {Tool:t} = global;

            let {Datas} = req.responseObject;
            if (t.isValidArr(Datas)) {
                Datas.forEach((specification) => {
                    let _levelPrice = '';
                    let member = global.Storage.currentMember();

                    let price = specification.Price;
                    if (t.isValidArr(specification.ShopLevelPrice)) {
                        specification.ShopLevelPrice.forEach((p)=>{
                            if (p.ShopLevelKey === member.LevelKey) {
                                price = p.Price2;
                            }
                        })
                    }
                    _levelPrice = price;

                    //普通会员显示老尤价（LYPrice）
                    if (global.Storage.didLogin() && member.MemberTypeKey === "0") {
                        _levelPrice = specification.LYPrice;
                    }
                    specification.levelPrice = _levelPrice;
                })
            }
        }
        return req;
    }

    /**
     * 搜索规格
     */
    static searchSpecificationRead(theId, specificationsArray) {
        let operation = Operation.sharedInstance().productSpecificationRead;
        let bodyParameters = {
            "Operation": operation,
            "ProductId": theId,
        };
        if (global.Tool.isValidArr(specificationsArray)) {
            specificationsArray.forEach((detail) => {
                let keyName = 'SpecificationItem' + detail.SpecificationKey + 'Id';
                bodyParameters[keyName] = detail.Id;
            });
        }
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头 搜索特定的规格';//用于日志输出
        return req;
    }

    //附件
    static attachmentsRead(theId, count = 20, index = 0) {
        let operation = Operation.sharedInstance().bmAttachmentsReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "${RelevancyId} == '" + theId + "' && ${RelevancyBizElement} == 'Attachments'",
            "MaxCount": count,
            "StartIndex": index,
            "Order": '${CreateTime} ASC'
        };
        let req = new RequestRead(bodyParameters);
        req.name = '附件';
        req.items = ['Id'];

        //修改返回结果，为返回结果添加imageUrls字段
        req.preprocessCallback = (req) => {
            let Datas = req.responseObject.Datas;
            let imageUrls = [];
            if (global.Tool.isValidArr(Datas)) {
                Datas.forEach((data) => {
                    data.imageUrl = global.Tool.imageURLForId(data.Id);
                    imageUrls.push(data.imageUrl);
                });
            }
            req.responseObject.imageUrls = imageUrls;
        }
        return req;
    }

    //老友码头 商品的国家信息
    static productNationRead(theKey) {
        let operation = Operation.sharedInstance().bmNationReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Value": theKey,
            "MaxCount": 1,
            "StartIndex": 0
        };
        let req = new RequestRead(bodyParameters);
        req.name = '老友码头 商品的国家信息';//用于日志输出
        req.items = ['Name'];
        return req;
    }

    //老友码头 运费
    static expressRuleRead(warehouseId, city) {
        let operation = Operation.sharedInstance().bmExpressRuleReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "StringIndexOf(${Area_Name},'" + city + "') > 0 && ${WarehouseId} == '" + warehouseId + "'",
            "MaxCount": 1,
            "StartIndex": 0
        };
        let req = new RequestRead(bodyParameters);
        req.name = '老友码头 运费';//用于日志输出
        req.items = ['Express_Fee'];
        return req;
    }

    //登录用户信息查询
    static memberInfoRead() {
        let operation = Operation.sharedInstance().memberInfoReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Id": global.Storage.memberId(),
        };
        let req = new RequestRead(bodyParameters);
        req.name = '登录用户信息查询';
        req.preprocessCallback = (req,data) => {
            if (global.Tool.isValid(data)) {
                global.Storage.setCurrentMember(data);
            }
        }
        return req;
    }

    //首页海报查询
    static homeAdRead() {
        let operation = Operation.sharedInstance().homeAdReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "IsHomePageShow": 'True'
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页海报查询';
        req.items = ['Id', 'ImgId', 'LinkTypeKey', 'KeyWord', 'Url', 'ProductId', 'Name'];
        //修改返回结果
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                item.imageUrl = global.Tool.imageURLForId(item.ImgId);
            });
        }
        return req;
    }

    //分类海报查询
    static sortAdRead(categoryId) {
        let operation = Operation.sharedInstance().homeAdReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "ProductCategoryId": categoryId
        };
        let req = new RequestRead(bodyParameters);
        req.name = '分类海报查询';
        req.items = ['Id', 'ImgId', 'LinkTypeKey', 'KeyWord', 'Url', 'ProductId', 'Name'];
        //修改返回结果
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                item.imageUrl = global.Tool.imageURLForId(item.ImgId);
            });
        }
        return req;
    }

    //首页-一级分类
    static homeOneSortRead() {
        let operation = Operation.sharedInstance().homeSortReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Hierarchy": '1',
            "IsShow": 'True',
            "ShowInHomepage": 'True',
            "Order": "${Order} ASC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页-一级分类';
        req.items = ['Id', 'Name', 'ImgId', 'MaxShow'];
        //修改返回结果
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                item.imageUrl = global.Tool.imageURLForId(item.ImgId);
            });
            let home = new Object();
            home.Name = "首页";
            responseData.unshift(home);
        }
        return req;
    }

    //首页-单个一级分类
    static homeOneSortSingleRead() {
        let operation = Operation.sharedInstance().homeSortReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Hierarchy": '1',
            "IsShow": 'True',
            "ShowInHomepage": 'True',
            "Order": "${Order} ASC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页-一级分类';
        req.items = ['Id', 'Name', 'ImgId', 'MaxShow'];
        return req;
    }

    //首页-二级分类
    static homeTwoSortRead(parentId) {
        let operation = Operation.sharedInstance().homeSortReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "ParentId": parentId,
            "IsShow": 'True',
            "Order": "${Order} ASC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页-二级分类';
        req.items = ['Id', 'Name', 'ImgId', 'Description'];
        return req;
    }

    //首页-一级分类商品
    static homeOneSortProductRead(categoryId, maxCount) {
        let operation = Operation.sharedInstance().productReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "FirstCategoryId": categoryId,
            "MaxCount": maxCount,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '一级分类商品';
        req.items = ['Id', 'ShowName', 'ImgId', 'SalePrice', 'LYPrice', 'PriceInside', 'Inv', 'Unit', 'Import'];
        //修改返回结果
        let that = this;
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            that.parseProductInfo(responseData);
        }
        return req;
    }

    //首页-二级分类商品
    static homeTwoSortProductRead(categoryId) {
        let operation = Operation.sharedInstance().productReadOperation;
        let condition = "${Product_CategoryId} == '" + categoryId + "'";
        //如果是内部员工
        if (global.Storage.isInsideMember()) {
            condition = "${Product_CategoryId} == '" + categoryId + "' || ${ProductCategoryInsideId} == '" + categoryId + "'";
        }
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition
        };
        let req = new RequestRead(bodyParameters);
        req.name = '二级分类商品';
        req.items = ['Id', 'ShowName', 'ImgId', 'SalePrice', 'LYPrice', 'PriceInside', 'Inv', 'Unit', 'Import'];
        //修改返回结果
        let that = this;
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            that.parseProductInfo(responseData);
        }
        return req;
    }

    //首页-搜索商品
    static searchProductRead(keyword) {
        let operation = Operation.sharedInstance().productReadOperation;
        let condition = "${KeyWord} like %" + keyword + "% || ${ShowName} like %" + keyword + "%";
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition
        };
        let req = new RequestRead(bodyParameters);
        req.name = '搜索商品';
        req.items = ['Id', 'ShowName', 'ImgId', 'SalePrice', 'LYPrice', 'PriceInside', 'Inv', 'Unit', 'Import'];
        //修改返回结果
        let that = this;
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            that.parseProductInfo(responseData);
        }
        return req;
    }

    //热门搜索查询
    static hotSearchRead() {
        let operation = Operation.sharedInstance().searchHotReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "MaxCount": '20',
            "Order": "${Count} DESC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '热门搜索查询';
        req.items = ['Id', 'Keyword', 'HightLight', 'DateTime'];
        return req;
    }

    //专题查询
    static specialRead() {
        let operation = Operation.sharedInstance().specialReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Deleted": "False"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '专题查询';
        req.items = ['Id', 'ImgId', 'Img2Id', 'Name', 'Title', 'Subtitle', 'PriceDes'];
        //修改返回结果
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                item.imageUrl = global.Tool.imageURLForId(item.ImgId);
                item.imageHeadUrl = global.Tool.imageURLForId(item.Img2Id);
            });
        }
        return req;
    }

    //查询购物车视图
    static cartViewRead() {
        let operation = Operation.sharedInstance().cartViewReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "View": {
                "EntityName": "ShoppingCart_View",
            }
        };
        let req = new RequestRead(bodyParameters);
        req.name = '查询购物车视图';
        return req;
    }

    //查询购物车
    static cartRead() {
        let operation = Operation.sharedInstance().cartReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "${MemberId} == '" + global.Storage.memberId() + "' && ${Useful} == 'True'",
            "Order": "${CreateTime} DESC",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '查询购物车';
        return req;
    }

    //收货地址查询
    static addressRead() {
        let operation = Operation.sharedInstance().addressReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${Default} DESC",
            "Condition": "${MemberId} == '" + global.Storage.memberId() + "'",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '收货地址查询';
        return req;
    }

    //区域查询
    static areaRead(condition) {
        let operation = Operation.sharedInstance().areaReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '区域查询';
        req.items = ['Id', 'Name', 'FullName', 'ZJS'];
        return req;
    }

    //地址查询（按默认排序）
    static addressDefaultRead() {
        let operation = Operation.sharedInstance().addressReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${Default} DESC",
            "Condition": "${MemberId} == '" + global.Storage.memberId() + "'",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '地址查询（按默认排序）';
        return req;
    }

    //我的订单查询
    static myOrderRead(status, index) {
        let operation = Operation.sharedInstance().orderReadOperation;

        let condition = "${CreatorId} == '" + global.Storage.memberId() + "'";;
        if (typeof (status) != "undefined" && status != "undefined") {
            condition = "${StatusKey} == '" + status + "' && " + condition;
        }

        if (global.Tool.isValidStr(status) && status != "undefined") {
            condition = "${StatusKey} == '" + status + "'";
        }

        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "IsIncludeSubtables": true,
            "Order": "${CreateTime} DESC",
            "MaxCount": '2',
            "StartIndex": index,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '我的订单查询';
        return req;
    }

    //订单详情查询
    static orderDetailRead(orderId) {
        let operation = Operation.sharedInstance().orderReadOperation;

        let condition = "${Id} == '" + orderId + "'";

        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "IsIncludeSubtables": true,
            "MaxCount": '1',
            "StartIndex": 0,
            "Subtables": [
                "Line"
            ]
        };
        let req = new RequestRead(bodyParameters);
        req.name = '订单详情查询';
        // req.items = ["Id", "OrderNo", "Money", "StatusKey", "Freight", "Due", "Discount", "ExpressSum", "Formal", "Qnty", "Tax", "Total", "Cross_Order", "Tax2", "CrossFee", "Credit", "UseCredit", "Balance", "UseBalance", "Money1", "Money2", "PaywayName", "BuyerCommission"];
        return req;
    }

    //物流详情查询
    static orderDeliveryInfoRead(deliveryNo, companyNo) {
        let req = new RequestDeliveryInfoRead(deliveryNo, companyNo);
        req.name = '物流详情查询';
        return req;
    }

    //优惠劵查询
    static couponRead(condition) {
        let operation = Operation.sharedInstance().couponReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "Order": "${Date} DESC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '优惠劵查询';
        req.items = ["Id", "Money", "Useful_Line", "Min_Money", "Overdue", "Used"];
        return req;
    }

    //商品收藏查询
    static productFavRead(index) {
        let operation = Operation.sharedInstance().favReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${CreateTime} DESC",
            "MaxCount": '2',
            "StartIndex": index,
            "MemberId": global.Storage.memberId(),
            "FavoriteObjectType": 'Product'
        };
        let req = new RequestRead(bodyParameters);
        req.name = '商品收藏查询';
        req.items = ["Id", "Product_Name", "Price", "CreateTime", "ImgId"];
        return req;
    }

    //处理商品信息
    static parseProductInfo(responseData) {
        responseData.forEach((item, index) => {
            let url = global.Tool.imageURLForId(item.ImgId);
            item.imageUrl = url;
            item.productId = item.Id;
            //未登录时,显示的价格为SalePrice,登陆后显示老友价（LYPrice)
            item.isLogin = global.Storage.didLogin();
            if (item.isLogin) {
                item.showPrice = "¥" + item.LYPrice;
            } else {
                item.showPrice = "¥" + item.SalePrice;
            }
            //未登录时,旧价格不显示,登陆后显示SalePrice
            if (item.isLogin) {
                item.oldPrice = "¥" + item.SalePrice;
                //如果销售价格和老友价都一样，那么为0，0的时候界面默认不显示
                if (item.SalePrice == item.LYPrice || item.SalePrice == 0) {
                    item.oldPrice = 0;
                }
            } else {
                item.oldPrice = 0;
            }
        });
        //9d7093c03c3fb18a9e9d8216e355f0a93ed6604d
    }

    //绑定的支付宝账号查询
    static alipyAccountRead() {
        let operation = Operation.sharedInstance().alipayAccountReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${CreateTime} DESC",
            "MemberId": global.Storage.memberId(),
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '绑定的支付宝账号查询';
        req.items = ["Id", "Name", "AplipayAccount"];
        return req;
    }

    // 便便诊所查询
    static advisoryRead(index = 0, count = 20){
        let operation = Operation.sharedInstance().advisoryReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "MaxCount": count + '',
            "StartIndex": index + '',
            "Order": "${Num} DESC,${CreateTime} DESC",
            "Appendixes": {
                "+Member": [
                    "NickName"
                ]
            },
        };
        let req = new RequestRead(bodyParameters);
        req.name = '便便诊所查询';
        req.items = ["Id","CreateTime","Head_PictureId","Is_Answer","Else_Add","MemberId",
        "GenderKey","BabyAge","Num"];
        req.appendixesKeyMap = { 'Member': 'MemberId' };//可以多个

        //匹配成功函数
        req.appendixesBlock = (data, appendixe, key, id) => {
            if (key === 'Member') {
                //给data添加新属性
                data.MemberNickName = appendixe.NickName;
            }
        };
        return req;
    }

    // 宝妈圈-查询帖子详情
    static postDetailRead(postId) {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Id": postId
      };

      let req = new RequestRead(bodyParameters);
      req.name = '查询帖子详情';
      req.items = ["Id", "SendNickName", "BabyAge", "Title_Article", "Article_Content", "TotalViews",
        "Commemt_Number", "Img_Member_Article_SendId", "RecommendId", "RecommendTitle" ,"LikeNumber"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        this.parseMomPostData(responseData);
      }
      return req;
    }

    // 宝妈圈-查询置顶帖子
    static postTopRead(circleId) {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Is_Top":true,
        "ModuleappId": circleId,
        "Order": "${CreateTime} DESC"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '查询置顶帖子';
      req.items = ["Id", "Title_Article"];
      return req;
    }

    // 宝妈圈-根据圈子ID查询所有帖子列表
    static postAllRead(circleId) {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Is_Top": false,
        "ModuleappId": circleId,
        "Order": "${CreateTime} DESC"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '根据圈子ID查询所有帖子列表';
      req.items = ["Id", "SendNickName", "BabyAge", "Title_Article", "Article_Abstract","Img_Member_Article_SendId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        this.parseMomPostData(responseData);
      }
      return req;
    }

    // 宝妈圈-根据圈子ID查询精华帖子列表
    static postEssenceRead(circleId) {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Is_Essential": true,
        "ModuleappId": circleId,
        "Order": "${CreateTime} DESC"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '根据圈子ID查询精华帖子列表';
      req.items = ["Id", "SendNickName", "BabyAge", "Title_Article", "Article_Abstract", "Img_Member_Article_SendId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        this.parseMomPostData(responseData);
      }
      return req;
    }

    // 宝妈圈-查询帖子是否被我点赞
    static isPostPraiseRead(postId) {
      let operation = Operation.sharedInstance().postPraiseReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "ArticleId": postId,
        "MemberId": global.Storage.memberId(),
        "MaxCount": "0"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '查询帖子是否被我点赞';

      //修改返回结果
      req.preprocessCallback = (req) => {
        let total = req.responseObject.Total;
        req.responseObject.isPraise = total > 0;
      }
      return req;
    }

    // 宝妈圈-查询帖子是否被我收藏
    static isPostCollectRead(postId) {
      let operation = Operation.sharedInstance().postCollectReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "SourceId": postId,
        "Collect_MemberId": global.Storage.memberId(),
        "MaxCount": "1"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '查询帖子是否被我收藏';
      req.items = ["Id"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let count = req.responseObject.Count;
        if(count>0){
          req.responseObject.isCollect = true;
          let collectId = req.responseObject.Datas[0].Id;
          req.responseObject.collectId = collectId;
        }else{
          req.responseObject.isCollect = false;
          req.responseObject.collectId = '';
        }
        console.log(req.responseObject)
      }
      return req;
    }

    // 宝妈圈-查询帖子的评论
    static postDiscussRead(postId) {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Condition": "${Belong_ArticleId} == '" + postId + "' && ${BelongCommentId} == '00000000-0000-0000-0000-000000000000'",
        "IsIncludeSubtables": true
      };
      
      let req = new RequestRead(bodyParameters);
      req.name = '查询帖子的评论';
      req.items = ["Id", "Replier_MemberId", "Replier_Member_ImgId", "BabyAge", "Commemt_Content",
        "Commemt_ImgId", "CreateTime","Member_Article_Send_Name"];
      req.subtables = [
        "ReplyDetail"
      ];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.headImgUrl = global.Tool.imageURLForId(item.Replier_Member_ImgId);
          item.age = "宝宝" + item.BabyAge;
        });
      }
      return req;
    }

    // 宝妈圈-热帖查询
    static hotPostRead(index = 0) {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "MaxCount": '20',
        "StartIndex": index * 20 + '',
        "IsTopArticle":'true',
        "Order": "${CreateTime} DESC"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '宝妈圈-热帖查询';
      req.items = ["Id", "SendNickName", "BabyAge", "Title_Article", "Article_Abstract", "TotalViews",
        "Commemt_Number", "Img_Member_Article_SendId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        this.parseMomPostData(responseData);
      }
      return req;
    }

    // 宝妈圈-所有帖查询
    static allPostRead(index = 0) {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "MaxCount": '20',
        "StartIndex": index * 20 + '',
        "Belong_ArticleId": '00000000-0000-0000-0000-000000000000',
        "Order": "${CreateTime} DESC"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '宝妈圈-所有帖查询';
      req.items = ["Id", "SendNickName", "BabyAge", "Title_Article", "Article_Abstract", "TotalViews",
        "Commemt_Number", "Img_Member_Article_SendId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        this.parseMomPostData(responseData);
      }
      return req;
    }

    /**
     * 处理宝妈圈帖子的返回数据
     */
    static parseMomPostData(responseData){
      responseData.forEach((item, index) => {
        item.headImgUrl = global.Tool.imageURLForId(item.Img_Member_Article_SendId);
        item.name = item.SendNickName;
        item.age = "宝宝" + item.BabyAge;
        item.isReply = false;
        item.title = item.Title_Article;
        item.content = item.Article_Abstract;
        item.readNum = item.TotalViews;
        item.commemtNum = item.Commemt_Number;
      });
    }

    // 宝妈圈-所有圈查询
    static allCircleRead() {
      let operation = Operation.sharedInstance().circleReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Order": "${Ordinal} ASC"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '宝妈圈-所有圈查询';
      req.items = ["Id", "Name", "Introduction", "Small_ImgId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.headImgUrl = global.Tool.imageURLForId(item.Small_ImgId);
          item.title = item.Name;
          item.content = item.Introduction;
        });
      }
      return req;
    }

    // 宝妈圈-宝妈圈详情查询
    static circleDetailRead(id) {
      let operation = Operation.sharedInstance().circleReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Id": id
      };

      let req = new RequestRead(bodyParameters);
      req.name = '宝妈圈-详情查询';
      req.items = ["Id", "Name","ImgId", "Introduction", "Small_ImgId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.headImgUrl = global.Tool.imageURLForId(item.Small_ImgId);
          item.bgImgUrl = global.Tool.imageURLForId(item.ImgId);
        });
      }
      return req;
    }

    // 宝妈圈-所有圈关注列表查询
    static allCircleAttentionRead() {
      let operation = Operation.sharedInstance().circleAttentionReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "MemberId": global.Storage.memberId()
      };

      let req = new RequestRead(bodyParameters);
      req.name = '宝妈圈-所有圈关注列表查询';
      req.items = ["Id","ModuleappId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
      }
      return req;
    }

    // 宝妈圈-大家都在搜查询
    static recordRead() {
      let operation = Operation.sharedInstance().recordReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "MaxCount":"10",
        "Order": "${SearchNumber} DESC"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '宝妈圈-大家都在搜查询';
      req.items = ["Name"];
      return req;
    }

    // 宝妈圈-搜索帖子
    static searchPostRead(keyword, index = 0) {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "MaxCount": '20',
        "StartIndex": index * 20 + '',
        "Condition": "${Title_Article} like %" + keyword + "% && ${Article_Abstract} like %" + keyword+"% && ${Belong_ArticleId} =='00000000-0000-0000-0000-000000000000'",
        "Order": "${CreateTime} DESC"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '宝妈圈-搜索帖子';
      req.items = ["Id", "SendNickName", "BabyAge", "Title_Article", "Article_Abstract",
        "Commemt_Number", "Img_Member_Article_SendId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.headImgUrl = global.Tool.imageURLForId(item.Img_Member_Article_SendId);
          item.name = item.SendNickName;
          item.age = "宝宝" + item.BabyAge;
          item.isReply = true;
          item.replyNum = item.Commemt_Number;
          item.title = item.Title_Article;
          item.content = item.Article_Abstract;
        });
      }
      return req;
    }

    //首页 宝宝年龄段描述 查询
    static requestAgeDescriptionWithDay(days) {
        let operation = Operation.sharedInstance().babyAgeDespReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "${Day} == " + days
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页 宝宝年龄段描述 查询';
        return req;
    }

    //录入最大年龄 查询
    static requestAgeMax() {
        let operation = Operation.sharedInstance().babyAgeDespReadOperation;
        let bodyParameters = {
            "Operation": operation,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '录入最大年龄 查询';
        return req;
    }

    //首页文章 查询
    static requestHomeArticalWithDays(days) {
        let operation = Operation.sharedInstance().homeArticalReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "${Day} == " + days,
            "Appendixes": {
                "+IndexArticleClassify": [
                    "Name"
                ],
                "+BirthMonthDay": [
                    "MonthDay"
                ]
            },
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页文章 查询';
        req.appendixesKeyMap = { 'IndexArticleClassify': 'IndexArticleClassifyId', 'BirthMonthDay': 'BirthMonthDayId' };//可以多个
        req.items = ["Id", "MainTitle", "SubTitle", "IndexArticleClassifyId", "BirthMonthDayId", "Day"];

        //匹配成功函数
        req.appendixesBlock = (data, appendixe, key, id) => {
            if (key === 'IndexArticleClassify') {
                //给data添加新属性
                data.ArticalName = appendixe.Name;
            }

            if (key === 'BirthMonthDay') {
                //给data添加新属性
                data.MonthDay = appendixe.MonthDay;
            }
        };
        return req;
    }

    //孕育问答 查询
    static requestQAWithCondition(condition, index, count) {
        let operation = Operation.sharedInstance().questionReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "Order": "${CreateTime} DESC",
            "MaxCount": count,
            "StartIndex": index,
            "Appendixes": {
                "+AskMember": [
                    "ImgId",
                    "NickName"
                ],
                "+ReplierMember": [
                    "NickName",
                    "ImgId"
                ]
            },
        };
        let req = new RequestRead(bodyParameters);
        req.name = '孕育问答 查询';
        req.appendixesKeyMap = { 'Member': 'AskMemberId', 'ReplierMember': 'ReplierMemberId' };//可以多个
        req.items = ["Id", 
            "AskMemberId",
            "CreateTime",
            "Que",
            "MonthDay",
            "ReplierNumber",
            "ReplierMemberId",
            "IsAnonymity",
            "Attachments",
            "BreedQueAnsId",
            "IsHandpick"];

        //匹配成功函数
        req.appendixesBlock = (data, appendixe, key, id) => {
            if (key === 'Member') {
                //给data添加新属性
                data.NickName = appendixe.NickName;
            }
        };
        return req;
    }
    
}