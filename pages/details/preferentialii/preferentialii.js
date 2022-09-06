// pages/details/preferential/preferential.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorData: '#0A0A0A',
    merchant_id: "",
    shop_id: "",
    shop_coupon:[],
    my_coupon:[],
    my_coupon_sl:0,
    dhqtk:false,
    yhqData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.merchant_id = options.merchant_id;
    this.data.shop_id = options.shop_id;
    this.storeYHQ();
  },
  //兑换优惠券
  yhqdhF:function(e){
    this.kaiqgbtk();
    this.setData({
      yhqData: e.currentTarget.dataset.value
    })
  },
  //开启/关闭优惠券弹框
  kaiqgbtk:function(){
    this.setData({
      dhqtk: !this.data.dhqtk
    })
  },
  //店铺可用优惠券查询
  storeYHQ: function () {
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id
    }
    app.api('/v1/coupon/shop', 'GET', true, data, (res, data) => {
      if (res.code == 0) {
        if (data.my_coupon != '' && data.my_coupon != null) {
          this.setData({
            my_coupon_sl: data.my_coupon.length,
            my_coupon:data.my_coupon,
            shop_coupon:data.shop_coupon
          })
        } else {
          this.setData({
            my_coupon_sl: 0,
            shop_coupon:data.shop_coupon
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
  //用积分兑换店铺券
  exchange: function (e) {
    var coupon_id = e.detail.value;
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id,
      coupon_id:coupon_id
    }
    app.api('/v1/coupon/exchange', 'POST', true, data, (res, data) => {
      if (res.code == 0) {
       this.storeYHQ();
       this.kaiqgbtk();
       wx.showToast({
        title: '兑换优惠券成功~',
        icon: "none",
        duration: 3000
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