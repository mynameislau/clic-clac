!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports["clic-clac"]=e():t["clic-clac"]=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=10)}([function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=t.exports={version:"2.5.1"};"number"==typeof __e&&(__e=n)},function(t,e,n){var r=n(16),a=n(21);t.exports=n(4)?function(t,e,n){return r.f(t,e,a(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){t.exports=!n(7)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){var n=e||document;return Array.prototype.slice.call(n.querySelectorAll(t))}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.isOrContains=function(t,e){return t===e||t.contains(e)};var r=e.updateState=function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0;t.getAttribute(e)!==n&&(t.setAttribute(e,n),r&&r())};e.updateAndDispatch=function(t,e,n){var a=new CustomEvent("clic-clac-state-update",{detail:{element:t,attribute:e,prevState:t.getAttribute(e),newState:n}});r(t,e,n,function(){return t.dispatchEvent(a)})}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e,n){"use strict";n(11),n(12)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.addExpand=void 0;var r=function(t){return t&&t.__esModule?t:{default:t}}(n(5)),a=n(6),o={},i=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];(0,a.updateAndDispatch)(t,"data-initial-state",e?"true":"false")},u=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];t.controllerElements.forEach(function(n){(0,a.updateAndDispatch)(n,"aria-pressed",t.expanded?"true":"false"),i(n,e)}),(0,a.updateAndDispatch)(t.controlledElement,"aria-expanded",t.expanded?"true":"false"),i(t.controlledElement,e),window.requestAnimationFrame&&window.requestAnimationFrame(function(){window.dispatchEvent(new Event("resize"))})},c=function(t){var e=t.controlledID;!1===t.expanded&&(t.controlledElement.setAttribute("id",""),window.requestAnimationFrame(function(){t.controlledElement.setAttribute("id",e)}))},l=function(t){t.expanded=!t.expanded,u(t),c(t)},s=function(t,e){t.controllerElements.push(e),e.setAttribute("aria-controls",t.controlledID)},f=function(t){try{window.document.querySelector(":target")===t.controlledElement&&l(t)}catch(t){}},d=function(t){var e=t.getAttribute("data-controls"),n=window.document.getElementById(e),r="true"===t.getAttribute("data-expand-default-state"),o=n.getAttribute("role"),i={controllerElements:[],controlledElement:n,controlledID:e,defaultState:r,expanded:r},c=i.controllerElements;return i.controlledElement.setAttribute("role",o||"region"),window.document.documentElement.addEventListener("click",function(t){c.reduce(function(e,n){return(0,a.isOrContains)(n,t.target)?n:e},null)&&l(i)}),u(i,!0),s(i,t),u(i,!1),f(i),i},p=e.addExpand=function(t){var e=t.getAttribute("data-controls");o[e]?s(o[e],t):o[e]=d(t)};(0,r.default)("[data-expand]").forEach(p)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.setMultiselectable=e.setKeepOneTabSelected=e.addTablist=void 0,n(13);var r=function(t){return t&&t.__esModule?t:{default:t}}(n(5)),a=n(6),o=[],i=function(t,e){return t.tabs.filter(function(t){return t!==e&&t.selected&&t.tabPanelID!==e.tabPanelID}).length>0},u=function(t,e){return t.tabPanelID===e},c=function(t,e){var n=!t.selected,r=!1===n&&!i(e,t)&&e.keepOneTabSelected,a=e.tabs.filter(function(e){return u(e,t.tabPanelID)});r||e.tabs.forEach(function(t){var r=a.includes(t);!r&&!e.multiselectable&&(t.selected=!1),r&&(t.selected=n)})},l=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];(0,a.updateAndDispatch)(t,"data-initial-state",e?"true":"false")},s=function(t,e){return t.reduce(function(t,n){return(0,a.isOrContains)(n,e)?n:t},null)},f=function(t,e){return t.reduce(function(t,n){return(0,a.isOrContains)(n.tabElement,e)?n:t},null)},d=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=t.tabs.some(function(t){return t.selected});(0,a.updateAndDispatch)(t.tablistElement,"aria-multiselectable",t.multiselectable?"true":"false"),(0,a.updateAndDispatch)(t.tablistElement,"data-has-selected-tab",n?"true":"false"),t.tabs.forEach(function(t){var r=t.selected?"true":"false";(0,a.updateAndDispatch)(t.tabPanelElement,"aria-expanded",r),(0,a.updateAndDispatch)(t.tabElement,"aria-selected",r),(0,a.updateAndDispatch)(t.tabPanelElement,"data-tablist-has-tab-selected",n?"true":"false"),l(t.tabPanelElement,e),l(t.tabElement,e),t.tabPanelElement.className=t.tabPanelElement.className,t.tabElement.className=t.tabElement.className})},p=function(t){t.tabs.forEach(function(t){t.selected=!1}),d(t)},b=function(t,e){return t+" "+e},m=function(t){t.tabElement.setAttribute("role","tab"),t.tabElement.setAttribute("id",t.tabID),t.tabElement.setAttribute("aria-controls",t.tabPanelID),t.tabPanelElement.setAttribute("aria-labelledby",t.tabID),t.tabPanelElement.setAttribute("role","tabpanel")},v=function(t,e,n){return function(r){var a=s(t,r.target),o=s(n,r.target),i=f(e.tabs,r.target),u=null!==a,l=null!==o,b=!u&&!l;u&&(c(i,e),d(e)),b&&"deselect"===e.clickOutside&&p(e)}},h=function(t){t.tablistElement.setAttribute("id",t.tablistID),t.tablistElement.setAttribute("role","tablist"),t.tablistElement.setAttribute("aria-multiselectable",t.multiselectable?"true":"false"),t.tablistElement.setAttribute("aria-owns",t.tabs.map(function(t){return t.tabID}).reduce(b))},E=function(t){h(t),t.tabs.forEach(m);var e=t.tabs.map(function(t){return t.tabElement}),n=t.tabs.map(function(t){return t.tabPanelElement});window.document.body.addEventListener("click",v(e,t,n));var r=0===t.tabs.filter(function(t){return t.selected}).length;return t.keepOneTabSelected&&r&&c(t.tabs[0],t),d(t,!0),t},y=function(t,e,n){var r="true"===t.getAttribute("data-expand-default-state"),a=r,o=t.getAttribute("data-tab-for");return{tabElement:t,tabPanelElement:window.document.getElementById(o),defaultState:a,tablistID:e,tabID:t.getAttribute("id")||e+"-tab-"+n,tabPanelID:o,selected:r}},x=function(t){var e=t.getAttribute("data-tablist")||t.getAttribute("id"),n=(0,r.default)('[data-owner="'+e+'"]').map(function(t,n){return y(t,e,n)});return{tablistID:e,tabs:n,updateHash:!1,keepOneTabSelected:"true"===t.getAttribute("data-at-least-one"),multiselectable:"true"===t.getAttribute("data-multiselectable"),tablistElement:t,clickOutside:t.getAttribute("data-click-outside")}},g=function(t){return o.reduce(function(e,n){return n.tablistID===t?n:e},null)},A=e.addTablist=function(t){o.push(E(x(t)))};e.setKeepOneTabSelected=function(t,e){var n=g(t);n.keepOneTabSelected=e,d(n)},e.setMultiselectable=function(t,e){var n=g(t);n.multiselectable=e,d(n)};(0,r.default)("[data-tablist]").forEach(A)},function(t,e,n){n(14),t.exports=n(1).Array.includes},function(t,e,n){"use strict";var r=n(15),a=n(26)(!0);r(r.P,"Array",{includes:function(t){return a(this,t,arguments.length>1?arguments[1]:void 0)}}),n(33)("includes")},function(t,e,n){var r=n(0),a=n(1),o=n(2),i=n(22),u=n(24),c=function(t,e,n){var l,s,f,d,p=t&c.F,b=t&c.G,m=t&c.S,v=t&c.P,h=t&c.B,E=b?r:m?r[e]||(r[e]={}):(r[e]||{}).prototype,y=b?a:a[e]||(a[e]={}),x=y.prototype||(y.prototype={});b&&(n=e);for(l in n)f=((s=!p&&E&&void 0!==E[l])?E:n)[l],d=h&&s?u(f,r):v&&"function"==typeof f?u(Function.call,f):f,E&&i(E,l,f,t&c.U),y[l]!=f&&o(y,l,d),v&&x[l]!=f&&(x[l]=f)};r.core=a,c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,e,n){var r=n(17),a=n(18),o=n(20),i=Object.defineProperty;e.f=n(4)?Object.defineProperty:function(t,e,n){if(r(t),e=o(e,!0),r(n),a)try{return i(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var r=n(3);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){t.exports=!n(4)&&!n(7)(function(){return 7!=Object.defineProperty(n(19)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(3),a=n(0).document,o=r(a)&&r(a.createElement);t.exports=function(t){return o?a.createElement(t):{}}},function(t,e,n){var r=n(3);t.exports=function(t,e){if(!r(t))return t;var n,a;if(e&&"function"==typeof(n=t.toString)&&!r(a=n.call(t)))return a;if("function"==typeof(n=t.valueOf)&&!r(a=n.call(t)))return a;if(!e&&"function"==typeof(n=t.toString)&&!r(a=n.call(t)))return a;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){var r=n(0),a=n(2),o=n(23),i=n(8)("src"),u=Function.toString,c=(""+u).split("toString");n(1).inspectSource=function(t){return u.call(t)},(t.exports=function(t,e,n,u){var l="function"==typeof n;l&&(o(n,"name")||a(n,"name",e)),t[e]!==n&&(l&&(o(n,i)||a(n,i,t[e]?""+t[e]:c.join(String(e)))),t===r?t[e]=n:u?t[e]?t[e]=n:a(t,e,n):(delete t[e],a(t,e,n)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[i]||u.call(this)})},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var r=n(25);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,a){return t.call(e,n,r,a)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){var r=n(27),a=n(31),o=n(32);t.exports=function(t){return function(e,n,i){var u,c=r(e),l=a(c.length),s=o(i,l);if(t&&n!=n){for(;l>s;)if((u=c[s++])!=u)return!0}else for(;l>s;s++)if((t||s in c)&&c[s]===n)return t||s||0;return!t&&-1}}},function(t,e,n){var r=n(28),a=n(30);t.exports=function(t){return r(a(t))}},function(t,e,n){var r=n(29);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var r=n(9),a=Math.min;t.exports=function(t){return t>0?a(r(t),9007199254740991):0}},function(t,e,n){var r=n(9),a=Math.max,o=Math.min;t.exports=function(t,e){return(t=r(t))<0?a(t+e,0):o(t,e)}},function(t,e,n){var r=n(34)("unscopables"),a=Array.prototype;void 0==a[r]&&n(2)(a,r,{}),t.exports=function(t){a[r][t]=!0}},function(t,e,n){var r=n(35)("wks"),a=n(8),o=n(0).Symbol,i="function"==typeof o;(t.exports=function(t){return r[t]||(r[t]=i&&o[t]||(i?o:a)("Symbol."+t))}).store=r},function(t,e,n){var r=n(0),a=r["__core-js_shared__"]||(r["__core-js_shared__"]={});t.exports=function(t){return a[t]||(a[t]={})}}])});
//# sourceMappingURL=clic-clac.js.map