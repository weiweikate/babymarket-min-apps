import Request from '../base-requests/request'
import Network from '../network'

export default class RequestDeliveryInfoRead extends Request {

    constructor(trackNo, companyNo) {
        super({});
        this.baseUrl = Network.sharedInstance().expressURL;
        this.urlParam = {
            "key": global.TCGlobal.ExpressKey,
            "no":trackNo,
            "com":companyNo
        };
    }
}
