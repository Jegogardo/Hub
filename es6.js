const ROOT = "../../"


class Bhv{

    static testStr( str ){
        console.log( str || `This is ${this.name} class in Behaviour`);
    }



    set whereami ( str ) { this.debug_str = str
                        console.log( this.debug_str )
                    }
    get whereami () { console.log( this.debug_str || "I'm here!!!" )}

    get debug () { console.log( this ) }
    

}

class Hub extends Bhv {

    get method(){ return this._method;}
    set method ( m )  {
        
        if(m === "GET" || m === "POST")
            this._method = m
        else
            console.error("Method can be set to GET or POST value");
    }   
    
    get queryString(){ return this._queryString }
    set queryString( param ){
        this._queryString = "";
        if( typeof param === "object" ){
            var ampersand = "";
            for(let i in param){
                this._queryString += `${ampersand}${i}=${param[i]}`

                var ampersand = "&";
            }

        }

        if( this.method == "GET" )
             if( param.startsWith( "?" ) )
                console.info( "Not need to start the queryString with '?'" );
            else
                this._queryString = "?"+param;
        else
            if( param.startsWith( "?" ) ){
                this._queryString = param.substring(1);
                console.info( "Not need to start the queryString with '?'" );
            }
                


        return this._queryString;
    }

    get async(){ return this._async }
    set async( isAsync ){ isAsync? this._async = true: this._async = false  }
    
    constructor( url, method = "GET", param = null, async = true ) {
        super()
        this.req = new XMLHttpRequest()
        this.method = method
        this.queryString = param;
        this.async = async;
                
    }

    setRequestHeader( header ,value ){
        this.req.setRequestHeader( header, value );
    }

    connect(){
        if( this.method == "GET" ){
            this.req.open( "GET", this.url+this.queryString, this.async );
            this.req.send();
        }
        else{
            this.req.open( "POST", this.url, this.async );
            if( this.req.getAllResponseHeaders() == "" ){
                this.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }

            
            this.req.send( this.queryString );
        }
            
    }

}

//let hub = new Hub( "prova","GET",{data:"",t:"c"} );
let hub = new Hub( `${ROOT}index.php`,"POST", "data=&t=c" );
hub.debug;