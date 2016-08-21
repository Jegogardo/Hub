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

    set method ( m )  {
        if(m === "GET" || m === "POST")
            this._method = m
        else
            console.error("Method can be set to GET or POST value");
        }

    get method(){ return this._method;}

    get queryString(){ return this.queryString }
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
                this._queryString = "?"+this._queryString;
        else


        return this._queryString;
    }
    
    constructor( url, method="GET", param=null ) {
        super()
        this.req = new XMLHttpRequest()
        this.method = method
        this.queryString = param;
        
        
    }

}

//let hub = new Hub( "prova","GET",{data:"",t:"c"} );
let hub = new Hub( "prova","GET", "data=&t=c" );
hub.debug;