function Observe(data){
  /**保存data */
  this.data= data;
  this._start(data)
}
Observe.prototype={
  _start(data){
    this._defineData(data)
  },
  _defineData(data){
    let me = this;
    Object.keys(data).forEach(item=>{
      me._bindData(item,data[item]);
    })
  },
  _bindData(key,val){
    let dep = new Dep()
    let childObj = observe(val)
    let me = this;
    Object.defineProperty(me.data,key,{
      configurable:false,
      enumerable:true,
      get(){
        if(Dep.target){
          dep.depend()
        }
        return val;
      },
      set(newVal){
        if(newVal==val)return;
        /**新的值如果是对象就进行监听 */
        observe(newVal);
        val = newVal;
        dep.notify()
      }
    })
  }
}
let uid = 0;
/**新建一个dep目标，用于添加需要添加的订阅者 */
Dep.target=null
function Dep(){
  /**索引加1 */
  this.uid=uid++;
  /**创建一个订阅者数组 */
  this.subs=[];
}

Dep.prototype={
  addSub(val){
    this.subs.push(val)
  },
  depend(){
    Dep.target.addDep(this)
  },
  notify(){
    this.subs.forEach(item=>{
      item.update()
    })
  },
  removeSub(val){
    let index = this.subs.indexOf(val);
    if(index!=-1){
      this.subs.splice(index,1)
    }
  }
}

function observe(data){
  if(!data||typeof data!='object')return;
  return new Observe(data);
}