exports.appKey = "f09c419f2112dcf308637ecc"; // 极光官网中创建应用后分配的 appkey，必填；
exports.appid = "wx62c6e9ca72d1aea6"; // 微信管理后台分配的 appid，必填；
exports.channel = "default-channel"; // 渠道名称，默认值为:default-channel；
exports.debugMode = true; // 设置是否开启 debug 模式。true 则会打印更多的日志信息。设置 false 则只会输出 w、e 级别的日志；
exports.loc = true; // 设置是否尝试获取位置信息上报，默认为 true，需要在项目 app.json 配置位置权限；
exports.wifi = false; // (iOS only)设置是否尝试获取wifi信息上报，iOS 中获取 wifi 列表会跳出小程序到设置页面，请谨慎设置，默认为 false。