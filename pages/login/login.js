// pages/login.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //设置按钮
    location: false,
    //邀请码
    invite_code: '',
    //是否跳转活动
    activity: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.code) {
      console.log("从分享链接得到的code:" + options.code)
      this.setData({
        invite_code: options.code
      })
    }
    if (options.activity) {
      this.setData({
        activity: options.activity
      })
    }
    if (options.share_id) {
      app.share_id = options.share_id
    }
    //获取地址经纬度
    app.Location((i) => {
      if (i) {
        this.registrationID();
      } else {
        app.systemData.city_id = '450200';
        this.registrationID();
      }
    });

  },
  //获得极光设备号
  registrationID: function () {
    app.initJG((y) => {
      if (y) {
        this.handsPerform();
      }
    });
  },
  //执行握手协议
  handsPerform: function () {
    //握手协议
    app.handshake((y) => {
      if (y) {
        if (this.data.invite_code != '') {
          if (app.invite_code != this.data.invite_code) {
            //console.log("原来的invite_code:" + app.invite_code + "|得到的invite_code：" + app.invite_code)
            app.invite_code = this.data.invite_code;
            wx.setStorageSync('invite_code', this.data.invite_code);
          }
          //安装上报
          app.reportInvitation();
        }
        if (this.data.activity == 0) {
          //跳转首页
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          if (app.systemData.token != '' && app.userData.phone != '') {
            this.UserInfo();
          } else {
            wx.navigateTo({
              url: '/pages/activity/envelope/envelope'
            })
          }
        }
      }
    });
  },
  //我的资料
  UserInfo: function () {
    app.api('/v1/user/info', 'GET', false, '', (res, data, header) => {
      if (res.code == 0) {
        app.userData = data;
        app.systemData.token = header['Access-Token'];
        wx.setStorageSync('token', header['Access-Token']);
        wx.navigateTo({
          url: '/pages/activity/activity?card=1'
        })
      } else if (res.code == 15014) {
        app.userData = data;
        wx.navigateTo({
          url: '/pages/phone/phone?activity=1'
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

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