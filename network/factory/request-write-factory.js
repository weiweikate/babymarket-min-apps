/**
 * Created by coin on 1/13/17.
 */

import RequestWrite from '../base-requests/request-write'
import Network from '../network'
import Operation from '../operation'
import Tool from '../../tools/tool'

//写入请求具体封装
export default class RequestWriteFactory {

    //示例
    static demo() {
        let operation = Operation.sharedInstance().locationUploadOperation;
        let status = Network.sharedInstance().statusNew;

        let params = {
            "Operation": operation,
            "Longitude": '30',
            "Latitude": '120',
            "LongAddress": '浙江省杭州市。。。',
            "Address": '杭照所',
        };

        let req = new RequestWrite(status, 'Location', params, null);
        req.name = '定位信息上传';

        return req;
    }

    //新增中奖记录
    static addLotteryExtract(requestData) {
      let operation = Operation.sharedInstance().lotteryExtractAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'Extract_Prize', requestData, operation, null);
      req.name = '新增中奖记录';
      return req;
    }

    //新增会员
    static addMember(requestData) {
      let operation = Operation.sharedInstance().memberAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'Member', requestData, operation, null);
      req.name = '新增会员';
      return req;
    }

    //修改密码
    static modifyPassword(requestData) {
      let operation = Operation.sharedInstance().passwordRetakeAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'PasswordRetake', requestData, operation, null);
      req.name = '修改密码';
      return req;
    }

    //新增消息阅读
    static addMessageBatch(requestData) {
      let operation = Operation.sharedInstance().messageBatchReadOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'MessageBatchRead', requestData, operation, null);
      req.name = '新增消息阅读';
      return req;
    }

    //新增积分
    static addIntegral(requestData) {
      let operation = Operation.sharedInstance().integralAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'JFJL', requestData, operation, null);
      req.baseUrl = Network.sharedInstance().writeErpURL;
      req.name = '新增积分';
      return req;
    }

    //新增购物车
    static addCart(requestData) {
      let operation = Operation.sharedInstance().cartAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'ShopCart', requestData, operation, null);
      req.name = '新增购物车';
      return req;
    }

    //修改购物车
    static modifyCart(requestData) {
      let operation = Operation.sharedInstance().cartModifyOperation;
      let status = Network.sharedInstance().statusExisted;

      let req = new RequestWrite(status, 'ShopCart', requestData, operation, null);
      req.name = '修改购物车';
      return req;
    }

    //修改购物车数量
    static modifyCartQuantity(id, quantity) {
      let requestData = {
        "Id": id,
        "Qnty": quantity + ""
      };
      return this.modifyCart(requestData);
    }

    //删除购物车
    static deleteCart(id) {
        let operation = Operation.sharedInstance().cartDeleteOperation;
        let status = Network.sharedInstance().statusDelete;
        let requestData = {
          "Id": id
        };
        let req = new RequestWrite(status, 'ShopCart', requestData, operation, null);
        req.name = '删除购物车';
        return req;
    }

    //修改地址默认
    static modifyDefaultAddress(id) {
        let operation = Operation.sharedInstance().addressModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Default": "True",
            "Id": id,
        };

        let req = new RequestWrite(status, 'ReceiptAddress', params, null);
        req.name = '修改地址默认';

        return req;
    }

    //删除地址
    static deleteAddress(id) {
        let operation = Operation.sharedInstance().addressModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Deleted": "True",
            "Id": id,
        };

        let req = new RequestWrite(status, 'ReceiptAddress', params, null);
        req.name = '删除地址';

        return req;
    }

    //新增地址
    static addAddress(requestData) {
        let operation = Operation.sharedInstance().addressAddOperation;
        let status = Network.sharedInstance().statusNew;

        let req = new RequestWrite(status, 'ReceiptAddress', requestData, operation, null);
        req.name = '新增地址';
        return req;
    }

    //修改地址
    static modifyAddress(requestData) {
        let operation = Operation.sharedInstance().addressModifyOperation;
        let status = Network.sharedInstance().statusExisted;

        let req = new RequestWrite(status, 'ReceiptAddress', requestData, operation, null);
        req.name = '修改地址';
        return req;
    }

    //订单新增
    static orderAdd(requestData) {
        let operation = Operation.sharedInstance().orderAddOperation;
        let status = Network.sharedInstance().statusNew;

        let req = new RequestWrite(status, 'ExchangeOrder', requestData, operation, null);
        req.name = '订单新增';
        return req;
    }

    //订单明细新增
    static orderLineAdd(requestData) {
        let operation = Operation.sharedInstance().orderLineAddOperation;
        let status = Network.sharedInstance().statusNew;

        let req = new RequestWrite(status, 'ExchangeOrderDetail', requestData, operation, null);
        req.name = '订单明细新增';
        return req;
    }

    //秒杀订单新增
    static secondKillOrderAdd(requestData) {
        let operation = Operation.sharedInstance().secKillOrderAddOperation;
        let status = Network.sharedInstance().statusNew;

        let req = new RequestWrite(status, 'Seckill_Order', requestData, operation, null);
        req.name = '秒杀订单新增';
        return req;
    }

    //删除订单
    static deleteOrder(id) {
        let operation = Operation.sharedInstance().orderModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Id": id,
            "Delete": "true"
        };

        let req = new RequestWrite(status, 'Order', params, null);
        req.name = '删除订单';
        return req;
    }

    //修改订单状态
    static modifyOrderStatus(id, statusKey) {
        let operation = Operation.sharedInstance().orderModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Id": id,
            "StatusKey": statusKey,
        };

        let req = new RequestWrite(status, 'Order', params, null);
        req.name = '修改订单状态';
        return req;
    }

    //修改订单
    static modifyOrder(requestData) {
        let operation = Operation.sharedInstance().orderModifyOperation;
        let status = Network.sharedInstance().statusExisted;

        let req = new RequestWrite(status, 'Order', requestData, operation, null);
        req.name = '修改订单';
        return req;
    }

    //绑定支付宝
    static bindAlipayAdd(account, name, checkaccount) {
        let operation = Operation.sharedInstance().alipayAccountAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Name": name,
            "AplipayAccount": account,
            "CheckAccount": checkaccount,
            "MemberId": global.Storage.memberId(),
        };

        let req = new RequestWrite(status, 'AlipayBind', params, null);
        req.name = '绑定支付宝';
        return req;
    }

    //提现
    static withdrawAdd(alipayAccount, money, password, aliplayName) {
        let operation = Operation.sharedInstance().withdrawAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Alipay": alipayAccount,
            "CashMoney": money,
            "Password": password,
            "AlipayName": aliplayName,
            "MemberId": global.Storage.memberId(),
        };

        let req = new RequestWrite(status, 'Cash', params, null);
        req.name = '提现';
        return req;
    }

    //修改用户信息
    static modifyMemberInfo(params) {
        let operation = Operation.sharedInstance().memberInfoModifyOperation;
        let status = Network.sharedInstance().statusExisted;

        params.Operation = operation;
        params.Id = global.Storage.memberId();

        let req = new RequestWrite(status, 'Member', params, null);
        req.name = '修改用户信息';

        return req;
    }

    //修改头像,avatarType:2会员头像 1宝宝头像
    static modifyMemberAvatar(tempImgId, avatarType) {
        let operation = Operation.sharedInstance().memberInfoModifyOperation;
        let status = Network.sharedInstance().statusExisted;

        // 文件名
        let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
        let nowTimeInterval = Tool.timeIntervalFromString(now);
        let fileName = nowTimeInterval + '.png';

        let imgId = Tool.guid();

        let relevancies = [{
            "EntityName": "Attachment",
            "Status": Network.sharedInstance().statusNew,
            "Items": {
                "FileName": fileName,
                "RelevancyId": global.Storage.memberId(),
                "RelevancyType": "Member",
                "RelevancyBizElement": "Img",
                "$FILE_BYTES": tempImgId,
                "Id": imgId,
            },
        }];

        let params = {};
        if (avatarType == '1'){
            params = {
                "ImgId": imgId
            }
        }else{
            params = {
                "BabyImgId": imgId
            }
        }
        params.Operation = operation;
        params.Id = global.Storage.memberId();

        let req = new RequestWrite(status, 'Member', params, operation, relevancies);
        req.name = '修改头像';

        return req;
    }

    //验证码
    static verifyCodeGet(mobile, typeKey) {
        let operation = Operation.sharedInstance().verifyCodeAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Mobile": mobile,
            "TypeKey": typeKey+''// 1注册,2找回密码
        };

        let req = new RequestWrite(status, 'CheckCode', params, null);
        req.name = '获取验证码';
        return req;
    }

    //设置支付密码 classifyKey:1设置，2修改
    static payPasswordSet(loginPwd, payPwd, classifyKey) {
        let operation = Operation.sharedInstance().payPasswordModifyOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "MemberId": global.Storage.memberId(),
            "Password": loginPwd,
            "PayPassword": payPwd,
            "ClassifyKey": classifyKey
        };

        let req = new RequestWrite(status, 'PayPasswordRecord', params, null);
        req.name = '设置支付密码';
        return req;
    }

    //修改登录密码
    static loginPasswordSet(mobile, checkCode, pwd) {
        let operation = Operation.sharedInstance().loginPasswordModifyOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Mobile": mobile,
            "CheckCode": checkCode,
            "NewPassword": pwd,
            "PasswordCheck": pwd
        };

        let req = new RequestWrite(status, 'PasswordRetake', params, null);
        req.name = '修改登录密码';
        return req;
    }

    //新增宝宝日记
    static addBabyDiary(requestData, temporaryIdArray) {
      let operation = Operation.sharedInstance().babyDiaryAddOperation;
      let status = Network.sharedInstance().statusNew;

      let relevancies = null;

      if (temporaryIdArray != undefined) {
        let requestId = requestData.Id;
        relevancies = new Array();
        temporaryIdArray.forEach((item) => {
          let relevancy = new Object();
          relevancy.EntityName = "Attachment";
          relevancy.Status = Network.sharedInstance().statusNew;

          let itemId = Tool.guid();

          let items = new Object();
          items.FileName = itemId + ".png";
          items.RelevancyId = requestId;
          items.RelevancyType = 'BabyDiary';
          items.RelevancyBizElement = 'Attachments';
          items.$FILE_BYTES = item;
          items.Id = itemId;
          relevancy.Items = items;

          relevancies.push(relevancy);

          requestData.PhotoImgId = itemId;
        });
      }

      
      let req = new RequestWrite(status, 'BabyDiary', requestData, operation, relevancies);
      req.name = '新增宝宝日记';
      return req;
    }

    //修改宝宝日记
    static modifyBabyDiary(requestData, temporaryIdArray) {
      let operation = Operation.sharedInstance().babyDiaryModifyOperation;
      let status = Network.sharedInstance().statusExisted;

      let relevancies = null;

      if (temporaryIdArray != undefined) {
        let requestId = requestData.Id;
        relevancies = new Array();
        temporaryIdArray.forEach((item) => {
          let relevancy = new Object();
          relevancy.EntityName = "Attachment";
          relevancy.Status = Network.sharedInstance().statusNew;

          let itemId = Tool.guid();

          let items = new Object();
          items.FileName = itemId + ".png";
          items.RelevancyId = requestId;
          items.RelevancyType = 'BabyDiary';
          items.RelevancyBizElement = 'Attachments';
          items.$FILE_BYTES = item;
          items.Id = itemId;
          relevancy.Items = items;

          relevancies.push(relevancy);

          requestData.PhotoImgId = itemId;
        });
      }

      let req = new RequestWrite(status, 'BabyDiary', requestData, operation, relevancies);
      req.name = '修改宝宝日记';
      return req;
    }

    //新增帖子
    static addPost(requestData, temporaryIdArray) {
      let operation = Operation.sharedInstance().postAddOperation;
      let status = Network.sharedInstance().statusNew;

      let relevancies = null;

      if (temporaryIdArray != undefined) {
        let requestId = requestData.Id;
        relevancies = new Array();
        temporaryIdArray.forEach((item) => {
          let relevancy = new Object();
          relevancy.EntityName = "Attachment";
          relevancy.Status = Network.sharedInstance().statusNew;

          let itemId = Tool.guid();

          let items = new Object();
          items.FileName = itemId + ".png";
          items.RelevancyId = requestId;
          items.RelevancyType = 'Article';
          items.RelevancyBizElement = 'Attachments';
          items.$FILE_BYTES = item;
          items.Id = itemId;
          relevancy.Items = items;

          relevancies.push(relevancy);
        });
      }

      let req = new RequestWrite(status, 'Article', requestData, operation, relevancies);
      req.name = '新增帖子';
      return req;
    }

    //新增帖子评论
    static addPostDiscuss(requestData) {
      let operation = Operation.sharedInstance().postAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'Article', requestData, operation, null);
      req.name = '新增帖子评论';
      return req;
    }

    //新增帖子点赞
    static addPostPraise(requestData) {
      let operation = Operation.sharedInstance().postPraiseAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'ArticleLike', requestData, operation, null);
      req.name = '新增帖子点赞';
      return req;
    }

    //新增帖子收藏
    static addPostCollect(requestData) {
      let operation = Operation.sharedInstance().postCollectAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'Article_Collect', requestData, operation, null);
      req.name = '新增帖子收藏';
      return req;
    }

    //删除帖子收藏
    static deletePostCollect(collectId) {
      let operation = Operation.sharedInstance().postCollectDeleteOperation;
      let status = Network.sharedInstance().statusDelete;
      let params = {
        "Id": collectId
      };

      let req = new RequestWrite(status, 'Article_Collect', params, operation, null);
      req.name = '删除帖子收藏';
      return req;
    }

    //取消圈子关注
    static deleteCircleAttention(attentionId) {
      let operation = Operation.sharedInstance().circleAttentionDeleteOperation;
      let status = Network.sharedInstance().statusDelete;
      let params = {
        "Id": attentionId
      };

      let req = new RequestWrite(status, 'Module_Attention', params, operation, null);
      req.name = '取消圈子关注';
      return req;
    }

    //新增圈子关注
    static addCircleAttention(requestData) {
      let operation = Operation.sharedInstance().circleAttentionAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'Module_Attention', requestData, operation, null);
      req.name = '新增圈子关注';
      return req;
    }

    //新增便便诊所咨询
    static addAdvisory(requestData, temporaryIdArray) {
      let operation = Operation.sharedInstance().advisoryAddOperation;
      let status = Network.sharedInstance().statusNew;

      let relevancies = null;

      if (temporaryIdArray != undefined) {
        let requestId = requestData.Id;
        relevancies = new Array();
        temporaryIdArray.forEach((item) => {
          let relevancy = new Object();
          relevancy.EntityName = "Attachment";
          relevancy.Status = Network.sharedInstance().statusNew;

          let itemId = Tool.guid();

          let items = new Object();
          items.FileName = itemId + ".png";
          items.RelevancyId = requestId;
          items.RelevancyType = 'Advisory';
          items.RelevancyBizElement = 'Attachments';
          items.$FILE_BYTES = item;
          items.Id = itemId;
          relevancy.Items = items;

          relevancies.push(relevancy);
        });
      }

      let req = new RequestWrite(status, 'Advisory', requestData, operation, relevancies);
      req.name = '新增便便诊所咨询';
      return req;
    }

    //新增便便诊所评论
    static addAdvisoryDiscuss(requestData) {
      let operation = Operation.sharedInstance().advisoryDiscussAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'Advisory_Message', requestData, operation, null);
      req.name = '新增便便诊所评论';
      return req;
    }

    //新增爱牙卫士咨询
    static addTooth(requestData, temporaryIdArray) {
      let operation = Operation.sharedInstance().toothAdvisoryAddOperation;
      let status = Network.sharedInstance().statusNew;

      let relevancies = null;

      if (temporaryIdArray != undefined){
        let requestId = requestData.Id;
        relevancies = new Array();
        temporaryIdArray.forEach((item) => {
          let relevancy = new Object();
          relevancy.EntityName = "Attachment";
          relevancy.Status = Network.sharedInstance().statusNew;

          let itemId = Tool.guid();

          let items = new Object();
          items.FileName = itemId + ".png";
          items.RelevancyId = requestId;
          items.RelevancyType = 'Advisory';
          items.RelevancyBizElement = 'Attachments';
          items.$FILE_BYTES = item;
          items.Id = itemId;
          relevancy.Items = items;

          relevancies.push(relevancy);
        });
      }

      let req = new RequestWrite(status, 'ToothAdvisory', requestData, operation, relevancies);
      req.name = '新增爱牙卫士咨询';
      return req;
    }

    //新增爱牙卫士评论
    static addToothDiscuss(requestData) {
      let operation = Operation.sharedInstance().toothDiscussAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'ToothAdvisoryMessage', requestData, operation, null);
      req.name = '新增爱牙卫士评论';
      return req;
    }

    //新增孕育问答
    static addQuestion(content, isExpertAns, isAnonymity, queId, temporaryIdArray) {
        let operation = Operation.sharedInstance().questionAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Id": queId,
            "AskMemberId": global.Storage.memberId(),
            "Que": content,
            "IsExpertAns": isExpertAns,
            "IsAnonymity": isAnonymity
        }

        let relevancies = null;

        if (temporaryIdArray != undefined) {
            relevancies = new Array();
            
            temporaryIdArray.forEach((item) => {
                let relevancy = new Object();
                relevancy.EntityName = "Attachment";
                relevancy.Status = Network.sharedInstance().statusNew;

                let itemId = Tool.guid();

                let items = new Object();
                items.FileName = itemId + ".png";
                items.RelevancyId = queId;
                items.RelevancyType = 'BreedQueAns';
                items.RelevancyBizElement = 'Attachments';
                items.$FILE_BYTES = item;
                items.Id = itemId;
                relevancy.Items = items;

                relevancies.push(relevancy);
            });
        }

        let req = new RequestWrite(status, 'BreedQueAns', params, operation, relevancies);
        req.name = '新增孕育问答';
        return req;
    }

    //新增孕育问答回复
    static addQuestionReply(content, breedQueAnsId, BelongAnswerId) {
        let operation = Operation.sharedInstance().questionAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "ReplierMemberId": global.Storage.memberId(),
            "BreedQueAnsId": breedQueAnsId,
            "Ans": content,
            "BelongAnswerId": BelongAnswerId
        }

        let req = new RequestWrite(status, 'BreedQueAns', params, operation, null);
        req.name = '新增孕育问答回复';
        return req;
    }

    //新增孕育问答回复点赞
    static addQuestionReplyLike(BelongAnswerId) {
        let operation = Operation.sharedInstance().questionLikeAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "MemberId": global.Storage.memberId(),
            "BreedQueAnsId": BelongAnswerId
        }

        let req = new RequestWrite(status, 'QueAnsLike', params, null);
        req.name = '新增孕育问答回复点赞';
        return req;
    }

    //新增首页文章点赞
    static addArticalLike(articalId) {
        let operation = Operation.sharedInstance().homeArticalLikeAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "MemberId": global.Storage.memberId(),
            "IndexArticleId": articalId,
            "IsUseful": "True"
        }

        let req = new RequestWrite(status, 'IndexArticleSub', params, null);
        req.name = '新增首页文章点赞';
        return req;
    }

   //新增首页文章吐槽
    static addArticalComplain(articalId, content) {
        let operation = Operation.sharedInstance().homeArticalLikeAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "MemberId": global.Storage.memberId(),
            "IndexArticleId": articalId,
            "IsUseful": "False",
            "ComplainWord": content,
        }

        let req = new RequestWrite(status, 'IndexArticleSub', params, null);
        req.name = '新增首页文章吐槽';
        return req;
    } 

    //疫苗记录取消
    static cancelVaccineRecord(vaccineId) {
        let operation = Operation.sharedInstance().vaccineRecordDeleteOperation;
        let status = Network.sharedInstance().statusDelete;
        let params = {
            "Operation": operation,
            "Id": vaccineId,
        }

        let req = new RequestWrite(status, 'VaccineRecord', params, null);
        req.name = '疫苗记录取消';
        return req;
    }

    //疫苗记录新增
    static addVaccineRecord(vaccineId) {
        let operation = Operation.sharedInstance().vaccineRecordAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "VaccineId": vaccineId,
            "MemberId": global.Storage.memberId(),
        }

        let req = new RequestWrite(status, 'VaccineRecord', params, null);
        req.name = '疫苗记录新增';
        return req;
    }

    //签到记录新增
    static addSignRecord() {
        let operation = Operation.sharedInstance().signRecordAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "MemberId": global.Storage.memberId(),
        }

        let req = new RequestWrite(status, 'Sign', params, null);
        req.name = '签到记录新增';
        return req;
    }

    //金币充值记录新增
    static addExchangeRecord(points) {
        let operation = Operation.sharedInstance().exchangeAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Point": points,
            "MemberId": global.Storage.memberId(),
        }

        let req = new RequestWrite(status, 'Exchange', params, null);
        req.name = '金币充值记录新增';
        return req;
    }

    //提现 记录新增
    static addWithdrawRecord(money, writePayPassword, alipayAccount) {
        let operation = Operation.sharedInstance().withdrawRecordAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "MemberId": global.Storage.memberId(),
            "CreatorId": global.Storage.memberId(),
            "Money": money,
            "WritePayPassword": writePayPassword,
            "AlipayAccount": alipayAccount
        }

        let req = new RequestWrite(status, 'Cash', params, null);
        req.name = '提现 记录新增';
        return req;
    }

    //新增众筹订单
    static addRaiseOrder(buyCount, raiseId, receiptAddressID, orderId, payPassword) {
        let operation = Operation.sharedInstance().raiseOrderAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "MemberId": global.Storage.memberId(),
            "Crowd_FundingId": raiseId,
            "Buy_Count": buyCount,
            "ReceiptAddressId": receiptAddressID,
            "Id": orderId,
            "WritePayPassword": payPassword
        }

        let req = new RequestWrite(status, 'Crowd_Order', params, null);
        req.name = '新增众筹订单';
        return req;
    }

    //新增团购订单
    static addGroupBuyOrder(activityId, addressDatas, orderId) {
        let operation = Operation.sharedInstance().activityOrderAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "MemberId": global.Storage.memberId(),
            "CreatorId": global.Storage.memberId(),
            "Id":orderId,
            "ActivityId": activityId,
            "Consignee": addressDatas.Consignee,
            "ConsigneeMobile": addressDatas.Mobile,
            "CityId": addressDatas.AreaId,
            "Street": addressDatas.Street,
            "Address": addressDatas.ReciptAddress,
        }

        let req = new RequestWrite(status, 'ActivityOrder', params, null);
        req.name = '新增团购订单';
        return req;
    }

    //新增黄金便征集令报告
    static addLevyReport(requestData, temporaryIdArray) {
      let operation = Operation.sharedInstance().levyReportAddOperation;
      let status = Network.sharedInstance().statusNew;

      let relevancies = null;

      if (temporaryIdArray != undefined) {
        let requestId = requestData.Id;
        relevancies = new Array();
        temporaryIdArray.forEach((item) => {
          let relevancy = new Object();
          relevancy.EntityName = "Attachment";
          relevancy.Status = Network.sharedInstance().statusNew;

          let itemId = Tool.guid();

          let items = new Object();
          items.FileName = itemId + ".png";
          items.RelevancyId = requestId;
          items.RelevancyType = 'Report';
          items.RelevancyBizElement = 'Attachments';
          items.$FILE_BYTES = item;
          items.Id = itemId;
          relevancy.Items = items;

          relevancies.push(relevancy);
        });
      }

      let req = new RequestWrite(status, 'Report', requestData, operation, relevancies);
      req.name = '新增黄金便征集令报告';
      return req;
    }

    //新增黄金便征集令申请
    static addLevyApply(requestData) {
      let operation = Operation.sharedInstance().levyApplyAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'Apply_For', requestData, operation, null);
      req.name = '新增黄金便征集令申请';
      return req;
    }

    //新增门店会员
    static addLevyApply(requestData) {
        let operation = Operation.sharedInstance().storeMemberAddOperation;
        let status = Network.sharedInstance().statusNew;

        let req = new RequestWrite(status, 'MemberClerk', requestData, operation, null);
        req.name = '新增门店会员';
        return req;
    }
}