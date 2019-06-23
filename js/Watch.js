function Watch(vm,exp,cb){
  this.$vm = vm;
  this.exp = exp;
  this.cb=cb;
  this.depId={};
  this.value = this.get()
}

Watch.prototype={
  get(){
    Dep.target=this;
    let value = this.getVal()
    Dep.target=null;
    return value;
  },
  getVal(){
    let exp = this.exp;
    let val = this.$vm._data;
    exp.split('.').forEach(item=>{
      val=val[item];
    })
    return val;
  },
  addDep(dep){
    if(!this.depId.hasOwnProperty(dep.uid)){
      this.depId[dep.uid]=[];
      dep.addSub(this);
    }
  },
  update(){
    this.run()
  },
  run(){
    let oldValue=this.value;
    let newValue=this.value=this.getVal()
    if(oldValue==newValue)return;

    this.cb(newValue)
  }
}