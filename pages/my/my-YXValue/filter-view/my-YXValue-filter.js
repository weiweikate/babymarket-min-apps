
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visiable: Boolean,
    isProperty: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    items: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dismiss: function () {
      this.triggerEvent('dismissFilterClicked', {});
    },
    thumbClicked: function (e) {
      let index = e.currentTarget.dataset.index;
      let thumb = this.data.items[index];
      this.triggerEvent('thumbClicked', { index, thumb })
    }
  },
  ready: function () {
    let r = global.RequestReadFactory.requestYXValueTypes();
    r.finishBlock = (req) => {
      console.log(req.responseObject.Datas)
      let YXValueType = req.responseObject.Datas
      this.setData({
        items: YXValueType
      });

    };
    r.addToQueue();
  }
})
