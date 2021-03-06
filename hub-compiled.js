"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//const ROOT = "../../"

//const READYSTATE = [0,1,2,3,4]
//const STATUS

var Hub = function () {
    _createClass(Hub, [{
        key: "url",
        get: function get() {
            return this._url;
        },
        set: function set(url) {
            if (typeof url != "string") {
                console.error("URL is not valid");
                return;
            } else this._url = url;
        }
    }, {
        key: "method",
        get: function get() {
            return this._method;
        },
        set: function set(m) {

            if (m === "GET" || m === "POST") this._method = m;else console.error("Method can be set to GET or POST value");
        }
    }, {
        key: "queryString",
        get: function get() {
            return this._queryString;
        },
        set: function set(param) {
            var _this = this;

            //this._queryString = {}
            //debugger
            if (param != null) {

                if (typeof param === "string") {

                    //if (param.startsWith("?")) {
                    if (param.indexOf("?") == 0) {
                        console.info("Not need to start the queryString with '?'");
                        param = param.substring(1);
                    }
                    param = param.split("&");
                    //debugger
                    param.forEach(function (a) {
                        var b = a.split("=");
                        _this._queryString[b[0]] = b[1];
                    });
                } else {
                    this._queryString = Object.assign(this._queryString, param);
                }
            }

            this.queryString.serialize = function () {
                var ampersand = "";
                var temp = _this.method == "GET" ? "?" : "";

                for (var i in _this._queryString) {
                    if (i != "serialize") {
                        temp += "" + ampersand + i + "=" + _this._queryString[i];
                        var ampersand = "&";
                    }
                }
                return temp;
            };
            return this._queryString;
        }
    }, {
        key: "async",
        get: function get() {
            return this._async;
        },
        set: function set(isAsync) {
            isAsync ? this._async = true : this._async = false;
        }
    }, {
        key: "onerror",
        get: function get() {
            return this._onerror;
        },
        set: function set(fn) {
            this._onerror = fn;
        }
    }, {
        key: "onsuccess",
        get: function get() {
            return this._onsuccess;
        },
        set: function set(fn) {
            this._onsuccess = fn;
        }
    }, {
        key: "onstart",
        get: function get() {
            return this._onstart;
        },
        set: function set(fn) {
            this.req.onloadstart = this._onstart = fn;
        }
    }, {
        key: "ondone",
        get: function get() {
            return this._ondone;
        },
        set: function set(fn) {
            this._ondone = fn;
        }
    }, {
        key: "onprogress",
        get: function get() {
            return this._onprogress;
        },
        set: function set(fn) {
            this.req.onprogress = this._onprogress = fn;
        }
    }], [{
        key: "EVENTS",
        get: function get() {
            return {
                onsuccess: "onHubSuccess", onstart: "onHubStart",
                ondone: "onHubDone", onerror: "onHubError" };
        }
    }]);

    function Hub(url, method, param, _async, callbacks) {
        _classCallCheck(this, Hub);

        //super()
        this.req = new XMLHttpRequest();
        this._onerror = null;
        this._onsuccess = null;
        this._onstart = null;
        this._ondone = null;
        this._queryString = {};
        this.req.onreadystatechange = this.statechange.bind(this);
        this.isHeaderSet = false;
        this._events = Hub.EVENTS;
        for (var i in this._events) {
            var temp = document.createEvent("Event");
            temp.initEvent(this._events[i], true, true);
            temp.page = this;
            this._events[i] = temp;
        }

        if ((typeof method === "undefined" ? "undefined" : _typeof(method)) == "object") {
            checkParam.call(this, method);
            method = "GET";
        } else if ((typeof param === "undefined" ? "undefined" : _typeof(param)) == "object") {
            checkParam.call(this, param);
            param = "";
        } else if ((typeof _async === "undefined" ? "undefined" : _typeof(_async)) == "object") {
            checkParam.call(this, _async);
            _async = true;
        }

        this.url = url || null;
        this.method = method || "GET";
        this.queryString = param || null;
        this.async = _async || true;

        function checkParam(obj) {
            var _this2 = this;

            var arr = Object.keys(obj);
            //if (typeof Object.keys(arr)[0] == "function") {
            arr.forEach(function (callback) {
                if (callback in Hub.EVENTS) {
                    if (typeof obj[callback] == "function") _this2[callback] = obj[callback];else return console.error("Only functions are permitted as callback ");
                } else return console.error("Only " + Object.keys(Hub.EVENTS) + " are permitted as callback");
            });
            /*}
            else
                return obj*/
        }
    }

    _createClass(Hub, [{
        key: "statechange",
        value: function statechange(e) {
            //debugger
            var req = e.target;
            if (req.readyState == req.DONE) {
                this.result = {
                    response: this.req.response,
                    responseText: this.req.responseText,
                    responseType: this.req.responseType,
                    responseURL: this.req.responseURL,
                    responseXML: this.req.responseXML
                };
                this.result.responseText.indexOf("debug") == 0 ? document.body.innerHTML = this.result.responseText.replace("debug", "DEBUG<br>") : false;

                if (req.status == 200) {
                    if (this.onsuccess) this.onsuccess(this.result);

                    document.dispatchEvent(this._events.onsuccess);
                }
                if (req.status == 404) {
                    if (this.onerror) this.onerror(this.result);

                    document.dispatchEvent(this._events.onerror);
                }
                if (this.ondone) {
                    this.ondone(this.result);
                }
                document.dispatchEvent(this._events.ondone);
            }
        }
    }, {
        key: "addParam",
        value: function addParam() {
            for (var _len = arguments.length, param = Array(_len), _key = 0; _key < _len; _key++) {
                param[_key] = arguments[_key];
            }

            if (typeof param[0] == "string") param = param[0] + "=" + param[1];else param = param[0];

            this.queryString = param;

            return this;
        }
    }, {
        key: "cleanParam",
        value: function cleanParam() {
            this.queryString = {};
        }
    }, {
        key: "setRequestHeader",
        value: function setRequestHeader(header, value) {
            this.isHeaderSet = true;
            this.req.requestHeader = [header, value];
            this.req.setRequestHeader(header, value);
            return this;
        }
    }, {
        key: "connect",
        value: function connect() {
            if (this.url) {

                if (this.method == "GET") {
                    this.req.open("GET", this.url + this.queryString.serialize(), this.async);
                    this.req.send();
                    document.dispatchEvent(this._events.onstart);
                } else {
                    this.req.open("POST", this.url, this.async);
                    if (this.isHeaderSet) {
                        this.setRequestHeader(this.req.requestHeader[0], this.req.requestHeader[1]);
                    } else {
                        this.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    }
                    this.req.send(this.queryString.serialize());
                    document.dispatchEvent(this._events.onstart);
                }
            } else console.warn("Needs an URL to make a request");

            return this;
        }
    }], [{
        key: "connect",
        value: function connect() {
            for (var _len2 = arguments.length, param = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                param[_key2] = arguments[_key2];
            }

            //debugger
            var _param = _slicedToArray(param, 4);

            var url = _param[0];
            var method = _param[1];
            var param = _param[2];
            var _async = _param[3];

            var temp = new this(url, method, param, _async).connect();

            return temp;
        }
    }]);

    return Hub;
}();

/*let hub = new Hub( `${ROOT}index2.php`,"POST",{
    onstart: result=>{console.log("inizio con la callback")},
    ondone: result=>{console.log("fine con la callback")},
    onsuccess: result=>{console.log("tutto OK con la callback")},
    onerror: result=>{console.error("errore con la callback")}
} );
document.addEventListener("onHubStart", result=>{
    console.log("inizio con il listener");
})
document.addEventListener("onHubDone", result=>{
    console.log("fine con il listener");
})
document.addEventListener("onHubSuccess", result=>{
    console.log("tutto OK con il listener");
})
document.addEventListener("onHubError", result=>{
    console.error("errore con il listener");
})

hub.connect()*/
/*hub.onerror = (result)=>{
    console.error( "Errore" );
}
hub.onsuccess = ( result ) =>{
    console.log( "Successo" );
}
hub.onstart = () =>{
    console.info( "Iniziato" );
}
hub.ondone = (result) =>{
    console.info( "Finito");
}
hub.connect()*/
//let hub = new Hub( "prova","GET",{data:"",t:"c"} );
/*let hub = new Hub( `${ROOT}inde.php`,"POST", "data=&t=c" );
hub.onerror = (result)=>{
    console.error( "Errore" );
}
hub.onsuccess = ( result ) =>{
    console.log( "Successo" );
}
hub.onstart = () =>{
    console.info( "Iniziato" );
}
hub.ondone = (result) =>{
    console.info( "Finito");
}*/

/*var i=1;
hub.onprogress = () =>{
    console.info( `Progress ${i++}` );
}*/

//hub.connect()
/*let hub = new Hub( `${ROOT}index.php`,"POST", {
                                                onsuccess : ( result ) =>{ console.log(result.response) },
                                                ondone : ( result ) =>{ console.log("end") },
                                                onstart : ( result ) =>{ console.log("start") }
                                                })
*/
/*let hub2 = Hub.connect(`${ROOT}index.php`,
    {
        onsuccess: (result) => { console.log(result.response) },
        ondone: (result) => { console.log("end") },
        onstart: (result) => { console.log("start") }
    })*/

/*let hub2 = new Hub(`${ROOT}index.php`, "POST"
    {
        onsuccess: (result) => { console.log(result.response) },
        ondone: (result) => { console.log("end") },
        onstart: (result) => { console.log("start") }
    }
    ).addParam("data","value").addParam({testo:"testo"}).connect()

hub2.debug;*/
