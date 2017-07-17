网络库文档 by Patrick
-----

一、目录结构
------

1.
--

    /network

文件根目录

2.
--

    /network/base-requests

存放网络请求库的基类文件，一般不需要修改<br><br>

    /network/base-requests/request.js

请求类的基类<br><br>

    /network/base-requests/request-read.js

读取请求的基类，继承自request.js<br><br>

    /network/base-requests/request-write.js

写入请求基类，继承自request.js<br><br>

3.
--

    /network/factory

请求工厂类，具体请求集中写到这里<br><br>

    /network/factory/request-read-factory.js

读取工厂类，创建并返回request-read.js的实例<br><br>

    /network/factory/request-write-factory.js

写入工厂类，创建并返回request-write.js的实例<br><br>

二、使用说明
------

1、请求参数说明
--------

request.js（基础结构，可先略过本节）
----------

请求参数在request.js这层，主要5个参数：bodyParam，urlParam，finishBlock，failBlock，completeBlock。

 - bodyParam
body()方法会根据bodyParam参数拼接this._body，可重写body()方法（案列：登陆请求），修改拼接逻辑。request.js在发送请求前，会执行body()方法，并获取this._body的值作为最后的值写入请求的body中。

 - urlParam
url()方法会根据urlParam参数拼接this._url，可重写url()方法，修改拼接逻辑。request.js在发送请求前，会执行url()方法，并获取this._url的值作为请求的url

 - finishBlock = (req,firstData) => {};
 成功的回调，req是请求的对象，可通过req.responseObject获取结果对象。
 如果是读取请求 firstData 为req.responseObject.Datas数组的第一个对象，如果没有取到数据，则firstData默认为null

 - failBlock = (req) => {};
 失败的回调，req是请求的对象，可通过req.exception获取异常信息，默认会弹窗提示。

 - completeBlock = (req) => {};
结束回调，不管成功or失败，req是请求的对象

<br>

所有参数：

    //请求基类
    export default class Request {

        constructor(bParam)
        {
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

            this.index = 0;

            //当前尝试的次数
            this.tryCount = 0;

            //最多尝试重发请求的次数
            this.maxTryCount = 3;

            //用于标记请求
            this.tag = 0;

            //要返回的字段
            this.items = [];

            //成功回调
            this.finishBlock = (req) => {};

            //失败回调
            this.failBlock = (req) => {};

            //结束回调，不管成功or失败
            this.completeBlock = (req) => {};
        }

        //发起请求
        start()

        //拼接url
        url()

        //拼接body，子类重写
        body()

<br>

request-read.js（重要）
---------------
主要参数：bodyParameters

 - bodyParameters
主要接受这一个参数，可往这个对象中加多个参数，会自动区分是Condition字段还是_SESSION_字段或是其他控制字段。

如下字段会自动判断，以后会继续丰富。

     1. 'MaxCount'
     2. 'StartIndex'
     3. 'IsReturnTotal'
     4. 'Operation'
     5. 'Order'
     6. 'Appendixes'
     7. 'AppendixesFormatType'
     8. 'IsIncludeSubtables'
     9. 'View'
     10. 'IsIncludeLong'
     11. '_SESSION_'
     12. 'Items'
如果字段不在上面的范围内，则会自动添加到Condition中，作为查询条件，所以简短的条件查询，可不用写Condition字段，直接写查询字段即可，可自动拼接成Condition字段，拼接的条件默认是「等于」，多个条件之间用 && 连接。如果遇到复杂的查询情况，可在bodyParameters中直接指明Condition字段。

    let bodyParameters =  {
                "Operation":operation,
                "Id":theId,
                "MaxCount":'1',
            };

这个案例，会自动将Id字段拼接成Condition字段 "Condition":"${Id} == 'xxxxxxx'"。

request-read-factory.js （最常用）
-----------------------

    //示例 发货查询
    static deliveryRead(status){
        let operation = Operation.sharedInstance().deliveryReadOperation;
        let bodyParameters =  {
            "Operation":operation,
            "StatusKey":status,
            "MaxCount":'3',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '发货查询';//用于日志输出
        req.items = ['Customer'];
        return req;
    }

 - operation 即操作Id，在Operation单列中定义。
 - req 请求的实例对象
 - name 请求的名称，打印日志时会用到
 - items 可指明要返回的字段


request-write.js
----------------

主要参数：

 - status:写入类型
 - table:表名
 - tableParams:单个的写操作传入一个对象，批量的写操作传入Array即可
 - relevancies:附件参数

具体使用参考request-write-factory.js

request-write-factory.js
------------------------

    //条形码上传
    static codeUpload(code){
        let operation = Operation.sharedInstance().tagLockCodeWriteOperation;
        let status = Network.sharedInstance().statusNew;

        let params = {
            "Operation":operation,
            "Id":Tool.guid(),
            "Code" : code,
        };

        let req = new RequestWrite(status,'TagLock',params,null);
        req.name = '二维码上传';

        return req;
    }



 1. status 分三种类型，分别对应修改、新建、删除

          this.statusExisted = 'Existed';
          this.statusNew = 'New';
          this.statusDelete = 'Deleted';

 2. operation
 除了operation以外字段，都会作为写入字段内容提交到请求中。


