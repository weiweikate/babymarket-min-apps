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

//网络常量定义
export default class Network {

    constructor() {
        if (__instance()) return __instance();

        //域名
        this.domain = 'https://mobile.topmom.com.cn/';
        //域名Erp
        this.domainErp = 'https://erp.takecare.com.cn/';

        //读取
        this.readURL = this.domain + 'Libra.Web.AppSync.AppSyncBatchReadData2.aspx';

        //读取Erp
        this.readErpURL = this.domainErp + 'Libra.Web.AppSync.AppSyncBatchReadData2.aspx';

        //写入
        this.writeURL = this.domain + 'Libra.Web.Api.ApiBatchWrite.aspx';

        //写入Erp
        this.writeErpURL = this.domainErp + 'Libra.Web.Api.ApiBatchWrite.aspx';

        //登录
        this.loginURL = this.domain + 'Libra.Web.Authentication.GetSession.aspx';

        //附件
        this.attatchmentURL = this.domain + 'Libra.Web.Businesses.Attachments.GetFile.aspx';

        //获取系统时间
        this.getSystemTimeURL = this.domain + "Libra.Web.AppSync.AppSyncNow.aspx";

        //上传附件
        this.uploadURL = this.domain + "Libra.Web.Api.ApiWriteBlob.aspx";

        //物流信息
        this.expressURL = 'https://v.juhe.cn/exp/index';

        this.statusExisted = 'Existed';
        this.statusNew = 'New';
        this.statusDelete = 'Deleted';

        //详情页
        this.questionURL = this.domain + 'QueAnsDetails.aspx';
        this.articalURL = this.domain + 'IndexArticleDetails.aspx';
        this.levyDetailURL = this.domain + 'Wind_Alarm_Detail.aspx';
        this.levyRuleURL = this.domain + 'Wind_Alarm_Rule.aspx';
        this.activityRuleURL = this.domain + 'ActivitRule.aspx';
        this.raiseURL = this.domain + 'TopCrowdDetail.aspx';
        this.raiseRuleURL = this.domain + 'TopWinRule.aspx';
        this.lotteryRuleURL = this.domain + 'Dial.aspx';

        __instance(this);
    }

    static sharedInstance() {
        return new Network();
    }
}