/**
 * Created by coin on 1/13/17.
 */

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

//操作常量定义
export default class Operation {

    constructor() {
        if (__instance()) return __instance();

        //附件
        this.attachmentsReadOperation = '3a3bf362-b406-47a4-a6d2-a642010374b5';

        // 便便诊所，咨询类型
        this.advisoryTypeReadOperation = '8445b839-c622-40cb-8dbc-a63d0115a365';
        // 便便诊所
        this.advisoryReadOperation = 'de9167ca-44b6-42da-bf20-a63d0116325d';
        // 便便诊所，新增
        this.advisoryAddOperation = 'e3aa7396-a6cc-41b2-a9ea-a63d01171b91';
        // 便便诊所,留言查询
        this.advisoryDiscussReadOperation = '932411a2-b3fe-4554-9272-a63d0117be75';
        // 便便诊所,留言新增
        this.advisoryDiscussAddOperation = 'acfaaeb9-0be4-44f8-bed9-a63d0117dced';
        // 爱牙卫士
        this.toothAdvisoryReadOperation = '34fe93b4-dd36-4289-a1bd-a6c60123a429';
        // 爱牙卫士，新增
        this.toothAdvisoryAddOperation = 'd78c77c3-dcb9-46e6-8ade-a6c60124f92d';
        // 爱牙卫士,留言查询
        this.toothDiscussReadOperation = '016b409c-4044-4304-b622-a6c60124b535';
        // 爱牙卫士,留言新增
        this.toothDiscussAddOperation = '85450a21-1609-464c-bf4d-a6c6012519fd';
        // 黄金便征集令查询
        this.levyReadOperation = 'a3dba460-900e-44a9-af99-a64400bbf081';
        // 黄金便征集令申请查询
        this.levyApplyReadOperation = 'f096b173-23c4-48a4-9ec7-a64400bee7e1';
        // 黄金便征集令申请新增
        this.levyApplyAddOperation = '5067b146-ae32-49b9-91b4-a64400bf1b71';
        // 黄金便征集令报告查询
        this.levyReportReadOperation = '8e89a7fc-176a-4968-89f3-a64400c31a7d';
        // 黄金便征集令报告新增
        this.levyReportAddOperation = '73fb7ee0-0f09-4918-b6ae-a64400c33b4d';
        // 专题列表
        this.specialTopicReadOperation = '2d096526-3bb8-4e8c-b372-a69a0118ab2d';
        // 知识列表
        this.knowledgeReadOperation = '5b960cdc-33ae-45f8-ba5b-a69a0118db39';
        // 知识分类
        this.knowledgeClassifyReadOperation = 'fa08a7f6-5bd3-4a76-b1e1-a6ad00bf92f9';
        // 宝妈圈-贴子查询
        this.postReadOperation = '459fcf50-c9db-40a1-8cf7-a63d0119205d';
        // 宝妈圈-我回复的帖子查询
        this.postMineReplyReadOperation = 'df2e994f-1a73-4182-a0bb-a68e012119c5';
        // 宝妈圈-贴子新增
        this.postAddOperation = '9f0deed4-76cc-4a3f-9340-a63d01193c7d';
        // 宝妈圈-贴子点赞新增
        this.postPraiseAddOperation = '627fc402-8626-4615-bd11-a6db0106d461';
        // 宝妈圈-贴子点赞查询
        this.postPraiseReadOperation = 'd06340d6-aea6-002f-0b1a-3fd901f4ab87';
        // 宝妈圈-贴子收藏新增
        this.postCollectAddOperation = 'dd2586b6-37f9-4b81-89b5-a63d0119b789';
        // 宝妈圈-贴子收藏查询
        this.postCollectReadOperation = '50a1b87d-e2b1-43f6-aa4e-a63d01199dc1';
        // 宝妈圈-贴子收藏删除
        this.postCollectDeleteOperation = 'b6fdfd74-bde5-4af5-90ae-a63d0119ee9d';
        // 宝妈圈-圈子查询
        this.circleReadOperation = '1e9cea5e-ea22-486f-b2cb-a63d011834d1';
        // 宝妈圈-圈子是否关注查询
        this.circleAttentionReadOperation = '7c05789f-d478-4a22-9e9c-a63d01189741';
        // 宝妈圈-圈子新增关注
        this.circleAttentionAddOperation = '96cac357-8b6c-459a-bd07-a63d0118aeb1';
        // 宝妈圈-圈子取消关注
        this.circleAttentionDeleteOperation = '27fc1943-83c8-4b94-8158-a63d0118f17d';
        // 宝妈圈-大家都在搜查询
        this.recordReadOperation = 'd734db6e-2322-4a81-bfca-a68e00af1389';

        // 首页-宝宝年龄段描述查询
        this.babyAgeDespReadOperation = '5685c0ea-609e-4844-a2e4-a68600aae0ed';
        // 首页-文章查询
        this.homeArticalReadOperation = '568b4f34-2b12-48ff-b8dc-a68600af2af9';
        // 首页-文章查询点赞新增
        this.homeArticalLikeAddOperation = '81eb7bb6-36af-49f8-88d4-a6da0122b069';

        // 孕育问答 查询
        this.questionReadOperation = '5107b45e-6f9d-4383-bdfa-a68600b56711'
        this.questionAddOperation = 'e8967308-a160-4b0d-8f7b-a68600b5b469'
        //我的孕育问答回答
        this.questionReplyReadOperation = '6fce86ea-15f2-488d-a105-a68f00aa58fd'
        //孕育问答点赞
        this.questionLikeReadOperation = 'd2a5b35f-3d8f-05c8-33ae-3f9e01e560f3'
        this.questionLikeAddOperation = 'a17faf8c-244e-4d6b-b455-a76f00a6101d'

        // 能不能吃食物分类 查询
        this.foodSortReadOperation = '6f8be012-8000-476a-8828-a68600b0da39'
        // 食物列表 查询
        this.foodReadOperation = '670b88f4-1858-464f-9ef0-a68600b039ad'

        // 查询辅食大全
        this.babyFoodReadOperation = '9db096be-1b31-432e-a5cc-a69a01054015'
        // 查询月子餐
        this.confinementFoodReadOperation = '0dd116fb-2bcf-4f6d-8873-a69a00fc033d'

        // 查询疫苗主表
        this.vacineeReadOperation = '8d73e0ce-6532-4682-8a81-a69a0113ee49'
        // 增加疫苗记录
        this.vaccineRecordAddOperation = 'b30dac6c-714d-479f-ae22-a69a0116fe45'
        // 查询疫苗记录
        this.vaccineRecordReadOperation = 'c7abca9f-89e7-4cd9-ae98-a69a01171de9'
        // 取消疫苗记录 
        this.vaccineRecordDeleteOperation = 'c6883d4c-7ab7-4822-ba8a-a69b01095a15'

        // 团购首页 轮播图查询
        this.welfareCycleReadOperation = 'f7caf922-5a10-4d98-bdc8-a65800b955b5'

        // 限时购活动 查询
        this.activityReadOperation = '4a2a4f46-6feb-4418-bfc0-a769001d5308'
        // 限时购订单 查询
        this.activityOrderReadOperation = 'cc223268-ef4e-4891-bebb-a769001e5e38'
        // 限时购订单 新增
        this.activityOrderAddOperation = '2646f5c3-da95-0f8a-2a95-3e64004ecd3d'
        // 限时购订单 修改
        this.activityOrderModifyOperation = 'bfb69850-f8df-4288-ae15-a769001ebbf8'

        // 签到记录 查询
        this.signRecordReadOperation = '80618989-184d-0b9e-3fe8-3f5b01db72b3'
        // 签到记录 新增
        this.signRecordAddOperation = '0e22c859-30ee-05f5-0031-3f550018150a'

        // 秒杀时间段 查询
        this.secKillTimeReadOperation = '94b1a9c8-c840-4f16-8b4d-a64e01109a55'
        // 秒杀商品列表 查询
        this.secKillProductsReadOperation = 'a5db1a6b-3345-4f87-b61a-a64e010f1fd1'

        //首页-广告位
        this.homeAdReadOperation = 'f7caf922-5a10-4d98-bdc8-a65800b955b5';
        //首页-分类
        this.homeSortReadOperation = 'c2e1f45e-1096-4ca9-b065-a6320104409d';
        //首页-标签
        this.homeTargetReadOperation = '331a858b-db16-48e4-9603-a69e00e5ffb1';
        //首页-标签产品
        this.homeTargetProductReadOperation = '9310cb28-7e14-4f46-97dd-a69e00bff0b9';

        //搜索-热门搜索
        this.searchHotReadOperation = 'c8abee85-11ab-0bba-1bcd-3c4701ec76cb';

        //规格读取
        this.productFormRead = '05fac52c-6d7d-0acb-1173-3e3201d4fe8f';

        //产品查询
        this.productReadOperation = '9992fecc-286b-47c2-97fa-a62c00fa3201';

        //购物车新增
        this.cartAddWriteOperation = '';

        //用户信息
        this.memberInfoReadOperation = 'cf71ab3d-ed28-4541-819b-a62c00f4ed2d';

        //购物车
        this.cartReadOperation = 'd85baa92-d73c-42de-a91c-a62c0115803d';
        this.cartAddOperation = '88282f4f-a1d7-07c2-250f-3f2501f1e80e';
        this.cartModifyOperation = '4ebbf890-ded4-4610-a9c6-a633012f2065';
        this.cartDeleteOperation = '7f7bb361-4a1f-4434-8dbb-a633012b0d6d';

        //地址
        this.addressReadOperation = 'e4d97b85-5133-4304-a799-a62c00f67819';
        this.addressAddOperation = 'dc785d02-c9cd-07f5-0f1c-3f25019d80fa';
        this.addressModifyOperation = '4bc9d501-35d4-0429-37a1-3f26004900d6';

        //地区
        this.areaReadOperation = 'd7e69a1e-5040-48c8-a5ac-a62c00f70f45';

        //订单
        this.orderAddOperation = '7026e5da-2db7-0e59-3831-3f25018afab2';
        this.orderDeleteOperation = '';
        this.orderReadOperation = '318450a4-715f-463d-b1f9-a62c01176565';
        this.orderModifyOperation = '3095ff42-bece-47e2-b435-a62c011818b1';

        //订单明细
        this.orderLineAddOperation = 'cc995cdf-115c-01b3-30cb-3f2500426b35';

        //完善信息
        this.informationCompleteReadOperation = '';
        this.informationCompleteWriteOperation = '';

        __instance(this);
    }

    static sharedInstance() {
        return new Operation();
    }
}