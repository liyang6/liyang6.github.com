YK.File.Js.load('//jietiao.yinker.com/static/v1/dev/js/plugins/jweixin-1.0.0.js', function(){
  var weixinConfigInfo = {};
  var shareData = {
    "appId": "",
    "title": "",
    "link": "",
    "msgImg": "",
    "desc": "",
    "shareToFriendTitle":"",
    "shareToFriendDesc":"",
    "shareToFriendLink":"",
    "shareToFriendImg":"",
    "shareAppMessage_trigger": false,
    "shareAppMessage_success": false,
    "shareAppMessage_cancel": false,
    "shareAppMessage_fail": false,
    "shareTimeline_trigger": false,
    "shareTimeline_success": false,
    "shareTimeline_cancel": false,
    "shareTimeline_fail": false,
    "shareQQ_trigger": false,
    "shareQQ_complete": false,
    "shareQQ_success": false,
    "shareQQ_cancel": false,
    "shareQQ_fail": false,
    "shareWeibo_trigger": false,
    "shareWeibo_complete": false,
    "shareWeibo_success": false,
    "shareWeibo_cancel": false,
    "shareWeibo_fail": false,
    "hideMenuItems": true
  };
  window.wxSetShareData = function () {
    $.ajax({
      url : YK.Env.mRoot + 'weixin/getShareJSConfig.do',
      data : {
        shareUrl : location.href.split('#')[0]
      },
      dataType :'json',
      type : 'POST',
      cache : false,
      async: false,
      success : function(data){
        weixinConfigInfo.appId = data['appId'];
        weixinConfigInfo.nonceStr = data["nonceStr"];
        weixinConfigInfo.signature = data["signature"];
        weixinConfigInfo.timestamp = data["timestamp"];
      }
    });
    var _config = YK.Share.config();
    for (key in _config) {
      shareData[key] = _config[key];
    }

    // 如果未单独设置 “分享给好友” 的相关选项
    if(shareData.shareToFriendTitle === ''){
      shareData.shareToFriendTitle = shareData.title;
      shareData.shareToFriendDesc = shareData.desc;
      shareData.shareToFriendLink = shareData.link;
      shareData.shareToFriendImg = shareData.msgImg;
    }
    
  };
  window.wxSetShareData();
  
  //初始化
  window.wx && wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: weixinConfigInfo['appId'], // 必填，公众号的唯一标识
    nonceStr: weixinConfigInfo['nonceStr'], // 必填，生成签名的随机串
    signature: weixinConfigInfo['signature'], // 必填，签名，见附录1
    timestamp: weixinConfigInfo['timestamp'], // 必填，生成签名的时间戳
    //要调用的接口需要先在这里声明
    jsApiList: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'chooseImage',
      'uploadImage',
      'openLocation',
      'getLocation',
      'hideMenuItems',
      'hideOptionMenu'
    ]
  });
  
  //所有微信事件都要写到ready里
  window.wx && wx.ready(function () {
    window.wxReadyCallback && window.wxReadyCallback(); //微信的ready回调可以写在这里

    //隐藏其它分享入口
    if(shareData.hideMenuItems){
      wx.hideMenuItems({
        menuList: [
          // "menuItem:share:appMessage",
          // "menuItem:share:timeline",
          "menuItem:share:weiboApp",
          "menuItem:share:facebook",
          "menuItem:share:QZone",
          "menuItem:exposeArticle",
          "menuItem:copyUrl",
          "menuItem:favorite",
          "menuItem:readMode",
          "menuItem:openWithSafari",
          "menuItem:share:email",
          "menuItem:share:qq"
        ]
      });
    }

    // 隐藏右上角菜单接口
    // wx.hideOptionMenu();
    
    //分享给朋友
    wx.onMenuShareAppMessage({
      title: shareData.shareToFriendTitle || shareData.title,
      desc: shareData.shareToFriendDesc || shareData.desc,
      link: shareData.shareToFriendLink || shareData.link,
      imgUrl: shareData.shareToFriendImg || shareData.msgImg,
      trigger: function (res) {
        //alert('用户点击发送给朋友');
        shareData.shareAppMessage_trigger && shareData.shareAppMessage_trigger(res);
      },
      success: function (res) {
        //alert('已分享');
        shareData.shareAppMessage_success && shareData.shareAppMessage_success(res);
      },
      cancel: function (res) {
        //alert('已取消');
        shareData.shareAppMessage_cancel && shareData.shareAppMessage_cancel(res);
      },
      fail: function (res) {
        //alert(JSON.stringify(res));
        shareData.shareAppMessage_fail && shareData.shareAppMessage_fail(res);
      }
    });

    //分享到朋友圈，注意去掉回调里的alert
    wx.onMenuShareTimeline({
      title: shareData.title,
      desc: shareData.desc,
      link: shareData.link,
      imgUrl: shareData.msgImg,
      trigger: function (res) {
        //alert('用户点击分享到朋友圈');
        shareData.shareTimeline_trigger && shareData.shareTimeline_trigger(res);
      },
      success: function (res) {
        //alert('已分享');
        shareData.shareTimeline_success && shareData.shareTimeline_success(res);
      },
      cancel: function (res) {
        //alert('已取消');
        shareData.shareTimeline_cancel && shareData.shareTimeline_cancel(res);
      },
      fail: function (res) {
        //alert(JSON.stringify(res));
        shareData.shareTimeline_fail && shareData.shareTimeline_fail(res);
      }
    });

    //分享到QQ
    wx.onMenuShareQQ({
      title: shareData.title,
      desc: shareData.desc,
      link: shareData.link,
      imgUrl: shareData.img_url,
      trigger: function (res) {
        //alert('用户点击分享到QQ');
        shareData.shareQQ_trigger && shareData.shareQQ_trigger(res);
      },
      complete: function (res) {
        //alert(JSON.stringify(res));
        shareData.shareQQ_complete && shareData.shareQQ_complete(res);
      },
      success: function (res) {
        //alert('已分享');
        shareData.shareQQ_success && shareData.shareQQ_success(res);
      },
      cancel: function (res) {
        //alert('已取消');
        shareData.shareQQ_cancel && shareData.shareQQ_cancel(res);
      },
      fail: function (res) {
        //alert(JSON.stringify(res));
        shareData.shareQQ_fail && shareData.shareQQ_fail(res);
      }
    });

    //分享到微博
    wx.onMenuShareWeibo({
      title: shareData.title,
      desc: shareData.desc,
      link: shareData.link,
      imgUrl: shareData.img_url,
      trigger: function (res) {
        //alert('用户点击分享到微博');
        shareData.shareWeibo_trigger && shareData.shareWeibo_trigger(res);
      },
      complete: function (res) {
        //alert(JSON.stringify(res));
        shareData.shareWeibo_complete && shareData.shareWeibo_complete(res);
      },
      success: function (res) {
        //alert('已分享');
        shareData.shareWeibo_success && shareData.shareWeibo_success(res);
      },
      cancel: function (res) {
        //alert('已取消');
        shareData.shareWeibo_cancel && shareData.shareWeibo_cancel(res);
      },
      fail: function (res) {
        //alert(JSON.stringify(res));
        shareData.shareWeibo_fail && shareData.shareWeibo_fail(res);
      }
    });
  });
});