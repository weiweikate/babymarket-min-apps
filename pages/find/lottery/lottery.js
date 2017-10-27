let { Tool, Event, Storage, RequestReadFactory, RequestWriteFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lotteryArray: [],
    lotteryRule: undefined,
    usedCoin: 0,//每次消耗金币
    myCoin: 0,//我的金币,
    selectPosition: 0,//选中的位置
    isLotterying: false,//正在抽奖
    time: 0//计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Tool.showLoading();
    this.requestLottery();

    //注册通知
    Event.on('loginSuccessEvent', this.loginSuccess, this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    Event.off('loginSuccessEvent', this.loginSuccess)
  },

  /**
  * 登录成功
  */
  loginSuccess: function () {
    //获取用户的金币
    this.requestMyCoin();
    //查询用户的默认收货地址
    this.requestDefaultAddress();
  },

  /**
   * 查询奖品
   */
  requestLottery: function () {
    let task = RequestReadFactory.lotteryRead();
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        lotteryArray: responseData
      });
      Tool.showLoading();
      this.requestLotteryRule();
    }
    task.addToQueue();
  },

  /**
   * 查询转盘每次消耗的金币
   */
  requestLotteryRule: function () {
    let task = RequestReadFactory.lotteryRuleRead();
    task.finishBlock = (req, firstData) => {
      if (firstData != undefined) {
        this.setData({
          usedCoin: firstData.DialEveryScore
        });
      }
      if (Storage.didLogin()) {
        Tool.showLoading();
        this.requestMyCoin();
        this.requestDefaultAddress();
      }
    }
    task.addToQueue();
  },
  /**
   * 查询用户金币
   */
  requestMyCoin: function () {
    let task = RequestReadFactory.memberCoinRead();
    task.finishBlock = (req, firstData) => {
      if (firstData != undefined) {
        this.setData({
          myCoin: firstData.Coin
        });
      }
    }
    task.addToQueue();
  },

  /**
   * 查询地址
   */
  requestDefaultAddress: function () {
    let self = this;
    let r = RequestReadFactory.addressDefaultRead();
    r.finishBlock = (req) => {
      let count = req.responseObject.Count;
      if (count <= 0) {
        //没有默认地址，提示需要默认地址，跳转到收货地址列表
        Tool.showAlert("为方便抽中商品寄送,请先设置默认地址,我们会依据默认地址给您寄去中奖商品。", function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/address/address'
            })
          }
        });
      }
    }
    r.addToQueue();
  },

  /**
   * 新增中奖记录
   */
  requestAddLotteryExtract: function (id) {
    let requestData = {
      "MemberId": Storage.memberId(),
      "Is_App_Add": "True",
      "Win_GiftId": id
    }
    let task = RequestWriteFactory.addLotteryExtract(requestData);
    task.finishBlock = (req) => {
      //重新查询我的金币
      this.requestMyCoin();
    }
    task.addToQueue();
  },

  /**
   * 查看我的中奖纪录
   */
  onRecordClickListener: function () {
    if (Storage.didLogin()) {
      wx.navigateTo({
        url: '/pages/find/lottery/lottery-list/lottery-list'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  /**
   * 抽奖规则
   */
  onRuleClickListener: function () {
    wx.navigateTo({
      url: '/pages/find/lottery/lottery-rule/lottery-rule'
    })
  },

  /**
   * 开始抽奖按钮
   */
  onLotteryClickListener: function () {
    let isLotterying = this.data.isLotterying;
    //正在抽奖的时候不允许点击,并且我的金币大于等于需要消耗的金币
    if (!isLotterying) {
      //先判断是否登录
      if (Storage.didLogin()) {
        let myCoin = this.data.myCoin;
        let usedCoin = this.data.usedCoin;
        //我的金币大于等于需要消耗的金币
        if (myCoin >= usedCoin) {
          let winningPosition = this.getWinningPosition();
          //计数赋值
          this.setData({
            isLotterying: true,
            time: this.data.selectPosition
          });
          this.startTurnAround(winningPosition);
        } else {
          Tool.showAlert("您的金币不足");
        }
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
  },
  /**
   * 获得中奖的位置
   */
  getWinningPosition: function () {
    //从0-10000中取一个随机数
    let random = Math.floor(Math.random() * 10000);
    let winningPosition = 0;
    let lotteryArray = this.data.lotteryArray;
    // 中奖的范围
    let g0 = lotteryArray[0].Win_Probability;
    let g1 = g0 + lotteryArray[1].Win_Probability;
    let g2 = g1 + lotteryArray[2].Win_Probability;
    let g3 = g2 + lotteryArray[3].Win_Probability;
    let g4 = g3 + lotteryArray[4].Win_Probability;
    let g5 = g4 + lotteryArray[5].Win_Probability;
    let g6 = g5 + lotteryArray[6].Win_Probability;
    let g7 = g6 + lotteryArray[7].Win_Probability;
    let g8 = g7 + lotteryArray[8].Win_Probability;

    if (random >= 0 && random < g0) {
      // 中奖为上左
      winningPosition = 0;
    } else if (random >= g0 && random < g1) {
      // 中奖为上中1
      winningPosition = 1;
    } else if (random >= g1 && random < g2) {
      // 中奖为上中2
      winningPosition = 2;
    } else if (random >= g2 && random < g3) {
      // 中奖为上右
      winningPosition = 3;
    } else if (random >= g3 && random < g4) {
      // 中奖为中右
      winningPosition = 4;
    } else if (random >= g4 && random < g5) {
      // 中奖为下右
      winningPosition = 5;
    } else if (random >= g5 && random < g6) {
      // 中奖为下中2
      winningPosition = 6;
    } else if (random >= g6 && random < g7) {
      // 中奖为下中1
      winningPosition = 7;
    } else if (random >= g7 && random < g8) {
      // 返回3的概率1%100 中奖为下左
      winningPosition = 8;
    } else {
      // 中奖为中左
      winningPosition = 9;
    }
    return winningPosition;
  },
  /**
   * 开始转圈
   */
  startTurnAround: function (winningPosition, delayTime = 100) {
    let self = this;
    let time = this.data.time;
    let selectPosition = this.data.selectPosition;

    setTimeout(function () {
      //如果小于time+50+winningPosition的时候，停止运行
      if (time <= 50 + winningPosition) {
        selectPosition = time % 10
        time++;
        self.setData({
          time: time,
          selectPosition: selectPosition
        });
        if (time < 45) {
          self.startTurnAround(winningPosition, 100);
        } else if (time > 45 && time < 50) {
          self.startTurnAround(winningPosition, 200);
        } else {
          self.startTurnAround(winningPosition, 300);
        }
      } else {
        //抽奖结束
        self.setData({
          isLotterying: false,
          time: time
        });

        //中奖提示
        let selectlottery = self.data.lotteryArray[selectPosition];
        if (selectlottery.Name == "谢谢参与") {
          Tool.showAlert("差一点就中啦");
        } else {
          Tool.showAlert("恭喜您抽中" + selectlottery.Name);
          self.requestAddLotteryExtract(selectlottery.Id);
        }
      }
    }, delayTime)
  }
})