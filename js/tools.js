var tools = (function(){
	var toolsObj = {
		$:function(selector,context){
		  /*
		  * #id
		  * .class
		  * 标签
		  * "#id li"
		  * ".class a"
		  * */
		  context = context || document;
		  if(selector.indexOf(" ") !== -1){
			return context.querySelectorAll(selector);
		  }else if( selector.charAt(0) === "#" ){
			return document.getElementById(selector.slice(1))
		  }else if( selector.charAt(0) === "." ){
			return context.getElementsByClassName(selector.slice(1));
		  }else{
			return context.getElementsByTagName(selector);
		  }
		},
		addEvent:function(ele,eventName,eventFn){
			ele.addEventListener(eventName,eventFn,false);
		},
		removeEvent:function(ele,eventName,eventFn){
			ele.removeEventListener(eventName,eventFn,false);
		},
		addClass:function (element,clsNames){
			if( typeof clsNames === "string" ){
				if(!tools.hasClass(element,clsNames)){
					element.className += " "+clsNames;
				}
			}
		},
		removeClass:function (element,clsNames){
			var classNameArr = element.className.split(" ");
			for( var i = 0; i < classNameArr.length; i++ ){
				if( classNameArr[i] === clsNames ){
					classNameArr.splice(i,1);
					i--;
				}
			}
			element.className = classNameArr.join(" ");
		},
		hasClass:function(ele,classNames){
			
			var classNameArr = ele.className.split(" ");
			for( var i = 0; i < classNameArr.length; i++ ){
				if( classNameArr[i] === classNames ){
					return true;
				}
			}

			return false;
		},
 fadeIn:function(elem) {
      tools.setOpacity(elem, 0); // 初始全透明
      for (var i = 0; i <= 20; i++) { // 透明度改变 20 * 5 = 100
         (function () {
           var level = i * 5;  // 透明度每次变化值
           setTimeout(function() {
              tools. setOpacity(elem, level)
           },i*25); // i * 25 即为每次改变透明度的时间间隔，自行设定
         })(i);     // 每次循环变化一次
      }
  },
  fadeOut : function(elem) {
       for(var i = 0;i<=20;i++) { // 透明度改变 20 * 5 = 100
       (function () {
          var level = 100 - i * 5; // 透明度每次变化值
          setTimeout(function () {
           tools.setOpacity(elem, level)
       },i*25); // i * 25 即为每次改变透明度的时间间隔，自行设定
      })(i);     // 每次循环变化一次
     }
  },
 setOpacity:function(elem, level) {
     if (elem.filters) {
         elem.style.filter = 'alpha(opacity=' + level + ')';
     } else {
        elem.style.opacity = level / 100;
     }
  },
  // 封装ajax
  ajax :function(obj) {
      var xhr = (function () {
          if (typeof XMLHttpRequest != 'undefined') {
              return new XMLHttpRequest();
          } else if (typeof ActiveXObject != 'undefined') {
             var version = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
             for (var i = 0; version.length; i++) {
                 try {
                     return new ActiveXObject(version[i]);
                  } catch (e) {
              // 跳过
                  }  
              }
          } else {
              throw new Error('您的系统或浏览器不支持XHR对象！');
          }
      })();

      obj.url = obj.url + '?rand=' + Math.random();
      obj.data = (function (data) {
         var arr = [];
         for (var i in data) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
          }
          return arr.join('&');
      })(obj.data);

      if (obj.method === 'get') obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
      if (obj.async === true) {
           xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          callback();
      }
     }; }

     xhr.open(obj.method, obj.url, obj.async);
      if (obj.method === 'post') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.send(obj.data);
      } else {
          xhr.send(null);
      }
      if (obj.async === false) {
          callback();
      }

      function callback() {
          if (xhr.status == 200) {
              obj.success(xhr.responseText); // 回调传递参数
          } else {
              alert('获取数据错误!错误代号:' + xhr.status + ',错误信息:' + xhr.statusText);
          }
      }
  },
  setCookietime:function(days){
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 3600 * 1000);
    return date;
  },
  setCookie:function(name, value, expires, path, domain, secure){
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
  },
  getCookie:function(){
    var cookie = {};
    var all = document.cookie;
    if (all === '')
        return cookie;
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
  },
  removeCookie:function(name, path, domain){
    tools.setCookie(name, '', 0, path, domain);
  },
	}
    return toolsObj;
}())