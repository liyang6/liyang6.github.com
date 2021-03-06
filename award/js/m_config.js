//基本设置（像素比、Html字体大小）
(function(doc, win) {
    var oBaseSet = {
        setPixelRatio: function() { //动态设置像素比
            var oPixelRatio = 1 / win.devicePixelRatio;
            doc.write('<meta name="viewport" content="width=device-width,initial-scale=' + oPixelRatio + ',minimum-scale=' + oPixelRatio + ',maximum-scale=' + oPixelRatio + ',user-scalable=no" />');
        },
        setRem: function(ImgW, ImgM) { //设置字体大小(默认20px,640的2倍图)
            ImgM = ImgM || 2;
            ImgW = (ImgW || 640) / ImgM;
            var setHtmlSize = function() {
                var oHtml = doc.getElementsByTagName('html')[0];
                oHtml.style.fontSize = 20 * oHtml.getBoundingClientRect().width / ImgW + "px";
            };
            var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, setHtmlSize, false);
            doc.addEventListener('DOMContentLoaded', setHtmlSize, false);
        },
        preventHref: function() { //给所有的a动态加链接(防止误触)
            var fnPreventHref = function() {
                var aBtn = document.querySelectorAll('a');
                for (var i = 0; i < aBtn.length; i++) {
                    aBtn[i].addEventListener("touchmove", function() {
                        this.isMove = true;
                    }, false);

                    aBtn[i].addEventListener("touchend", function() {
                        if (!this.isMove) {
                            window.location.href = this.href;
                        }
                        this.isMove = false;
                    }, false);
                }
            };
            doc.addEventListener('DOMContentLoaded', fnPreventHref, false);
        }
    };
    // oBaseSet.setPixelRatio();//动态设置像素比
    oBaseSet.setRem(); //设置字体大小
    oBaseSet.preventHref(); //给所有的a动态加链接(防止误触)
})(document, window);


(function(doc, win) {
    win.com = {};
    var F = function() {};
    F.prototype.ready = function(fn) {
        /*判断高版本浏览器*/
        if (doc.addEventListener) {
            doc.addEventListener("DOMContentLoaded", function() {
                fn && fn();
            });
        } else {
            doc.addEventListener("onreadystatechange", function() {
                if (doc.readyState == "complete") {
                    fn && fn();
                }
            });
        }
    };
    F.prototype.getStyle = function(obj, name) {
        return (obj.currentStyle || getComputedStyle(obj, false))[name];
    };
    F.prototype.getCss = function(obj, name) {
        var sRus = this.getStyle(obj, name);
        return /px/g.test(sRus) ? sRus.replace("px","") : sRus ;
    };
    F.prototype.fnEvent = function(time,callback) {
        this.sAfterTime=null;
        if ( this.sBeforeTime==null ) {
            this.sBeforeTime = new Date().getTime();
        } else {
            sAfterTime = new Date().getTime();
            if (sAfterTime - this.sBeforeTime < this.timeout) {
                this.sBeforeTime = this.sAfterTime;
                return;
            } else {
                this.sBeforeTime = this.sAfterTime;
            }
        }
        this.callback && this.callback();
    }
    
    com = new F();
})(document, window);