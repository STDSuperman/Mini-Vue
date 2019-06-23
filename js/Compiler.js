function Compiler(el,vm){
  this.$vm = vm;
  this.element = this.isElement(el)?el:document.querySelector(el);
  if(this.element){
    this.$fragment = this.fragment2node(this.element);
    this.init(this.$fragment);
    this.appendChild(this.$fragment)
  }
}
Compiler.prototype={
  fragment2node(el){
    let fragment = document.createDocumentFragment(),child;
    // 将原生节点拷贝到fragment
    while(child = el.firstChild){
      fragment.appendChild(child);
    }
    return fragment;
  },
  appendChild(el){
    this.element.appendChild(el);
  },
  init(fragment){
    this.compileElement(fragment);
  },
  compileElement(node){
    /**取出所有子节点 */
    let children = node.childNodes;
    let reg = /\{\{(.*)\}\}/mg;
    [].slice.call(children).forEach(node=>{
      let text = node.textContent
      if(this.isElement(text)){
        this.compileElement(text)
      }else if(this.isTextNode(node)&&reg.test(text)){
        this.compileText(node,RegExp.$1)
      }
      if(node.childNodes&&node.childNodes.length!=0){
        this.compileElement(node)
      }
    })
  },
  compileText(node,exp){
    compileUtils.text(node,this.$vm,exp.trim());
  },
  isElement(el){
    return el.nodeType==1;
  },
  isTextNode(el){
    return el.nodeType ==3;
  }
}

var compileUtils={
  text(node,vm,exp){
    this.bind(node,vm,exp,'text');
  },
  bind(node,vm,exp,type){
   let updateFn = update[type+"Update"];
   updateFn&&updateFn(node,this._getVal(vm,exp))
   new Watch(vm,exp,function(val){
     updateFn&&updateFn(node,val)
   })
  },
  _getVal(vm,exp){
    let val = vm;
    let temp = exp.split('.');
    temp.forEach((item,index)=>{
      /**判断是否是最后一位了 */
      if(index<temp.length-1){
        val=val[item]
      }else{
        val = val[item];
      }
    })
    return val;
  }
}
var update={
  textUpdate(node,val){
    node.textContent = typeof val == 'undefined' ? '' : val;
  }
}
