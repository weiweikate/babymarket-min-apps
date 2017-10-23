// product-specification.js

/**
 * 商品规格选择
 */

let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;
export default class ProductSpecification {
    constructor(page,productId){
        this.page = page;

        this.productId = productId;//商品id
        this.page.data.specificationData = null;
        this.page.data.innerCount = 1;//选择的数量
        this.selectedArray = [];//选择结果
        this.selectInfoDict = new Map();

        this.page.data.showProductSpecification = false;//是否显示规格选择页面
        // this.page.data.productSpecificationAction = 'Buy';//立即购买
        this.page.data.productSpecificationAction = 'ShoppingCart';//加入购物车
        this.page.data.innerProduct = {};//商品对象，防止和主页面的变量重名，加前缀inner
        this.page.data.innerPrice = 0;//商品价格，防止重名，加前缀inner
        this.page.data.categoryArray = [];//规格组
        this.page.data.allSepcificationArray = [];//所有规格

        let title = '加入购物车';
        this.page.data.innerTitle = title;//按钮标题

        this.page.setData({
            innerCount:1,
        })

        let {Tool:t} = global;
        let {page:p} = this;

        //dismiss
        if (!t.isFunction(p.dismissProductSpecification)) {
            p.dismissProductSpecification = this._dismissProductSpecification.bind(this);
        }

        /**
         * 捕获点击，防止向下传递触发dismiss
         * @private
         */
        if (!t.isFunction(p.productSpecificationClicked)) {
            p.productSpecificationClicked = this._productSpecificationClicked.bind(this);
        }

        //提交按钮点击事件
        if (!t.isFunction(p.submitBtnClicked)) {
            p.submitBtnClicked = this._submitBtnClicked.bind(this);
        }

        if (!t.isFunction(p.thumbClicked)) {
            p.thumbClicked = this._thumbClicked.bind(this);
        }

        if (!t.isFunction(p.counterInputOnChange)) {
            p.counterInputOnChange = this._counterInputOnChange.bind(this);
        }

        if (!t.isFunction(p.counterSubClicked)) {
            p.counterSubClicked = this._counterSubClicked.bind(this);
        }

        if (!t.isFunction(p.counterAddClicked)) {
            p.counterAddClicked = this._counterAddClicked.bind(this);
        }

        // //请求数据
        // this.requestData();

        this.requestProductForm();
    }

    setSpecificationData(specificationData){
        this.page.setData({
            specificationData,
        })
        if (specificationData) {
            console.log('setSpecificationData Inv' + specificationData.Inv + " levelPrice:" + specificationData.levelPrice);
        }
    }

    //更新提交按钮标题
    updateTitle(){
        let title = '加入购物车';
        if (this.page.data.productSpecificationAction === 'Buy') {
            title = '确认购买';
        }
        this.page.setData({
            innerTitle:title,
        })
    }

    //请求数据
    requestData(){
        this.getProductInfo();
        this.getSpecificationGroup();
        this.getAllSpecificationRead();
    }

    /**
     * 商品详情
     */
    getProductInfo(){
        let self = this;
        let r = global.RequestReadFactory.productByIdRead(this.page.data.productId);
        r.finishBlock = (req,firstData) =>{
            self.page.setData({
                innerProduct:firstData,
                innerPrice:firstData.SalePrice,
            });
        }
        r.addToQueue();
    }

    /**
     * 获取产品规格
     */
    requestProductForm(){
        let self = this;
        let task = RequestReadFactory.productFormRead(this.page.data.productId);
        task.finishBlock = (req) => {
            // let {Datas} = req.responseObject;
            // self.page.setData({
            //     categoryArray:Datas,
            // })
        }
        task.addToQueue();
    }

    /**
     * 所有规格
     */
    getAllSpecificationRead(){
        let self = this;
        let r = global.RequestReadFactory.allSpecificationRead(this.productId);
        r.finishBlock = (req,firstData) => {
            if (req.responseObject.Total == '1') {
                self.setSpecificationData(firstData);
            }

            let {Datas} = req.responseObject;
            self.page.setData({
                allSepcificationArray:Datas
            })
        }
        r.addToQueue();
    }

    //显示规格选择页面 action ： 立即购买'Buy'、加入购物车'ShoppingCart'
    showWithAction(action){
        this.page.setData({
            productSpecificationAction:action,
            showProductSpecification:true,
        })
        this.updateTitle();
    }

    //隐藏页面
    dismiss(){
        this.page.setData({
            showProductSpecification:false,
        })
    }

    //dismiss
    _dismissProductSpecification(){
        this.dismiss();
    }

    /**
     * 捕获点击，防止向下传递触发dismiss
     * @private
     */
    _productSpecificationClicked(){

    }

    /**
     * 提交按钮点击事件
     * @private
     */
    _submitBtnClicked(){
        let {Tool:t} = global;
        let {innerProduct:product,innerPrice:price,innerCount:count} = this.page.data;

        if (t.isEmptyStr(this.page.data.specificationData) || t.isEmptyStr(this.page.data.specificationData.Id)) {
            t.showAlert('无法获取规格数据，请稍后再试！');
            return;
        }
        if (t.isEmptyObject(product)) {
            t.showAlert('无法获取商品数据，请稍后再试！');
            return;
        }

        if (t.isFunction(this.finishBlock)) {
            this.finishBlock(this.page.data.specificationData.Id,product,count,price);
        }

        //立即购买
        if (this.page.data.productSpecificationAction = 'Buy') {
            console.log('立即购买');
        }

        //加入购物车
        else{
            console.log('加入购物车');
        }

        this.dismiss();
    }

    /**
     * thumb 点击事件
     */
    _thumbClicked(e){
        let self = this;
        let {dataset} = e.currentTarget;
        let {index, section} = dataset;
        console.log('index:' + index + ' section:' + section);

        //选中规格所在的组
        let selectGroupData = this.page.data.categoryArray[section];

        //选中规格所在的组的所有规格
        let selectGroupItemArray = selectGroupData.S_Value_Detail;

        //选中的一个规格
        let selectGroupItem = selectGroupItemArray[index];

        //该规格全部断货
        if (parseInt(selectGroupItem.Inv) == 0 ||
            selectGroupItem.showDashed) //理论上不应该会有这种情况，因为showDashed为YES时，是不可点击的。
        {
            return;
        }

        //2维组合（以下代码的目的：找到未被选中的组，刷新他们的库存信息，为0时，变成虚线，并不可点击)
        if (this.page.data.categoryArray.length == 2)
        {
            //查询选中规格后，其他组规格的库存情况，这个for的时间复杂度是常数，只会循环1、2次，可忽略。
            this.page.data.categoryArray.forEach((eachGroupDataInLoop)=>{
                if (eachGroupDataInLoop.Id !== selectGroupData.Id)
                {
                    //找到其他组(未被选中的组，刷新他们的库存信息，为0时，变成虚线，并不可点击)
                    let otherGroupData = eachGroupDataInLoop;

                    //其他组数据
                    let otherGroupItemArray = otherGroupData.S_Value_Detail;

                    //遍历其他组数据
                    otherGroupItemArray.forEach((otherGroupItem)=>{
                        self.searchSepecificationIn(self.page.data.allSepcificationArray,[selectGroupItem,otherGroupItem]);
                    })
                }
            })
        }

        //1纬
        else if (this.page.data.categoryArray.length == 1)
        {

        }

        //保存选中的规格
        self.selectInfoDict.set(selectGroupData.SpecificationName,selectGroupItem);

        //把选中规格所在组的其他规格状态修改为未选中
        let key = selectGroupItem.Id;
        selectGroupItemArray.forEach((sValueDetail)=>{
            if (sValueDetail.Id === key) {
                sValueDetail.selected = true;
            }else {
                sValueDetail.selected = false;
            }
        })

        let selectedArray = [];

        this.page.data.categoryArray.forEach((data)=>{
            let subitemArray = data.S_Value_Detail;
            subitemArray.forEach((sValueDetail) => {
                if (sValueDetail.selected) {
                    selectedArray.push(sValueDetail);
                }
            })
        })
        this.selectedArray = selectedArray;

        let didFind = false;
        this.setSpecificationData(null);
        if (this.page.data.categoryArray.length == this.selectedArray.length) {
            let specificationData = this.searchSepecificationIn(this.page.data.allSepcificationArray,this.selectedArray);
            this.setSpecificationData(specificationData);
        }

        if (this.page.data.specificationData) {
            didFind = true;
        }

        let shouldBreak = false;
        if (this.page.data.categoryArray.length == this.selectInfoDict.keys.length && didFind == false) {
            this.page.data.allSepcificationArray.forEach((spec)=>{
                if (shouldBreak === false) {
                    let detail_1 = self.selectInfoDict.get(spec.S_Name1);
                    let detail_2 = self.selectInfoDict.get(spec.S_Name2);

                    let isOneDimensionalValid = false;
                    let isTwoDimensionalValid = false;
                    if (Tool.isValidStr(spec.SpecificationItem1Id)) {
                        isOneDimensionalValid = self.page.data.categoryArray.length == 1 && detail_1.Id === spec.SpecificationItem1Id;
                        isTwoDimensionalValid = detail_1.Id === spec.SpecificationItem1Id && detail_2.Id === spec.SpecificationItem2Id;
                    }
                    else
                    {
                        isOneDimensionalValid = self.page.data.categoryArray.length == 1 && detail_1.S_ValueKey === spec.S_Value1Key;
                        isTwoDimensionalValid = detail_1.S_ValueKey === spec.S_Value1Key && detail_2.S_ValueKey === spec.S_Value2Key;
                    }

                    if (isTwoDimensionalValid || isOneDimensionalValid) {
                        didFind = true;
                        self.setSpecificationData(spec);
                        console.log('find specification:');
                        console.log(self.page.data.specificationData);

                        let {categoryArray,allSepcificationArray} = self.page.data;
                        self.page.setData({
                            categoryArray
                        })
                        shouldBreak = true;
                    }
                }
            })
        }
        console.log('find specification:');
        console.log(this.page.data.specificationData);
        let {categoryArray,allSepcificationArray} = this.page.data;
        this.page.setData({
            categoryArray
        })
    }

    /**
     * 在所有规格中搜索规格选中的具体规格
     */
    searchSepecificationIn(allSpecificationArr,groupItemArr){
        let self = this;
        let result = null;
        //所有规格组合,一个specification包含2个groupItem的信息。

        //只有一个规格，直接返回
        if (Tool.isValidArr(allSpecificationArr) && allSpecificationArr.length == 1) {
            result = allSpecificationArr[0];
        }

        let selectGroupItem = null,otherGroupItem = null;

        if (groupItemArr.length == 2) {
            selectGroupItem = groupItemArr[0];
            otherGroupItem = groupItemArr[1];
        }
        else if(groupItemArr.length == 1)
        {
            selectGroupItem = groupItemArr[0];
        }
        else {
        }

        allSpecificationArr.forEach((specification) => {
            if (groupItemArr.length == 2) {
                if (Tool.isValidStr(specification.SpecificationItem1Id) && Tool.isValidStr(specification.SpecificationItem2Id)) {
                    let specificationItemId = 'SpecificationItem'+ selectGroupItem.SpecificationKey +'Id';
                    let isSelectGroupItemEqual = specification[specificationItemId] === selectGroupItem.Id;
                    specificationItemId = 'SpecificationItem'+ otherGroupItem.SpecificationKey +'Id';
                    let isOtherGroupItemEqual = specification[specificationItemId] === otherGroupItem.Id;

                    if (isSelectGroupItemEqual && isOtherGroupItemEqual) {
                        let showDashed = (parseInt(specification.Inv) <= 0);//没有库存了，显示虚线
                        otherGroupItem.showDashed = showDashed;
                        result = specification;
                    }
                }
                else
                {
                    let SName             = "S_Name" + selectGroupItem.SpecificationKey;
                    let ValueName         = "Value"+selectGroupItem.SpecificationKey+"_Name";
                    let OtherSName        = "S_Name" + otherGroupItem.SpecificationKey;
                    let OtherValueName    = "Value"+otherGroupItem.SpecificationKey+"_Name";

                    if (specification[SName] === selectGroupItem.S_Name &&
                        specification[ValueName] === selectGroupItem.S_Value_Name &&
                        specification[OtherSName] === otherGroupItem.S_Name &&
                        specification[OtherValueName] === otherGroupItem.S_Value_Name)
                    {
                        let showDashed = (parseInt(specification.Inv) <= 0);
                        otherGroupItem.showDashed = showDashed;
                        result = specification;
                    }
                }
            }
            else if (groupItemArr.length == 1){
                //选中规格相同
                if (Tool.isValidStr(specification.SpecificationItem1Id))
                {
                    let specificationItemId = "SpecificationItem"+ selectGroupItem.SpecificationKey +"Id";
                    let isSelectGroupItemEqual = specification[specificationItemId] === selectGroupItem.Id;

                    if (isSelectGroupItemEqual) {
                        result = specification;
                    }
                }
                else
                {
                    let SName             = "S_Name" + selectGroupItem.SpecificationKey;
                    let ValueName         = "Value"+ selectGroupItem.SpecificationKey +"_Name";

                    if (specification[SName] === selectGroupItem.S_Name &&
                    specification[ValueName] === selectGroupItem.S_Value_Name)
                    {
                        let showDashed = (parseInt(specification.Inv) <= 0);
                        otherGroupItem.showDashed = showDashed;
                        result = specification;
                    }
                }
            }
        })
        return result;
    }

    /**
     * 数量价格变化
     */
    _counterInputOnChange(e){

    }

    /**
     * 数量减点击
     */
    _counterSubClicked(){
        let count = this.page.data.innerCount - 1;
        if (count < 1 || count == undefined) {
            count = 1;
        }
        this.page.setData({
            innerCount: count,
        })
    }

    /**
     * 数量加点击
     */
    _counterAddClicked(){
        this.page.setData({
            innerCount:this.page.data.innerCount + 1
        })
    }
}