// pages/phone/phone.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //电话
    phone: "",
    //验证码
    validation: "",
    //性别
    gender: "",
    //生日
    birthday: "",
    birthdayBF:"2003-12-31",
    //动画
    donhwenz: "发送验证码",
    shuzData: 60,
    keyidianji: true,
    //是否同意协议
    agreement: false,
    //是否跳转活动
    activity: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.activity) {
      this.setData({
        activity: options.activity
      })
    }
  },
  //请输入手机号
  phoneData: function (e) {
    this.data.phone = e.detail.value;
  },
  //请输入验证码
  validationData: function (e) {
    this.data.validation = e.detail.value;
  },
  //获得验证码
  huodeyzm: function () {
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入手机号！',
        icon: "none",
        duration: 3000
      })
      return;
    }
    if (this.data.keyidianji) {
      let data = {
        phone: this.data.phone,
        scene: 1
      }
      app.api('/v1/sms/send', 'POST', false, data, (res, data) => {
        if (res.code == 0) {
          wx.showToast({
            title: '验证码短信发送成功',
            icon: "success",
            duration: 3000
          })
          this.data.keyidianji = false;
          this.donhF();
        } else {
          wx.showToast({
            title: res.msg || '服务器异常',
            icon: 'error',
          })
        }
      })
    }
  },
  //倒数动画
  donhF() {
    this.setData({
      donhwenz: "重新发送（" + this.data.shuzData + "）",
    })
    this.data.shuzData--;
    if (this.data.shuzData > 0) {
      setTimeout(this.donhF, 1000)
    } else {
      this.data.shuzData = 60;
      this.setData({
        donhwenz: "获得验证码",
        keyidianji: true
      })
    }
  },
  //选择性别
  genderF: function (e) {
    this.setData({
      gender: e.currentTarget.dataset.value
    })
  },
  //设置生日
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  //同意协议
  checkboxChange(e) {
    if (e.detail.value == 1) {
      this.data.agreement = true;
    } else {
      this.data.agreement = false;
    }
  },
  //用户协议
  showAgreement1(){
    wx.getStorage({
      key: 'world',
      success (res) {
        wx.navigateTo({
          url:'/pages/webView/webView?url='+res.data.user_server_url
        });
      }
    });
  },
  //隐私协议
  showAgreement2(){
    wx.getStorage({
      key: 'world',
      success (res) {
        wx.navigateTo({
          url:'/pages/webView/webView?url='+res.data.user_agree_url
        });
      }
    });
  },
  //提交
  tijiao: function () {
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入手机号！',
        icon: "error",
        duration: 3000
      })
      return;
    }
    if (this.data.validation == '') {
      wx.showToast({
        title: '请输入验证码！',
        icon: "error",
        duration: 3000
      })
      return;
    }
    if (this.data.gender == '') {
      wx.showToast({
        title: '请选择性别！',
        icon: "error",
        duration: 3000
      })
      return;
    }
    if (this.data.birthday == '') {
      wx.showToast({
        title: '请选择出生日期！',
        icon: "error",
        duration: 3000
      })
      return;
    }
    if (!this.data.agreement) {
      wx.showToast({
        title: '请阅读后选择是否同意协议',
        icon: "error",
        duration: 3000
      })
      return;
    }
    let data = {
      openid: app.userData.weapp_openid,
      unionid: app.userData.unionid,
      phone: this.data.phone,
      captcha: this.data.validation,
      gender: this.data.gender,
      birthday: this.data.birthday,
      //邀请码
      invite_code: app.invite_code,
      //请求邀请上报接口后返回的id
      invite_id: app.invite_id,
    }
    app.api('/v1/auth/reg', 'POST', false, data, (res, data) => {
      if (res.code == 0) {
        app.userData = data;
        app.systemData.token = data.auth_key;
        wx.setStorageSync('token', data.auth_key);
        if(this.data.activity==0){
          wx.switchTab({
            url: '/pages/index/index'
          })
        }else if(this.data.activity==1){
          wx.navigateTo({
            url: '../activity/activity?card=1'
          })
        }
        
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  return () {
    wx.navigateBack({
      delta: 1
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
      var data={};
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