/**
 * Created by Patrick on 02/06/2017.
 */

export default class DateFilter {

    constructor(page){
        this.page = page;
        this.page.data.dateFilterData = {
            startDate:'',
            endDate:'',
        }

        /**
         * 把需要封装的逻辑，按这个形式封装。
         * 因为.wxml文件中绑定的是Page中的函数，所以这里的函数名datePickerChange要和.wxml中的一样
         */
        this.page.datePickerChange = this._datePickerChange.bind(this);

        /**
         * 暴露给使用者的回调函数
         * @param type : 'start', 'end'
         * @param value : 2017-05
         */
        this.dateFilterValueChanged = (type,value) => {};

    }

    /**
     * 日期选择结果
     * 封装组件的内部逻辑
     */
    _datePickerChange(e) {
        let type = e.currentTarget.dataset.type;
        let value = e.detail.value;
        console.log('datePickerChange:'+value);
        //开始日期

        /**
         * dateFilterData:运行时添加到page中data的字段中
         */
        let {dateFilterData} = this.page.data;
        dateFilterData = dateFilterData || {};

        if (type === 'start') {
            dateFilterData.startDate = value;
            dateFilterData.endMinDate = value;
        }

        //结束日期
        else{
            dateFilterData.endDate = value;
            dateFilterData.startMaxDate = value;
        }
        this.page.setData({
            dateFilterData:dateFilterData
        });

        //触发回调函数
        this.dateFilterValueChanged(type,value);
    }
}