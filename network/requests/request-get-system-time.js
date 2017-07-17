/**
 * Created by Patrick on 30/06/2017.
 */
'use strict';

import Request from '../base-requests/request'
import Network from '../network'

export default class RequestGetSystemTime extends Request {

    constructor() {
        super({});
        this.baseUrl = Network.sharedInstance().getSystemTimeURL;
    }

}