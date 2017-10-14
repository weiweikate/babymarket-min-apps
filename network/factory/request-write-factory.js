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

    //修改购物车数量
    static modifyCartQnty(id, qnty) {
        let operation = Operation.sharedInstance().cartModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Id": id,
            "Qnty": qnty,
        };

        let req = new RequestWrite(status, 'Shopping_Cart', params, null);
        req.name = '修改购物车数量';

        return req;
    }

    //删除购物车
    static deleteCart(requestData) {
        let operation = Operation.sharedInstance().cartDeleteOperation;
        let status = Network.sharedInstance().statusDelete;

        let req = new RequestWrite(status, 'Shopping_Cart', requestData, operation, null);
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

        let req = new RequestWrite(status, 'Delivery_address', params, null);
        req.name = '修改地址默认';

        return req;
    }

    //删除地址
    static deleteAddress(id) {
        let operation = Operation.sharedInstance().addressModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Delete": "True",
            "Id": id,
        };

        let req = new RequestWrite(status, 'Delivery_address', params, null);
        req.name = '删除地址';

        return req;
    }

    //新增地址
    static addAddress(id,name, mobile, area, address, areaId, card) {
        let operation = Operation.sharedInstance().addressAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Default": "False",
            "MemberId": global.Storage.memberId(),
            "Consignee": name,
            "Mobile": mobile,
            "FullName": area,
            "Address1": address,
            "Address": area + address,
            "DistrictId": areaId,
            "Card": card,
            "Name": "未指定",
            "Id":id,
        };

        let req = new RequestWrite(status, 'Delivery_address', params, null);
        req.name = '新增地址';

        return req;
    }

    //修改地址
    static modifyDetailAddress(isDefault, name, mobile, area, address, areaId, id, card) {
        let operation = Operation.sharedInstance().addressModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Address": area + address,
            "Address1": address,
            "Card": card,
            "Consignee": name,
            "Default": isDefault,
            "Delete": "False",
            "DistrictId": areaId,
            "FullName": area,
            "Id": id,
            "MemberId": global.Storage.memberId(),
            "Mobile": mobile,
            "Name": "未指定"
        };

        let req = new RequestWrite(status, 'Delivery_address', params, null);
        req.name = '修改地址';

        return req;
    }

    //订单新增
    static orderAddRequest(id, addressId, time) {
        let operation = Operation.sharedInstance().orderAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Formal": "False",
            "CreatorId": global.Storage.memberId(),
            "MemberId": global.Storage.memberId(),
            "Id": id,
            "Delivery_AddressId": addressId,
            "Address_Refresh": time,
        };

        let req = new RequestWrite(status, 'Order', params, null);
        req.name = '订单新增';
        return req;
    }

    //订单明细新增
    static orderLineAddRequest(requestData) {
        let operation = Operation.sharedInstance().orderLineAddOperation;
        let status = Network.sharedInstance().statusNew;

        let req = new RequestWrite(status, 'Order_Line', requestData, operation, null);
        req.name = '订单明细新增';
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

    //验证码
    static verifyCodeGet(mobile, typeKey) {
        let operation = Operation.sharedInstance().verifyCodeAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Mobile": mobile,
            "TypeKey": typeKey,// 1 为找回密码 0 为新用户注册 2 设置支付密码
        };

        let req = new RequestWrite(status, 'Check_Code', params, null);
        req.name = '获取验证码';
        return req;
    }

    //设置支付密码
    static payPasswordSet(checkCode, pwd, confirmPwd, mobile) {
        let operation = Operation.sharedInstance().payPasswordAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "CheckCode": checkCode,
            "NewCode": pwd,
            "CheckPassword": confirmPwd,
            "Mobile": mobile,
            "MemberId": global.Storage.memberId()
        };

        let req = new RequestWrite(status, 'PayCode', params, null);
        req.name = '设置支付密码';
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
    static addAdvisory(requestData) {
      let operation = Operation.sharedInstance().advisoryAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'Advisory', requestData, operation, null);
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
    static addTooth(requestData) {
      let operation = Operation.sharedInstance().toothAdvisoryAddOperation;
      let status = Network.sharedInstance().statusNew;

      let req = new RequestWrite(status, 'ToothAdvisory', requestData, operation, null);
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
    static addQuestion(content, isExpertAns, isAnonymity, queId) {
        let operation = Operation.sharedInstance().questionAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Id": queId,
            "AskMemberId": global.Storage.memberId(),
            "Que": content,
            "IsExpertAns": isExpertAns,
            "IsAnonymity": isAnonymity
        }

        let req = new RequestWrite(status, 'BreedQueAns', params, null);
        req.name = '新增孕育问答';
        return req;
    }

    //新增孕育问答回复
    static addQuestionReply(content, breedQueAnsId, BelongAnswerId) {
        let operation = Operation.sharedInstance().questionAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "ReplierMemberId": global.Storage.memberId(),
            "BreedQueAnsId": breedQueAnsId,
            "Ans": content,
            "BelongAnswerId": BelongAnswerId
        }

        let req = new RequestWrite(status, 'BreedQueAns', params, null);
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
}