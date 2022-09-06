// component/screeningTAB/screeningTAB.js
Component({
  properties: {
    //区域数据
    areaData: { 
      type: Object,
      value: []
    },
    //类型
    typeData: { 
      type: Object,
      value: []
    },
    //排序
    sortingData: { 
      type: Object,
      value: []
    },
  },
  data: {
    //筛选条件
    screening: 0,
    //区域数据
    areaValue: 0,
    //类型数据
    typeValue: 0,
    //排序数据
    sortingValue: 0,
    //三个文本值
    areaText: "区域",
    typeText: "类型",
    sortingText: "排序",
    //三个CSS值
    areaLength: false,
    typeLength: false,
    sortingLength: false,
    isOpen:false
  }, // 私有数据，可用于模板渲染
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },
  methods:{
    //切换TAB筛选
  choosetj(e) {
    var id = e.currentTarget.dataset.value;
    if (this.data.screening == id) {
      this.setData({
        screening: 0,
        isOpen:false
      })
    } else {
      this.setData({
        screening: id,
        isOpen:true
      })
    }
    // 展开下拉时向父组件传值
    this.triggerEvent('onChange',  {isOpen:this.data.isOpen});
  },
  //选择条件
  conditions(e) {
    var key = e.currentTarget.dataset.value;
    if (this.data.screening == 1) {
      this.setData({
        areaValue: this.data.areaData[key].id,
        areaText: this.data.areaData[key].name
      })
    } else if (this.data.screening == 2) {
      if (key != 0) {
        var wz = this.data.typeData[key].name;
        wz = wz.length > 4 ? wz.substring(0, 4) : wz;
        this.setData({
          typeValue: this.data.typeData[key].type_id,
          typeText: wz,
          typeLength: true
        })
      } else {
        this.setData({
          typeValue: this.data.typeData[key].type_id,
          typeText: '类型',
          typeLength: false
        })
      }
    } else if (this.data.screening == 3) {
      if (key != 0) {
        var wz = this.data.sortingData[key].name;
        wz = wz.length > 4 ? wz.substring(0, 4) : wz;
        this.setData({
          sortingValue: this.data.sortingData[key].id,
          sortingText: wz,
          sortingLength: true
        })
      } else {
        this.setData({
          sortingValue: this.data.sortingData[key].id,
          sortingText: '排序',
          sortingLength: false
        })
      }
    }
    //向父组件传值
    this.triggerEvent('onChange',  {areaValue:this.data.areaValue,typeValue:this.data.typeValue,sortingValue:this.data.sortingValue,isOpen:false});
    this.setData({
      screening: 0
    })
  }
  }
})