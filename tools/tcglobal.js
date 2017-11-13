/**
 * Created by coin on 3/14/17.
 */

import Tool from './tool';
import Network from '../network/network';
import RequestWriteFactory from '../network/factory/request-write-factory';
import RequestReadFactory from '../network/factory/request-read-factory';
import Storage from './storage';
import Event from './event';
import Touches from './Touches';

require('./DateFormat');

let TCGlobal = {
    Tool: Tool,
    Storage: Storage,
    Network: Network,
    Event: Event,
    Touches:Touches,
    RequestWriteFactory: RequestWriteFactory,
    RequestReadFactory: RequestReadFactory,
    EmptyId: "00000000-0000-0000-0000-000000000000",
    MainColor: '#715329',
    ExpressKey:"68b36abf923b43d8294cfa09482c945a",
    BaiduMapKey:'isXMvA8KolOhA9UireE9IsXOYFQl8XGw',
    CustomerServicesNumber:'4006286698',
    version:'V1.0',
    
    AppId:'wx27771c51f11bf6fc',
    Secret:'a652d5de756c419ebaa70294f4b7af6a',
    WXPayMchId:'1486151622',
    WXPayAccount:'2af11683-275b-4272-baa3-a81e014a46ca',
    WXPayKey:'b1Sfq9hBI822iR2BJbY1BxTDZ1v2noCh'
};

module.exports = TCGlobal;