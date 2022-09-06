// pages/container/container.js
const app = getApp() 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlData: "",
    merchant_id: "",
    shop_id: "",
    type_id: "",
    reserve_date: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => {
      switch (Number(options.id)) {
        case 1:
          this.setData({
            url: wx.getStorageSync('vr_url')
          })
          break;
        case 2:
          var SVG_urlData = 'https://m.ddhi.cn/place?shop_id=' + options.shop_id + '&merchant_id=' + options.merchant_id
          //console.info(SVG_urlData);
          this.setData({
            urlData: SVG_urlData
          })
          break;
        case 3:
          this.data.merchant_id = options.merchant_id;
          this.data.shop_id = options.shop_id;
          this.data.type_id = options.type_id;
          this.data.reserve_date = options.reserve_date;
          this.xuanzYM();
          break;
        case 4:
          this.setData({
            urlData: wx.getStorageSync('bannerHref')
          })
          break;
      }
    }, 0)
  },
  //接收H5页面的返回
  handleGetMessage: function (e) {
    console.log("H5页面返回:"+e.detail.data[0])
    app.seatData = {type_id:e.detail.data[0].type_id,place_id: e.detail.data[0].check_id}
  },
  //加载选座页面
  xuanzYM() {
    var token = app.systemData.token;
    var urlData = 'http://mtest.ddhi.cn/placeSmall?shop_id=' + this.data.shop_id + '&merchant_id=' + this.data.merchant_id + '&type_id=' + this.data.type_id + '&reserve_date=' + this.data.reserve_date + '&token=' + token;
    this.setData({
      urlData: urlData
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