com.ready(function (){

	var can=document.getElementById("can"),
		ctx=can.getContext('2d'),
	  	palyBtn=document.getElementById("paly_btn"),
	  	resultPage=document.getElementById("resultPage"),
	  	resultCont=document.getElementById("resultCont"),
	  	checkBtn=document.getElementById("checkBtn"),
	  	pw=1314,
	  	password=document.getElementById("password"),
	  	err=document.getElementById("err"),
	  	reg=/pw\=\d+/,
	  	sHref=window.location.href;
	  	if(reg.test(sHref)){
	  		sHref.replace(reg,function (s){
	  			pw=s.replace(/\D+/,"");
	  			return s;
	  		});
	  	}
	  	

        ctx.lineWidth = 4;  
		ctx.font="16px Arial";


	function callback(cont){
		resultPage.style.display="block";
		resultCont.innerHTML=cont;
	}

	
	function Award(){
		this.init();
		this.event();
		this.submitEvent();
	}
	Award.prototype.submitEvent=function (){
		var This=this;
		checkBtn.addEventListener("click",function (){
			if(password.value==pw){
				resultPage.style.display="none";
				err.style.opacity="0";
				err.innerHTML="";
				password.value="";
				new Award().play(This.data.startDeg);
			}else{
				err.style.opacity="1";
			}
			
		});

	}
	Award.prototype.isTrun=true;
	Award.prototype.startTime=0;
	Award.prototype.endTimeout=0;
	Award.prototype.init=function (obj,data){
		var oCanW=com.getCss(can,'width'),
			oCanH=com.getCss(can,'height')
			This=this,
			deg=30,
			len=360/deg,
			this.data={
				r:oCanW/2,
				w:oCanW,
				h:oCanH,
				x:oCanW/2,
				y:oCanH/2,
				deg:deg,
				len:len,
				arr:['奖励一元','惩俯卧撑十个','罚任意要求一个','奖励九十九元','惩亲十秒钟','惩才艺表演一个','奖请大餐一顿','惩倒贴十元','再来一次','奖真心话一次','奖享受服务一次','惩大冒险一次'],
				xc:L=oCanW*Math.sin(This.aTor(deg/2)),
				startDeg:deg/2
			}
	};
	Award.prototype.play=function (n){
		var obj=this.data;
		
		ctx.clearRect(0,0,obj.w,obj.h);
		ctx.translate(obj.x,obj.y);
		ctx.rotate(this.aTor(n-obj.startDeg));
		ctx.translate(-obj.x, -obj.y);
	
		/*画线*/
		this.drawLine();
		/*写字*/
		this.writeArr(obj.arr);

		ctx.translate(obj.x,obj.y);
		ctx.rotate(this.aTor(-(n-obj.startDeg)));
		ctx.translate(-obj.x, -obj.y);
	};
	Award.prototype.drawLine=function (){
		var deg=this.data.deg,
			obj=this.data;
		var fn=function(deg){
			ctx.save();
			ctx.strokeStyle ='rgb('+Math.ceil(255*Math.random())+','+Math.ceil(255*Math.random())+','+Math.ceil(255*Math.random())+')';//线条的颜色
			ctx.beginPath(); 
			ctx.moveTo(obj.x,obj.y);  
			ctx.lineTo(obj.x*(1+Math.sin(deg)),obj.y*(1-Math.cos(deg)));  
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		};
		for(var i=0;i<obj.len;i++){
			var degLine=this.aTor(deg*i);
			fn(degLine);
		}
	}; 
	Award.prototype.writeArr=function (){
		var arr=this.data.arr,
			obj=this.data;;	
		for(var j=0;j<arr.length;j++){
			ctx.save();
			ctx.translate(obj.x,obj.y);
			ctx.rotate(this.aTor(obj.deg/2+obj.deg*j));
			ctx.translate(-obj.x, -obj.y);
			this.writeCon(obj.arr[j]);
			ctx.restore();
		}
	};
	Award.prototype.writeCon=function (str){
		var startW=0,
				fontW=this.data.xc/2,
				top=24,//绘制字体距离canvas顶部初始的高度
				inx= 0,
				left=(this.data.w-fontW)/2; //每次开始截取的字符串的索引
			for(var i=0;i<str.length;i++){ 
			    startW+=ctx.measureText(str[i]).width; 
			    if(startW>=fontW){  
			        ctx.fillText(str.substring(inx,i+1),left,top);//绘制截取部分
			        top+=20;//20为字体的高度
			        startW=0;
			        inx=i+1;
			    } 
			    (i == str.length-1) && ctx.fillText(str.substring(inx,i+1),left,top);
			}
	};
	Award.prototype.aTor=function (n){
		return n*Math.PI/180;
	};	

	Award.prototype.event=function (){
		var This=this,
			fnDown=function () {
				if(This.isTrun){
					This.startTime=new Date().getTime();
				}
			},
			fnUp=function(){
				if(This.isTrun){
					This.isTrun=false;
						This.endTimeout=new Date().getTime();
						This.turn(can,{
							dis:This.endTimeout-This.startTime,
							complete:function (startDeg){
								This.data.startDeg=startDeg%360;
								var nowDeg=startDeg,
									iNow=Math.ceil(((nowDeg-This.data.deg/2)%360)/30);
								console.log(nowDeg);
								console.log(iNow);
								console.log(This.data.arr[This.data.arr.length-iNow]);
								callback(This.data.arr[This.data.arr.length-iNow]);
							}
						});
				}
			};
		palyBtn.removeEventListener("touchstart",fnDown);	
		palyBtn.addEventListener("touchstart",fnDown);	
		palyBtn.removeEventListener("touchend",fnUp);	
		palyBtn.addEventListener("touchend",fnUp);	
	};
	Award.prototype.isComplete=true;
	Award.prototype.turn=function (obj,data){
		var This=this;
		console.log(This.isComplete);
		var complete=data.complete || function (){},
				dis=data.dis || 100,
				startDeg=This.data.startDeg;
				n=startDeg+1,
				endDeg=n+dis;
				
				(endDeg<360) && (endDeg+=360);

			obj.timer=null;
			clearInterval(obj.timer);
			obj.timer=setInterval(function (){
				if(startDeg<endDeg/2){
					n=n*1.4;
					startDeg+=n;
					This.play(startDeg);
				}else if((startDeg>endDeg/2) && (startDeg<endDeg) ){	
					n=(n<4)? 2 : n*0.8;
					startDeg+=n;
					((endDeg-0.2)<startDeg) && (startDeg=endDeg);
					This.play(startDeg);
				}else{
					if( This.isComplete ){
						This.isComplete=false;
						complete && complete(startDeg);
						clearInterval(obj.timer);
						/*This.isTrun=true;
						This.isComplete=true;*/
					}
					
				}
				
			},100);
	};
		

	var awardPlay=new Award();
	awardPlay.play(0);

		







});