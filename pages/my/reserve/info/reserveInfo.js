const app = getApp();
Page({

  return () {
    wx.navigateBack({
      delta: 1
    })
  },
  //删除
  scdd:function(){
    wx.showModal({
      title: '删除',
      content: '是否删除该订单！',
      success :(res)=> {
        if (res.confirm) {
          let data = {
            order_no: this.data.reserveInfo.order_no
          }
          app.api('/v1/reserve/delete', 'POST', false, data, (res, data) => {
            if (res.code == 0) {
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 2000
              });
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'error',
                duration: 2000
              });
            }
          });
        }
      }
    })
  },
  handleReserveCancel() {
    this.setData({
      isShowReserveCancel: true
    })
  },
  reserveCancelOk() {
    let data = {
      order_no: this.data.reserveInfo.order_no,
    }
    app.api('/v1/reserve/cancel', 'POST', false, data, (res, data) => {
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000
        });
        this.loadData();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'error',
          duration: 2000
        });
      }
      this.setData({
        reasonDialog: false,
      });
    });
  },
  reserveCancelClosed() {
    this.setData({
      isShowReserveCancel: false
    })
  },
  loadData() {
    let data = {
      reserve_id: this.data.reserve_id,
      order_no: this.data.order_no
    }
    app.api('/v1/reserve/detail', 'GET', false, data, (res, data) => {
      this.setData({
        reserveInfo:data
      })
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    isShowReserveCancel: false,
    reserveInfo: {},
    reserve_id: null,
    order_no: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      reserve_id: options.reserve_id,
      order_no: options.order_no
    });
    this.loadData();
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