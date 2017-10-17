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

    //附件
    static attachmentsRead(theId, bizElement ='Attachments') {
      let operation = Operation.sharedInstance().attachmentsReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Condition": "${RelevancyId} == '" + theId + "' && ${RelevancyBizElement} == '" + bizElement+"'",
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

    //咨询类型
    static advisoryTypeRead() {
      let operation = Operation.sharedInstance().advisoryTypeReadOperation;
      let bodyParameters = {
        "Operation": operation
      };
      let req = new RequestRead(bodyParameters);
      req.name = '咨询类型';
      req.items = ['Value', 'Select'];
      return req;
    }

    // 便便诊所查询
    static advisoryRead(isMy=false){
        let operation = Operation.sharedInstance().advisoryReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${Num} DESC,${CreateTime} DESC",
            "Appendixes": {
                "+Member": [
                    "NickName"
                ]
            },
        };
        if(isMy){
          bodyParameters.MemberId = global.Storage.memberId();
        }
        let req = new RequestRead(bodyParameters);
        req.name = '便便诊所查询';
        req.items = ["Id","CreateTime","Head_PictureId","Is_Answer","Else_Add","MemberId",
        "GenderKey","BabyAge"];
        req.appendixesKeyMap = { 'Member': 'MemberId' };//可以多个

        //修改返回结果
        req.preprocessCallback = (req) => {
          let responseData = req.responseObject.Datas;
          responseData.forEach((item, index) => {
            item.headImgUrl = global.Tool.imageURLForId(item.Head_PictureId);
            item.content = item.Else_Add;
            
            item.age = "宝宝" + item.BabyAge;
            if (item.GenderKey == "1") {
              item.age = "男" + item.age;
            } else if (item.GenderKey == "2"){
              item.age = "女" + item.age;
            }
            if (item.Is_Answer == "True") {
              item.isAnswer = true;
            } else {
              item.isAnswer = false;
            }
          });
        }
        //匹配成功函数
        req.appendixesBlock = (item, appendixe, key, id) => {
            if (key === 'Member') {
                //给data添加新属性
              item.name = appendixe.NickName;
            }
        };
        return req;
    }

    // 便便诊所详情查询
    static advisoryDetailRead(id) {
      let operation = Operation.sharedInstance().advisoryReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Id": id 
      };
      let req = new RequestRead(bodyParameters);
      req.name = '便便诊所详情查询';
      req.items = ["Id", "CreateTime", "Result", "Else_Add", "Nurse_Condition", "Milk_Powder_Brand",
        "Assisted_Food", "Cacation_Number", "Pull_Expression", "Suggest", "Answer_Time", "BabyAge", "Name_baby", "WaterIntake","Is_Answer"];
      return req;
    }

    // 便便诊所留言查询
    static advisoryDiscussRead(id) {
      let operation = Operation.sharedInstance().advisoryDiscussReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "AdvisoryId": id,
        "Order": "${CreateTime} DESC",
        "Appendixes": {
          "+Member_Message": [
            "NickName"
          ]
        },
      };
      let req = new RequestRead(bodyParameters);
      req.name = '便便诊所留言查询';
      req.items = ["Id", "Content", "CreateTime", "Member_Message_ImgId","Member_MessageId"];
      req.appendixesKeyMap = { 'Member': 'Member_MessageId' };//可以多个

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.headImgUrl = global.Tool.imageURLForId(item.Member_Message_ImgId);
          item.time = item.CreateTime;
          item.content = item.Content;
        });
      }
      //匹配成功函数
      req.appendixesBlock = (item, appendixe, key, id) => {
        if (key === 'Member') {
          //给data添加新属性
          item.name = appendixe.NickName;
        }
      };
      return req;
    }

    // 爱牙卫士查询
    static toothAdvisoryRead(isMy = false) {
      let operation = Operation.sharedInstance().toothAdvisoryReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Order": "${Num} DESC,${CreateTime} DESC",
        "Appendixes": {
          "+Member": [
            "NickName"
          ]
        },
      };
      if (isMy) {
        bodyParameters.MemberId = global.Storage.memberId();
      }
      let req = new RequestRead(bodyParameters);
      req.name = '便便诊所查询';
      req.items = ["Id", "CreateTime", "MemberImgId", "IsAns", "AdvisoryDetail", "MemberId",
        "BabySexKey", "BabyAge"];
      req.appendixesKeyMap = { 'Member': 'MemberId' };//可以多个

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.headImgUrl = global.Tool.imageURLForId(item.MemberImgId);
          item.content = item.AdvisoryDetail;

          item.age = "宝宝" + item.BabyAge;
          if (item.BabySexKey == "1") {
            item.age = "男" + item.age;
          } else if (item.BabySexKey == "2") {
            item.age = "女" + item.age;
          }
          if (item.IsAns == "True") {
            item.isAnswer = true;
          } else {
            item.isAnswer = false;
          }
        });
      }
      //匹配成功函数
      req.appendixesBlock = (item, appendixe, key, id) => {
        if (key === 'Member') {
          //给data添加新属性
          item.name = appendixe.NickName;
        }
      };
      return req;
    }

    // 爱牙卫士详情查询
    static toothDetailRead(id) {
      let operation = Operation.sharedInstance().toothAdvisoryReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Id": id
      };
      let req = new RequestRead(bodyParameters);
      req.name = '爱牙卫士详情查询';
      req.items = ["Id", "CreateTime", "NewAnsTime", "BabyName", "BabyAge", "TeethingNumber",
        "AdvisoryDetail", "Result", "Suggest", "IsAns"];
      return req;
    }

    // 爱牙卫士留言查询
    static toothDiscussRead(id) {
      let operation = Operation.sharedInstance().toothDiscussReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "ToothAdvisoryId": id,
        "Order": "${CreateTime} DESC",
        "Appendixes": {
          "+MemberMessage": [
            "NickName",
            "ImgId"
          ]
        },
      };
      let req = new RequestRead(bodyParameters);
      req.name = '爱牙卫士留言查询';
      req.items = ["Id", "Content", "CreateTime", "MemberMessageId"];
      req.appendixesKeyMap = { 'Member': 'MemberMessageId' };//可以多个

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.time = item.CreateTime;
          item.content = item.Content;
        });
      }
      //匹配成功函数
      req.appendixesBlock = (item, appendixe, key, id) => {
        if (key === 'Member') {
          //给data添加新属性
          item.headImgUrl = global.Tool.imageURLForId(appendixe.ImgId);
          item.name = appendixe.NickName;
        }
      };
      return req;
    }

    /**
     * 知识库
     */
    static knowledgeRead(key) {
      let operation = Operation.sharedInstance().specialTopicReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "ClassifyKey": key,
        "Order": "${Ordinal} ASC",
      };
      let req = new RequestRead(bodyParameters);
      req.name = '知识库';
      req.items = ["Id", "Name"];

      return req;
    }

    /**
     * 知识列表
     */
    static knowledgeListRead(specialId) {
      let operation = Operation.sharedInstance().knowledgeReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "SpecialTopicId": specialId
      };
      let req = new RequestRead(bodyParameters);
      req.name = '知识列表';
      req.items = ["Id", "Title", "ImgId","Content"];
      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.headImgUrl = global.Tool.imageURLForId(item.ImgId);
        });
      }
      return req;
    }

    /**
     * 知识列表内容
     */
    static knowledgeContentRead(id) {
      let operation = Operation.sharedInstance().knowledgeReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Id": id
      };
      let req = new RequestRead(bodyParameters);
      req.name = '知识列表内容';
      req.items = ["Content"];
      return req;
    }

    /**
     * 知识分类
     */
    static knowledgeClassifyRead() {
      let operation = Operation.sharedInstance().knowledgeClassifyReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Order": "${Ordinal} ASC",
      };
      let req = new RequestRead(bodyParameters);
      req.name = '知识分类';
      req.items = ["Value", "Name"];
      return req;
    }

    // 黄金便征集令查询
    static levyRead(time,applyArray=undefined) {
      let operation = Operation.sharedInstance().levyReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Condition": "${Is_End} == 'False'" + " && ${Remain_Number} > '0'",
        "Order": "${CreateTime} DESC",
        "Appendixes": {
          "+Product": [
            "Attachments",
            "ImgId"
          ]
        },
      };
      let req = new RequestRead(bodyParameters);
      req.name = '黄金便征集令查询';
      req.items = ["Id", "ProductId", "Name", "Normal_Price", "Max_Number", "DateTime_End", "Is_End"];
      req.appendixesKeyMap = { 'Product': 'ProductId' };//可以多个
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          if (time > item.DateTime_End){
            item.buttonText = '已结束';
            item.buttonType = 1;
          }else{
            item.buttonText = '立即申请';
            item.buttonType = 0;
          }
          if (applyArray!=undefined){
            applyArray.forEach((item2, index) => {
              if (item.Id == item2.Wind_AlarmId){
                item.buttonText = '已申请';
                item.buttonType = 2;
              }
            });
          }
        });
      }
      //匹配成功函数
      req.appendixesBlock = (item, appendixe, key, id) => {
        if (key === 'Product') {
          //给data添加新属性
          item.imgUrl = global.Tool.imageURLForId(appendixe.ImgId);
        }
      };
      return req;
    }

    // 黄金便征集令详情查询
    static levyDetailRead(id,time, apply = undefined) {
      let operation = Operation.sharedInstance().levyReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Id": id,
        "Appendixes": {
          "+Product": [
            "Attachments",
            "ImgId"
          ]
        },
      };
      let req = new RequestRead(bodyParameters);
      req.name = '黄金便征集令详情查询';
      req.items = ["Id", "ProductId", "Name", "Normal_Price", "Max_Number", "DateTime_End", "Is_End"];
      req.appendixesKeyMap = { 'Product': 'ProductId' };//可以多个
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          if (time > item.DateTime_End) {
            item.buttonText = '已结束';
            item.buttonType = 1;
          } else {
            item.buttonText = '立即申请';
            item.buttonType = 0;
          }
          if (global.Storage.memberId()){
            if (apply != undefined) {
              item.buttonText = '已申请';
              item.buttonType = 2;

              if (time > apply.Win_End_Time){
                if (apply.Is_Win=='True'){
                  item.status = '恭喜您中奖,请在' + apply.Report_DateTime_End +'之前完成试用报告';
                }else{
                  item.status = '抱歉,您没有中奖';
                }
              }else{
                item.status = '您申请的商品还未开奖';
              }
            } else {
              item.status = '您没有参与此次试用';
            }
          }else{
            item.status = '当前未登录,请先登录';
          }
        });
      }
      //匹配成功函数
      req.appendixesBlock = (item, appendixe, key, id) => {
        if (key === 'Product') {
          //给data添加新属性
          item.imgUrl = global.Tool.imageURLForId(appendixe.ImgId);
        }
      };
      return req;
    }

    // 黄金便征集令申请查询
    static levyApplyRead(id = undefined) {
      let operation = Operation.sharedInstance().levyApplyReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "MemberId": global.Storage.memberId()
      };
      if (id!=undefined){
        bodyParameters.Wind_AlarmId = id;
      }
      let req = new RequestRead(bodyParameters);
      req.name = '黄金便征集令申请查询';
      req.items = ["Id", "Wind_AlarmId", "Is_Win", "Report_DateTime_End"];
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

    // 宝妈圈-查询我发表的帖子
    static postMyRead() {
      let operation = Operation.sharedInstance().postReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Member_Article_SendId": global.Storage.memberId(),
        "Belong_ArticleId":"00000000-0000-0000-0000-000000000000"
      };

      let req = new RequestRead(bodyParameters);
      req.name = '查询我发表的帖子';
      req.items = ["Id", "SendNickName", "BabyAge", "Title_Article", "Article_Abstract", "TotalViews",
        "Commemt_Number", "Img_Member_Article_SendId"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        this.parseMomPostData(responseData);
        responseData.forEach((item, index) => {
          item.isReply = true;
          item.replyNum = item.Commemt_Number;
        });
      }
      return req;
    }

    // 宝妈圈-查询我回复的帖子
    static postMyReplyRead() {
      let operation = Operation.sharedInstance().postMineReplyReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "Order": "${ReplyTime} DESC",
      };

      let req = new RequestRead(bodyParameters);
      req.name = '查询我回复的帖子';
      req.items = ["Id", "SendNickName", "BabyAge", "Title_Article", "Article_Abstract", "TotalViews",
        "Commemt_Number", "Img_Member_Article_SendId", "ReplyTime","CreateTime"];

      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        this.parseMomPostData(responseData);
        responseData.forEach((item, index) => {
          item.isReply = true;
          item.replyNum = item.Commemt_Number;
        });
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

    //指定天数首页文章 查询
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
        req.name = '指定天数首页文章 查询';
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

    //首页文章最大天数 查询
    static requestHomeArticalCount(typeId) {
        let operation = Operation.sharedInstance().homeArticalReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "${IndexArticleClassifyId} == '" + typeId + "'",
            "Order":"${Day} DESC",
            "MaxCount": '1',
            "StartIndex": 0,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页文章最大天数 查询';
        req.items = ["Day"];
        return req;
    }

    //首页文章 查询
    static requestHomeArticalList(condition) {
        let operation = Operation.sharedInstance().homeArticalReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "MaxCount": '9999',
            "StartIndex": 0,
            "Appendixes": {
                "+BirthMonthDay": [
                    "MonthDay"
                ]
            },
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页文章 查询';
        req.appendixesKeyMap = {'BirthMonthDay': 'BirthMonthDayId' };//可以多个
        req.items = ["Id", "MainTitle", "BirthMonthDayId", "Day"];

        //匹配成功函数
        req.appendixesBlock = (data, appendixe, key, id) => {
            if (key === 'BirthMonthDay') {
                //给data添加新属性
                data.MonthDay = appendixe.MonthDay;
            }
        };
        return req;
    }

    //孕育问答 查询
    static requestQAWithCondition(condition, index, count, isAnswer=false) {
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
        if(isAnswer){
            req.appendixesKeyMap = { 'Member': 'ReplierMemberId'};//可以多个
        }
        req.items = ["Id", 
            "AskMemberId",
            "CreateTime",
            "Que",
            "Ans",
            "MonthDay",
            "ReplierNumber",
            "ReplierMemberId",
            "IsAnonymity",
            "Attachments",
            "BreedQueAnsId",
            "BelongAnswerId",
            "IsHandpick"];

        //匹配成功函数
        req.appendixesBlock = (data, appendixe, key, id) => {
            let { Tool } = global;
            
            if (key === 'Member') {
                //给data添加新属性
                data.NickName = appendixe.NickName;
                if (Tool.isTrue(data.IsAnonymity)){
                    data.NickName = '匿名';
                }
                data.ImgId = appendixe.ImgId;
                data.AvatarUrl = Tool.imageURLForId(appendixe.ImgId, '/res/img/common/common-avatar-default-icon.png');
            }
        };

        req.preprocessCallback = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                let createTime = item.CreateTime;
                createTime = createTime.substring(5, 16);
                item.HandleTime = createTime;

                if (item.Que == '') {
                    item.Que = item.Ans;
                }

            });
        }

        return req;
    }

    //我的孕育问答回答 查询
    static requestMyQAReplyWithCondition(index, count) {
        let operation = Operation.sharedInstance().questionReplyReadOperation;
        let bodyParameters = {
            "Operation": operation,
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
        req.name = '我的孕育问答回答 查询';
        req.appendixesKeyMap = { 'Member': 'AskMemberId', 'ReplierMember': 'ReplierMemberId' };//可以多个
        req.items = ["Id",
                    "AskMemberId",
                    "CreateTime",
                    "QueDigest",
                    "MonthDay",
                    "ReplierNumber",
                    "ReplierMemberId",
                    "IsAnonymity",
                    "BreedQueAnsId",
                    "Attachments"];

        //匹配成功函数
        req.appendixesBlock = (data, appendixe, key, id) => {
            let { Tool } = global;

            if (key === 'Member') {
                //给data添加新属性
                data.NickName = appendixe.NickName;
                data.ImgId = appendixe.ImgId;
                data.AvatarUrl = Tool.imageURLForId(appendixe.ImgId, '/res/img/common/common-avatar-default-icon.png');
            }
        };

        req.preprocessCallback = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                let createTime = item.CreateTime;
                createTime = createTime.substring(5, 16);
                item.HandleTime = createTime;
                item.Que = item.QueDigest;
            });
        }

        return req;
    }

    //孕育问答详情评论点赞 查询
    static requestQuestionLike(BreedQueAnsId) {
        let operation = Operation.sharedInstance().questionLikeReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "BreedQueAnsId": BreedQueAnsId,
            "MaxCount": 1,
            "StartIndex": 0,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '孕育问答详情评论点赞 查询';
        req.items = ["Id","MemberId","BreedQueAnsId"]
        return req;
    }

    //食物分类 查询
    static requestFoodSort() {
        let operation = Operation.sharedInstance().foodSortReadOperation;
        let bodyParameters = {
            "Operation": operation,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '食物分类 查询';
        req.items = ["Id","Value","ImgId","Name"];
        req.preprocessCallback = (req) => {
            let { Tool } = global;

            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                
                item.title = item.Name;
                item.imageUrl = Tool.imageURLForId(item.ImgId, '/res/img/common/common-avatar-default-icon.png');
            });
        }
        return req;
    }

    //食物列表 查询
    static requestFoodList(index, count, condition) {
        let operation = Operation.sharedInstance().foodReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "MaxCount": count,
            "StartIndex": index,
            "Condition": condition,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '食物列表 查询';
        /*req.items = ["Id",
                    "FootClassifyId",
                    "Name",
                    "OtherName",
                    "ImgId",
                    "FetationEatStateKey",
                    "LyinginEatStateKey",
                    "LactationEatStateKey",
                    "BabyEatStateKey",
                    "Hunt"];*/

        req.preprocessCallback = (req) => {
            let { Tool } = global;

            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                item.imageUrl = Tool.imageURLForId(item.ImgId, '/res/img/common/common-avatar-default-icon.png');
                
                let yesUrl = '/res/img/index/index-eat-yes-icon.png';
                let littleUrl = '/res/img/index/index-eat-little-icon.png';
                let noUrl = '/res/img/index/index-eat-no-icon.png';

                let fetationEat = '';
                if (item.FetationEatStateKey == '1'){
                    fetationEat = yesUrl;
                } else if (item.FetationEatStateKey == '2'){
                    fetationEat = littleUrl;
                } else{
                    fetationEat = noUrl;
                }

                let lyingEat = '';
                if (item.LyinginEatStateKey == '1') {
                    lyingEat = yesUrl;
                } else if (item.LyinginEatStateKey == '2') {
                    lyingEat = littleUrl;
                } else {
                    lyingEat = noUrl;
                }
                
                let babyEat = '';
                if (item.BabyEatStateKey == '1') {
                    babyEat = yesUrl;
                } else if (item.BabyEatStateKey == '2') {
                    babyEat = littleUrl;
                } else {
                    babyEat = noUrl;
                }

                item.eatLists = [{
                    'name': '孕妇',
                    'imgUrl': fetationEat,
                    'explain': item.FetationExplain
                },
                {
                    'name': '产妇',
                    'imgUrl': lyingEat,
                    'explain': item.LyinginExplain
                },
                {
                    'name': '婴幼儿',
                    'imgUrl': babyEat,
                    'explain': item.BabyExplain
                }];
            });
        }
        return req;
    }

    //辅食大全月份列表查询
    static requestBabyFoodMonth() {
        let operation = Operation.sharedInstance().babyFoodReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "${IsMonthShow} == 'true'",
            "Order": "${AgeMonth} ASC",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '辅食大全月份列表查询';
        req.items = ["AgeMonth"];
        req.preprocessCallback = (req) => {
            let { Tool } = global;

            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {

                item.Name = item.AgeMonth + '个月';
            });
        }
        return req;
    }

    //辅食大全查询
    static requestBabyFoodList(index, count, condition) {
        let operation = Operation.sharedInstance().babyFoodReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "MaxCount": count,
            "StartIndex": index,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '辅食大全月份列表查询';
        req.items = ["AgeMonth",
                        "Id",
                        "ImgId",
                        "Digest",
                        "Title",
                        "Content"];
        req.preprocessCallback = (req) => {
            let { Tool } = global;

            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                item.imageUrl = Tool.imageURLForId(item.ImgId, '/res/img/common/common-avatar-default-icon.png');
            });
        }
        return req;
    }

    //月子餐天数查询
    static requestConfinementFoodDays() {
        let operation = Operation.sharedInstance().confinementFoodReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "MaxCount": 50,
            "StartIndex": 0,
            "Order": "${Day} ASC",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '月子餐天数查询';
        return req;
    }

    //疫苗时间表查询
    static requestVaccineTime() {
        let operation = Operation.sharedInstance().vacineeReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${Day} ASC",
            "IsIncludeSubtables": true,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '疫苗时间表查询';
        return req;
    }

    //打疫苗记录查询
    static requestVaccineRecord() {
        let operation = Operation.sharedInstance().vaccineRecordReadOperation;
        let bodyParameters = {
            "Operation": operation,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '打疫苗记录查询';
        req.items = ["Id", "MemberId", "VaccineId"];
        return req;
    }
}