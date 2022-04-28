(function() {

  window.$customLoader = false;

  class PermissionError extends Error {
    constructor(message) {
      super(message)
      this.name = 'PermissionError'
      this.message = message
    }
  }

  const error = {};
  error.new = (event) => {
    !function handle(e) {
      var x = 'Unknown';
      try {
        x = e.error.stack;
      } catch {
        x = e;
      }

      document.getElementById('popup-error-dev-err').innerHTML = '<br><pre id="popup-dev-code"><code>' + x + '</code></pre>';
      var h = document.getElementById('popup-dev-code').offsetHeight;

      document.getElementById('popup-error-dev-err').setAttribute('data-height', (parseInt(h) + 50) + 'px');

      document.getElementById('popup-error-btn').addEventListener('click', () => {
        document.getElementById('popup-error-dev-err').classList.toggle('show');
      });

      let popup = document.getElementById('popup-error');
      popup.style.display = 'block';

      !function report(stack) {
        console.error(stack);
      }(x);
    }(event);
  };
  window.error = error;

  const w = window;
  const d = document;
  const id = function(name) {
    !function checkElement(id) {
        if (typeof id != 'string') {
          throw new TypeError('Non string given for id(...) in parameter 1.');
          return false;
        }
     }(name);
     return d.getElementById(name);
  }
  const descendant = function(parent, child) {
    let node = child.parentNode;
    while (node) {
        if (node === parent) {
            return true;
        }
        // Traverse up to the parent
        node = node.parentNode;
    }
    // Go up until the root but couldn't find the `parent`
    return false;
  };

  const http = {};
  http.post = async (url = '', data = {}, headers = {'Content-Type': 'application/x-www-form-urlencoded'}) => {

      const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: headers,
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: data
      });
      return response.json();
  };
  http.get = async (url = '', headers = {'Content-Type': 'application/x-www-form-urlencoded'}) => {

      const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: headers,
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
      });
      return response.json();
  }

  const Cookies = {};

   Cookies.set = (cname, cvalue, exdays, domain = 'teamtbm.org', secure = false) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;domain=" + domain + ";secure=" + (secure == false ? 'false' : 'true');
  }

   Cookies.get = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  window.http = http; window.Cookies = Cookies; window.w = window; window.d = document; window.id = id; window.descendant = descendant;


})();
!function(){"use strict";var e={not_string:/[^s]/,not_bool:/[^t]/,not_type:/[^T]/,not_primitive:/[^v]/,number:/[diefg]/,numeric_arg:/[bcdiefguxX]/,json:/[j]/,not_json:/[^j]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[+-]/};function t(r){return function(r,n){var i,s,a,o,p,c,l,u,f,d=1,g=r.length,y="";for(s=0;s<g;s++)if("string"==typeof r[s])y+=r[s];else if("object"==typeof r[s]){if((o=r[s]).keys)for(i=n[d],a=0;a<o.keys.length;a++){if(null==i)throw new Error(t('[sprintf] Cannot access property "%s" of undefined value "%s"',o.keys[a],o.keys[a-1]));i=i[o.keys[a]]}else i=o.param_no?n[o.param_no]:n[d++];if(e.not_type.test(o.type)&&e.not_primitive.test(o.type)&&i instanceof Function&&(i=i()),e.numeric_arg.test(o.type)&&"number"!=typeof i&&isNaN(i))throw new TypeError(t("[sprintf] expecting number but found %T",i));switch(e.number.test(o.type)&&(u=i>=0),o.type){case"b":i=parseInt(i,10).toString(2);break;case"c":i=String.fromCharCode(parseInt(i,10));break;case"d":case"i":i=parseInt(i,10);break;case"j":i=JSON.stringify(i,null,o.width?parseInt(o.width):0);break;case"e":i=o.precision?parseFloat(i).toExponential(o.precision):parseFloat(i).toExponential();break;case"f":i=o.precision?parseFloat(i).toFixed(o.precision):parseFloat(i);break;case"g":i=o.precision?String(Number(i.toPrecision(o.precision))):parseFloat(i);break;case"o":i=(parseInt(i,10)>>>0).toString(8);break;case"s":i=String(i),i=o.precision?i.substring(0,o.precision):i;break;case"t":i=String(!!i),i=o.precision?i.substring(0,o.precision):i;break;case"T":i=Object.prototype.toString.call(i).slice(8,-1).toLowerCase(),i=o.precision?i.substring(0,o.precision):i;break;case"u":i=parseInt(i,10)>>>0;break;case"v":i=i.valueOf(),i=o.precision?i.substring(0,o.precision):i;break;case"x":i=(parseInt(i,10)>>>0).toString(16);break;case"X":i=(parseInt(i,10)>>>0).toString(16).toUpperCase()}e.json.test(o.type)?y+=i:(!e.number.test(o.type)||u&&!o.sign?f="":(f=u?"+":"-",i=i.toString().replace(e.sign,"")),c=o.pad_char?"0"===o.pad_char?"0":o.pad_char.charAt(1):" ",l=o.width-(f+i).length,p=o.width&&l>0?c.repeat(l):"",y+=o.align?f+i+p:"0"===c?f+p+i:p+f+i)}return y}(function(t){if(n[t])return n[t];var r,i=t,s=[],a=0;for(;i;){if(null!==(r=e.text.exec(i)))s.push(r[0]);else if(null!==(r=e.modulo.exec(i)))s.push("%");else{if(null===(r=e.placeholder.exec(i)))throw new SyntaxError("[sprintf] unexpected placeholder");if(r[2]){a|=1;var o=[],p=r[2],c=[];if(null===(c=e.key.exec(p)))throw new SyntaxError("[sprintf] failed to parse named argument key");for(o.push(c[1]);""!==(p=p.substring(c[0].length));)if(null!==(c=e.key_access.exec(p)))o.push(c[1]);else{if(null===(c=e.index_access.exec(p)))throw new SyntaxError("[sprintf] failed to parse named argument key");o.push(c[1])}r[2]=o}else a|=2;if(3===a)throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");s.push({placeholder:r[0],param_no:r[1],keys:r[2],sign:r[3],pad_char:r[4],align:r[5],width:r[6],precision:r[7],type:r[8]})}i=i.substring(r[0].length)}return n[t]=s}(r),arguments)}function r(e,r){return t.apply(null,[e].concat(r||[]))}var n=Object.create(null);"undefined"!=typeof exports&&(exports.sprintf=t,exports.vsprintf=r),"undefined"!=typeof window&&(window.sprintf=t,window.vsprintf=r,"function"==typeof define&&define.amd&&define(function(){return{sprintf:t,vsprintf:r}}))}();
