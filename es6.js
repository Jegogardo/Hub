const ROOT = "../../"
const CALLBACKS = ["onsuccess", "ondone", "onstart", "onerror"]
//const READYSTATE = [0,1,2,3,4]
//const STATUS



class Bhv {

    static testStr(str) {
        console.log(str || `This is ${this.name} class in Behaviour`);
    }


    static whereami(str) {
        console.log(str || "I'm here!!!");
    }

    get debug() { console.log(this) }
    set debug(obj) {
        console.log(obj)
    }


}

class Hub extends Bhv {


    get url() { return this._url }
    set url(url) {
        if (typeof url != "string") {
            console.error("URL is not valid")
            return
        }
        else
            this._url = url

    }


    get method() { return this._method; }
    set method(m) {

        if (m === "GET" || m === "POST")
            this._method = m
        else
            console.error("Method can be set to GET or POST value");
    }

    get queryString() { return this._queryString }
    set queryString(param) {
        this._queryString = {}

        if (param != null) {

            if (typeof param === "string") {

                if (param.startsWith("?")) {
                    console.info("Not need to start the queryString with '?'");
                    param = param.substring(1)
                }
                param = param.split("&")
                //debugger
                param.forEach((a) => {
                    let b = a.split("=")
                    this._queryString[b[0]] = b[1]
                })
            }
            else {
                this._queryString = param
            }



        }

        this.queryString.__proto__.serialize = () => {
            var ampersand = "";
            let temp = this.method=="GET"? "?": ""
            
            for (let i in this._queryString) {
                if (i != "serialize") {
                    temp += `${ampersand}${i}=${this._queryString[i]}`
                    var ampersand = "&";
                }
            }
            return temp
        }
        return this._queryString;


    }

    get async() { return this._async }
    set async(isAsync) { isAsync ? this._async = true : this._async = false }

    get onerror() { return this._onerror }
    set onerror(fn) { this._onerror = fn }

    get onsuccess() { return this._onsuccess }
    set onsuccess(fn) { this._onsuccess = fn }

    get onstart() { return this._onstart }
    set onstart(fn) { this.req.onloadstart = this._onstart = fn }

    get ondone() { return this._ondone }
    set ondone(fn) { this._ondone = fn }

    get onprogress() { return this._onprogress }
    set onprogress(fn) { this.req.onprogress = this._onprogress = fn }


    constructor(url, method, param, async, callbacks) {

        super()
        this.req = new XMLHttpRequest()
        this._onerror = null
        this._onsuccess = null
        this._onstart = null
        this._ondone = null
        this.req.onreadystatechange = this.statechange.bind(this)


        if (typeof method == "object") {
            checkParam.call(this, method)
            method = "GET"
        }
        else if (typeof param == "object") {
            checkParam.call(this, param)
            param = ""
        }
        else if (typeof async == "object") {
            checkParam.call(this, async)
            async = true
        }


        this.url = url || null
        this.method = method || "GET"
        this.queryString = param || null
        this.async = async || true


        function checkParam(obj) {
            let arr = Object.keys(obj)
            //if (typeof Object.keys(arr)[0] == "function") {
            arr.forEach((callback) => {
                if (CALLBACKS.indexOf(callback) == -1) {
                    console.error(`Only ${CALLBACKS} are permitted as callback`)
                    return
                }
                else
                    this[callback] = obj[callback]
            }
            )
            /*}
            else
                return obj*/

        }

    }



    statechange(e) {
        //debugger
        let req = e.target;
        if (req.readyState == req.DONE) {
            this.result = {
                response: this.req.response,
                responseText: this.req.responseText,
                responseType: this.req.responseType,
                responseURL: this.req.responseURL,
                responseXML: this.req.responseXML
            }

            if (req.status == 200 && this.onsuccess)
                this.onsuccess(this.result)
            if (req.status == 404 && this.onerror)
                this.onerror(this.result)
            if (this.ondone)
                this.ondone(this.result)

        }


    }

    addParam(...param) {
        if (typeof param[0] == "string")
            param = `${param[0]}=${param[1]}`
        else
            param = param[0]

        this.queryString = param

        return this
    }

    setRequestHeader(header, value) {
        this.req.setRequestHeader(header, value);
        return this;
    }

    connect() {
        if (this.url) {

            
            if (this.method == "GET") {
                this.req.open("GET", this.url + this.queryString.serialize(), this.async);
                this.req.send();
            }
            else {
                this.req.open("POST", this.url, this.async)
                if (this.req.getAllResponseHeaders() == "") {
                    this.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
                }

                this.req.send(this.queryString.serialize())


            }
        }
        else
            console.warn("Needs an URL to make a request");

        return this

    }

    static connect(...param) {
        //debugger
        var [url, method, param, async] = param
        let temp = new this(url, method, param, async).connect()

        return temp

    }





}

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

let hub2 = Hub.connect(`${ROOT}index.php`,"POST", "data=prova",
    {
        onsuccess: (result) => { console.log(result.response) },
        ondone: (result) => { console.log("end") },
        onstart: (result) => { console.log("start") }
    })


//hub2.debug;