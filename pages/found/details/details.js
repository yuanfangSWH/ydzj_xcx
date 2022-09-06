// pages/found/details/details.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    detailsData: [],
    storeData: [],
    tag: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id ? options.id : ''
    this.loadData();
  },
  //商家详情
  detailsTZ: function (e) {
    let data = e.currentTarget.dataset.value
    wx.navigateTo({
      url: '../details/details?merchant_id=' + data.merchant_id + '&shop_id=' + data.shop_id
    })
  },
  //详情
  loadData: function () {
    var formData = {
      //资讯ID
      news_id: this.data.id
    }
    app.api('/v1/news/detail', 'GET', false, formData, (res, data) => {
      if (res.code == 0) {
        this.setData({
          detailsData: data,
          storeData: data.shop
        })
        if (data.tag) {
          this.data.tag = data.tag;
          var t = 1;
          var e = [];
          for (let i of this.data.tag) {
            t++
            e.push({
              name: i.name.length < 6 ? i.name : i.name.substring(0, 6)
            })
            if (t == 4) {
              break;
            }
          }
          this.setData({
            tag: e
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