// app.js
var JAnalyticsInterface = require('./utils/janalytics-m-1.1.0.js')

App({
  canIUse: wx.canIUse('button.open-type.getUserInfo'), //wx.canIUse 判断小程序的API，回调，参数，组件等是否在当前版本可用。
  //请求域名
  site: "https://pro.yuanfang.cn",
  //登录数据
  code: "",
  encryptedData: "",
  iv: "",
  //用户数据
  userData: [],
  //基础携带信息
  systemData: {
    //纬度
    lat: "",
    //经度
    lng: "",
    //范围（单位米，不提交会自动控制在15000米，也就是15公里范围内，筛选距离或者设定显示多少范围内的时候必填）
    distance: "",
    //区县id（握手协议返回的值，限定在当前城市下的所有内容，初次握手如果没有提交，会根据经纬度自动判断，如果用户改变了城市，需要变动值，保存客户端本地）
    area_id: "",
    //城市id（握手协议返回的值，限定在当前城市下的所有内容，初次握手如果没有提交，会根据经纬度自动判断，如果用户改变了城市，需要变动值，保存客户端本地）
    city_id: "",
    //省份id（握手协议返回的值，限定在当前城市下的所有内容，初次握手如果没有提交，会根据经纬度自动判断，如果用户改变了城市，需要变动值，保存客户端本地）
    province_id: "",
    //会话id，相当于设备id，保存客户端本地，特定接口会判断是否是这台设备提交的请求
    session_id: "",
    //WEAPP（小程序）
    platform: "WEAPP",
    //渠道，参数要有，可为空
    channel: "",
    //渠道ID，参数要有，可为空
    channel_id: "",
    //手机品牌
    device_brand: "",
    //手机型号
    device_type: "",
    //操作系统,全部大写,比如ios，android
    os: "",
    //操作系统版本，14.2，11
    os_version: "",
    //登录token，登录后必带
    token: wx.getStorageSync('token') != '' ? wx.getStorageSync('token') : '',
    //当前时间戳10位
    ts: "",
    //ydzjtest
    mode: "ydzjtest",
    //极光设备号
    registration_id: ""
  },
  //请求携带值
  carry: "",
  //广告数据
  advertisingData: [],
  //城市数据
  cityData: [],
  //邀请码
  invite_code: wx.getStorageSync('invite_code') != '' ? wx.getStorageSync('invite_code') : '',
  invite_id: wx.getStorageSync('invite_id') != '' ? wx.getStorageSync('invite_id') : '',
  //选座数据
  seatData: {},
  //预订信息
  bookingData: {},
  //选择的优惠券数据
  coupons: {},
  //活动用户ID
  share_id: '',

  onLaunch() {
    // wx.login({
    //   success: res => {
    //     this.code = res.code;
    //   }
    // })
    //获取到系统信息
    wx.getSystemInfo({
      success: res => {
        this.systemData.device_brand = res.brand;
        this.systemData.device_type = res.model;
        this.systemData.os = res.platform;
        this.systemData.os_version = res.system;
      }
    })
    //判断是否有上次握手缓存数据
    wx.getStorage({
      key: 'world',
      success: res => {
        if (res.data && res.data != '') {
          //this.systemData.area_id = res.data.area_id;
          this.systemData.city_id = res.data.city_id;
          //this.systemData.province_id = res.data.province_id;
          this.systemData.session_id = res.data.session_id;
        }
      }
    })
  },
  //调用初始化(极光 SDK初始化)
  initJG: function (callback) {
    JAnalyticsInterface.init(this)
    JAnalyticsInterface.obtainID((e) => {
      try {
        callback(true)
        this.systemData.registration_id = e;
      } catch (err) {
        callback(true)
        console.error(err);
      }
    })
  },
  //测试期间使用
  CHSHI: function (CS) {
    //握手协议
    this.handshake((y) => {
      if (y) {
        CS(true)
      }
    });
  },
  //判断用户是否登录或者没绑定手机号
  userCredentials() {
    if (this.systemData.token == '') {
      return 1
    } else if (this.userData.phone == '') {
      return 2
    } else {
      return 0
    }
  },
  // 获得授权code
  loginData: function (callback) {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.encryptedData = res.encryptedData;
        this.iv = res.iv;
        wx.login({
          success: res => {
            this.code = res.code;
            this.login((i) => {
              if (i == 0) {
                callback(true)
              } else if (i == 15014) {
                callback(false)
              }
            })
          }
        })
      }
    })
  },
  //登录
  login: function (callback) {
    let data = {
      code: this.code,
      encrypted_data: this.encryptedData,
      iv: this.iv
    }
    this.api('/v1/auth/login', 'POST', false, data, (res, data) => {
      if (res.code == 0) {
        this.userData = data;
        this.systemData.token = data.auth_key;
        wx.setStorageSync('token', data.auth_key);
        callback(0)
      } else if (res.code == 15014) {
        this.userData = data;
        callback(15014)
      } else {
        callback(100)
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: "error",
        })
      }
    })
  },
  //判断用户是否授权授权
  authorization: function (scopeData, callback) {
    wx.getSetting({
      success(res) {
        if (res.authSetting[scopeData]) {
          callback(true)
        } else {
          callback(false)
        }
      }
    })
  },
  //拉起授权
  authorizeData: function (scopeData, callback) {
    wx.authorize({
      scope: scopeData,
      success() {
        callback(true)
      },
      fail() {
        callback(false)
      }
    })
  },
  //获取经纬度坐标
  Location: function (callback) {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.systemData.lat = res.latitude;
        this.systemData.lng = res.longitude;
        callback(true)
      },
      fail() {
        callback(false)
      }
    })
  },
  //得到全部的广告使用图片
  advertising: function (callback) {
    this.api('/v1/ad/list', 'GET', false, '', (res, data) => {
      if (res.code == 0) {
        this.advertisingData = data;
        callback(res.code, data);
      } else {
        callback(res.code, data);
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //切换城市
  cityChange: function (id) {
    //城市ID
    this.systemData.city_id = id;
  },
  //城市位置检测
  cityLocation: function (callback) {
    this.api('/v1/city/check', 'GET', false, '', (res, data) => {
      if (res.code == 0) {
        this.cityData = data;
        callback(res, data);
      } else {
        this.cityData = [];
        callback(res, data);
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //设置分享参数
  shareData(callback) {
    var code = '';
    if (this.systemData.token != '' && this.userData.phone != '') {
      code = this.userData.invite_code ? this.userData.invite_code : '';
    } else {
      code = this.invite_code;
    }
    var data = {
      title: '参与就送100元无门槛消费卷，拆惊喜红包赢免单奖励',
      path: 'pages/login/login?code=' + code + '&activity=1' + '&share_id=' + this.share_id
    }
    callback(data)
  },
  //安装上报
  reportInvitation: function () {
    let data = {
      //邀请码
      invite_code: this.invite_code
    };
    this.api('/v1/invite/report', 'POST', false, data, (res, data) => {
      if (res.code == 0) {
        this.invite_id = data.id;
        wx.setStorageSync('invite_id', data.id);
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },

  //获得接口地址主地址
  getSite(){
    return this.site;
  },
  //得到当前时间转换为时间戳
  parseData: function () {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.systemData.ts = timestamp;
  },
  //数字签名
  signature(url, formData) {
    var data = this.systemData;
    if (formData != '' && formData) {
      for (let i in formData) {
        data[i] = formData[i]
      }
    }
    var e = "";
    for (let i in data) {
      e = e + "&" + i + '=' + data[i]
    }
    e = e.substr(1);
    e = url + '?' + e + '&key=ttxs-ddhi-app';
    //console.log("签名前："+e)
    const md5 = require('./utils/md5.js');
    let md5Data = md5.hexMD5(e);
    this.systemData.sn = md5Data;
  },
  //握手协议
  handshake: function (callback) {
    //判断有没有设备号
    if (this.systemData.registration_id == '') {
      this.systemData.registration_id = wx.getStorageSync("JG_REGISTRATIONID")
    }
    //得到当前时间戳
    this.parseData();
    //数字签名
    this.signature('/v1/init/handshake', '');
    wx.request({
      url: this.site + '/v1/init/handshake',
      timeout: 20000,
      method: "GET",
      data: this.systemData,
      success: res => {
        if (res.data.code == 0) {
          //this.systemData.area_id = res.data.data.area_id;
          this.systemData.city_id = res.data.data.city_id;
          //this.systemData.province_id = res.data.data.province_id;
          this.systemData.session_id = res.data.data.session_id;
          wx.setStorage({
            key: "world",
            data: res.data.data
          })
          callback(true);
        } else {
          callback(false);
          wx.showToast({
            title: res.data.message || '服务器错误',
            icon: 'error',
          })
        }
      },
      fail: res => {
        console.log('接口请求失败！' + res)
      }
    })
  },
  //api统一请求方法
  api: function (url, method, user, formData, callback) {
    //判断有没有设备号
    if (this.systemData.registration_id == '') {
      this.systemData.registration_id = wx.getStorageSync("JG_REGISTRATIONID")
    }
    //接口调用都经过token凭证和user判断
    if (!this.systemData.token && user) {
      wx.showToast({
        title: '未登录！',
        icon: "error",
        duration: 3000
      })
      return
    }
    //得到当前时间戳
    this.parseData();
    if (url == '/v1/shop/list') {
      //显示 loading 提示框
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
    }
    //数字签名
    this.signature(url, formData);
    this.carry = "?lat=" + this.systemData.lat + "&lng=" + this.systemData.lng + "&distance=" + this.systemData.distance + "&area_id=" + this.systemData.area_id + "&city_id=" + this.systemData.city_id + "&province_id=" + this.systemData.province_id + "&session_id=" + this.systemData.session_id + "&platform=" + this.systemData.platform + "&channel=" + this.systemData.channel + "&channel_id=" + this.systemData.channel_id + "&device_brand=" + this.systemData.device_brand + "&device_type=" + this.systemData.device_type + "&os=" + this.systemData.os + "&os_version=" + this.systemData.os_version + "&token=" + this.systemData.token + "&ts=" + this.systemData.ts + "&sn=" + this.systemData.sn + "&mode=" + this.systemData.mode + "&registration_id=" + this.systemData.registration_id
    var parameter = "";
    var data = {};
    if (method == 'GET' || method == 'get') {
      parameter = this.carry;
      data = formData;
    } else if (method == 'POST' || method == 'post') {
      data = this.systemData;
      if (formData != '' && formData) {
        for (let i in formData) {
          data[i] = formData[i]
        }
      }
    }
    //发起网络请求
    wx.request({
      url: this.site + url + parameter,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      timeout: 20000,
      data: data,
      method: method ? method : 'GET',
      //接口调用成功
      success: (res) => {
        //隐藏 loading 提示框
        wx.hideLoading();
        callback(res.data, res.data.data ? res.data.data : [], res.header);
        //更新token
        if (res.header['Access-Token']) {
          this.systemData.token = res.header['Access-Token'];
        }
      },
      fail: function () {
        //隐藏 loading 提示框
        wx.hideLoading();
        //显示消息提示框
        wx.showToast({
          title: '服务器繁忙',
          icon: 'error',
        })
      }
    })
  },
})