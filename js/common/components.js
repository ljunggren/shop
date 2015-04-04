var PageContext={
  menuVisible:false,
  mouseInMenu:false,
  curContext:null,
  defaultContext:null,
  assignHash:false,
  init:function(def,assignHash){
    this.defaultContext=def;
    this.assignHash=assignHash;
    return this;
  },
  //Control page content
  isCurrentContext:function(v){
    if(!this.curContext){
      this.curContext=location.hash.substr(1);
    }
    if(!this.curContext){
      this.curContext=this.defaultContext;
    }
    return this.curContext==v;
  },
  setContext:function(v){
    this.curContext=v;
    this.setMouseInMenu(false);
    this.showMenu(false);
    location.href=location.href.replace(location.hash,"")+"#"+v;
    return this;
  },
  //Control menu
  showMenu:function(v){
    if(!this.mouseInMenu){
      this.menuVisible=v;
    }
  },
  setMouseInMenu:function(v){
    this.mouseInMenu=v;
  }
}