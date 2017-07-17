/**
 * Created by coin on 1/13/17.
 */
'use strict';

import Request from './request'
import Network from '../network'
import Tool from '../../tools/tool'

//写入请求基类
export default class RequestWrite extends Request {

    /*
     status:写入类型
     table:表名
     tableParams:单个传入普通对象，批量传入Array即可,
     operation:操作Id，如果tableParams中也指明了操作Id，则用tableParams中的。
     relevancies:附件参数
    */
    constructor(status,table,tableParams,operation,relevancies) {
        super({});
        this.baseUrl =  Network.sharedInstance().writeURL;

        this.status = status;
        this.table = table;
        this.tableParams = tableParams;
        this.relevancies = relevancies;
        this.operation = operation;
    }

    setup(param){
        //操作字段
        let op = param['Operation'];
        if (Tool.isValidStr(op)) {
            this.operation = op;
            delete param.Operation;
        }

        let operationKey = '';
        if (this.status === Network.sharedInstance().statusNew) {
            operationKey = 'AddOperationId';
        }
        else if (this.status === Network.sharedInstance().statusExisted) {
            operationKey = 'ModifyOperationId';
        }
        else if (this.status === Network.sharedInstance().statusDelete){
            operationKey = 'DeleteOperationId';
        }

        let dict = {};

        let relevancyKey = '-Relevancy#'+ this.table +'(Attachment)';

        dict = {
            Data:
                {
                    EntityName:this.table,
                    Status:this.status,
                    Items:param,
                    Relevancies:{
                    }
                }
        };
        dict[operationKey] = this.operation;

        //没有附件
        if (Tool.isEmptyArr(this.relevancies)) {
            delete dict.Data.Relevancies;
        }
        //有附件
        else
        {
            dict.Data.Relevancies[relevancyKey] = this.relevancies;
        }

        return dict;
    }

    //拼接body
    body() {
        let items = [];
        if (this.tableParams instanceof Array) {
            this.tableParams.forEach((item) => {
                items.push(this.setup(item));
            });
        }
        else
        {
            items.push(this.setup(this.tableParams));
        }
        this._body = {Items: items};
        this.bodyParam = this._body;
        return this._body;
    }
}

