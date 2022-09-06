/*
 * @Author: your name
 * @Date: 2021-03-17 16:29:11
 * @LastEditTime: 2021-03-17 16:49:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \js\uploadImg\uploadImg.js
 */
//const env = require('config.js');

const base64 = require('base64.js');
require('hmac.js');
require('sha1.js');
const Crypto = require('crypto.js');

var env = {
  //aliyun OSS config
  uploadImageUrl: '',
  AccessKeySecret: '', //登录oss控制台查看
  OSSAccessKeyId: '', //登录oss控制台查看
  securityToken:'',// 使用STS签名时必传。
  timeout: 87600,
  scene:'',//场景
  fileKey:''
};

/*
 *上传文件到阿里云oss
 *@param - filePath :图片的本地资源路径
  @param - path :上传oss哪个路径下
 *@param - config:aliyun OSS config
 *@param - successc:成功回调
 *@param - failc:失败回调
  */
const uploadFile = function (filePath, config, successc, failc) {
  if (!filePath || filePath.length < 9) {
    wx.showModal({
      title: '图片错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }
  env = config;
  //存放图片命名格式：自定义时间戳给图片名字(可以自己改)
  var extName=getFileExt(filePath);
  const aliyunFileKey = env.fileKey+'.'+extName;//path + new Date().getTime() + Math.floor(Math.random() * 150) + '.png';
  const aliyunServerURL = env.uploadImageUrl; //OSS地址，https
  const accessid = env.OSSAccessKeyId;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64);
  const securityToken=env.securityToken;

  wx.uploadFile({
    url: aliyunServerURL, //开发者服务器 url
    filePath: filePath, //要上传文件资源的路径
    name: 'file', //必须填file
    formData: {
      'key': aliyunFileKey,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'signature': signature,
      'x-oss-security-token': securityToken,
      'success_action_status': '200',
    },
    success: function (res) {
      if (res.statusCode != 200) {
        failc(new Error('上传错误:' + JSON.stringify(res)))
        return;
      }
      successc(aliyunServerURL + aliyunFileKey);
    },
    fail: function (err) {
      err.wxaddinfo = aliyunServerURL;
      failc(err);
    },
  })
}
const getFileExt=function(f){
  var farr=f.split('.');
  return farr[farr.length-1];
}

const getPolicyBase64 = function () {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  let srcT = date.toISOString();
  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
    "conditions": [
      ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

const getSignature = function (policyBase64) {
  const accesskey = env.AccessKeySecret;
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);
  return signature;
}

module.exports = uploadFile;