// pages/my/helper/helper.js
const app = getApp();
Page({
  loadList(){
    let datas={
      type:3
    };
    app.api('/v1/article/list', 'GET', false, datas, (res, data) => {
      if (res.code == 0) {
        this.setData({
          dataList:data
        });
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    });
  },
  showContent(e){
    let itemIndex=e.currentTarget.dataset.index;
    if(itemIndex){
      let url=escape(this.data.dataList[itemIndex]['url']);
      let title=this.data.dataList[itemIndex]['title']
      wx.navigateTo({
        url:'/pages/webView/webView?url='+url+'&title='+title
      });
    }
  },
  return () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadList();
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