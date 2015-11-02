## Cheerful



小巧的JavaScript与Native通信库（JavaScript端实现），拿去即可使用，已经经过项目的检实际检测。

### iOS实现

如果你的iOS项目使用了[WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)，那么你可不必引入iOS-JavaScriptBridge.js文件，直接引入bridge.js文件即可。

如果你的iOS项目未使用[WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)，那么你需要先引入iOS-JavaScriptBridge.js文件，并且需要在iOS端实现对 CUSTOM_PROTOCOL_SCHEME = 'wvjbscheme'的截取，并且使用stringByEvaluatingJavaScriptFromString去执行截取的参数QUEUE_HAS_MESSAGE。

### Android 实现

Android不会存在这个问题，因为它们使用的是对象映射来实现。

	public final String API_KEY = "jsApi";
	openWebView.addJavascriptInterface(baseJsApi, API_KEY);

不过如果在JS端获取响应，你依然必须在Android实现对JS端的执行：
	
	JSONObject object = new JSONObject(jsonParam);
    androidResponseFunSigning = "androidResponseFunSigning." + object.getString("funcKey");
	openWebView.loadUrl("javascript:window.NativeEvaluatingJavaScript." + androidResponseFunSigning + "('" + json + "')");

### How Use it ?

在页面中引入：

	<script type="text/javascript" src="bridge.js"></script>

使用AMD引入：

	define(['bridge'],function(bridge){
	
	});
	
使用CommonJS

	var bridge = require('bridge');


### API

	/**
	* [register 向Native调起Api]
	* @param  {[JSON]} opt [funSigning（函数签名）arg（传递的参数）callback（方法回调）]
	* @return {[undefined]}     [undefined]
	*/
	register:function(opt) {
		if(!opt || !opt.funcSigning) { throw new Error("Method missed."); }
		registerFunSigningForNativeHandler(opt);
	},
	/*
		是否为iOS客户端
	*/
	isIOS: isIOS,
	/*
		是否为Android客户端
	*/
	isAndroid: isAndroid,
	/**
	* [registerNativeEvaluatingJavaScript 注册Native可以执行的JavaScript函数]
	* @param  {[type]} name [description]
	* @param  {[type]} func [description]
	* @return {[type]}      [description]
	*/
	registerNativeEvaluatingJavaScript:function(name,des){
		window.NativeEvaluatingJavaScript[name] = des;
	},
	version:'1.0.0'
