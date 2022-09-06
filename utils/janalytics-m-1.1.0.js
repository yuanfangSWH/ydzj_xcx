"use strict";
var Log;

function __awaiter(e, t, n, r) {
  return new(n || (n = Promise))(function (i, o) {
    function s(e) {
      try {
        c(r.next(e))
      } catch (e) {
        o(e)
      }
    }

    function a(e) {
      try {
        c(r.throw(e))
      } catch (e) {
        o(e)
      }
    }

    function c(e) {
      e.done ? i(e.value) : new n(function (t) {
        t(e.value)
      }).then(s, a)
    }
    c((r = r.apply(e, t || [])).next())
  })
}

function __generator(e, t) {
  var n, r, i, o, s = {
    label: 0,
    sent: function () {
      if (1 & i[0]) throw i[1];
      return i[1]
    },
    trys: [],
    ops: []
  };
  return o = {
    next: a(0),
    throw: a(1),
    return: a(2)
  }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
    return this
  }), o;

  function a(o) {
    return function (a) {
      return function (o) {
        if (n) throw new TypeError("Generator is already executing.");
        for (; s;) try {
          if (n = 1, r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
          switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
            case 0:
            case 1:
              i = o;
              break;
            case 4:
              return s.label++, {
                value: o[1],
                done: !1
              };
            case 5:
              s.label++, r = o[1], o = [0];
              continue;
            case 7:
              o = s.ops.pop(), s.trys.pop();
              continue;
            default:
              if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                s = 0;
                continue
              }
              if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                s.label = o[1];
                break
              }
              if (6 === o[0] && s.label < i[1]) {
                s.label = i[1], i = o;
                break
              }
              if (i && s.label < i[2]) {
                s.label = i[2], s.ops.push(o);
                break
              }
              i[2] && s.ops.pop(), s.trys.pop();
              continue
          }
          o = t.call(e, s)
        } catch (e) {
          o = [6, e], r = 0
        } finally {
          n = i = 0
        }
        if (5 & o[0]) throw o[1];
        return {
          value: o[0] ? o[1] : void 0,
          done: !0
        }
      }([o, a])
    }
  }
}! function (e) {
  var t = !1,
    n = "[JIGUANG-JAnalytics]";
  e.setDebugMode = function (e) {
    t = e
  }, e.d = function (e, r) {
    t && console.log(n + "[" + e + "]" + r)
  }, e.w = function (e, r) {
    t && console.warn(n + "[" + e + "]" + r)
  }, e.dd = function (e, r) {

    t && console.log(n + "[" + e + "]" + r)
  }, e.ww = function (e, t) {
    console.warn(n + "[" + e + "]" + t)
  }, e.ee = function (e, t) {
    console.error(n + "[" + e + "]" + t)
  }
}(Log || (Log = {}));
var dateFormat = function (e, t) {
  var n = {
    "M+": e.getMonth() + 1,
    "d+": e.getDate(),
    "h+": e.getHours(),
    "m+": e.getMinutes(),
    "s+": e.getSeconds(),
    "q+": Math.floor((e.getMonth() + 3) / 3),
    S: e.getMilliseconds()
  };
  for (var r in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length))), n) new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? n[r] : ("00" + n[r]).substr(("" + n[r]).length)));
  return t
};

function httpReport(e) {
  return new Promise(function (t, n) {
    e.success = function (e) {
      t(e)
    }, e.fail = function (e) {
      n(e)
    }, wx.request(e)
  })
}

function uuid() {
  return S() + S() + "-" + S() + "-" + S() + "-" + S() + "-" + S() + S() + S()
}

function S() {
  return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
}
var ReportHelper, MPromise = function () {
  function e() {
    this.callbackList = [], this.errorCallList = [], this.PromiseStatus = "pending"
  }
  return e.prototype.resolve = function (e) {
    "pending" === this.PromiseStatus && (this.PromiseStatus = "resolved", this.PromiseValue = e, this.callbackList.forEach(function (t) {
      setTimeout(function () {
        t(e)
      }, 0)
    }))
  }, e.prototype.reject = function (e) {
    if ("pending" === this.PromiseStatus) return this.PromiseStatus = "rejected", this.PromiseValue = e, this.errorCallList.forEach(function (t) {
      t(e)
    }), this
  }, e.prototype.then = function (e) {
    if ("resolved" !== this.PromiseStatus) return this.callbackList.push(e), this;
    e(this.PromiseValue)
  }, e.prototype.catch = function (e) {
    if ("rejected" !== this.PromiseStatus) return this.errorCallList.push(e), this;
    e(this.PromiseValue)
  }, e.prototype.toPromise = function () {
    var e = this;
    return new Promise(function (t, n) {
      e.then(t), e.catch(n)
    })
  }, e
}();

function getNetWorkInfo() {
  return new Promise(function (e, t) {
    wx.getNetworkType({
      success: function (t) {
        e(t)
      },
      fail: function (e) {
        t(e)
      }
    })
  })
}

function isEmpty(e) {
  return !e || 0 == e.length
}

function set(e, t) {
  try {
    wx.setStorageSync("JG_" + e, t)
  } catch (e) {}
}

function get(e) {
  var t = null;
  try {
    t = wx.getStorageSync("JG_" + e)
  } catch (e) {}
  return t
}

function remove(e) {
  try {
    wx.removeStorageSync("JG_" + e)
  } catch (e) {}
}! function (e) {
  var t = "ReportHelper";

  function n(e) {
    return __awaiter(this, void 0, void 0, function () {
      var t;
      return __generator(this, function (n) {
        return (t = JAnalyticsInterface.g.sysInfo) || (t.version = ""), [2, {
          platform: "m",
          uid: JAnalyticsInterface.g.uid,
          app_key: JAnalyticsInterface.g.appkey,
          sdk_ver: "",
          channel: JAnalyticsInterface.g.channel,
          app_version: t.version,
          statistics_sdk_ver: JAnalyticsInterface.g.sdkVersion,
          from_type: JAnalyticsInterface.g.fromType,
          content: Array.isArray(e) ? e : [e]
        }]
      })
    })
  }
  e.report = function (e) {
    return __awaiter(this, void 0, void 0, function () {
      var r, i, o;
      return __generator(this, function (s) {
        switch (s.label) {
          case 0:
            return r = uuid() + Date.now(), reportFailCache.add(r, e), [4, isRegistered()];
          case 1:
            return s.sent() ? [4, getNetWorkInfo()] : (Log.dd(t, "not register,will save report cache"), [2]);
          case 2:
            return "none" == s.sent().networkType ? [2] : [4, n(e)];
          case 3:
            return i = s.sent(), JSON.stringify(i), [4, httpReport({
              url: "https://mini-stats.jpush.cn/v1/mini/report",
              header: {
                Accept: "application/jason",
                "X-App-Key": JAnalyticsInterface.g.appkey,
                "X-Jpush-UID": JAnalyticsInterface.g.uid
              },
              method: "POST",
              data: i
            }).catch(function (e) {
              JSON.stringify(e)
            })];
          case 4:
            return (o = s.sent()) && 200 == o.statusCode ? (reportFailCache.delete(r), Log.dd(t, "JAnalyticsInterface,report success.")) : o && o.statusCode && Log.ww(t, "report failed.statusCode:" + o.statusCode), [2, o]
        }
      })
    })
  }, e.batchReport = n
}(ReportHelper || (ReportHelper = {}));
var UID = "UID",
  PASSWORD = "PASSWORD",
  REGID = "REGISTRATIONID",
  LOC_LAST_REPORT = "LOC_LR",
  reportFailCache = new(function () {
    function e() {
      this.cacheload = new MPromise
    }
    return e.prototype.init = function () {
      return __awaiter(this, void 0, void 0, function () {
        var e, t, n, r, i, o;
        return __generator(this, function (s) {
          switch (s.label) {
            case 0:
              return [4, this.loadData()];
            case 1:
              if (s.sent(), e = [], !(Object.keys(this.obj).length > 0)) return [3, 3];
              for (t in this.obj)
                if (n = this.obj[t], Array.isArray(n))
                  for (r = 0, i = n; r < i.length; r++) o = i[r], e.push(o);
                else e.push(n);
              return e.length > 0 ? [4, ReportHelper.report(e)] : [3, 3];
            case 2:
              s.sent(), s.label = 3;
            case 3:
              return this.obj = {}, [4, this.sync()];
            case 4:
              return s.sent(), this.cacheload.resolve(this), [2]
          }
        })
      })
    }, e.prototype.loadData = function () {
      return __awaiter(this, void 0, void 0, function () {
        var e;
        return __generator(this, function (t) {
          return e = get("FAILCACHE"), this.obj = e ? JSON.parse(e) : {}, [2]
        })
      })
    }, e.prototype.reportCache = function () {
      if (this.obj) {
        var e = this.obj;
        this.obj = {}, this.sync(), JSON.stringify(e);
        var t = [];
        if (Object.keys(e).length > 0) {
          for (var n in e) {
            var r = e[n];
            if (Array.isArray(r))
              for (var i = 0, o = r; i < o.length; i++) {
                var s = o[i];
                t.push(s)
              } else t.push(r)
          }
          t.length > 0 && ReportHelper.report(t)
        }
      }
    }, e.prototype.add = function (e, t) {
      this.cacheload.then(function (n) {
        n.addInternal(e, t)
      })
    }, e.prototype.addInternal = function (e, t) {
      this.obj[e] = t, this.sync()
    }, e.prototype.delete = function (e) {
      this.cacheload.then(function (t) {
        t.deleteInternal(e)
      })
    }, e.prototype.deleteInternal = function (e) {
      delete this.obj[e], this.sync()
    }, e.prototype.sync = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (e) {
          return set("FAILCACHE", JSON.stringify(this.obj)), [2]
        })
      })
    }, e
  }()),
  reportQueueCache = new(function () {
    function e(e) {
      this.time = e, this.quene = [], this.autoReport()
    }
    return e.prototype.reportLast = function () {
      return __awaiter(this, void 0, void 0, function () {
        var e, t;
        return __generator(this, function (n) {
          if (null == this.time) return [2];
          if (e = get("QUEUECACHE")) {
            if (0 === (t = JSON.parse(e)).length) return [2];
            ReportHelper.report(t), this.sync()
          }
          return [2]
        })
      })
    }, e.prototype.add = function (e) {
      null != this.time ? (this.quene.push(e), this.sync()) : ReportHelper.report(e)
    }, e.prototype.autoReport = function () {
      var e = this;
      null != this.time && (this.timer = setInterval(function () {
        0 !== e.quene.length && (ReportHelper.report(e.quene), e.quene = [], e.sync())
      }, 1e3 * this.time))
    }, e.prototype.sync = function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (e) {
          return [2, set("QUEUECACHE", JSON.stringify(this.quene))]
        })
      })
    }, e
  }())(null),
  TAG$2 = "RegisterHelper",
  isConnecting = !1;

function register() {
  return __awaiter(this, void 0, void 0, function () {
    var e, t, n, r, i;
    return __generator(this, function (o) {
      switch (o.label) {
        case 0:
          return isConnecting ? [2] : (isConnecting = !0, [4, getNetWorkInfo()]);
        case 1:
          return "none" == o.sent().networkType ? (isConnecting = !1, Log.dd(TAG$2, "register failed,no network"), [2]) : (e = JAnalyticsInterface.g.sysInfo) ? (t = {
            ver: 16,
            platform: 4,
            appkey: JAnalyticsInterface.g.appkey,
            strApkVersion: e.version,
            systemversion: e.system,
            modelnumber: e.model,
            basebandversion: e.brand,
            channel: JAnalyticsInterface.g.channel,
            StatisticSDKVer: JAnalyticsInterface.g.sdkVersion,
            installation: 0,
            resolution: e.screenWidth + "*" + e.screenHeight,
            DeviceId: JAnalyticsInterface.g.deviceid,
            business: 4,
            from_type: JAnalyticsInterface.g.fromType,
            third_appid: JAnalyticsInterface.g.appid
          }, n = JSON.stringify(t), [4, (s = {
            url: "https://user.jpush.cn/v1/register",
            header: {
              "X-Jpush-AuthType": "miniprogram"
            },
            method: "POST",
            data: n
          }, httpReport(s).then(function (e) {
            if (JSON.stringify(e), 200 === e.statusCode) return e.data;
            throw new Error(e)
          })).catch(function (e) {
            JSON.stringify(e)
          })]) : [2];
        case 2:
          return (r = o.sent()) ? 0 == (i = r).code && i.uid && i.password && i.RegistrationID ? (Log.dd(TAG$2, "register success,registerId:" + r.RegistrationID), set(UID, i.uid), set(PASSWORD, i.password), set(REGID, i.RegistrationID), reportFailCache.reportCache()) : Log.ee(TAG$2, "Register Failed with server error - code:" + i.code) : Log.ww(TAG$2, "Register Failed:no reponse"), isConnecting = !1, [2, r]
      }
      var s
    })
  })
}

function isRegistered() {
  return __awaiter(this, void 0, void 0, function () {
    var e;
    return __generator(this, function (t) {
      return JAnalyticsInterface.g.uid > 0 ? [2, !0] : (e = get(UID)) ? (get(PASSWORD), get(REGID), JAnalyticsInterface.g.uid = e, JAnalyticsInterface.g.password = get(PASSWORD), [2, !0]) : [2, !1]
    })
  })
}
var TAG$3 = "EHelper",
  EVENTS = new Map([
    ["custom_counting", {
      event_id: "10"
    }],
    ["custom_calculate", {
      event_id: "10",
      event_value: "111"
    }],
    ["custom_register", {
      register_method: "10",
      register_success: "12"
    }],
    ["custom_login", {
      login_method: "10",
      login_success: "12"
    }],
    ["custom_browse", {
      browse_content_id: "00",
      browse_name: "10",
      browse_type: "00",
      browse_duration: "011"
    }],
    ["custom_purchase", {
      purchase_goods_id: "00",
      purchase_goods_name: "00",
      purchase_price: "111",
      purchase_success: "12",
      purchase_currency: "00",
      purchase_goods_type: "00",
      purchase_quantity: "010"
    }]
  ]);

function onEvent(e) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (t) {
      return Log.dd(TAG$3, "onEvent"),
        function (e) {
          if (!e) return logEmpty("event"), !1;
          var t = e.type;
          if (!t) return logEmpty("event type"), !1;
          var n = e.attributes;
          if (!n) return logEmpty("event attributes"), !1;
          var r = EVENTS.get(t);
          if (!r) return Log.ee(TAG$3, "Can't find the type :" + t), !1;
          for (var i in r)
            if (1 == r[i].match(/./g)[0]) {
              var o = n[i];
              if (null == o) return logInvalid(i + " must be not null"), !1;
              if (validParams(0, o) && ("" == o || new RegExp("^[ ]+$").test(o))) return logInvalid(i + " must be not null"), !1
            } var s = 0;
          for (var i in n) {
            var o = n[i];
            if (byteCount(i) > 256 || byteCount(o + "") > 256) return logInvalid("key/value size must be less than 256 bytes"), !1;
            if (i in r) {
              var a = r[i].match(/./g)[1];
              if (!validParams(a, o)) return logInvalid("the " + i + " value type must be " + TYPES[a]), !1;
              if (1 == a) {
                if (0 == r[i].match(/./g)[2]) {
                  if (o % 1 != 0) return logInvalid("the " + i + " value must be integer"), !1;
                  if (!validIntegerRange(o)) return logInvalid("the " + i + " value exceed limits"), !1
                }
                if (o == 1 / 0) return logInvalid("the " + i + " value exceed limits"), !1
              }
              if ("custom_purchase" == t && "purchase_currency" == i && "CNY" != o && "USD" != o) return logInvalid("the " + i + " value must be CNY or USD"), !1
            } else s++
          }
          if (s > 10) return Log.ee(TAG$3, "This event will not record, since you have more than 10 pairs of custom key/value"), !1;
          return !0
        }(e) ? (Log.dd(TAG$3, "Report event :" + JSON.stringify(e)), reportQueueCache.add(function (e) {
          var t = {
            type: e.type,
            itime: parseInt((new Date).getTime() / 1e3 + ""),
            attributes: {}
          };
          for (var n in e.attributes) t.attributes[n] = e.attributes[n];
          return t
        }(e)), [2]) : [2]
    })
  })
}

function logEmpty(e) {
  Log.ee(TAG$3, e + " cannot be empty")
}

function logInvalid(e) {
  Log.ee(TAG$3, "Parameter invalid," + e)
}

function byteCount(e) {
  return encodeURI(e).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1
}
var TYPES = ["string", "number", "boolean"];

function validParams(e, t) {
  return typeof t === TYPES[e]
}

function validIntegerRange(e) {
  return !(e + 0x8000000000000000 <= 0 || e - 0x8000000000000000 >= 0)
}
var LocInfoHelper, SaHelper = function () {
    function e() {
      this.SA = {
        interval: 3e4,
        latestResumeTime: 0,
        latestPauseTime: 0,
        firstResume: !0,
        sessionId: "",
        theadPool: new MPromise
      }
    }
    return e.prototype.onResume = function () {
      this.SA.latestResumeTime = Date.now(), this.sendLog()
    }, e.prototype.onPause = function () {
      this.SA.latestPauseTime = Date.now(), this.saveLog()
    }, e.prototype.sendLog = function () {
      return __awaiter(this, void 0, void 0, function () {
        var e, t, n;
        return __generator(this, function (r) {
          switch (r.label) {
            case 0:
              return [4, this.isNewSession()];
            case 1:
              return 1 != r.sent() ? [3, 3] : [4, this.createNewSession()];
            case 2:
              return e = r.sent(), t = get("SA_CACHE"), JSON.stringify(e), t && ((n = JSON.parse(t)).itime = parseInt((new Date).getTime() / 1e3 + ""), n.type = "active_terminate", remove("SA_CACHE"), JSON.stringify(n), reportQueueCache.add(n)), reportQueueCache.add(e), [3, 4];
            case 3:
              this.SA.sessionId = get("SA_SID"), this.SA.sessionId, r.label = 4;
            case 4:
              return [2]
          }
        })
      })
    }, e.prototype.saveLog = function () {
      return __awaiter(this, void 0, void 0, function () {
        var e, t, n, r, i, o;
        return __generator(this, function (s) {
          return set("SA_LP", this.SA.latestPauseTime), e = get("SA_CACHE"), t = {
            session_id: "",
            time: "",
            date: "",
            itime: 0,
            duration: 0
          }, e && (t = JSON.parse(e)), n = get("SA_SST"), r = parseInt(n), i = (this.SA.latestPauseTime - r) / 1e3, t.duration = Math.floor(i), o = new Date(this.SA.latestPauseTime), t.itime = parseInt(o.getTime() / 1e3 + ""), t.session_id = this.SA.sessionId, t.time = dateFormat(o, "hh:mm:ss"), t.date = dateFormat(o, "yyyy-MM-dd"), JSON.stringify(t), set("SA_CACHE", JSON.stringify(t)), [2]
        })
      })
    }, e.prototype.createNewSession = function () {
      return __awaiter(this, void 0, void 0, function () {
        var e;
        return __generator(this, function (t) {
          return set("SA_SST", this.SA.latestResumeTime), this.SA.sessionId = JAnalyticsInterface.g.appkey + this.SA.latestResumeTime, set("SA_SID", this.SA.sessionId), e = new Date, [2, {
            session_id: this.SA.sessionId,
            time: dateFormat(e, "hh:mm:ss"),
            type: "active_launch",
            date: dateFormat(e, "yyyy-MM-dd"),
            itime: parseInt(e.getTime() / 1e3 + "")
          }]
        })
      })
    }, e.prototype.isNewSession = function () {
      return __awaiter(this, void 0, void 0, function () {
        var e, t;
        return __generator(this, function (n) {
          return e = !0, 1 == this.SA.firstResume ? (this.SA.firstResume = !1, (t = get("SA_LP")) > 0 && this.SA.latestResumeTime - t <= this.SA.interval && (e = !1)) : this.SA.latestResumeTime - this.SA.latestPauseTime <= this.SA.interval && (e = !1), [2, e]
        })
      })
    }, e
  }(),
  TAG$5 = "LocInfoHelper";
! function (e) {
  function t(e) {
    !1 === JAnalyticsInterface.g.wifi && "ios" == JAnalyticsInterface.g.sysInfo.platform ? (JAnalyticsInterface.g.sysInfo.platform, n(e, null)) : new Promise(function (e, t) {
      wx.onGetWifiList(function (t) {
        e(t)
      }), wx.startWifi({
        success: function (e) {
          wx.getWifiList({
            fail: function (e) {
              t(e)
            }
          })
        }
      }), setTimeout(function () {
        t()
      }, 1e4)
    }).then(function (t) {
      n(e, t.wifiList)
    }).catch(function (t) {
      n(e, null)
    })
  }

  function n(e, t) {
    return __awaiter(this, void 0, void 0, function () {
      var n, r, i, o, s;
      return __generator(this, function (a) {
        switch (a.label) {
          case 0:
            return JSON.stringify(e), JSON.stringify(t), [4, getNetWorkInfo()];
          case 1:
            if (n = a.sent(), r = {
                network_type: n.networkType,
                type: "loc_info",
                itime: parseInt((new Date).getTime() / 1e3 + ""),
                gps: [],
                wifi: []
              }, e && (r.gps = [e]), i = [], t)
              for (o in t) {
                if (i.length >= 10) break;
                s = {
                  itime: parseInt(Date.now() / 1e3 + ""),
                  mac_address: t[o].BSSID,
                  ssid: t[o].SSID,
                  age: 0,
                  tag: "",
                  signal_strength: t[o].signalStrength
                }, i.push(s)
              }
            return i && (r.wifi = i), Log.dd(TAG$5, "Report locInfo and netInfo"), reportQueueCache.add(r), set(LOC_LAST_REPORT, Date.now()), [2]
        }
      })
    })
  }
  e.checkLocInfo = function () {
    return __awaiter(this, void 0, void 0, function () {
      var e;
      return __generator(this, function (n) {
        return (e = get(LOC_LAST_REPORT)) && (new Date).getTime() / 1e3 - parseInt(e / 1e3 + "") < 900 ? ((new Date).getTime(), [2]) : !1 === JAnalyticsInterface.g.loc ? (t(null), [2]) : (new Promise(function (e, t) {
          wx.getLocation({
            altitude: "true",
            success: function (t) {
              e(t)
            },
            fail: function (e) {
              t(e)
            }
          })
        }).then(function (e) {
          var n;
          e && (n = {
            lat: e.latitude,
            lng: e.longitude,
            alt: e.altitude,
            acc: e.accuracy,
            itime: parseInt((new Date).getTime() / 1e3 + ""),
            tag: "gps",
            bear: -1
          }), t(n)
        }).catch(function (e) {
          t(null)
        }), [2])
      })
    })
  }
}(LocInfoHelper || (LocInfoHelper = {}));
var TAG$6 = "JAnalyticsInterface",
  JAnalyticsInterface = {
    g: {
      session: void 0,
      appkey: void 0,
      channel: "default-channel",
      sdkVersion: "1.1.0",
      uid: 0,
      password: void 0,
      deviceid: void 0,
      isInited: !1,
      fromType: void 0,
      appid: void 0,
      saPromise: new MPromise,
      loc: !0,
      wifi: !1,
      sysInfo: void 0
    },
    //返回registerId
    obtainID: function (callback) {
      register().then((e)=>{
      callback(e.RegistrationID)
      })
    },
    init: function (e) {
      var t, n = require("./janalytics-conf.js");
      if (t = n.debugMode, Log.setDebugMode(t), Log.dd(TAG$6, "setDebugMode:" + t), isEmpty(n.appid) || isEmpty(n.appKey)) Log.ee(TAG$6, "init failed,appKey or appid is empty");
      else {
        var r = JAnalyticsInterface;
        if (!r.g.isInited) {
          r.g.isInited = !0, Log.dd(TAG$6, "action:init - sdkVersion:" + r.g.sdkVersion), r.g.appkey = n.appKey, r.g.appid = n.appid, r.g.loc = n.loc, "boolean" == typeof n.wifi && (r.g.wifi = n.wifi), isEmpty(n.channel) || (r.g.channel = n.channel);
          try {
            r.g.sysInfo = wx.getSystemInfoSync()
          } catch (e) {
            Log.ww(TAG$6, "getSystemInfo failed:" + e)
          }! function (e) {
            var t = e;
            if (t.onShow) {
              var n = t.onShow;
              t.onShow = function (e) {
                JAnalyticsInterface.g.saPromise.then(function (e) {
                  e.onResume()
                });
                var r = n.apply(t, arguments);
                return r
              }
            }
            if (t.onHide) {
              var r = t.onHide;
              t.onHide = function (e) {
                JAnalyticsInterface.g.saPromise.then(function (e) {
                  e.onPause()
                });
                var n = r.apply(t, arguments);
                return n
              }
            }
          }(e);
          var i = get("APPKEY"),
            o = get("DEVICEID");
          return r.g.appkey != i && (Log.dd(TAG$6, "appkey changed,will clear cache"), remove(UID), remove("FAILCACHE")), set("APPKEY", r.g.appkey), o || (o = uuid() + Date.now()), set("DEVICEID", o), r.g.deviceid = o, r.g.fromType = wx.getLaunchOptionsSync().scene + "", isRegistered().then(function (e) {
            e ? Log.dd(TAG$6, "Already registered,registerId:" + get(REGID)) : register(), peroidTask(), setInterval(function () {
              peroidTask()
            }, 9e5), reportFailCache.init(), JAnalyticsInterface.g.saPromise.resolve(new SaHelper), wx.onNetworkStatusChange(function (e) {
              Log.dd("NetWork", "network changed to:" + e.networkType), e && "none" != e.networkType && isRegistered().then(function (e) {
                e || register()
              })
            })
          }), e && (e.JAnalyticsInterface = r), this
        }
        Log.dd(TAG$6, "need not init multi times")
      }
    },
    onEvent: function (e) {
      JAnalyticsInterface.g.appkey ? onEvent(e) : Log.ee(TAG$6, "call onEvent failed:please call init correctly first")
    }
  };

function peroidTask() {
  LocInfoHelper.checkLocInfo()
}


module.exports = JAnalyticsInterface;