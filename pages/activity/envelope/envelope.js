// pages/activity/envelope/envelope.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.systemData.token != '' && app.userData.phone != '') {
      this.UserInfo();
    }
  },
  //我的资料
  UserInfo: function () {
    app.api('/v1/user/info', 'GET', false, '', (res, data, header) => {
      if (res.code == 0) {
        app.userData = data;
        app.systemData.token = header['Access-Token'];
        wx.setStorageSync('token', header['Access-Token']);
        wx.navigateTo({
          url: '../../activity/activity?card=1'
        })
      } else if (res.code == 15014) {
        app.userData = data;
        wx.navigateTo({
          url: '../../phone/phone?activity=1'
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
  //手动拉起用户授权弹框获得用户信息
  loginDataF() {
    if (app.userData.weapp_openid != '' && app.userData.unionid != '' && app.userData.phone == '') {
      wx.navigateTo({
        url: '../../phone/phone?activity=1'
      })
    } else {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../../phone/phone?activity=1'
          })
        } else {
          wx.navigateTo({
            url: '../../activity/activity?card=1'
          })
        }
      });
    }
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