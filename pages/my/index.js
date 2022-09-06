// pages/my/index.js
const app = getApp()

Page({
  //验证是否可以进行跳转
  /**
   * 页面的初始数据
   */
  data: {
    userData: [],
    //动画
    animationData: {},
    //遮罩层
    zhezcheng: false,
    //活动弹框
    activitytk: false,
    activityData: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.versionHD();
  },
  //跳转活动
  activityF: function () {
    //极光-计数事件模型
    app.JAnalyticsInterface.onEvent({
      type: 'custom_counting',
      attributes: {
        event_id: 'DialogIndexld'
      }
    })
    if (app.userData.weapp_openid != '' && app.userData.unionid != '' && app.userData.phone == '') {
      wx.navigateTo({
        url: '../phone/phone?activity=1'
      })
    } else if (app.systemData.token != '' && app.userData.phone != '') {
      wx.navigateTo({
        url: '../activity/activity'
      })
    } else if (app.systemData.token == '') {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone?activity=1'
          })
        } else {
          wx.navigateTo({
            url: '../activity/activity'
          })
        }
      });
    }
  },
  //检查活动弹框
  versionHD: function () {
    app.api('/v1/activity/popup?version=105', 'GET', false, '', (res, data) => {
      if (res.code == 0) {
        if (data.my) {
          var date = new Date();
          var activityDate = Number(String(date.getMonth()) + String(date.getDate()));
          var myDate = wx.getStorageSync('activityDate') != '' ? wx.getStorageSync('activityDate') : ''
          if (myDate == '') {
            wx.setStorageSync('activityDate', activityDate);
            this.setData({
              activityData: data.my,
              activitytk: true
            })
          } else if (Number(myDate) != activityDate) {
            wx.setStorageSync('activityDate', activityDate);
            this.setData({
              activityData: data.my,
              activitytk: true
            })
          }
        }
      }
    })
  },
  //关闭活动弹框
  gbhdtk: function () {
    this.setData({
      activitytk: !this.data.activitytk
    })
  },
  //联系客服(废弃)
  goToCustomer(e) {
    if (app.userData.weapp_openid != '' && app.userData.unionid != '' && app.userData.phone == '') {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else if(app.systemData.token != '' && app.userData.phone != ''){
      wx.navigateTo({
        url: './customer/customer'
      })
    } else if(app.systemData.token == ''){
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          wx.navigateTo({
            url: './customer/customer'
          })
        }
      });
    }
  },
  goPreferential(e) {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    //判断用户是否登录或者没绑定手机号
    let i = app.userCredentials();
    if (i == 1) {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          wx.navigateTo({
            url: './preferential/preferential'
          })
        }
      });
    } else if (i == 2) {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else {
      wx.navigateTo({
        url: './preferential/preferential'
      })
    }
  },
  goToShopApply(e) {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    //判断用户是否登录或者没绑定手机号
    let i = app.userCredentials();
    if (i == 1) {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          wx.navigateTo({
            url: './shopApply/shopApply'
          })
        }
      });
    } else if (i == 2) {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else {
      wx.navigateTo({
        url: './shopApply/shopApply'
      })
    }
  },
  goToHelper(e) {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    //判断用户是否登录或者没绑定手机号
    let i = app.userCredentials();
    if (i == 1) {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          wx.navigateTo({
            url: './helper/helper'
          })
        }
      });
    } else if (i == 2) {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else {
      wx.navigateTo({
        url: './helper/helper'
      })
    }
  },
  goToFeedback(e) {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    //判断用户是否登录或者没绑定手机号
    let i = app.userCredentials();
    if (i == 1) {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          wx.navigateTo({
            url: './feedback/feedback'
          })
        }
      });
    } else if (i == 2) {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else {
      wx.navigateTo({
        url: './feedback/feedback'
      })
    }
  },

  goToOrder(obj) {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    let type = obj.currentTarget.dataset.value;
    //判断用户是否登录或者没绑定手机号
    let i = app.userCredentials();
    if (i == 1) {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          wx.navigateTo({
            url: './reserve/reserve?type=' + type
          })
        }
      });
    } else if (i == 2) {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else {
      wx.navigateTo({
        url: './reserve/reserve?type=' + type
      })
    }
  },
  goToSet(e) {
    //判断用户是否登录或者没绑定手机号
    let i = app.userCredentials();
    if (i == 1) {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          wx.navigateTo({
            url: './set/set'
          })
        }
      });
    } else if (i == 2) {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else {
      wx.navigateTo({
        url: './set/set'
      })
    }
  },
  //登录
  loginDataF() {
    if (app.userData.weapp_openid != '' && app.userData.unionid != '' && app.userData.phone == '') {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else if (app.systemData.token != '' && app.userData.phone != '') {
      this.UserInfo();
    } else if (app.systemData.token == '')  {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          this.setData({
            userData: app.userData
          });
        }
      });
    }
  },
  //绑定手机号弹框 (废弃)
  phoneBD: function () {
    this.animation.translateY(-500).step()
    this.setData({
      zhezcheng: true,
      animationData: this.animation.export()
    })
  },
  //关闭弹框
  guangtk: function () {
    this.animation.translateY(500).step()
    this.setData({
      zhezcheng: false,
      animationData: this.animation.export()
    })
  },
  //获取手机号
  tiaozsj() {
    wx.navigateTo({
      url: '../phone/phone'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.systemData.token != '' && app.userData.phone != '') {
      this.UserInfo();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (app.systemData.token != '' && app.userData.phone != '') {
      this.UserInfo();
    }
    //停止当前页面下拉刷新
    wx.stopPullDownRefresh();
  },
  //我的资料
  UserInfo: function () {
    app.api('/v1/user/info', 'GET', false, '', (res, data, header) => {
      if (res.code == 0) {
        this.setData({
          userData: data
        });
        app.userData = data;
        app.systemData.token = header['Access-Token'];
        wx.setStorageSync('token', header['Access-Token']);
      } else if (res.code == 15014) {
        app.userData = data;
        wx.navigateTo({
          url: '../phone/phone'
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: "none",
          duration: 3000
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const promise = new Promise(resolve => {
      var data = {};
      //获取到分享参数
      app.shareData(e => {
        data = e
        resolve(data)
      });
    })
    return {
      promise
    }

  }
})