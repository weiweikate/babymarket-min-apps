let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

import CreateBtn from '../../components/create-btn/create-btn';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressArray: [],
    isSelectMode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isSelectMode: options.door == '1'
    });

    this.createBtn = new CreateBtn(this, '/pages/address/add-address/add-address');
    if (this.data.isSelectMode) {
      this.createBtn.setHide();
    }

    this.requestData();

    Event.on('refreshAddressList', this.requestData, this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    Event.off('refreshAddressList', this.requestData)
  },

  /**
   * 数据请求
   */
  requestData: function () {
    this.requestAddressInfo();
  },

  /**
   * 查询地址
   */
  requestAddressInfo: function () {
    let self = this;
    let r = RequestReadFactory.addressRead();
    r.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        addressArray: responseData
      });
    }
    r.addToQueue();
  },

  /**
   * 设置默认地址
   */
  requestAddressDefault: function (id, position) {
    let self = this;
    let r = RequestWriteFactory.modifyDefaultAddress(id);
    r.finishBlock = (req) => {
      let addressArray = self.data.addressArray;
      addressArray.forEach((item, index) => {
        if (index == position) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });

      this.setData({
        addressArray: addressArray
      });
      Tool.showSuccessToast("设置成功");
    }
    r.addToQueue();
  },

  /**
   * 删除地址
   */
  requestAddressDelete: function (id, position) {
    let self = this;
    let r = RequestWriteFactory.deleteAddress(id);
    r.finishBlock = (req) => {
      let addressArray = self.data.addressArray;
      addressArray.splice(position, 1);

      this.setData({
        addressArray: addressArray
      });
      Tool.showSuccessToast("删除成功");
    }
    r.addToQueue();
  },

  /**
   * 设置默认地址
   */
  onDefaultClickLitener: function (e) {
    let id = e.currentTarget.dataset.id;
    let position = e.currentTarget.dataset.position;
    let addressInfo = this.data.addressArray[position];
    if (!addressInfo.isDefault) {
      Tool.showLoading();
      this.requestAddressDefault(id, position);
    }
  },

  /**
   * 删除地址
   */
  onDeleteClickListener: function (e) {
    let self = this;

    let id = e.currentTarget.dataset.id;
    let position = e.currentTarget.dataset.position;
    wx.showModal({
      title: '提示',
      content: '确认删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          Tool.showLoading();
          self.requestAddressDelete(id, position);
        }
      }
    })
  },

  /**
   * 进入地址详情修改
   */
  onAddressClickListener: function (e) {
    let id = e.currentTarget.dataset.id;
    let position = e.currentTarget.dataset.position;

    let addressInfo = this.data.addressArray[position];
    if (this.data.isSelectMode) {
      //选择模式，返回数据
      let pages = getCurrentPages();
      let pageBOne = pages[pages.length - 2];// 前一页
      pageBOne.setData({
        addressInfo: addressInfo
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/address/add-address/add-address?extra=' + JSON.stringify(addressInfo),
      })
    }
  },

})