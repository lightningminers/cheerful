
'use strict';

(function(factory){
	var root = (typeof self == 'object' && self.self == self && self) ||
            (typeof global == 'object' && global.global == global && global);
    if (typeof define === 'function' && define.amd) {
    	define(factory);
    }else if(typeof exports === 'object'){
    	module.exports = factory();
    }else{
    	root.bridge = factory();
    }
})(function(){
	var registerFunSigningForNativeHandler,
		ua = navigator.userAgent,
		// 'jsApi' definition of Android Webview
		androidApi = window.jsApi,
		isIOS = /iphone|ipad|ipod/i.test(ua),
		isAndroid = /android/i.test(ua),
		uid = 0;
	/**
	 * [NativeEvaluatingJavaScript 用于Native调用JS的注册函数]
	 * @type {[JSON]}
	 */
	window.NativeEvaluatingJavaScript = {
		androidResponseFunSigning:{}
	};
	var androidResponseFunSigning = window.NativeEvaluatingJavaScript.androidResponseFunSigning;
	/**
	 * [androidBridge 安卓交互处理]
	 * @type {Object}
	 */
	var androidBridge = {
		callNative:function(option){
			var funcSigning = option.funcSigning;
			delete option.funcSigning;
			if(option && typeof option.callback === 'function'){
				var funcKey = 'icepy_'+(uid++)+'_'+(new Date().getTime())+Math.floor(Math.random(100)*100);
				androidResponseFunSigning[funcKey] = option.callback;		
				option.arg.funcKey = funcKey;
			}
			if (androidApi) {
				androidApi[funcSigning](JSON.stringify(option.arg || {}));
			};
		}
	};

	var init = true;
	var bridge = null;
	/**
	 * [iOSBridge iOS交互处理]
	 * @type {Object}
	 */
	var iOSBridge = {
		connectWebViewJavascriptBridge:function(callback){
			if(window.WebViewJavascriptBridge){
				callback(WebViewJavascriptBridge);
			}else{
				document.addEventListener('WebViewJavascriptBridgeReady',function() {
						callback(WebViewJavascriptBridge);
				},false);
			}
		},
		callNative:function(option){
			if(!bridge){
				iOSBridge.connectWebViewJavascriptBridge(function(_bridge){
					bridge = _bridge;
					bridge.init();
					iOSBridge.handler(bridge,option);
		    	});
			}else{
				iOSBridge.handler(bridge,option);
			}
		},
		handler:function(bridge,option){
			bridge.callHandler(option.funcSigning,option.arg || {},function(response) {
				if(typeof option.callback === 'function'){
					option.callback(response);
				}
			});
		}
	};

	if(isIOS){
		registerFunSigningForNativeHandler = iOSBridge.callNative;
	}else if(isAndroid) {
		registerFunSigningForNativeHandler = androidBridge.callNative;
	}else{
		//throw new Error("Unkown UA.");
	};

	return {
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
	};
});