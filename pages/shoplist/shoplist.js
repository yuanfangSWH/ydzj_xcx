// pages/shop/list/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //顶广告
    advertisingImag: [],
    //区域数据
    areaData: [{
      type_id: 0,
      name: "全部"
    }],
    areaValue: 0,
    //排序数据
    sortingData: [{
      id: 0,
      name: "全部"
    }, {
      id: 1,
      name: "综合排序"
    }, {
      id: 2,
      name: "销量最高"
    }, {
      id: 3,
      name: "低消最低"
    }, {
      id: 4,
      name: "评分最高"
    }, {
      id: 5,
      name: "距离最近"
    }, ],
    sortingValue: 0,
    //类型数据
    typeValue: 0,
    //固定
    fixedValue: false,
    //搜索值
    searchData: "",
    //商店数据
    storeData: [],
    //是否可以继续翻页
    has_page: true,
    page: 1,
    page_size: 10,
    isOpen:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      typeValue: options.id ? options.id : 0
    })
    this.loadData();
    this.cityLoadData();
    this.loadAdvertising();
  },
  //获得顶部图片广告
  loadAdvertising: function () {
    var advertisingData = app.advertisingData;
    if (advertisingData == '' || !advertisingData) {
      app.advertising((code, data) => {
        if (code == 0) {
          switch (Number(this.data.typeValue)) {
            case 1:
              this.setData({
                advertisingImag: data.shop_list1_top ? data.shop_list1_top : []
              })
              break
            case 2:
              this.setData({
                advertisingImag: data.shop_list2_top ? data.shop_list2_top : []
              })
              break
            case 3:
              this.setData({
                advertisingImag: data.shop_list3_top ? data.shop_list3_top : []
              })
              break
            case 4:
              this.setData({
                advertisingImag: data.shop_list4_top ? data.shop_list4_top : []
              })
              break
            default:
              this.setData({
                advertisingImag: []
              })
              break
          }
        }
      });
    } else {
      switch (Number(this.data.typeValue)) {
        case 1:
          this.setData({
            advertisingImag: advertisingData.shop_list1_top ? advertisingData.shop_list1_top : []
          })
          break
        case 2:
          this.setData({
            advertisingImag: advertisingData.shop_list2_top ? advertisingData.shop_list2_top : []
          })
          break
        case 3:
          this.setData({
            advertisingImag: advertisingData.shop_list3_top ? advertisingData.shop_list3_top : []
          })
          break
        case 4:
          this.setData({
            advertisingImag: advertisingData.shop_list4_top ? advertisingData.shop_list4_top : []
          })
          break
        default:
          this.setData({
            advertisingImag: []
          })
          break
      }
    }
  },
  //Banner点击
  BannerBindtap: function () {
    var event_id = '';
    switch (Number(this.data.typeValue)) {
      case 1:
        event_id = 'ShopclubTopBannerAdClickld'
        break
      case 2:
        event_id = 'ShopktvTopBannerAdClickld'
        break
      case 3:
        event_id = 'ShopbarTopBannerAdClickld'
        break
      case 4:
        event_id = 'ShoppartyTopBannerAdClickld'
        break
    }
    //极光-计数事件模型
    app.JAnalyticsInterface.onEvent({
      type: 'custom_counting',
      attributes: {
        event_id: event_id
      }
    })
  },
  //商家详情
  detailsTZ: function (e) {
    let data = e.currentTarget.dataset.value
    wx.navigateTo({
      url: '../details/details?merchant_id=' + data.merchant_id + '&shop_id=' + data.shop_id
    })
  },
  //搜索
  searchF(e) {
    this.setData({
      searchData: e.detail.value,
      storeData:[],
      page: 1
    })
    this.loadData();
  },
  //拉取店铺数据
  loadData: function () {
    var formData = {
      //类型ID
      type_id: this.data.typeValue,
      //关键词
      keyword: this.data.searchData,
      //区域筛选
      district_id: this.data.areaValue,
      //排序方式
      sort: this.data.sortingValue,
      page: this.data.page,
      page_size: this.data.page_size
    }
    app.api('/v1/shop/list', 'GET', false, formData, (res, data) => {
      if (res.code == 0) {
          this.setData({
            storeData: this.data.storeData.concat(data)
          })
        
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
  //城市地区联动选择
  cityLoadData: function () {
    var formData = {
      id: app.systemData.city_id
    }
    app.api('/v1/city/select', 'GET', false, formData, (res, data) => {
      if (res.code == 0) {
        this.setData({
          areaData: this.data.areaData.concat(data)
        });
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  /**
   * 页面滚动距离
   */
  onPageScroll: function (e) {
    if (e.scrollTop >= 150) {
      this.setData({
        fixedValue: true
      })
    } else {
      this.setData({
        fixedValue: false
      })
    }
  },
  //组件调用的方法
  onChange: function (e) {
    //接收到传过来的值
    if(e.detail.isOpen){
      this.setData({
        isOpen: e.detail.isOpen
      })
    }else{
      this.setData({
        areaValue: e.detail.areaValue,
        sortingValue: e.detail.sortingValue,
        storeData:[],
        page: 1,
        isOpen: e.detail.isOpen
      })
      this.loadData();
    }
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
    this.setData({
      storeData: []
    })
    this.data.page = 1;
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