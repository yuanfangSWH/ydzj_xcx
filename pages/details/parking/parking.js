// pages/details/parking/parking.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorData: '#0A0A0A',
    merchant_id: "",
    shop_id: "",
    //停车场数据
    parkingData: []
  },
  return () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.merchant_id = options.merchant_id;
    this.data.shop_id = options.shop_id;
    this.parkingLoading();
  },
  //附近停车场
  parkingLoading: function () {
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id
    }
    app.api('/v1/shop/parkinglot', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        this.setData({
          parkingData: data,
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

  }
})