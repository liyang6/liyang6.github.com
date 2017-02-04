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
                this.refresh=opt.refresh,
                this.pageCount=opt.pageCount;
                this.oRefresh=null;
                this.oLoad=null;

                this.oContId=document.querySelector(this.addContId);

                this.refresh &&  this.creatTipEle("refresh");
                this.load &&  this.creatTipEle("load");
        };
        ScrollMore.prototype.scrollEven=function (){//模拟topOffset的方法
            var that=this;
            var scrollId=document.querySelector(this.scrollId),
                oRefresh=this.oRefresh,
                oLoad=this.oLoad,
                isRefresh=false,
                isLoad=false,
                nRefreshH;
            nRefreshH= oRefresh.offsetHeight;
            scrollId.style.transform="translate(0px, -80px)";
            var myScroll=null;
            myScroll = new IScroll(this.scrollId, {
                    click:true,
                    tap: true ,
                    probeType: 2
                    
            });
             myScroll.on("scrollCancel",function(){
                 //console.log("scrollCancel");
                 scrollId.style.transition="none";
            });
              myScroll.on("beforeScrollStart",function(){
               // myScroll.refresh();
               //console.log("beforeScrollStart");
            });
           

              myScroll.on("scroll",function(){
                console.log(this.y);
                if(this.y>50 ){
                    oRefresh.innerHTML="下拉刷新";
                    if(this.y>100){
                        //console.log(this.y);
                        oRefresh.innerHTML="释放刷新";
                    }
                } 
                if (this.y < this.maxScrollY - 5){

                }
            });
            myScroll.on("scrollEnd",function(){
                scrollId.style.transition="1s all ease";
                scrollId.style.transform="translate(0px, -80px)";
                console.log("end"+this.y);
                //myScroll.scrollTo(0,nRefreshH,0);
               // myScroll.scrollToElement(oRefresh, 100, 30, 20, "linear" )
               }); 

        };
        ScrollMore.prototype.creatTipEle=function (type,addData){
            if( !type ) return;
            var oEle=comonWork.createEle();
            var type=type.toLowerCase();
            ( typeof addData=="function" && addData) && addData(oEle);
            if(type=="refresh"){
                oEle.className="refreshTip";
                oEle.innerHTML="下拉刷新";
                this.oContId.insertBefore(oEle,this.oContId.childNodes[0]);
                 this.oRefresh=oEle;
            }else if(type=="load"){
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
                            pageCount:"",
                            /*onlyScroll:true*/
                            refresh:function (){
                                console.log(123);
                            }
                        });
       
    };
   doc.addEventListener('DOMContentLoaded',fnReady, false);
})(document, window);