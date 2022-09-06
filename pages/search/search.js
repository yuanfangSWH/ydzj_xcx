// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索历史
    historyData: [],
    //搜索值
    searchData: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      historyData: wx.getStorageSync('history') ? wx.getStorageSync('history') : []
    })
  },
  //清空历史记录
  qklsF() {
    this.setData({
      historyData: []
    })
    wx.setStorage({
      key: "history",
      data: []
    })
  },
  searchF(e) {
    var nameData = e.detail.value;
    if (nameData == '' || nameData == null) {
      return;
    }
    var valueData = this.data.historyData;
    if (valueData.length < 10) {
      valueData.splice(0, 0, nameData);
      //去重
      valueData = Array.from(new Set(valueData))
      this.setData({
        historyData: valueData
      })
      wx.setStorage({
        key: "history",
        data: valueData
      })
    } else {
      valueData.splice(-1, 1);
      valueData.splice(0, 0, nameData);
      this.setData({
        historyData: valueData
      })
      wx.setStorage({
        key: "history",
        data: valueData
      })
    }
    wx.navigateTo({
      url: '../searchlist/searchlist?nameData=' + nameData
    })
  },
  historyTZ(e) {
    wx.navigateTo({
      url: '../searchlist/searchlist?nameData=' + e.currentTarget.dataset.value
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