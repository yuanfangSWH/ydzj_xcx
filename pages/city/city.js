// pages/city/city.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //位置
    locationData: "定位中...",
    city_id:'',
    //热门城市
    hotData: [],
    //城市列表
    cityData: [],
    //城市列表备份
    cityBF: [],
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cityLoading();
    setTimeout(()=>{this.cityLocation()},1000);
  },
  //城市位置检测
  cityLocation:function(){
    app.api('/v1/city/check', 'GET', false, '', (res, data) => {
      if (res.code == 0) {
        this.setData({
          city_id: data.city_id,
          locationData:data.city
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //加载城市数据
  cityLoading() {
    app.api('/v1/city/list', 'GET', false, '', (res,data) => {
      if (res.code == 0) {
        this.setData({
          hotData: data.hot,
          cityData: data.list,
          cityBF: data.list
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    })
  },
  //跳转对应位置
  jumpWZ(e) {
    var value = e.currentTarget.dataset.value;
    value = '#city' + value
    wx.pageScrollTo({
      duration: 300,
      selector: value
    })
  },
  //选择城市
  xuanzeCS(e) {
    var id = e.currentTarget.dataset.value;
    if(id!=''){
      app.cityChange(id);
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //搜索算法
  inputSearch(e) {
    this.setData({
      cityData: []
    })
    var group = [];
    var group2 = [];
    var value = e.detail.value;
    var regex1 = /^[\u4e00-\u9fa5]*$/
    var regex2 = /^[a-zA-Z]$/
    var add = false;
    if (!value.search(regex1) && value != '') {
      this.data.cityBF.forEach(i => {
        i.city.forEach(e => {
          if (e.name.indexOf(value) != -1) {
            group.push(e);
            add = true;
          }
        });
        if (add) {
          group2.push({
            "first": i.first,
            "city": group
          });
          this.setData({
            cityData: group2
          })
          add = false;
          group = [];
        }
      });
    } else if (!value.search(regex2) && value != '') {
      this.data.cityBF.forEach(i => {
        i.city.forEach(e => {
          if (e.letter.indexOf(value.toUpperCase()) != -1) {
            group.push(e);
            add = true;
          }
        });
        if (add) {
          group2.push({
            "first": i.first,
            "city": group
          });
          this.setData({
            cityData: group2
          })
          add = false;
          group = [];
        }
      });
    } else {
      this.setData({
        cityData: this.data.cityBF
      })
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