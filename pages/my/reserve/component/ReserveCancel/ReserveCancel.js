Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    reasonIndex: null,
    reasonInfo: '',
    reasonItems: [
      '买多/买错/不想要了', '无法再预定时间内到场', ''
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeReason(e) {
      this.setData({
        reasonIndex: Number(e.currentTarget.dataset.index),
        reasonInfo: e.currentTarget.dataset.index < 2 ? this.data.reasonItems[e.currentTarget.dataset.index] : ''
      });
    },
    handleReasonDialog(e) {
      let result = e.detail.index;
      if (result == 1) {
        if (this.data.reasonIndex !=undefined) {
          if (this.data.reasonIndex < 2) {
            this.triggerEvent('selected', this.data.reasonItems[this.data.reasonIndex]);
          } else {
            if (this.data.reasonInfo!='') {
              this.triggerEvent('selected', this.data.reasonInfo);
            }
          }
        }else{
          wx.showToast({
            title: '请设置取消原因',
            icon: 'error',
            duration: 2000
          });
        }
      } else {
        this.setData({
          reasonIndex: null,
          reasonInfo: ''
        });
        this.triggerEvent('closed');
      }
    }
  }
})