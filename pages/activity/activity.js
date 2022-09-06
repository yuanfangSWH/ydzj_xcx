// pages/activity/activity.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPageScroll: true,
    colorData: '#0A0A0A',
    //进入方式
    card: 0,
    //动画
    animationData: {},
    //遮罩层
    cover: false,
    //活动规则弹框
    hdgztk: false,
    //活动步骤弹框
    steps1: false,
    tirnr: '',
    //我邀请的人弹框
    invitationtk: false,
    //轮播信息
    lunbxxi: {},
    phbData: [],
    tonData: [],
    hdxlData: [],
    huodx: {
      invite_user: []
    },
    invite_user: [],
    wdyqData: [],
    hbRecordList: {
      register_num: null,
      app_register_num: null,
      red_packet_log: []
    },
    //是1否0 注册登录过APP
    app_used: 0,
    //活动日期
    start_time: '',
    end_time: '',
    //定时器ID
    timer1: '',
    timer2: '',
    //是否是分享进入
    share: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation;
    //判断是否是分享进入
    if (app.share_id != '') {
      this.setData({
        share: true
      });
    }
    //是否是红包页进入的
    if (options.card) {
      this.data.card = options.card;
    }
    //活动信息
    this.hdxingF();
    this.setData({
      app_used: app.userData.extend ? app.userData.extend.app_used : 0
    });
    if (this.data.app_used == 1) {
      //我的统计
      this.wdtjF();
    }
    setTimeout(this.zjlbf, 1000);
    //T10
    this.phbF();
    // 我的邀请
    this.wdyqF();
    //红包记录
    this.getHbRecordList();
  },
  //活动步骤
  hdbzF(e) {
    this.setData({
      cover: !this.data.cover,
      steps1: !this.data.steps1
    });
  },
  //提示下载
  TSXZ: function () {
    wx.showToast({
      title: '打开手机应用市场搜索探电APP，下载至手机安装注册即可助力好友成功~',
      icon: "none",
      duration: 5000
    })
  },
  //关优惠券领取弹框
  guangyhq: function () {
    app.api('/v1/activity/box/closelayer', 'POST', true, '', (res, data) => {
      if (res.code == 0) {} else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //我的邀请
  wdyqF: function () {
    app.api('/v1/activity/box/myinvite', 'GET', true, {
      page: 1,
      page_size: 10000
    }, (res, data) => {
      if (res.code == 0) {
        var dataEX = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i]) {
            dataEX.push(data[i])
          } else {
            break;
          }
        }
        this.setData({
          wdyqData: dataEX,
          // cover: !this.data.cover,
          // invitationtk: !this.data.invitationtk
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //我的红包记录
  getHbRecordList() {
    app.api('/v1/activity/box/myaward', 'GET', true, '', (res, data) => {
      console.info(data);
      if (res.code == 0) {
        var dataEX = {
          register_num: data.register_num,
          app_register_num: data.app_register_num,
          red_packet_log: []
        };
        if (data.red_packet_log) {
          for (let i = 0; i < data.red_packet_log.length; i++) {
            if (data.red_packet_log[i]) {
              dataEX.red_packet_log.push(data.red_packet_log[i])
            } else {
              break;
            }
          }
        }
        this.setData({
          hbRecordList: dataEX,
          // cover: !this.data.cover,
          // invitationtk: !this.data.invitationtk
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //领取100代金券
  linq100: function () {
    if (!this.data.huodx.invite_user || (this.data.huodx.invite_user && this.data.huodx.invite_user.length < 3)) {
      wx.showToast({
        title: '请完成任务到APP领取',
        icon: 'none',
      })
    } else if (this.data.huodx.invite_user && this.data.huodx.invite_user.length >= 3) {
      wx.showToast({
        title: '请到APP领取',
        icon: 'none',
      })
    }
    // app.api('/v1/activity/box/receive', 'POST', true, '', (res, data) => {
    //   if (res.code == 0) {
    //     this.setData({
    //       tirnr: data.msg,
    //       cover: true,
    //       steps1: true
    //     });
    //   } else {
    //     wx.showToast({
    //       title: res.msg || '服务器异常',
    //       icon: 'error',
    //     })
    //   }
    // })
  },
  //活动信息
  hdxingF: function () {
    let data = '';
    if (app.share_id != '') {
      data = {
        share_id: app.share_id
      }
    }
    app.api('/v1/activity/box/index', 'GET', false, data, (res, data) => {
      if (res.code == 0) {
        console.log("我的:" + app.userData.invite_code )
        console.log("分享:" + app.invite_code)
        if (app.userData.invite_code == app.invite_code) {
          this.setData({
            share: false
          });
        } else {
          app.share_id = data.share_id;
        }
        this.setData({
          hdxlData: data.activity,
          huodx: data
        });
        if (data.invite_user) {
          this.setData({
            invite_user: data.invite_user
          });
        }
        var a = this.data.hdxlData.start_time.split('-');
        var b = this.data.hdxlData.end_time.split('-');
        var a1 = [];
        var a2 = [];
        var a3 = '';
        var b1 = [];
        var b2 = [];
        var b3 = '';
        if (a[1].indexOf("0") != -1) {
          a1 = a[1].split('0');
        } else {
          a1[1] = a[1];
        }
        if (a[2].indexOf("0") != -1) {
          a2 = a[2].split('0');
          a3 = a2[1];
          if (a3 == '' || a3 == 0) {
            a3 = a2[0] + '0'
          }
        } else {
          a2[1] = a[2];
        }
        if (b[1].indexOf("0") != -1) {
          b1 = b[1].split('0');
        } else {
          b1[1] = b[1];
        }
        if (b[2].indexOf("0") != -1) {
          b2 = b[2].split('0');
          b3 = b2[1];
          if (b3 == '' || b3 == 0) {
            b3 = b2[0] + '0'
          }
        } else {
          b2[1] = b[2];
        }
        this.setData({
          start_time: a1[1] + '月' + a3 + '日',
          end_time: b1[1] + '月' + b3 + '日'
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //中奖轮播动画
  zjlbdh: function () {
    this.animation.opacity(0).step()
    this.setData({
      animationData: this.animation.export()
    })
    this.data.timer2 = setTimeout(this.zjlbf, 3000);
  },
  //中奖轮播
  zjlbf: function () {
    app.api('/v1/activity/box/showaward', 'GET', true, '', (res, data) => {
      if (res.code == 0) {
        this.setData({
          lunbxxi: data
        });
        this.animation.opacity(1).step()
        this.setData({
          animationData: this.animation.export()
        })
        this.data.timer1 = setTimeout(this.zjlbdh, 3000);
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //排行榜 T10
  phbF: function () {
    app.api('/v1/activity/box/top', 'GET', true, '', (res, data) => {
      if (res.code == 0) {
        // console.log('kkk',data)
        this.setData({
          phbData: data ? data : []
        });
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },

  //我的统计
  wdtjF: function () {
    app.api('/v1/activity/box/my', 'GET', true, '', (res, data) => {
      if (res.code == 0) {
        this.setData({
          tonData: data
        });
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //打开/关闭活动规则弹框
  huodtkF: function () {
    this.setData({
      cover: !this.data.cover,
      hdgztk: !this.data.hdgztk
    })
  },
  //打开/关闭邀请人弹框
  yaoqrtkF: function () {
    this.setData({
      cover: !this.data.cover,
      invitationtk: !this.data.invitationtk
    })
  },
  listTZ() {
    this.data.cityChange = true;
    wx.navigateTo({
      url: '../activity/list/list'
    })
  },
  return () {
    app.share_id = '';
    if (this.data.card == 1) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  showPopup() {
    //this.wdyqF();
    this.yaoqrtkF();
    this.isPageScroll = false;
    this.popup.showPopup();
  },
  showPopup_guize() {
    this.huodtkF();
    this.isPageScroll = false;
    this.popup_guize.showPopup();
  },
  showPopup_hb() {
    this.isPageScroll = false;
    this.setData({
      cover: !this.data.cover
    });
    this.popup_hb.showPopup();
  },
  //取消事件
  _error() {
    this.yaoqrtkF();
    this.isPageScroll = true;
    console.log('你点击了取消');
    this.popup.hidePopup();
  },
  _error_guize() {
    console.log('你点击了取消');
    this.huodtkF();
    this.isPageScroll = true;
    this.popup_guize.hidePopup();
  },
  _error_hb() {
    console.log('你点击了取消');
    this.isPageScroll = true;
    this.setData({
      cover: !this.data.cover
    });
    this.popup_hb.hidePopup();
  },
  //确认事件
  _success() {
    this.yaoqrtkF();
    console.log('你点击了确定');
    this.isPageScroll = true;
    this.popup.hidePopup();
  },
  _success_guize() {
    console.log('你点击了确定');
    this.huodtkF();
    this.isPageScroll = true;
    this.popup_guize.hidePopup();
  },
  _success_hb() {
    console.log('你点击了确定');
    this.isPageScroll = true;
    this.setData({
      cover: !this.data.cover
    });
    this.popup_hb.hidePopup();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popup = this.selectComponent("#popup");
    this.popup_guize = this.selectComponent("#popup_guize");
    this.popup_hb = this.selectComponent("#popup_hb");
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
    //清理掉定时器
    clearTimeout(this.data.timer1);
    clearTimeout(this.data.timer2);
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