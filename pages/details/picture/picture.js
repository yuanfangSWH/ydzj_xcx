// pages/details/picture/picture.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商家ID
    merchant_id: "",
    //店铺ID
    shop_id: "",
    //图片
    album: [],
    //视频
    video: [],
    //图片放大
    imgtk: false,
    path: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.merchant_id = options.merchant_id;
    this.data.shop_id = options.shop_id;
    this.details();
  },
  fadtp: function (e) {
    this.setData({
      path: e.currentTarget.dataset.value,
      imgtk: !this.data.imgtk
    })
  },
  gbuimg: function () {
    this.setData({
      imgtk: !this.data.imgtk
    })
  },
  //店铺信息
  details: function () {
    let data = {
      //商家ID
      merchant_id: this.data.merchant_id,
      //店铺ID
      shop_id: this.data.shop_id
    }
    app.api('/v1/shop/detail', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        this.setData({
          album: data.album,
          video: data.video
        })
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