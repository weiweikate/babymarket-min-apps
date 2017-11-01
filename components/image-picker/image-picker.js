/**
 * 图片选择器
 */
let { Tool, Network, Storage } = global;

export default class ImagePicker {
  constructor(page, maxCount = 9) {
    this.page = page;

    this.page.setData({
      maxCount: maxCount,
      imageArray: []
    })

    this.page.onPickerClickListener = this.onPickerClickListener.bind(this);
    this.page.onPickerItemListener = this.onPickerItemListener.bind(this);
    this.page.onPickerDeleteListener = this.onPickerDeleteListener.bind(this);
  }

  /**
   * 从图库选择，或者拍照
   */
  onPickerClickListener(e) {
    let self = this;
    wx.chooseImage({
      count: self.page.data.maxCount,
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let imageArray = self.page.data.imageArray;
        tempFilePaths.forEach((item) => {
          imageArray.push(item);
        });
        self.page.setData({
          imageArray: imageArray
        });
      },
    })
  }

  /**
   * 点击图片，查看大图
   */
  onPickerItemListener(e) {
    console.log(e);
  }

  /**
   * 删除图片
   */
  onPickerDeleteListener(e) {
    let position = e.currentTarget.dataset.position;
    let imageArray = this.page.data.imageArray;
    imageArray.splice(position, 1);
    this.page.setData({
      imageArray: imageArray
    });
  }

  /**
   * 上传文件
   */
  onUploadAction(finishBlock) {
    let self = this;
    //上传地址
    let httpUrl = Network.sharedInstance().uploadURL + '?_SESSION_=' + Storage.currentSession();

    let imageArray = self.page.data.imageArray;
    //需要上传的文件数量
    let arrayLength = imageArray.length;
    //返回计数，等于上传长度时回调finishBlock方法
    let taskCount = 0;
    if (arrayLength > 0) {
      //返回的临时文件ID数组
      let temporaryIdArray = [];

      //上传图片
      imageArray.forEach((item) => {
        //调用微信上传接口
        if (item.indexOf("mobile.topmom.com.cn") >= 0) {
          arrayLength--;
          if (arrayLength == 0) {
            finishBlock(undefined);
          }
        } else {
          wx.uploadFile({
            url: httpUrl,
            filePath: item,
            name: 'file',
            success: function (res) {
              taskCount++;

              var fileInfo = JSON.parse(res.data);
              let temporaryId = fileInfo.TemporaryId;
              //把临时ID放入id数组
              temporaryIdArray.push(temporaryId);
              if (taskCount == arrayLength) {
                //所有文件上传成功，回调finishBlock方法
                finishBlock(temporaryIdArray);
              }
            }
          })
        }
      });
    } else {
      //直接返回空数据
      finishBlock(undefined);
    }
  }

}

