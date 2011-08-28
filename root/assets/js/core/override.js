mwf.override = new function(){
    
    if(!mwf.device.hasCookies())
        return;
    
    this.cookieName = mwf.site.cookie.prefix+'override';
    
    var override;
    
    var regexS = "[\\?&]override=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if(results == null){
        regexS = "[\\?&]ovrcls=([^&#]*)";
        regex = new RegExp( regexS );
        results = regex.exec( window.location.href );
        if(results != null){
            switch(results[1]){
                case 0: 
                    override = 'basic'; 
                    break;
                case 1: 
                    override = 'standard'; 
                    break;
                case 2:
                case 3: 
                    override = 'full'; 
                    break;
            }
        }else{
            mwf.device.isOverride = function(){ return false; }
            return;
        }
    }else{
        override = results[1];
    }
    
    if(override == 'no'){
        document.cookie = mwf.device.cookieName+'=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT';
        document.cookie = this.cookieName+'=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT';
        
        url = document.location.href;
        var urlparts= url.split('?');
        if (urlparts.length>=2)
        {
            var urlBase=urlparts.shift(); //get first part, and remove from array
            var queryString=urlparts.join("?"); //join it back up

            var prefix = 'override=';
            var pars = queryString.split(/[&;]/g);
            for (var i= pars.length; i-->0;)               //reverse iteration as may be destructive
              if (pars[i].lastIndexOf(prefix, 0)!==-1)   //idiom for string.startsWith
                  pars.splice(i, 1);
            window.location = urlBase+'?'+pars.join('&');
            return;
        }
    }
    
    var cookies = document.cookie.split(';');
    for(i=0; i < cookies.length; i++){
        x = cookies[i].substr(0,cookies[i].indexOf("="));
        x = x.replace(/^\s+|\s+$/g,"");
        if(x == this.cookieName){
            var pos = cookies[i].indexOf("=")+1;
            if(override == cookies[i].substr(pos, cookies[i].length-pos)){
                return;
            }
        }
    }
    
    var _full = mwf.device.isFull();
    var _standard = mwf.device.isStandard();
    var _basic = mwf.device.isBasic();
    var _mobile = mwf.device.isMobile();
    
    mwf.device.wasFull = function(){ return _full; }
    mwf.device.wasStandard = function(){ return _standard; }
    mwf.device.wasBasic = function(){ return _basic; }
    mwf.device.wasMobile = function(){ return _mobile; }
    
    switch(override){
        case 'full':
            mwf.device.isFull = function(){ return true; }
        case 'standard':
            mwf.device.isStandard = function(){ return true; }
        case 'basic':
            mwf.device.isBasic = function(){ return true; }
            mwf.device.isMobile = function(){ return true; }
    }
    
    switch(override){
        case 'basic':
            mwf.device.isStandard = function(){ return false; }
        case 'standard':
            mwf.device.isFull = function(){ return false; }
    }
    
    mwf.device.isOverride = function(){ return true; }
    
    document.cookie = mwf.device.cookieName+'=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT';
    document.cookie = this.cookieName+'='+override+';path=/';
    
};
