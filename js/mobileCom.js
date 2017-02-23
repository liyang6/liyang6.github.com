/*移动端常用方法start*/
//com对象下的方法
    //绑定事件：addEvent(obj,"click",fn);
    //解绑事件：removeEvent(obj,"click",fn);
    //对象合并：extend(o1,o2);
    //创建对象：createEle(className,标签名);
    //有无class：hasClass(obj,c);
    //添加class：addClass(obj,c);
    //删除class：removeClass(obj,c);
var com={
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
