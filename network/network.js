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
        this.domain = 'http://mobile.topmom.com.cn/';

        //读取
        this.readURL = this.domain + 'Libra.Web.AppSync.AppSyncBatchReadData2.aspx';

        //写入
        this.writeURL = this.domain + 'Libra.Web.Api.ApiBatchWrite.aspx';

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

        __instance(this);
    }

    static sharedInstance() {
        return new Network();
    }
}