/**
 * 商品规格选择
 */
let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;
export default class ProductForm {
  constructor(page) {
    this.page = page;
    let form = new Object();
    form.innerType = 0;//0加入购物车 1立即兑换
    form.innerPrice = 0;//价格
    form.innerStock = 0;//库存
    form.innerQuantity = 1;//选择的数量，默认1
    form.isShowForm = false;//是否显示规格选择页面
    form.formArray = [];//规格数组
    form.selectFormPosition = -1;//选中的规格下标
    form.IsYXProduct = 'False'; // 是否是婴雄值兑换产品
    form.ActivityProduct = 'False' // 是否是婴雄值兑换活动产品
    form.door = this.page.data.door

    this.page.data.form = form;

    this.page.onFormItemClickListener = this.onFormItemClickListener.bind(this);
    this.page.onQuantityMinusListener = this.onQuantityMinusListener.bind(this);
    this.page.onQuantityPlusListener = this.onQuantityPlusListener.bind(this);
    this.page.dismiss = this.dismiss.bind(this);
    this.page.onNoActionListener = this.onNoActionListener.bind(this);
    this.page.onFormSubmitListener = this.onFormSubmitListener.bind(this);

    this.requestProductForm();
  }

  /**
   * 获取产品规格
   */
  requestProductForm() {
    let form = this.page.data.form;
    let task = RequestReadFactory.productFormRead(this.page.data.productId);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      form.formArray = responseData;
      this.page.setData({
        form: form
      })
    }
    task.addToQueue();
  }

  /**
  * 新增购物车
  */
  requestAdd(requestData) {
    if (this.page.data.door == '0' && this.page.data.productInfo.ActivityProduct == 'True') {
      Tool.showSuccessToast("暂不支持加入");
      this.dismiss();
      return 
    }
    let task = RequestWriteFactory.addCart(requestData);
    task.finishBlock = (req) => {
      Tool.showSuccessToast("添加到购物车");

      Event.emit('refreshCartList');//发出通知

      this.dismiss();
    };
    task.addToQueue();
  }

  /**
   * 规格点击事件
   */
  onFormItemClickListener(e) {
    let position = e.currentTarget.dataset.position;
    let form = this.page.data.form;
    form.selectFormPosition = position;
    this.page.setData({
      form: form
    })
  }

  /**
   * 减少数量
   */
  onQuantityMinusListener(e) {
    let form = this.page.data.form;
    if (form.innerQuantity > 1) {
      form.innerQuantity--;
      this.page.setData({
        form: form
      });
    } else {
      console.log("数量不能小于1");
    }
  }

  /**
   * 增加数量
   */
  onQuantityPlusListener(e) {
    let form = this.page.data.form;
    if (form.innerQuantity < 999) {
      form.innerQuantity++;
      this.page.setData({
        form: form
      });
    } else {
      console.log("数量不能大于999");
    }
  }

  //显示规格选择页面,0购物车，1立即兑换
  show(innerType, productInfo) {
    let form = this.page.data.form;
    form.innerType = innerType;
    form.isShowForm = true;
    if (this.page.data.door == '0' ){
      form.innerPrice = this.page.data.productInfo.YXValue;
      form.IsYXProduct = 'True'
      form.door ='0'
      form.ActivityProduct = this.page.data.productInfo.ActivityProduct
    } else {
      form.innerPrice = productInfo.Price;
    }
    
    //改成 form.innerStock = productInfo.InventoryNumber;
    form.innerStock = productInfo.Quantity
    this.page.setData({
      form: form
    })
  }

  //隐藏页面
  dismiss() {
    let form = this.page.data.form;
    form.isShowForm = false;
    this.page.setData({
      form: form
    })
  }

  /**
   * 规格界面提交
   */
  onFormSubmitListener() {
    let form = this.page.data.form;
    //如果有规格，要判断是否选了规格
    let formArray = form.formArray;
    if (formArray.length > 0 && form.selectFormPosition < 0) {
      Tool.showAlert('请选择规格');
      return;
    }
    if (this.page.data.door == '0' && this.page.data.productInfo.Overdue == 'True'){
      Tool.showAlert('兑换时间已超时');
      return;
    }
    if (form.formArray.Quantity == '0'){
      Tool.showAlert('商品库存不足');
      return;
    }
    if (form.innerQuantity > form.innerStock){
      Tool.showAlert('该商品库存只有' + form.innerStock +"件");
      return;
    }
    let selectForm = formArray[form.selectFormPosition];
    let requestData = undefined;
    // 判断form.innerType
    switch (form.innerType) {
      case 0:
        //加入购物车
        let isXYorder = 'False'
        requestData = {
          'MemberId': Storage.memberId(),
          'ProductId': this.page.data.productId,
          'Price': form.innerPrice + '',
          'Points': form.innerPrice * form.innerQuantity + '',
          'Qnty': form.innerQuantity + '',
          'ProductSizeId': selectForm.Id,
          'IsYXOrder': form.IsYXProduct,
          'ActivityProduct': form.ActivityProduct
        };
        Tool.showLoading();
        this.requestAdd(requestData);
        break;
      case 1:
        //立即兑换
        // if (Number(this.page.data.userXYvalue) < ){
          
        // }
        requestData = [{
          'MemberId': Storage.memberId(),
          'ProductId': this.page.data.productId,
          'ProductImgUrl': this.page.data.productInfo.imageUrl,
          'ProductName': this.page.data.productInfo.Name,
          'Price': form.innerPrice,
          'Points': form.innerPrice * form.innerQuantity,
          'Qnty': form.innerQuantity,
          'ProductSizeId': selectForm.Id,
          'IsYXProduct': this.page.data.productInfo.IsYXProduct,
          'ActivityProduct': form.ActivityProduct,
          'innerStock': form.innerStock
        }];
        // 如果是婴雄联盟的产品 那么添加相关信息
        if (this.page.data.door == '0') {
          requestData[0].XYProuductPrice = this.page.data.productInfo.ProuductPrice
          requestData[0].YXValue = this.page.data.productInfo.YXValue
          requestData[0].YXValueSum = this.page.data.productInfo.YXValue * form.innerQuantity
          requestData[0].usefulXYValue = this.page.data.userXYvalue
        }
        console.log(requestData)
        Storage.setterFor("orderLine", requestData);
        this.finishBlock(selectForm.Id, 1, form.innerQuantity, form.innerPrice);
        break;
    }
    this.dismiss();
  }

  /**
   * 捕获点击，防止向下传递触发dismiss
   * @private
   */
  onNoActionListener() {

  }

}