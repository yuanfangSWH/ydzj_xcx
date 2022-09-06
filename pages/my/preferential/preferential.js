// pages/details/preferential/preferential.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorData: '#0A0A0A',
    //数据
    storeData: [],
    //是否可以继续翻页
    has_page: true,
    page: 1,
    page_size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },
  //商家详情
  detailsTZ: function (e) {
    let data = e.currentTarget.dataset.value
    wx.navigateTo({
      url: '../../details/details?merchant_id=' + data.merchant_id + '&shop_id=' + data.shop_id
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
  //拉取我的优惠券
  loadData: function () {
    let data = {
      page : this.data.page,
      page_size : this.data.page_size
    }
    app.api('/v1/coupon/my', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        if (data.length > 0) {
          this.setData({
            storeData: this.data.storeData.concat(data)
          })
        }
        //是否可以继续翻页
        if (res.has_page) {
          this.setData({
            has_page: true
          });
        } else {
          this.setData({
            has_page: false
          });
        }
        //停止当前页面下拉刷新
        wx.stopPullDownRefresh();
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //跳转对应位置
  jumpWZ() {
    wx.pageScrollTo({
      duration: 300,
      selector: '#topMOD'
    })
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
    this.setData({
      storeData: []
    })
    this.data.page=1;
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.has_page) {
      this.data.page++;
      this.loadData();
    } else {
      wx.showToast({
        title: '已经到底了~',
        icon: "none",
        duration: 2000
      })
    }
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