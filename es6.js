class Bhv{

    static test(){
        console.log(`This is ${this.name} class in Behaviour`);
    }



    set debug ( str ) { this.debug_str = str
                        console.log( this.debug_str )
                    }
    get debug () { console.log( this.debug_str || "I'm here!!!" )}
    

}

class Hub extends Bhv {
    


}

let hub = new Hub();
