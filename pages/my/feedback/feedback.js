var uploadImage = require('../../../js/uploadImg/uploadImg.js');
const app = getApp();
Page({
  getRandom(min,max){
    return parseInt(Math.random()*(max-min+1)+min,10)
  },
  uploadImg(){
    var imgList=this.data.imageList;
    var self=this;
    app.api('/v1/file/sts', 'GET', false, '', (res, data) => {
      var dateObject=new Date();
      let config={
        uploadImageUrl:'https://ddhitest.oss-cn-hangzhou.aliyuncs.com/',
        OSSAccessKeyId:data.Credentials.AccessKeyId,
        AccessKeySecret:data.Credentials.AccessKeySecret,
        securityToken:data.Credentials.SecurityToken,
        timeout: 87600,
        scene:'feedback',
        fileKey:
          'feedback/'+
          dateObject.getFullYear()+'/'+
          (dateObject.getMonth()+1)+'/'+
          dateObject.getDate()+'/'+
          app.userData.user_id+'_'+
          this.getRandom(100000,666666)
      };
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          //支持多图上传
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            //显示消息提示框
            wx.showLoading({
              title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
              mask: true
            })
  
            //上传图片
            //你的域名下的/images/当前年月日文件下的/图片.png
            //图片路径可自行修改【(这二个参数就是你oss地址目录的下一个路径目录，比如:https://xxx.com/images/xxx.png)】
            uploadImage(res.tempFilePaths[i], config,
              function (result) {
                //console.log("======上传成功图片地址为：", result);
                //这个result就是返给你上传到oss上的地址链接
                wx.hideLoading();
                imgList.push(result);
                self.setData({imageList:imgList});
              }, function (result) {
                //console.log("======上传失败======", result);
                
                wx.hideLoading()
              }
            )
          }
        }
      })
      
    });
  },
  //删除上传文件
  removeImg(obj){
    let imgs=this.data.imageList;
    imgs.splice(obj.currentTarget.dataset.index,1);
    this.setData({imageList:imgs});
  },
  //提交意见反馈
  submit(){
    if(this.data.desc){
      let postData={
        desc:this.data.desc,
        pic:this.data.imageList
      }
      app.api('/v1/feedback/submit', 'POST', false, postData, (res, data) => {
        if (res.code == 0) {
          this.setData({
            desc:'',
            imageList:[]
          });
          wx.navigateTo({
            url: '../my/preferentialwc/preferentialwc'
          })
        } else {
          wx.showToast({
            title: res.msg || '服务器异常',
            icon: 'error',
          })
        }
      });
    }else{
      wx.showToast({
        title: '请填写意见内容',
        icon: 'error',
      })
    }
  },
  return () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    colorData:'#0A0A0A',
    OSSconfig:{},
    imageList:[],
    desc:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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