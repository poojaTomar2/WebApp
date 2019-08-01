Ext.ns("Df.util")
Df.util.Cookies = {
    set : function(name, value, expires, path, domain, secure){
		expires = expires == undefined ? null : expires;
		path = path === undefined ? '/' : path;
		domain = domain === undefined ? null : domain;
		secure = secure === undefined ? false : secure;
        document.cookie = name + "=" + escape(value) + ((expires === null) ? "" : ("; expires=" + expires.toGMTString())) + ((path === null) ? "" : ("; path=" + path)) + ((domain === null) ? "" : ("; domain=" + domain)) + ((secure === true) ? "; secure" : "");
    },

    get : function(name){
        var arg = name + "=",
            alen = arg.length,
            clen = document.cookie.length,
            i = 0,
            j = 0;
            
        while(i < clen){
            j = i + alen;
            if(document.cookie.substring(i, j) == arg){
                return this.getCookieVal(j);
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if(i === 0){
                break;
            }
        }
        return null;
    },

    clear : function(name, path){
        if(this.get(name)){
            path = path || '/';
            document.cookie = name + '=' + '; expires=Thu, 01-Jan-70 00:00:01 GMT; path=' + path;
        }
    },
    
    getCookieVal : function(offset){
        var endstr = document.cookie.indexOf(";", offset);
        if(endstr == -1){
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    }
};