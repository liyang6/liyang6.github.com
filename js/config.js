//基本设置（像素比、Html字体大小）
function config(){
    //动态设置像素比
    var oPixelRatio = 1 / window.devicePixelRatio;
    document.write('<meta name="viewport" content="width=device-width,initial-scale='+oPixelRatio+',minimum-scale='+oPixelRatio+',maximum-scale='+oPixelRatio+',user-scalable=no" />');
    //设置字体大小
    var setHtmlSize=function (){
        var oHtml = document.getElementsByTagName('html')[0];
        oHtml.style.fontSize =oHtml.getBoundingClientRect().width / 320 +"px";
    };
    setHtmlSize();
    window.addEventListener("resize", setHtmlSize, false);
    window.addEventListener("orientationchange", setHtmlSize, false);
}
config();