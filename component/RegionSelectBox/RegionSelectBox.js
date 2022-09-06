const app = getApp()
// component/RegionSelectBox/RegionSelectBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: Boolean,
      value: false,
    },
    returnValue: {
      //所有改变都返回值
      type: Boolean,
      default: false,
    },
  },
  observers: {
    'active': function (v) {
      if (v) {
        this.setData({
          showInfo: ''
        });
      } else {
        this.setData({
          showInfo: 'none'
        });
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showInfo: 'none',
    province_id: null,
    city_id: null,
    area_id: null,
    province_name: null,
    city_name: null,
    area_name: null,
    province: [],
    city: [],
    area: [],
    province_index: null,
    city_index: null,
    area_index: null,
    dataValue: [0,0,0]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({showInfo:'none'});
      this.triggerEvent('close',{});
    },
    selectOk(e){
      this.setData({showInfo:'none'});
      this.triggerEvent('selected',{
        province_id:this.data.province_id,
        city_id:this.data.city_id,
        area_id:this.data.area_id,

        province_name:this.data.province_name,
        city_name:this.data.city_name,
        area_name:this.data.area_name,
      });
    },
    //清空结果
    resetData() {
      this.province_id = null;
      this.city_id = null;
      this.area_id = null;
      this.province = [];
      this.city = [];
      this.area = [];
      this.getProvince();
    },
    // 获取一级城市列表
    getProvince() {
      app.api('/v1/city/select', 'GET', false, {
        id: '00000'
      }, (res, data) => {
        this.setData({
          province: data,
          province_index: 0,
          province_id: data[0]['id'],
          province_name: data[0]['name']
        })
        this.getCity();
      })
    },
    getCity() {
      app.api('/v1/city/select', 'GET', false, {
        id: this.data.province_id
      }, (res, data) => {
        this.setData({
          city: data,
          city_index: 0,
          city_id: data[0]['id'],
          city_name:data[0]['name'],
        });
        this.getArea();

      });
    },
    getArea(c, a) {
      app.api('/v1/city/select', 'GET', false, {
        id: this.data.city_id
      }, (res, data) => {
        this.setData({
          area: data,
          area_index: 0,
          area_id: data[0]['id'],
          area_name:data[0]['name'],
        });
      });
    },
    testSelect(e) {
      let allIndex = {
        p: this.data.province_index,
        c: this.data.city_index,
        a: this.data.area_index,
      }
      this.setData({
        province_index: e.detail.value[0],
        city_index: e.detail.value[1],
        area_index: e.detail.value[2],
        province_id: this.data.province[e.detail.value[0]].id,
        city_id: this.data.city[e.detail.value[1]].id,
        area_id: this.data.area[e.detail.value[2]].id,

        province_name: this.data.province[e.detail.value[0]].name,
        city_name: this.data.city[e.detail.value[1]].name,
        area_name: this.data.area[e.detail.value[2]].name,
      });
      if (this.data.province_index != allIndex.p) {
        this.getCity();
        wx.nextTick(() => {
          this.setData({ dataValue: [
            this.data.province_index,
            0,0
          ] })
        })
      }
      if (this.data.city_index != allIndex.c) {
        this.getArea();
        wx.nextTick(() => {
          this.setData({ dataValue: [
            this.data.province_index,
            this.data.city_index,
            0,
          ] })
        })
      }
    }
  }
})