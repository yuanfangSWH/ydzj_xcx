// pages/my/shopApply/index.js
const app = getApp();
Page({
  showShopType(e) {
    this.setData({
      isShowShopType: true
    });
    //this.isShowShopType=true;
    // wx.showActionSheet({
    //   itemList: ['A', 'B', 'C','d','e','f','g','h','i','j'],
    //   success (res) {
    //     console.log(res.tapIndex)
    //   },
    //   fail (res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },

  /**
   * 用户点击选择区域，将选择区域组件开关打开。
   * @param {*} e 
   */
  showRegion(e){
    this.setData({isShowRegion:true});
  },


  /**
   * 关闭选择区域组件显示
   * @param {*} e 
   */
  actionSheetClose(e) {
    this.setData({isShowShopType:false});
    //this.data.isShowShopType = false;
    console.log(this.data.isShowShopType)
  },

  /**
   * 组件内点击关闭
   * @param {*} e 
   */
  regionClose(e) {
    //this.data.isShowRegion = false;
    this.setData({isShowRegion:false});
  },

  /**
   * 选择了商家类型
   * @param {*} v 
   */
  selectedTheShopType(v) {
    var sInfo = Object.assign({}, this.data.shopInfo);
    var result = v.detail
    sInfo['type_name'] = result.itemName;
    sInfo['type_id'] = result.itemValue;
    this.setData({
      shopInfo: sInfo
    })
  },

  /**
   * 选择了商家所在区域
   * @param {*} v 
   */
  selectedTheRegion(v) {
    let tShopInfo=Object.assign({},this.data.shopInfo);
    tShopInfo.pid=v.detail.province_id;
    tShopInfo.cid=v.detail.city_id;
    tShopInfo.aid=v.detail.area_id;
    this.setData({
      shopInfo:tShopInfo,
      regionName:v.detail.province_name+ ' ' + v.detail.city_name + ' ' + v.detail.area_name
    })
  },
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },


  /**
   * 加载商家类型
   */
  loadShopType() {
    app.api('/v1/shop/type', 'GET', false, '', (res, data) => {
      if (res.code == 0) {
        //console.log(data)
        let typeList = [];
        for (var i in data) {
          typeList[i] = {
            itemName: data[i]['name'],
            itemValue: data[i]['type_id']
          };
        }
        this.setData({
          shopType: typeList
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
   * 撤销勾选用户协议
   */
  uncheckThis(){
    this.setData({isCheck:false})
  },

  /**
   * 勾选用户协议
   */
  checkThis(){
    this.setData({isCheck:true})
  },

  /**
   * 跳转到到用户协议H5页面
   * @param {*} e 
   */
  showAgreement(e){
    wx.getStorage({
      key: 'world',
      success (res) {
        wx.navigateTo({
          url:'/pages/webView/webView?url='+res.data.shop_agree_url
        });
      }
    });
  },
  return () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 检查商家入驻数据，准备提交
   * @param {*} e 
   */
  submitShop(e){
    if(this.data.isCheck){
      let datas={
        name: this.data.shopName,
        type_id: this.data.shopInfo.type_id,
        type_name: this.data.shopInfo.type_name,
        address: this.data.shopAddress,
        phone: this.data.shopPhone,
        pid: this.data.shopInfo.pid,
        cid: this.data.shopInfo.cid,
        aid: this.data.shopInfo.aid
      };
      let isOk=true;
      for(let i in datas){
        if(datas[i]==undefined){
          isOk=false;
          break;
        }
      }
      if(isOk){
        this.submitShopOk(datas)
      }else{
        wx.showToast({
          title: '请填写申请表',
          icon: 'error',
          duration: 2000
        })
      }
    }else{
      wx.showToast({
        title: '请阅读并同意协议',
        icon: 'error',
        duration: 2000
      })
    }
  },

  /**
   * 提交商家入驻数据
   * @param {*} datas 
   */
  submitShopOk(datas){
    app.api('/v1/shop/apply', 'POST', false, datas, (res, data) => {
      if (res.code == 0) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
        })
        this.setData({
          shopName:'',
          shopPhone:'',
          shopAddress:'',
          isCheck:false
        })
      } else {
        wx.showToast({
          title: res.msg || '服务器异常',
          icon: 'error',
        })
      }
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    colorData:'#0A0A0A',
    shopInfo: {
      name: '',
      type_id: null,
      type_name: '',
      address: '',
      phone: '',
      pid: null,
      cid: null,
      aid: null
    },
    shopName:'',
    shopPhone:'',
    shopAddress:'',
    regionName:'',
    isShowShopType: false,
    isShowRegion: false,

    
    shopTypeIndex: 0,
    shopType: [],
    shopTypeName: ['a', 'b', 'c'],
    isCheck:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadShopType()
    this.selectComponent('#RegionSelectBox').getProvince('00000')
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