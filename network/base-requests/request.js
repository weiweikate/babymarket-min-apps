/**
 * Created by coin on 1/13/17.
 */
'use strict';

import Tool from '../../tools/tool'
import RequestQueue from './request-queue';
import RequestStatus from './request-status';

//请求基类
export default class Request {

    constructor(bParam)
    {
        //request自己控制loading提示
        this.manageLoadingPrompt = true;

        //接口URL
        this.baseUrl = '';

        //拼接了urlParam的最终url
        this._url = '';

        //操作id
        this.operation = '';

        //异常
        this.exception = '';

        //用于日志输出
        this.name = 'base request';

        //请求方法
        this.requestMethod = 'POST';

        //接收入参
        this.urlParam = {};

        //接收入参
        this.bodyParam = bParam;

        //最后拼接后传给服务器
        this._body = {};

        //响应结果
        this.responseObject = {};

        this.count = 20;

        /**
         * 分页查询时的起始位置
         * @type {number}
         */
        this.index = 0;

        //当前尝试的次数
        this.tryCount = 0;

        //最多尝试重发请求的次数
        this.maxTryCount = 2;

        //用于标记请求
        this.tag = 0;

        //请求的状态
        this.status = RequestStatus.waiting;

        //是否有队列管理请求
        this.isManagedByQueue = false;

        //是否是最后一页数据
        this.hasMore = false;

        //下一页的起始位置
        this.nextIndex = 20;

        /**
         * 调用finishBlock前的预处理，可作为factory中的统一处理
         */
        this.preprocessCallback = (req,firstData) => {};

        //要返回的字段
        this.items = [];

        //     "Appendixes": [
        //     {
        //         "$DataKey": "ZDSD.ed0d67cb-9a93-434c-9d9a-a57e00df2d99",
        //         "KHMC": "D滨江江晖店"
        //     },
        //     {
        //         "$DataKey": "Employee.c2f7ea6c-36fe-410b-a6d2-9f2a0119cca1",
        //         "FullName": "邓辉"
        //     }
        // ]
        //appendixes键值对:{$DataKey前缀:data中对应的属性名} eg. {Employee:'CreatorId',ZDSD:'ShopId'}
        this.appendixesKeyMap = {};

        /**
         * 匹配成功回调
         * @param data
         * @param appendixe
         * @param key
         * @param id
         */
        this.appendixesBlock = (data,appendixe,key,id) => {}

        //成功回调
        this.finishBlock = (req,firstData) => {};

        //失败回调
        this.failBlock = (req) => {};

        //结束回调，不管成功or失败
        this.completeBlock = (req) => {};
    }

    //添加到请求队列中
    addToQueue(){
        this.isManagedByQueue = true;
        RequestQueue.addRequest(this);
    }

    //发起请求
    start() {

        let that = this;
        this.body();
        this.url();
        this.status = RequestStatus.requesting;
        wx.request({
            data:this._body,
            url: this._url,
            dataType:'json',
            method:this.requestMethod,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {

                if (that.managerLoadingPrompt) {
                    Tool.hideLoading();
                }

                console.debug('<============================== 请求结束：' + that.name);
                console.debug('result:');
                console.debug(JSON.stringify(res.data));
                console.debug(res.data);
                console.debug('==============================\n\n\n');
                that.responseObject = res.data;

                //成功
                if (res.data.exception === undefined) {
                    let datas = that.responseObject.Datas;
                    let appendixes = that.responseObject.Appendixes;

                    //配置了键值映射
                    if (Tool.isValidObject(that.appendixesKeyMap)) {

                        //服务器有返回appendixes
                        if (Tool.isValidArr(appendixes)){

                            //第一层for
                            for (let i = 0; i < appendixes.length; i++) {
                                let appendixe = appendixes[i];//appendixe

                                //第二层for
                                for (let j = 0; j < datas.length; j++) {
                                    let data = datas[j];//data

                                    let keyMap = Tool.getAppendixesKeyMap(appendixe.$DataKey);
                                    let key = keyMap.key;//Employee
                                    let id = keyMap.id;//"Employee.c2f7ea6c-36fe-410b-a6d2-9f2a0119cca1"中的id值
                                    let propertyKey = that.appendixesKeyMap[key];//data的属性名，如CreatorId

                                    //通过id，匹配到数据
                                    if (data[propertyKey] === id){

                                        //给data对象添加appendixesMap属性
                                        if (Tool.isEmptyObject(data.appendixesMap)) {
                                            data.appendixesMap = {};
                                        }
                                        data.appendixesMap[key] = appendixe;

                                        //可在这个block中进行二次开发
                                        that.appendixesBlock(data,appendixe,key,id);
                                    }
                                }
                            }
                        }
                    }

                    //
                    let Datas = that.responseObject.Datas;
                    let firstData = null;
                    if (Tool.isValidArr(Datas)) {
                        firstData = Datas[0];
                    }
                    let currentCount = parseInt(that.responseObject.StartIndex) + parseInt(that.responseObject.Count);
                    if (currentCount >= parseInt(that.responseObject.Total)) {
                        that.hasMore = true;
                        console.log(that.name + ' : 已全部加载完');
                    }
                    else{
                        that.nextIndex = currentCount;
                    }

                    //预处理，可以重新组织请求结果
                    that.preprocessCallback(that,firstData)
                    that.finishBlock(that,firstData)
                }

                //失败，有异常
                else
                {
                    that.exception = res.data.exception;

                    //弹窗，提示服务器错误
                    that.failBlock(that);
                    Tool.showAlert(res.data.brief);

                    let error = res.data.brief;
                    console.debug('请求出错：'+error);
                }
            },
            fail:function () {
                that.tryCount ++;

                console.debug('<============================== 请求结束：' + that.name + '第' + that.tryCount + '次请求');
                console.debug('==============================\n\n\n');
                //请求失败重试
                if (that.tryCount < that.maxTryCount) {
                    if (that.isManagedByQueue === false) {
                        that.start();
                    }
                }

                //达到重试上限，提示错误
                else
                {
                    //弹窗，提示服务器错误
                    that.failBlock(that);
                    Tool.showAlert('请求失败，请稍后重试')
                }
            },
            complete:function () {
                that.status = RequestStatus.finish;
                that.completeBlock(that);

                if (that.isManagedByQueue) {
                    RequestQueue.removeRequest(that);
                }

                if (that.manageLoadingPrompt) {
                    Tool.hideLoading();
                }
            }
        });

        console.debug('------------------------------> 请求发起：' + that.name);

        console.debug('url: ' + this._url);
        console.debug('body:');
        console.debug(JSON.stringify(this._body));
        console.debug(this._body);
        console.debug('------------------------------\n\n\n');

        if (this.manageLoadingPrompt) {
            Tool.showLoading();
        }

        return this;
    }

    //拼接url
    url() {

        //没有指明url param，则用默认参数
        if (Tool.isEmpty(this.urlParam)) {
            let session = '';

            //指定了session
            if ('_SESSION_' in this.bodyParam){
                session = this.bodyParam['_SESSION_'];
            }
            else {
                session = global.TCGlobal.Storage.currentSession();
            }

            this.urlParam = {
                _SESSION_: session
            };
        }

        this._url = Tool.generateURL(this.baseUrl,this.urlParam);
        return this._url;
    }

    //拼接body，子类重写
    body() {
        return this._body;
    }
}

