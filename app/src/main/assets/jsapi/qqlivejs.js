javascript:(function(window){
    if(!!window.${injectedName}) return;
    console.log("${injectedName} initialization begin");
    // a是注入的name
    var a = {queue: [], contents :[],callback: function () {
            var arglist=Array.prototype.slice.call(arguments, 0);//复制参数，防止篡改
            var callBackIndex = arglist.shift();// 回调的index；
            var isPermanent = arglist.shift();// callback 是否持久
            var needEncode = arglist.shift();// 是否需要编码
            var content = arglist.shift();
            var hasNext = arglist.shift();
            var pageIndex = arglist.shift();

            if(needEncode){
                content = decodeURIComponent(content);
            }
            if(hasNext){
                this.contents[pageIndex]=content;
            }else {
                this.contents[pageIndex]=content;
                var callback = this.queue[callBackIndex];
                var finalContent = this.contents.join('');
                callback.apply(this,[finalContent]);
                if (!isPermanent) {
                    delete this.queue[callBackIndex];
                }
                this.contents.length=0;
            }

        }};

    var Android = {};
    var Unicom = {};

    ${allFuncName} function () {
        var arglist =Array.prototype.slice.call(arguments, 0);
        if (arglist.length < 1) {
            throw "${injectedName} call error, message:miss method name";
        }
        var types =[];
        var hasCallBack = false;
        var cbIdx = -1;
        for (var index = 1; index < arglist.length; index++) {
            var arg = arglist[index];
            var type = typeof(arg);
            types.push(type);
            if (type === "function") {
                hasCallBack = true;
                arglist[index] = a.queue.length;
                cbIdx = a.queue.length;
                a.queue.push(arg);
            }
        }

        var resultjson = QQLiveJavaInterface.invoke(JSON.stringify({method: arglist.shift(), types: types, args: arglist, from:'qqlive',pageSize:a.pagesize}));

        if(resultjson != null && resultjson != ''){}

        var result = JSON.parse(resultjson);
        if (result && result.code !== 200) {
            if(hasCallBack && cbIdx>=0) delete a.queue[cbIdx];
            throw "call error, code:" + result.code + ", message:" + result.result;
        }
        return result?result.result:{};
    };
    Object.getOwnPropertyNames(a).forEach(function (d) {
        var c = a[d];
        if (typeof c === "function" && d !== "callback") {
            a[d] = function () {
                return c.apply(a, [d].concat(Array.prototype.slice.call(arguments, 0)));
            };
        }
    });

    Object.getOwnPropertyNames(Android).forEach(function (d) {
        var c = Android[d];
        if (typeof c === "function" && d !== "callback") {
            Android[d] = function () {
                return c.apply(Android, [d].concat(Array.prototype.slice.call(arguments, 0)));
            };
        }
    });

    Object.getOwnPropertyNames(Unicom).forEach(function (d) {
        var c = Unicom[d];
        if (typeof c === "function" && d !== "callback") {
            Unicom[d] = function () {
                return c.apply(Unicom, [d].concat(Array.prototype.slice.call(arguments, 0)));
            };
        }
    });

    var _MESSAGE_TYPE = '__msg_type',
        _EVENT_ID = '__event_id',
        _PARAMS = '__params',
        _CUSTOM_PROTOCOL_SCHEME = 'qqlive',
        _JSON_MESSAGE = '__json_message';

    var _event_hook_map = {};

    function _handleMessageFromQQLive(message){
        var msgWrap = message[_JSON_MESSAGE];
        if(!msgWrap) return;
        switch(msgWrap[_MESSAGE_TYPE]){
            case 'event':
            {
                if (typeof msgWrap[_EVENT_ID] === 'string' && typeof _event_hook_map[msgWrap[_EVENT_ID]] === 'function') {
                    var ret = _event_hook_map[msgWrap[_EVENT_ID]](msgWrap[_PARAMS]);
                }
            }
        }
    }

    function _on(event, callback){
        if (!event || typeof event !== 'string') {
            return;
        }
        if (typeof callback !== 'function') {
            return;
        }
        _event_hook_map[event] = callback;
        _invoke("registListener", {"eventName":event});
    }

    function _checkJsApi(param, callback){
        if (typeof callback !== 'function') {
            return;
        }
        var errCode = 0;
        var errMsg = "";
        var result = {};
        var methodName;
        var methodArray;
        if(typeof param === 'object'){
            methodArray = param['apiList'];
        }

        if(get_type(methodArray) === 'array'){
            for(var i=0;i<methodArray.length;i++){
                methodName = methodArray[i];
                result[methodName] = !!(a[methodName]);
            }
        }else{
            errCode = -1;
            errMsg = 'param error';
        }
        var ret = {'errCode':errCode ,'errMsg': errMsg,'result': result};
        callback(ret);
    }

    var defaultCallbackFun = function(){};

    function _invoke(methodName, params, callback){
        if(window.forbiddenPrompt){
            return;
        }
        if (!methodName || typeof methodName !== 'string') {
            return;
        };
        if(methodName === 'checkApi'){
            _checkJsApi(params, callback);
            return;
        }
        if(a[methodName]){
            if(typeof callback !== 'function'){
                callback = defaultCallbackFun;
            }
            if (params != null && params !== undefined) {
                a[methodName](params, callback);
            } else {
                a[methodName](callback);
            }
        } else {
            if (callback) {
                callback(JSON.stringify({
                    "errCode": 2002,
                    "errMsg": "ERR_CODE_UNSUPPORTED_API"
                }))
            }

        }
    }

    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    a.invoke = _invoke;
    a.on = _on;
    a._handleMessageFromQQLive = _handleMessageFromQQLive;
    a.pagesize= 1024*1024*2;
    a.contents=[];
    window.${injectedName} = a;
    window.Android = Android;
    window.Unicom = Unicom;

    window.forbiddenPrompt = false;

    var readyEvent = document.createEvent('Events');
    readyEvent.initEvent('on${injectedName}Ready');
    if(window && ${injectedName}){
            a.invoke('setVersion',{"version":11,"versionName":"1.1.1"}),function(ret){
                if(ret){
                    try{
                        var result = JSON.parse(ret);
                        var javaversion= ret.version;
                        var javaversionname = ret.versionName;
                        ${injectedName}.version=javaversion;
                        ${injectedName}.versionName = javaversionname;
                    }catch(e){
                        console.log(e);
                    }
                }
            };
           document.dispatchEvent(readyEvent);
        }

    console.log("${injectedName} initialization end");

    if(window.addEventListener){
        window.addEventListener('load',function(ev){
            ${injectedName}.invoke('onWebViewLoaded',{},null);
        });

        window.addEventListener('cached',function(ev){
            ${injectedName}.invoke('onWebViewCached',{},null);
        });

        window.addEventListener('error',function(ev){
            ${injectedName}.invoke('onWebViewError',{},null);
        });
    }
    if(${injectedName}){
        ${injectedName}.on('destoryWebView',function(){
            console.log('destoryWebView');
            ${injectedName}.invoke('onDestoryWebView',{},null);
            window.forbiddenPrompt = true;
        });
    }

    console.log("after init "+JSON.stringify(a.contents));


})(window);