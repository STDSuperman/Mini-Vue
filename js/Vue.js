
function Vue(options){
  this.$options = options;
  let data = this._data=this.$options.data;
  let self = this;
  /**对data数据进行代理 */
  Object.keys(data).forEach(item=>{
    self._proxy(item)
  })
  /**对data数据进行监听 */
  observe(data);

  /**开始编译 */
  this.$compiler = new Compiler(options.el||document.body,self)
  return this;
}

Vue.prototype={
  _proxy(key){
    let me = this;
    Object.defineProperty(me,key,{
      configurable:false,
      enumerable:true,
      get(){
        return me._data[key]
      },
      set(newVal){
        me._data[key]=newVal
      }
    })
  }
}