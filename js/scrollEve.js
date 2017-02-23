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
                com.extend(opt,obj);
                this.url=opt.url,
                this.scrollId=opt.scrollId,
                this.addContId=opt.addContId,
                this.onlyScroll=opt.onlyScroll,
                this.fnRefresh=opt.fnRefresh,
                this.fnLoad=opt.fnLoad,
                this.pageCount=opt.pageCount,
                this.oRefresh=null,
                this.oLoad=null,
                this.maxRefreshY=opt.maxRefreshY || 0;
                this.fnScrollCancel=opt.fnScrollCancel;
                this.fnBeforeScrollStart=opt.fnBeforeScrollStart;
                this.fnScroll=opt.fnScroll;
                this.fnScrollCancel=opt.fnScrollCancel;
                this.fnScrollCancel=opt.fnScrollCancel;


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
            var myScroll=null;
            myScroll = new IScroll(this.scrollId, {
                    click:true,
                    tap: true ,
                    probeType: 2
                    
            });
             myScroll.on("scrollCancel",function(){
                that.fnScrollCancel && that.fnScrollCancel({"myScroll":myScroll});
             });
              myScroll.on("beforeScrollStart",function(){
                that.fnBeforeScrollStart && that.fnBeforeScrollStart({"myScroll":myScroll});
                oRefresh.innerHTML="下拉刷新";
                oLoad.innerHTML="上垃圾在";
            });
           
              myScroll.on("scroll",function(){
                 that.fnScroll && that.fnScroll({"myScroll":myScroll,"y":this.y});
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
            var oEle=com.createEle();
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
                that.fnScrollCancel && that.fnScrollCancel({"myScroll":myScroll});
                myScroll.refresh();
            });
            myScroll.on("beforeScrollStart",function(){
                that.fnBeforeScrollStart && that.fnBeforeScrollStart({"myScroll":myScroll});
                myScroll.refresh();
            });

            myScroll.refresh();
            myScroll.scrollTo(0,0,0);
            this.scrollFun && this.scrollFun(myScroll);
        };