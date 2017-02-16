function Tab(id,obj){//没有绑定事件，按钮和内容区块获取优化
	this.par=document.getElementById(id);
	this.btn=this.par.getElementsByTagName("input");
	this.cont=this.par.getElementsByTagName("div");
	this.len=this.btn.length;
	this.iNow=0;
}
Tab.prototype.init=function (){
	var This=this;
	for(var i=0;i<this.len;i++){
		(function (index){
			This.btn[i].onclick=function (){
				This.iNow=index;
				This.tabChange(index);
			};
		})(i);
	}
};
Tab.prototype.tabChange=function (n){
	for(var i=0;i<this.len;i++){
		this.btn[i].className="";
		this.cont[i].style.display="none";
	}
	this.btn[n].className="active";
	this.cont[n].style.display="block";
};
Tab.prototype.autuPlay=function (){
	var This=this;
	this.timer=null;
	this.bFlag=true;
	this.timer=setInterval(function (){
		if(This.bFlag){
			This.iNow++;
			if(This.iNow>This.len-1){
				This.iNow=0;
			}
			This.tabChange(This.iNow);
		}
	},1000);
	this.overParEve();
	this.outParEve();
};
Tab.prototype.overParEve=function (){
	var This=this;
	this.par.onmouseover=function (){
		This.overPar();
	}
};
Tab.prototype.overPar=function (){
	//clearInterval(this.timer);
	this.bFlag=false;
};
Tab.prototype.outParEve=function (){
	var This=this;
	this.par.onmouseout=function (){
		This.outPar();
	}
};
Tab.prototype.outPar=function (){
	//this.autuPlay();
	this.bFlag=true;
};

/*拖拽*/
function Drag(id,obj){//优化获取元素，
	this.par=document.getElementById(id);
	this.btn=this.par.getElementsByTagName("h6")[0];
	if(obj.linmitId){
		this.limitBox=document.getElementById(obj.linmitId);
		this.parW=this.par.offsetWidth;
		this.parH=this.par.offsetHeight;
		this.limitX=this.limitBox.offsetWidth-this.parW;
		this.limitY=this.limitBox.offsetHeight-this.parW;
		(this.limitX<0) && (this.limitX=0);
		(this.limitY<0) && (this.limitY=0);
	}
	this.disX=0;
	this.disY=0;
}
Drag.prototype.init=function (){
	var This=this;
	this.btn.onmousedown=function (ev){
		var e=ev || event;
		This.downData(e);
		return false;
	};
};
Drag.prototype.downData=function (e){
	var This=this;
	this.disX=e.clientX-this.par.offsetLeft;
	this.disY=e.clientY-this.par.offsetTop;
	document.onmousemove=function (ev){
		var e=ev || event;
		This.moveData(e);
	};
	document.onmouseup=function (ev){
		var e=ev || event;
		This.endData(e);
	};
};
Drag.prototype.moveData=function (e){
	var This=this;
	var x=e.clientX-this.disX,
	y=e.clientY-this.disY;

	(x>=this.limitX) && (x=this.limitX);
	(x<=0) && (x=0);
	(y>=this.limitY) && (y=this.limitY);
	(y<=0) && (y=0);
	this.par.style.left=x+"px";
	this.par.style.top=y+"px";
};
Drag.prototype.endData=function (e){
	document.onmousemove=null;
	document.onmouseup=null;
};
Drag.prototype.limitBox=function (id){
	document.onmousemove=null;
	document.onmouseup=null;
};