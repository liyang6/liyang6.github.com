(function (doc, win) {
    /*移动端常用方法start*/
    var comonWork={
            addEvent:function (el, type, fn, capture){
                el.addEventListener(type, fn, !!capture);
            },
            removeEvent:function (el, type, fn, capture){
                el.removeEventListener(type, fn, !!capture);
            },
            extend:function (o1, o2, preventOverwrite) {//第三个参数，不覆盖o1的数值
                for (var prop in o2) {
                    if (o2.hasOwnProperty(prop)) {
                        if(preventOverwrite && o1.hasOwnProperty(prop)) {
                            continue;
                        }
                        o1[prop] = o2[prop];
                    }
                }
            },
            createEle: function(c, tag) {
                var el = document.createElement(tag || 'div');
                if(c) {
                    el.className = c;
                }
                return el;
            },
            hasClass:function (el,c){
                return el.className && new RegExp('(^|\\s)' + c + '(\\s|$)').test(el.className);//^|\\s+  表示什么都没有（起始位置）或者 空白符
            },
            addClass: function(el, className) {
                var aName=className.split(" ");
                for(var i=0;i<aName.length;i++){
                    if( aName[i] && !comonWork.hasClass(el,aName[i]) ) {
                    el.className += (el.className ? ' ' : '') + aName[i];
                    }
                }
                return el;
            },
            removeClass: function(el, className) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, ''); //检测替换，去除多余空格
                return el;
            }

    };
    /*常用方法end*/
    var fnReady=function (){
        var ScrollMore=function (obj){
                this.scrollInit(obj);//初始化数据

                if( !this.url || !this.scrollId ) return;
                if( this.onlyScroll ){
                    this.scrollEffect();
                }else{
                    this.scrollEven();
                }

        };
        ScrollMore.prototype.scrollInit=function (obj){
            var opt={
                        url:"456",
                        onlyScroll:false,
                        pageCount:"0"
                };
                //数据合并
                comonWork.extend(opt,obj);
                this.url=opt.url,
                this.scrollId=opt.scrollId,
                this.addContId=opt.addContId,
                this.onlyScroll=opt.onlyScroll,
                this.fnRefresh=opt.fnRefresh,
                this.fnLoad=opt.fnLoad,
                this.pageCount=opt.pageCount,
                this.oRefresh=null,
                this.oLoad=null,
                this.maxRefreshY=opt.maxRefreshY;

                this.oContId=document.querySelector(this.addContId);

                this.fnRefresh &&  this.creatTipEle("refresh");
                this.fnLoad &&  this.creatTipEle("load");
        };
        ScrollMore.prototype.scrollEven=function (){
            var that=this;
            that.isRefresh=false;
            that.isLoad=false;
            var scrollId=document.querySelector(this.scrollId),
                oRefresh=this.oRefresh,
                oLoad=this.oLoad,
                
                maxRefreshY=(typeof this.maxRefreshY=="number") ? this.maxRefreshY : 150;
                //nRefreshH=oRefresh.offsetHeight;

            var myScroll=null;
            myScroll = new IScroll(this.scrollId, {
                    click:true,
                    tap: true ,
                    probeType: 2
                    
            });
             myScroll.on("scrollCancel",function(){
            });
              myScroll.on("beforeScrollStart",function(){
                oRefresh.innerHTML="下拉刷新";
                oLoad.innerHTML="上垃圾在";
            });
           

              myScroll.on("scroll",function(){
                //刷新
                that.isRefresh=false;
                that.isLoad=false;
                if(this.y>5 && this.y<100){
                    oRefresh.style.display="block";
                    oRefresh.innerHTML="下拉刷新";
                } else if(this.y>100){
                    that.isRefresh=true;
                    oRefresh.innerHTML="释放刷新";
                    if(maxRefreshY && (this.y > maxRefreshY)) myScroll.scrollTo(0,maxRefreshY,0);
                }
                console.log(this.maxScrollY);
                //加载
                if ((this.y<0) && (this.y < this.maxScrollY - 5)){
                        oLoad.innerHTML="上啦加载";
                    if(this.y < this.maxScrollY - 100){
                        that.isLoad=true;
                        oLoad.innerHTML="释放加载";
                    }
                }
            });  
              
            myScroll.on("scrollEnd",function(){
                var This=this;
                if(that.isRefresh && this.y==0){
                    oRefresh.innerHTML="加载中";
                    that.fnRefresh &&  that.fnRefresh(oRefresh,myScroll)
                }else{
                    oRefresh.style.display="none";
                }

                if(that.isLoad && (this.y>=this.maxScrollY)){
                    oLoad.innerHTML="加载中";
                    that.fnLoad &&  that.fnLoad(oLoad,that.oContId,myScroll)
                }else{
                    
                }
                    
            }); 

        };
        ScrollMore.prototype.creatTipEle=function (type,addData){
            if( !type ) return;
            var oEle=comonWork.createEle();
            var type=type.toLowerCase();
            ( typeof addData=="function" && addData) && addData(oEle);
            if(type=="refresh" && this.pageCount>0){
                oEle.className="refreshTip";
                oEle.innerHTML="下拉刷新";
                this.oContId.insertBefore(oEle,this.oContId.childNodes[0]);
                 this.oRefresh=oEle;
            }else if(type=="load" && this.pageCount>1){
                oEle.className="loadTip";
                oEle.innerHTML="上拉加载";
                this.oContId.appendChild(oEle);
                this.oLoad=oEle;
            }
        };
        ScrollMore.prototype.scrollEffect=function (){//滚动效果
            var that=this;
            var myScroll=null;
            myScroll = new IScroll(this.scrollId, {
                    click:true,
                    tap: true ,
                    preventDefault:false
            });
            
            myScroll.on("scrollCancel",function(){
                myScroll.refresh();
            });
            myScroll.on("beforeScrollStart",function(){
                myScroll.refresh();
            });

            myScroll.refresh();
            myScroll.scrollTo(0,0,0);
            this.scrollFun && this.scrollFun(myScroll);
        };

        var oScroll=new ScrollMore({
                            url:"123",
                            scrollId:"#box",
                            addContId:"#cont",
                            pageCount:"2",
                            maxRefreshY:0,
                            /*onlyScroll:true*/
                            fnRefresh:function (oRefresh){
                                setTimeout(function (){//模拟请求延时2s(刷新)

                                    oRefresh.innerHTML="刷新成功";
                                    //只为提示信息显示，添加延时
                                    var timer=null;
                                    clearTimeout(timer);
                                    timer=setTimeout(function (){
                                        clearTimeout(timer);
                                        oRefresh.style.display="none";
                                        console.log("实现刷新");
                                    }, 500);
                                  
                                }, 2000);//模拟请求延时2s(刷新)  
                                
                            },
                             fnLoad:function (oLoad,content,myScroll){
                                setTimeout(function (){//模拟请求延时2s(加载)

                                   
                                   oLoad.innerHTML="加载成功";
                                    //只为提示信息显示，添加延时
                                    var timer=null;
                                    clearTimeout(timer);
                                    timer=setTimeout(function (){
                                        clearTimeout(timer);
                                        var li=comonWork.createEle("","li");
                                        li.innerHTML="456";
                                        console.log(li);
                                        content.insertBefore(li,oLoad);
                                        console.log("实现加载");
                                        myScroll.refresh();
                                    }, 500);
                                  
                                }, 2000);//模拟请求延时2s(加载)  
                                
                            }
                        });
       
    };
   doc.addEventListener('DOMContentLoaded',fnReady, false);
})(document, window);