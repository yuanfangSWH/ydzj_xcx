// pages/booking/booking.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorData: '#0A0A0A',
    //是否支持选座
    choose_place: 0,
    //位置id
    place_id: "",
    //商家ID
    merchant_id: "",
    //店铺ID
    shop_id: "",
    //位置类型ID
    type_id: "",
    //券领取ID
    receive_id: "",
    //预订日期 yyyy-mm-dd 必填
    reserve_date: "",
    //预订时间 hh:ii ，如果允许选择时间才填写
    reserve_time: "",
    //预订数据
    bookingData: {},
    //可用券
    my_coupon_sl: 0,
    //座位详情数据
    zwxqData: [],
    //判断是否进入了选座H5页面
    backData:0,
    //联系人
    name: "",
    //性别 1男 2女
    gender: 1,
    //电话
    phone: "",
    //留言
    remark: "",
    //留言长度
    remark_cd: 0,
    //优惠券数据
    couponsData:{}
  },
  //选择性别
  xuanzxb: function (e) {
    this.setData({
      gender: e.currentTarget.dataset.value
    })
  },
  gefuxiac1: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  gefuxiac2: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  gefuxiac3: function (e) {
    var remark_cd = e.detail.value;
    this.setData({
      remark: e.detail.value,
      remark_cd: remark_cd.length
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.coupons = {};
    this.data.merchant_id = options.merchant_id;
    this.data.shop_id = options.shop_id;
    this.data.reserve_date = options.reserve_date;
    this.data.reserve_time = options.reserve_time;
    this.data.type_id = options.type_id;
    if (options.choose_place == 1) {
      wx.navigateTo({
        url: '../../container/container?id=' + 3 + '&merchant_id=' + options.merchant_id + '&shop_id=' + options.shop_id + '&type_id=' + options.type_id + '&reserve_date=' + options.reserve_date
      })
    } else {
      this.setData({
        bookingData: app.bookingData
      })
      this.storeYHQ();
    }
  },
  //预订准备
  bookingData: function () {
    let data = {
      //商家ID
      merchant_id: this.data.merchant_id,
      //店铺ID
      shop_id: this.data.shop_id,
      //预订日期 yyyy-mm-dd，必填
      reserve_date: this.data.reserve_date,
      //预订时间 hh:ii ，如果允许选择时间才填写
      reserve_time: this.data.reserve_time,
      //位置类型ID
      type_id: this.data.type_id,
      //套餐ID |非必填
      gb_id: this.data.bookingData.gb_id,
      //券领取ID |非必填
      receive_id: this.data.receive_id
    }
    app.api('/v1/reserve/ready', 'POST', true, data, (res, data) => {
      if (res.code == 0) {
        this.setData({
          reserve_date: data.arrive_date,
          reserve_time: data.arrive_time
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //提交验证
  TJyz: function () {
    if (this.data.name == '') {
      wx.showToast({
        title: '联系人未填写！',
        icon: "none",
        duration: 2000
      })
      return;
    }
    if (this.data.phone == '') {
      wx.showToast({
        title: '电话未填写！',
        icon: "none",
        duration: 2000
      })
      return;
    }
    if (this.data.remark == '') {
      wx.showToast({
        title: '留言未填写！',
        icon: "none",
        duration: 2000
      })
      return;
    }
    this.bookingTJ();
  },
  //预订提交
  bookingTJ: function () {
    let data = {
      //商家ID |必填
      merchant_id: this.data.merchant_id,
      //店铺ID |必填
      shop_id: this.data.shop_id,
      //联系人 |必填
      name: this.data.name,
      //性别 1男 2女 |必填
      gender: this.data.gender,
      //电话 |必填
      phone: this.data.phone,
      //留言 |必填
      remark: this.data.remark,
      //预订日期 yyyy-mm-dd |必填
      reserve_date: this.data.reserve_date,
      //预订时间 hh:ii ，如果允许选择时间才填写
      reserve_time: this.data.reserve_time,
      //位置id |非必填
      place_id: this.data.place_id,
      //位置类型ID |必填
      type_id: this.data.type_id,
      //套餐ID |非必填
      gb_id: this.data.bookingData.gb_id,
      //券领取ID |非必填
      receive_id: this.data.receive_id
    }
    //console.log("预订提交参数:" + JSON.stringify(data))
    app.api('/v1/reserve/submit', 'POST', true, data, (res, data) => {
      if (res.code == 0) {
        wx.navigateTo({
          url: '../../details/results/results'
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //店铺优惠券
  storeYHQ: function () {
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id
    }
    app.api('/v1/coupon/shop', 'GET', true, data, (res, data) => {
      if (res.code == 0) {
        if (data.my_coupon != '' && data.my_coupon != null) {
          this.setData({
            my_coupon_sl: data.my_coupon.length
          })
        } else {
          this.setData({
            my_coupon_sl: 0
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
  //跳转选择优惠券
  xuanyhjq:function(){
    this.data.backData = 0 ;
    wx.navigateTo({
      url: '../../details/preferential/preferential?merchant_id='+this.data.merchant_id+'&shop_id='+this.data.shop_id
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
    var couponsData = app.coupons;
    if(couponsData.receive_id){
      this.setData({
        couponsData: couponsData,
        receive_id:couponsData.receive_id
      })
      //预订准备
      this.bookingData();
    }else{
      this.setData({
        couponsData: {},
        receive_id:""
      })
      //预订准备
      this.bookingData();
    }
    //选座数据
    var seatData = app.seatData;
    if (seatData.place_id) {
      this.data.place_id = app.seatData.place_id;
      //座位详情
      this.detailZWXQ(app.seatData.place_id);
    }else if(this.data.backData==1){
      this.return();
    }
    this.data.backData = 1 ;
  },
  //座位详情
  detailZWXQ: function (place_id) {
    let data = {
      merchant_id: this.data.merchant_id,
      shop_id: this.data.shop_id,
      place_id: place_id
    }
    app.api('/v1/place/detail', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        this.setData({
          zwxqData: data,
          bookingData: app.bookingData
        })
        //预订准备
      this.bookingData();
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