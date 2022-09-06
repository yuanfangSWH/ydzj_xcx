// pages/my/set/profile/profile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorData:'#161616',
    nickname:"",
    birthday:"",
    age:"",
    constellation:"",
    nicknameBF:"",
    birthdayBF:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinfo();
  },
  //查询我的资料
  getinfo:function(){
    app.api('/v1/user/info', 'GET', true, '', (res, data) => {
      if (res.code == 0) {
        this.setData({
          nickname:data.nickname,
          birthday:data.birthday,
          age:data.age,
          constellation:data.constellation,
          nicknameBF:data.nickname,
          birthdayBF:data.birthday,
        })
          } else {
            wx.showToast({
              title: res.msg || '服务器异常',
              icon: 'error',
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

  },
  return () {
    wx.navigateBack({
      delta: 1
    })
  },
  //昵称
  bindPickerChange: function(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  //出生日期
  bindDateChange: function(e) {
      this.setData({
        birthday: e.detail.value
      })
  },
  // 修改保存
  submitproflie(){
    if(this.data.nickname==this.data.nicknameBF&&this.data.birthday==this.data.birthdayBF){
      wx.showToast({
        title: '保存成功',
        icon: 'none',
      })
      this.return();
      return;
    }
    let data={
      nickname:this.data.nickname,
      birthday:this.data.birthday,
    }
    app.api('/v1/user/update', 'POST', true, data, (res, data) => {
      if (res.code == 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
        })
        this.return();
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  }
})