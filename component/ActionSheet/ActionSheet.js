// component/ActionSheet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active:{
      type:Boolean,
      value:false,
    },
    items:{
      type:Array,
      value:[]
    }
  },
  observers:{
    'active':function(v){
      if(v){
        this.setData({showInfo:''});
      }else{
        this.setData({showInfo:'none'});
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showInfo:'none',
    itemIndex:0,
  },


  
  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({showInfo:'none'});
      this.triggerEvent('close',{});
    },
    selectOk(){
      if(this.data.itemIndex>=0){
        this.setData({showInfo:'none'});
        this.triggerEvent('selected',this.data.items[this.data.itemIndex]);
      }
    },
    selectItem(e){
      var i=e.detail.value[0];//obj.currentTarget.dataset.index;
      this.setData({itemIndex:i});
      console.log(this.data.itemIndex)
    }
  }
})
