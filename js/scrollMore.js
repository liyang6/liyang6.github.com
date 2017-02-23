(function (doc, win) {
    var fnReady=function (){



        //调用
        var oScroll=new ScrollMore({
                            url:"123",
                            scrollId:"#box",//滚动id
                            addContId:"#cont",//添加内容Id
                            pageCount:"2",//页数
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
                                        var li=com.createEle("","li");
                                        li.innerHTML="456";
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