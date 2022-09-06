// index.js
const app = getApp()

Page({
  data: {
    //幻灯片
    advertising: [],
    //活动广告
    index_middle: [],
    //分类
    classification: [],
    //店铺
    storeData: [],
    //是否可以继续翻页
    has_page: true,
    //是否进入了选择城市页面
    cityChange: false,
    //城市数据
    city_id: 0,
    city: '',
    //活动弹框
    activitytk: false,
    activityData: {},
    page: 1,
    page_size: 10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //拉取店铺分类
    this.loadClassification();
    //拉取店铺数据
    this.loadData();
    //城市位置检测
    app.cityLocation((res, data) => {
      if (res.code == 0) {
        this.setData({
          city_id: data.city_id,
          city: data.city != '' ? data.city : '未知'
        })
      }
    });
    this.versionHD();
    this.loadAdvertising();
  },
  //检查活动弹框
  versionHD: function () {
    app.api('/v1/activity/popup?version=105', 'GET', false, '', (res, data) => {
      if (res.code == 0) {
        if (data.index) {
          var date = new Date();
          var activityDate = Number(String(date.getMonth()) + String(date.getDate()));
          var myDate = wx.getStorageSync('activityDate') != '' ? wx.getStorageSync('activityDate') : ''
          if (myDate == '') {
            wx.setStorageSync('activityDate', activityDate);
            this.setData({
              activityData: data.index,
              activitytk: true
            })
          } else if (Number(myDate) != activityDate) {
            wx.setStorageSync('activityDate', activityDate);
            this.setData({
              activityData: data.index,
              activitytk: true
            })
          }
        }
      }
    })
  },
  //关闭活动弹框
  gbhdtk: function () {
    this.setData({
      activitytk: !this.data.activitytk
    })
  },
  //获得顶部图片广告/活动广告
  loadAdvertising: function () {
    app.advertising((code, data) => {
      if (code == 0) {
        //解决切换时间过短
        data.index_top.stay_time = data.index_top.stay_time == 0 ? 5000 : Number(String(data.index_top.stay_time) + "00");
        data.index_top.stay_time = data.index_top.stay_time < 1000 ? Number(String(data.index_top.stay_time) + "00") : data.index_top.stay_time;
        this.setData({
          advertising: data.index_top ? data.index_top : [],
          index_middle: data.index_middle ? data.index_middle : [],
        })
      }
    });
  },
  //拉取店铺分类
  loadClassification: function () {
    app.api('/v1/shop/type', 'GET', false, '', (res, data) => {
      if (res.code == 0) {
        this.setData({
          classification: data
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //拉取店铺数据
  loadData: function () {
    let data = {
      page: this.data.page,
      page_size: this.data.page_size
    }
    app.api('/v1/shop/recommend', 'GET', false, data, (res, data) => {
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
  Search() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  shopTZ(e) {
    wx.navigateTo({
      url: '../shoplist/shoplist?id=' + e.currentTarget.dataset.value
    })
  },
  cityTZ() {
    this.data.cityChange = true;
    wx.navigateTo({
      url: '../city/city'
    })
  },
  //商家详情
  detailsTZ: function (e) {
    var routeData = getCurrentPages();
    wx.setStorageSync('route_url', routeData[0].route);
    let data = e.currentTarget.dataset.value
    wx.navigateTo({
      url: '../details/details?merchant_id=' + data.merchant_id + '&shop_id=' + data.shop_id
    })
  },
  //更多店铺列表
  morelistTZ: function () {
    wx.navigateTo({
      url: '../morelist/morelist'
    })
  },
  //Banner点击
  BannerBindtap: function () {
    //极光-计数事件模型
    app.JAnalyticsInterface.onEvent({
      type: 'custom_counting',
      attributes: {
        event_id: 'IndexTopBannerAdClickld'
      }
    })
  },
  //跳转活动
  activityF: function () {
    //极光-计数事件模型
    app.JAnalyticsInterface.onEvent({
      type: 'custom_counting',
      attributes: {
        event_id: 'DialogIndexld'
      }
    })
    if (app.userData.weapp_openid != '' && app.userData.unionid != '' && app.userData.phone == '') {
      wx.navigateTo({
        url: '../phone/phone?activity=1'
      })
    } else if (app.systemData.token != '' && app.userData.phone != '') {
      wx.navigateTo({
        url: '../activity/activity'
      })
    } else if (app.systemData.token == '') {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone?activity=1'
          })
        } else {
          wx.navigateTo({
            url: '../activity/activity'
          })
        }
      });
    }
  },
  //跳转页面容器
  container: function (e) {
    wx.setStorageSync('bannerHref', e.currentTarget.dataset.url)
    wx.navigateTo({
      url: '../container/container?id=' + e.currentTarget.dataset.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.cityChange) {
      this.data.cityChange = false;
      if (this.data.city_id != app.systemData.city_id) {
        this.setData({
          storeData: []
        })
        //城市位置检测
        app.api('/v1/city/check', 'GET', false, '', (res, data) => {
          if (res.code == 0) {
            this.setData({
              city_id: data.city_id,
              city: data.city
            })
          } else {
            wx.showToast({
              title: res.msg || '服务器异常',
              icon: 'error',
            })
          }
        })
        //拉取店铺数据
        this.loadData();
        //拉取全部广告图片
        this.loadAdvertising();
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      storeData: []
    })
    this.data.page = 1;
    //拉取店铺分类
    this.loadClassification();
    //拉取店铺数据
    this.loadData();
    //拉取全部广告图片
    this.loadAdvertising();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.has_page) {
      this.data.page++;
      //拉取店铺数据
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