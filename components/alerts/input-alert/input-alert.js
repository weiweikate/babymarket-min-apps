/** 0.1 18758328354 123456
 * Created by coin on 17/6/10.
 */
export default class InputAlert {
    constructor(page){
        this.page = page;
        this.page.data.showInputAlert = false;

        let {Tool:t} = global;
        let {page:p} = this;

        /**
         * 如果page没有相应的方法，则默认实现一个
         */
        if (t.isFunction(p.dismissInputAlert) === false) {
            p.dismissInputAlert = this._dismissInputAlert.bind(this);
        }

        if (t.isFunction(p.inputAlertBtnClicked) === false) {
            p.inputAlertBtnClicked = this._inputAlertBtnClicked.bind(this);
        }

        if (t.isFunction(p.alertInputOnChange) === false) {
            p.alertInputOnChange = this._alertInputOnChange.bind(this);
        }

        if (t.isFunction(p.inputAlertClicked) === false) {
            p.inputAlertClicked = this._inputAlertClicked.bind(this);
        }

        this.alertBtnClicked = (index) => {};
        this.alertInputOnChange = (text) => {};
    }

    _dismissInputAlert(){
        this.page.setData({
            showInputAlert: false//隐藏
        });
    }

    _alertInputOnChange(e){
        let text = e.detail.value;
        this.alertInputOnChange(text);
    }

    _inputAlertBtnClicked(e){
        let index = e.currentTarget.dataset.index;
        this.alertBtnClicked(index);
        this._dismissInputAlert();
    }

    /**
     * 捕获点击，防止向下传递触发dismiss
     * @private
     */
    _inputAlertClicked(){

    }
}