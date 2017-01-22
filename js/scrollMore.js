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
                console.log(this.onlyScroll);


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
                        onlyScroll:false
                };
                //数据合并
                comonWork.extend(opt,obj);
                this.url=opt.url,
                this.scrollId=opt.scrollId,
                this.addContId=opt.addContId,
                this.onlyScroll=opt.onlyScroll,
                this.refresh=opt.refresh,
                this.oRefresh=null;
                this.oLoad=null;

                this.oContId=document.querySelector(this.addContId);

                this.refresh &&  this.creatTipEle("refresh");
                this.load &&  this.creatTipEle("load");
        };
        ScrollMore.prototype.scrollEven=function (){
            var that=this;
            var oRefresh=this.oRefresh,
                oLoad=this.oLoad;
            var myScroll=null;
            myScroll = new IScroll(this.scrollId, {
                    click:true,
                    tap: true ,
                    preventDefault:false
            });
            
            myScroll.on("scrollCancel",function(){
                /*if(!oRefresh.hasClass("loading") ){
                    oRefresh.removeClass("down");
                    oRefresh.prev().removeClass("imgError");  
                };
                if( !oLoad.hasClass("loading")){
                    oLoad.removeClass("down");
                    oLoad.removeClass("imgError");              
                };*/

                myScroll.refresh();
            });
            myScroll.on("beforeScrollStart",function(){
                myScroll.refresh();
            });
            myScroll.on('scroll',function(){

                if(!oRefresh.hasClass("loading") && ! oLoad.hasClass("loading")){
                   if(this.y>5){   //下拉刷新
                       
                       /*beforeMore.removeClass("down");
                       beforeMoreimg.removeClass("imgok imgup imgLoading").addClass("downimg");
                       beforeMore.html("下拉刷新");*/
                       if(this.y>20){
                           /*beforeMore.addClass("down").html("释放立即刷新");
                           beforeMoreimg.removeClass("downimg").addClass("imgup");
                           afterMore.removeClass("up"); */
                       }
                      
                   }else if (this.y < this.maxScrollY - 5){  //上拉加载
                       if(that.pageCount>1 && that.pageCount != undefined){
                          /* afterMore.html("上拉加载");
                           afterMore.removeClass("up");
                           afterMoreimg.removeClass("imgok imgup").addClass("upimg");
                          */
                           if(this.y < (this.maxScrollY - 50)){
                              /* afterMoreimg.removeClass("upimg").addClass("downimg");
                               beforeMore.removeClass("down");
                               afterMore.addClass("up").html("释放立即加载"); */
                           };
                       }
                       
                   }
                };




            myScroll.refresh();
            myScroll.scrollTo(0,0,0);
            
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