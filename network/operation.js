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
        // 专题列表
        this.specialTopicReadOperation = '2d096526-3bb8-4e8c-b372-a69a0118ab2d';
        // 知识列表
        this.knowledgeReadOperation = '5b960cdc-33ae-45f8-ba5b-a69a0118db39';
        // 知识分类
        this.knowledgeClassifyReadOperation = 'fa08a7f6-5bd3-4a76-b1e1-a6ad00bf92f9';
        // 宝妈圈-贴子查询
        this.postReadOperation = '459fcf50-c9db-40a1-8cf7-a63d0119205d';
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


        //首页-广告位
        this.homeAdReadOperation = 'b412ff1c-c19b-4250-b479-a61e0085a868';
        //首页-分类
        this.homeSortReadOperation = '4293f401-3425-4d6b-bf67-a618018b764a';

        //搜索-热门搜索
        this.searchHotReadOperation = 'c8abee85-11ab-0bba-1bcd-3c4701ec76cb';

        //专题
        this.specialReadOperation = '1120e650-629e-4af0-ab39-a650012db775';

        //宝贝码头商品详情
        this.bmProductReadOperation = 'de9362a8-395e-09a4-087d-3c1701f9da63';

        //规格读取
        this.productSpecificationRead = '3b61a23d-e130-00cd-320f-3c6800fbe982';

        //规格组 读取
        this.productSpecificationGroupRead = '41222433-4d44-089d-3ca0-3c6800f1d60a';

        //老友码头 商品的国家信息
        this.bmNationReadOperation = 'c5cb5117-b585-0160-2ab2-3c1f0016ec87';

        //老友码头 运费
        this.bmExpressRuleReadOperation = '91972a34-2e32-0928-156f-3c3501e55857';

        //产品查询
        this.productReadOperation = 'de9362a8-395e-09a4-087d-3c1701f9da63';

        //购物车新增
        this.cartAddWriteOperation = '';

        //用户信息
        this.memberInfoReadOperation = 'cf71ab3d-ed28-4541-819b-a62c00f4ed2d';

        //购物车
        this.cartReadOperation = '0a8ed48f-088f-0ca3-0c43-3c290052b69b';
        this.cartAddOperation = '';
        this.cartModifyOperation = '137c1d5c-dc35-0114-0b27-3c240045510e';
        this.cartDeleteOperation = 'cd0221ba-e321-0581-06f5-3c2401834522';

        //购物车视图
        this.cartViewReadOperation = '0a8ed48f-088f-0ca3-0c43-3c290052b69b';

        //地址
        this.addressReadOperation = '881d520d-bb5d-04e2-29a8-3c29005a359b';
        this.addressAddOperation = '065e13dd-93fe-0a89-1671-3c2701995222';
        this.addressModifyOperation = '91ef9bde-6fe7-0955-2ecc-3c24004dd20e';
        this.addressDeleteOperation = '4f91a738-50f3-0dc0-231e-3c24018bc622';

        //地区
        this.areaReadOperation = '7e179d1c-ab1c-0352-0a44-393c01c0abf4';

        //订单
        this.orderAddOperation = 'c65c46b6-b12e-0e57-28fe-3c1900223872';
        this.orderDeleteOperation = '';
        this.orderReadOperation = '481f0766-998d-003c-1727-3c1701e15fcb';
        this.orderModifyOperation = '51edceb5-4d37-0d8b-1043-3c1a01f6b85e';

        //订单明细
        this.orderLineAddOperation = '6a5ba01b-d63c-0e45-230f-3c19005015b1';

        //完善信息
        this.informationCompleteReadOperation = '';
        this.informationCompleteWriteOperation = '';

        __instance(this);
    }

    static sharedInstance() {
        return new Operation();
    }
}