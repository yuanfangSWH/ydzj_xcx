// pages/details/details.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //进入方式
    card: 0,
    //商家ID
    merchant_id: "",
    //店铺ID
    shop_id: "",
    //店铺详情数据
    detailsData: {},
    //相册数组
    album: [],
    //视频数组
    video: [],
    //预订日期
    date_list: [],
    //预订数据
    place_type: [],
    //预订天数
    date: [],
    //是否收藏
    collection: 0,
    //周边推荐
    storeData: [],
    //店铺标签
    tagsData: [],
    tagsBf: [],
    tagsLength: 1,
    openData: [],
    //弹框/遮罩层
    zhezcheng: false,
    //首单券
    first_coupon: [],
    //到店时间弹框
    daotk: false,
    //座位类型ID
    type_id: "",
    //选择的日期 | 仅展示用
    taiyzheta: "今天",
    //时间段
    sjdData: [],
    //时间段数据
    reserve_time: "",
    //预订信息
    booking: {},
    //套餐数据
    group_buy: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var card = wx.getStorageSync('route_url')
    
    if (card && card != '') {
      this.data.card = 1;
      wx.setStorageSync('route_url', '');
    }
    this.setData({
      merchant_id: options.merchant_id ? options.merchant_id : '',
      shop_id: options.shop_id ? options.shop_id : ''
    })
    this.loadData();
    this.around();
  },
  //敬请期待
  jqqd() {
    wx.showToast({
      title: '该功能未对小程序开放，请移步探电APP体验~',
      icon: "none",
      duration: 3000
    })
  },
  //点击预订
  dianjiyud: function (e) {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    if (e.currentTarget.dataset.area == 1) {
      this.data.booking = e.currentTarget.dataset.value;
    } else {
      this.data.group_buy = e.currentTarget.dataset.value;
      for (let i of this.data.place_type) {
        if (i.type_id == this.data.group_buy.type_id) {
          this.data.booking = i;
          break;
        }
      }
    }
    app.seatData = {};
    app.bookingData = {};
    if (this.data.detailsData.choose_time == 1) {
      this.chajxsjid();
    } else {
      this.setData({
        daotk: false
      })
      //判断用户是否登录或者没绑定手机号
      let i = app.userCredentials();
      if (i == 1) {
        app.loginData((i) => {
          if (!i) {
            wx.navigateTo({
              url: '../phone/phone'
            })
          } else {
            this.dianjiyud2();
          }
        });
      } else if (i == 2) {
        wx.navigateTo({
          url: '../phone/phone'
        })
      } else {
        this.dianjiyud2();
      }
    }
  },
  dianjiyud2: function (e) {
    app.bookingData = {
      //店铺名称
      name: this.data.detailsData.name,
      //预订id
      type_id: this.data.booking.type_id,
      //预订金额
      deposit: this.data.booking.deposit,
      //低消费
      basic_price: this.data.booking.basic_price,
      //预订日期
      reserve_date: this.data.date.date,
      //预订时间段
      reserve_time: "",
      //套餐id
      gb_id: this.data.group_buy.gb_id ? this.data.group_buy.gb_id : '',
      //套餐名称
      title: this.data.group_buy.title ? this.data.group_buy.title : '',
      //套餐价格
      reference_price: this.data.group_buy.reference_price ? this.data.group_buy.reference_price : 0
    };
    wx.navigateTo({
      url: '../details/booking/booking?choose_place=' + this.data.detailsData.choose_place + '&merchant_id=' + this.data.merchant_id + '&shop_id=' + this.data.shop_id + '&type_id=' + this.data.booking.type_id + '&reserve_date=' + this.data.date.date + '&reserve_time=' + this.data.reserve_time
    })
  },
  //开启/关闭时间段弹框
  sjtkqbb: function () {
    this.setData({
      daotk: !this.data.daotk
    })
  },
  //查询时间段
  chajxsjid: function () {
    //判断用户是否登录或者没绑定手机号
    let i = app.userCredentials();
    if (i == 1) {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          this.chajxsjid2();
        }
      });
    } else if (i == 2) {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else {
      this.chajxsjid2();
    }
  },
  chajxsjid2: function () {
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id,
      reserve_date: this.data.date.date,
      type_id: this.data.booking.type_id
    }
    app.api('/v1/place/times', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        var timbo = []
        for (let i of data.time_list) {
          timbo.push({
            value: i,
            name: i.substr(11, 5)
          })
        }
        var rq = this.data.date.month_day.replace(/-/, "月") + '日';
        var jt = '（' + rq + '） ' + this.data.date.week_day;
        this.setData({
          sjdData: timbo,
          daotk: true,
          taiyzheta: jt
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //选择时间段
  XZsjd: function (e) {
    this.setData({
      reserve_time: e.currentTarget.dataset.value
    })
  },
  //选择时间段后确定
  bxcgdyq: function () {
    if (this.data.reserve_time == '') {
      wx.showToast({
        title: '请选择时间段',
        icon: "none",
        duration: 3000
      })
      return;
    }
    //关闭弹框
    this.setData({
      daotk: false
    })
    app.bookingData = {
      //店铺名称
      name: this.data.detailsData.name,
      //预订id
      type_id: this.data.booking.type_id,
      //预订金额
      deposit: this.data.booking.deposit,
      //低消费
      basic_price: this.data.booking.basic_price,
      //预订日期
      reserve_date: this.data.date.date,
      //预订时间段
      reserve_time: this.data.reserve_time,
      //套餐id
      gb_id: this.data.group_buy.gb_id ? this.data.group_buy.gb_id : '',
      //套餐名称
      title: this.data.group_buy.title ? this.data.group_buy.title : '',
      //套餐价格
      reference_price: this.data.group_buy.reference_price ? this.data.group_buy.reference_price : 0
    };
    wx.navigateTo({
      url: '../details/booking/booking?choose_place=' + this.data.detailsData.choose_place + '&merchant_id=' + this.data.merchant_id + '&shop_id=' + this.data.shop_id + '&type_id=' + this.data.booking.type_id + '&reserve_date=' + this.data.date.date + '&reserve_time=' + this.data.reserve_time
    })
  },
  //商家详情
  detailsTZ: function (e) {
    let data = e.currentTarget.dataset.value
    wx.navigateTo({
      url: '../details/details?merchant_id=' + data.merchant_id + '&shop_id=' + data.shop_id
    })
  },
  //打开/关闭弹框
  guangtk: function () {
    this.setData({
      zhezcheng: !this.data.zhezcheng
    })
  },
  //领取优惠券接口
  preferentialApi: function () {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    //判断用户是否登录或者没绑定手机号
    let i = app.userCredentials();
    if (i == 1) {
      app.loginData((i) => {
        if (!i) {
          wx.navigateTo({
            url: '../phone/phone'
          })
        } else {
          this.preferentialApi2();
        }
      });
    } else if (i == 2) {
      wx.navigateTo({
        url: '../phone/phone'
      })
    } else {
      this.preferentialApi2();
    }
  },
  preferentialApi2: function () {
    let data = {
      coupon_id: this.data.first_coupon.coupon_id,
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id
    }
    app.api('/v1/coupon/getfirst', 'POST', true, data, (res, data) => {
      if (res.code == 0) {
        this.data.first_coupon.is_receive = 1;
        this.setData({
          first_coupon: this.data.first_coupon
        })
        this.guangtk();
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //收藏/取消收藏店铺(废弃)
  collectionF: function () {
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id
    }
    app.api('/v1/relation/shop', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        this.setData({
          collection: data.result
        })
        if (data.result == 1) {
          wx.showToast({
            title: '收藏店铺成功',
            icon: "none",
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '取消收藏店铺',
            icon: "none",
            duration: 3000
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
  //选择预订日期
  tianshu: function (e) {
    this.setData({
      date: e.currentTarget.dataset.value
    })
  },
  //拉取店铺详情
  loadData: function () {
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id
    }
    app.api('/v1/shop/service', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        var shop = data.shop;
        shop.score = parseInt(shop.score);
        this.setData({
          detailsData: shop,
          album: data.shop.album,
          video: data.shop.video,
          date_list: data.date_list,
          place_type: data.place_type,
          first_coupon: data.first_coupon,
          date: data.date_list[0]
        })
        wx.setStorageSync('vr_url', data.shop.vr_url);
        this.data.openData = []
        for (let r of data.place_type) {
          this.data.openData.push({
            open: false
          })
        }
        this.setData({
          openData: this.data.openData
        })
        //添加标签
        if (data.shop.tags) {
          var bf = [];
          //var e = data.shop.tags;
          // for (let i of e) {
          //   bf.push(i.substr(0, 5))
          //   if (bf.length == 3) {
          //     this.data.tagsBf.push({
          //       data: bf
          //     })
          //     bf = [];
          //   }
          // }
          // if (bf != '') {
          //   this.data.tagsBf.push({
          //     data: bf
          //   })
          // }
          // this.setData({
          //   tagsData: this.data.tagsBf[0].data
          // })
          for (let i of data.shop.tags) {
            // bf.push(i.substr(0, 5))
            bf.push(i)
            if (bf.length == 3) {
              break;
            }
          }
          this.setData({
            tagsData: bf
          })
        }
        //添加标签结束
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //周边推荐
  around: function () {
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id
    }
    app.api('/v1/shop/around', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        var i = [];
        for (let e of data) {
          i.push(e);
          if (i.length == 4) {
            break;
          }
        }
        this.setData({
          storeData: i,
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //展开套餐
  openTC: function (e) {
    var key = e.currentTarget.dataset.value;
    if (!this.data.openData[key].open) {
      this.data.openData[key].open = true;
    } else {
      this.data.openData[key].open = false;
    }
    this.setData({
      openData: this.data.openData
    })
  },
  //切换标签(废弃)
  dadydchou: function () {
    this.data.tagsLength++;
    var i = (this.data.tagsLength - 1);
    this.setData({
      tagsLength: this.data.tagsLength
    })
    if (this.data.tagsLength <= this.data.tagsBf.length) {
      this.setData({
        tagsData: this.data.tagsBf[i].data
      })
    } else {
      this.setData({
        tagsLength: 1,
        tagsData: this.data.tagsBf[0].data
      })
    }
  },
  //拨打电话
  phoneBD: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.detailsData.phone,
      success: () => {
        this.callphone();
      }
    })
  },
  //记录拨打电话
  callphone: function () {
    let data = {
      phone: this.data.detailsData.phone,
      shop_id: this.data.shop_id
    }
    app.api('/v1/shop/callphone', 'GET', false, data, (res, data) => {})
  },
  //跳转页面容器
  container: function (e) {
    wx.navigateTo({
      url: '../container/container?id=' + e.currentTarget.dataset.value + '&merchant_id=' + this.data.merchant_id + '&shop_id=' + this.data.shop_id
    })
  },
  //跳转附近停车场
  parkingF: function () {
    wx.navigateTo({
      url: '../details/parking/parking?merchant_id=' + this.data.merchant_id + '&shop_id=' + this.data.shop_id
    })
  },
  //跳转商家信息
  informationF: function () {
    wx.navigateTo({
      url: '../details/information/information?merchant_id=' + this.data.merchant_id + '&shop_id=' + this.data.shop_id
    })
  },
  //跳转商家相册
  picture: function () {
    wx.navigateTo({
      url: '../details/picture/picture?merchant_id=' + this.data.merchant_id + '&shop_id=' + this.data.shop_id
    })
  },
  //申请入住
  sqrzF: function () {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    wx.navigateTo({
      url: '../shopApply/shopApply'
    })
  },
  //跳转优惠券
  yhqTZ: function () {
    wx.showToast({
      title: '小程序暂未开放该功能，请搜索应用下载探电APP',
      icon: "none",
      duration: 2000
    })
    return;
    wx.navigateTo({
      url: '../details/preferentialii/preferentialii?merchant_id=' + this.data.merchant_id + '&shop_id=' + this.data.shop_id
    })
  },
  return () {
    if (this.data.card == 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
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
    this.loadData();
    this.around();
    //停止当前页面下拉刷新
    wx.stopPullDownRefresh();
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