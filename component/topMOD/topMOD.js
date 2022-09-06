// component/topMOD/topMOD.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
//背景颜色
colorData: { 
  type: String,
  value: ''
},
  },

  /**
   * 组件的初始数据
   */
  data: {
    heightData: "0px"
  },
  lifetimes: {
    attached: function () {
      this.heightF();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    heightF: function () {
      wx.getSystemInfo({
        success:(res)=> {
          this.setData({
            heightData: res.statusBarHeight + 'px'
          })
        }
      })
    }
  }
})