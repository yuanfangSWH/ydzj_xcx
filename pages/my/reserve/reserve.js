// pages/my/reserve/reserve.js
const app = getApp();
Page({
  onShareAppMessage() {
    return {
      title: 'tabs',
      path: 'page/weui/example/tabs/tabs'
    }
  },
  handleTabsChange(v) {
    this.setData({
      activeTab: v.currentTarget.dataset.index
    });
    this.loadData();
  },
  loadData() {
    let data = {
      type: this.data.activeTab == 0 ? '' : String(this.data.activeTab)
    }
    app.api('/v1/reserve/list', 'GET', false, data, (res, data) => {
      //停止当前页面下拉刷新
      wx.stopPullDownRefresh();
      this.setReserveData(data);
    });
  },
  reserveCancelClosed() {
    this.setData({
      reasonDialog: false,
    });
  },
  handleOrderCancel(e) {
    this.setData({
      currentReserve: e.currentTarget.dataset.set,
      reasonDialog: true,
    });
  },
  setReserveData(data) {
    let tabsData = this.data.tabs;
    tabsData[Number(this.data.activeTab)].items = data;
    this.setData({
      tabs: tabsData
    });
  },

  reserveCancelOk(e) {
    let data = {
      order_no: this.data.currentReserve.order_no,
      reason: e.detail//this.data.reasonInfo
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
  goReservInfo(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: './info/reserveInfo?reserve_id=' + item.reserve_id + '&order_no=' + item.order_no
    })
  },
  return () {
    wx.navigateBack({
      delta: 1
    })
  },
  handleOrderDelete(e) {
    this.setData({
      currentReserve: e.currentTarget.dataset.set,
      deleteReserveDialog: true
    });
  },
  handleDeleteReserveDialog(e) {
    let result = e.detail.index;
    if (result == 1) {
      let data = {
        order_no: this.data.currentReserve.order_no,
      }
      app.api('/v1/reserve/delete', 'POST', false, data, (res, data) => {
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
          deleteReserveDialog: false
        });
      });
    } else {
      this.setData({
        deleteReserveDialog: false
      });
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    colorData: '#0A0A0A',
    tabs: [],
    activeTab: 0,
    currentReserve: {},
    reasonDialog: false,

    deleteReserveDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const tabs = [{
        title: '全部订单',
        items: []
      },
      {
        title: '预约中',
        items: []
      },
      {
        title: '已预约',
        items: []
      },
      {
        title: '已取消',
        items: []
      }
    ]
    this.setData({
      tabs: tabs,
      activeTab: Number(options.type)
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
    this.loadData();
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
    this.loadData();
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