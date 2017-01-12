//基本设置（像素比、Html字体大小）
(function (doc, win) {
    //动态设置像素比
    var oPixelRatio = 1 / win.devicePixelRatio;
    doc.write('<meta name="viewport" content="width=device-width,initial-scale='+oPixelRatio+',minimum-scale='+oPixelRatio+',maximum-scale='+oPixelRatio+',user-scalable=no" />');
    //设置字体大小
    var setHtmlSize=function (){
        var oHtml = doc.getElementsByTagName('html')[0];
        oHtml.style.fontSize =20*oHtml.getBoundingClientRect().width / 320 +"px";//默认640设计图，750设计图，只需要修改成375即可
    };
    var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
    if( !doc.addEventListener) return;
    win.addEventListener(resizeEvt, setHtmlSize, false);
    doc.addEventListener('DOMContentLoaded',setHtmlSize, false);
    //
})(document, window);