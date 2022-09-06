// pages/my/set/set.js
Page({

  goUrl(e){
    let url=e.currentTarget.dataset.url;
    let title=e.currentTarget.dataset.title;
    wx.navigateTo({
      url:'/pages/webView/webView?url='+url+'&title='+title
    });
  },
  goToProfile(){
    wx.navigateTo({
      url: './profile/profile'
    })
  },
  goToAbout(){
    wx.navigateTo({
      url: './about/about'
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    loginData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let d=wx.getStorageSync('world');
    this.setData({
      'loginData':d
    });
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