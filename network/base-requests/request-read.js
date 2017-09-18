/**
 * Created by coin on 1/13/17.
 */
'use strict';

import Tool from '../../tools/tool'
import Request from './request'
import Network from '../network'

//读取请求基类
export default class RequestRead extends Request {

    constructor(bodyParameters) {
        super(bodyParameters, null);
        this.baseUrl =  Network.sharedInstance().readURL;
    }

    static isKeyInCondition(key){
        let notInCondition = (
        key === 'MaxCount' ||
        key === 'StartIndex' ||
        key === 'IsReturnTotal' ||
        key === 'Operation' ||
        key === 'Order' ||
        key === 'Appendixes' ||
        key === 'AppendixesFormatType' ||
        key === 'IsIncludeSubtables' ||
        key === 'Subtables' ||
        key === 'View' ||
        key === 'IsIncludeLong'||
        key === '_SESSION_' ||
        key === 'Items');

        return !notInCondition;
    }

    //拼接body
    body() {

        if (Tool.isValidArr(this.items)) {
            this.bodyParam['Items'] = this.items;
        }
        if (Tool.isValidArr(this.subtables)) {
          this.bodyParam['Subtables'] = this.subtables;
        }
        if (Tool.isValidObject(this.appendixes)) {
            this.bodyParam['Appendixes'] = this.appendixes;
        }

        let condition = '';

        if (!('Condition' in this.bodyParam)) {

            //拼接Condition字段
            for (let key in this.bodyParam) {

                //过滤继承来的属性
                if (this.bodyParam.hasOwnProperty(key)) {
                    let value = this.bodyParam[key];

                    //加入session判断以满足多session的场景：多账号or跨系统
                    if (!RequestRead.isKeyInCondition(key)) {
                        continue;
                    }

                    if (Tool.isEmptyStr(condition)) {
                        condition += '${' + key + "} == '" + value + "'";
                    }
                    else {
                        condition += ' && ${' + key + "} == '" + value + "'";
                    }
                }
            }
        }
        else{
            condition = this.bodyParam['Condition'];
        }

        //操作字段
        let op = this.bodyParam['Operation'];
        if (!Tool.isEmptyStr(op)) {
            this.operation = op;
        }

        //默认参数，可以被覆盖
        let filter = {
            Operation:this.operation,
            Condition:condition,
            IsReturnTotal:true,
            AppendixesFormatType:1,
            // IsIncludeSubtables:true,
            IsIncludeLong:true
        };

        //填装参数，覆盖默认参数
        for (let key in this.bodyParam) {
            //过滤继承来的属性
            if (this.bodyParam.hasOwnProperty(key)) {
                if (!RequestRead.isKeyInCondition(key)) {
                    filter[key] = this.bodyParam[key];//填装参数，覆盖默认参数
                }
            }
        }

        //记录count 和 index，加载更多时使用
        let count = this.bodyParam['MaxCount'];
        let index = this.bodyParam['StartIndex'];
        if (0 !== count && undefined !== count) {
            this.count = count;
        }
        if (undefined !== index) {
            this.index = index;
        }

        this._body = filter;
        return this._body;
    }
}

