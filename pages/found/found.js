// pages/found/found.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //分类
    classification: [],
    //分类长度
    widthData: '0rpx',
    //分类ID
    classificationID: '',
    //是否可以继续翻页
    has_page: true,
    //资讯数据
    information: [],
    page: 1,
    page_size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadClassification();
  },
  //选择分类
  xuanzfenl: function (e) {
    this.setData({
      classificationID: e.currentTarget.dataset.value,
      information: [],
      page:1
    })
    this.loadData();
  },
  //拉取分类
  loadClassification: function () {
    app.api('/v1/news/category', 'GET', false, '', (res, data) => {
      if (res.code == 0) {
        this.setData({
          classification: data,
          classificationID: data[0].mid
        })
        this.setData({
          widthData: this.data.classification.length * 160 + 'rpx'
        })
        this.loadData();
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //拉取资讯数据
  loadData: function () {
    let data = {
      mid: this.data.classificationID,
      page : this.data.page,
      page_size : this.data.page_size
    }
    app.api('/v1/news/list', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        if (data.length > 0) {
          this.setData({
            information: this.data.information.concat(data)
          })
        } else {
          this.setData({
            information: []
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
  //详情
  detailsF: function (e) {
    wx.navigateTo({
      url: '../found/details/details?id=' + e.currentTarget.dataset.value
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