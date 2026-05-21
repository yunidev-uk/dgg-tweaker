// ==UserScript==
// @name         DGG Tweaks
// @namespace    https://github.com/dgg-tweaker
// @version      1.20
// @description  UI Tweaks for destiny.gg
// @author       DGG Tweaks contributors
// @match        https://www.destiny.gg/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(function () {
globalThis.DGG_TWEAKS_VERSION = "1.20";
globalThis.DGG_TWEAKS_CSS = {"css/base.css":":root {\n    --dgg-tweaks-links-icon: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20class%3D%22lucide%20lucide-link%22%3E%3Cpath%20d%3D%22M10%2013a5%205%200%200%200%207.54.54l3-3a5%205%200%200%200-7.07-7.07l-1.72%201.71%22%2F%3E%3Cpath%20d%3D%22M14%2011a5%205%200%200%200-7.54-.54l-3%203a5%205%200%200%200%207.07%207.07l1.71-1.71%22%2F%3E%3C%2Fsvg%3E\");\n    --dgg-tweaks-mentions-icon: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20class%3D%22lucide%20lucide-at-sign%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%224%22%2F%3E%3Cpath%20d%3D%22M16%208v5a3%203%200%200%200%206%200v-1a10%2010%200%201%200-4%208%22%2F%3E%3C%2Fsvg%3E\");\n    --dgg-tweaks-logs-icon: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20class%3D%22lucide%20lucide-logs%22%3E%3Cpath%20d%3D%22M3%205h1%22%2F%3E%3Cpath%20d%3D%22M3%2012h1%22%2F%3E%3Cpath%20d%3D%22M3%2019h1%22%2F%3E%3Cpath%20d%3D%22M8%205h1%22%2F%3E%3Cpath%20d%3D%22M8%2012h1%22%2F%3E%3Cpath%20d%3D%22M8%2019h1%22%2F%3E%3Cpath%20d%3D%22M13%205h8%22%2F%3E%3Cpath%20d%3D%22M13%2012h8%22%2F%3E%3Cpath%20d%3D%22M13%2019h8%22%2F%3E%3C%2Fsvg%3E\");\n}\n\n.shell-layout-content__inner .user-info__field {\n    display: flex;\n    align-items: center;\n    justify-content: end;\n}\n.shell-layout-content__inner input[type=\"checkbox\"] {\n    appearance: none;\n    background-color: #18191b;\n    margin: 0;\n    overflow: hidden;\n    font: inherit;\n    color: #edeef0;\n    width: 2rem;\n    height: 2rem;\n    border: 1px solid #43484e;\n    border-radius: 0.625rem;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    transition: background-color 150ms ease 0s, border-color 150ms ease 0s;\n}\n.shell-layout-content__inner input[type=\"checkbox\"]:hover {\n    border-color:  #0090ff;\n}\n.shell-layout-content__inner input[type=\"checkbox\"]:checked {\n    background-color: #0090ff;\n    border-color:  #0090ff;\n}\n.shell-layout-content__inner section > div.user-info__section {\n    border: none;\n}\n.shell-layout-content__inner section > .profile-heading {\n    margin-bottom: 1.5rem;\n}\n\ninput.form-control {\n    margin-left: 0.5em;\n    border-radius: .25em;\n    padding: .3em;\n}\n\n#dgg-tweaks-settings {\n    margin-top: 1rem;\n    padding-top: 1rem;\n    border-top: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n#dgg-tweaks-settings .dgg-tweaks-settings-title {\n    margin: 0 0 0.45rem;\n    padding: 0 0 0 0.6em;\n    font-size: 1.35rem;\n    font-weight: 700;\n    line-height: 1.2;\n}\n\n#dgg-tweaks-settings .dgg-tweaks-settings-section {\n    margin-top: 1rem;\n}\n\n#dgg-tweaks-settings .dgg-tweaks-settings-section:first-of-type {\n    margin-top: 0;\n}\n\n#dgg-tweaks-settings .dgg-tweaks-settings-heading {\n    font-size: .9em;\n    margin-top: 1.8em;\n    margin-bottom: .9em;\n    padding-left: .9em;\n    color: #494949;\n    text-transform: uppercase;\n    font-weight: 600;\n}\n\n.dgg-tweaks-update-dialog {\n    position: absolute;\n    top: 50%;\n    bottom: 50%;\n    left: 50%;\n    right: 50%;\n    width: max-content;\n    transform: translate(-50%);\n    color: white;\n    font: 600 2.25rem/2.25rem Poppins,system-ui,sans-serif;\n}\n.dgg-tweaks-update-dialog:focus-visible {\n    outline: none;\n}\n.dgg-tweaks-update-dialog *:focus-visible {\n    outline: none;\n}\n.dgg-tweaks-update-dialog::backdrop {\n    background-color: rgba(0, 0, 0, 0.8);\n}\n.dgg-tweaks-update-dialog ul {\n    list-style: inside;\n}\n.dgg-tweaks-update-dialog .card__description {\n    max-width: 32em;\n    max-height: 32em;\n    overflow-y: auto;\n}\n.dgg-tweaks-update-dialog .card__description p {\n    margin-top: 0.5em;\n    margin-bottom: 1.5em;\n}\n.dgg-tweaks-update-dialog .card__description p:last-child {\n    margin-bottom: 0em;\n}\n.dgg-tweaks-update-dialog .card__description p:first-child {\n    margin-top: 0em;\n}\n.dgg-tweaks-update-dialog .card__field-container {\n    flex-grow: 1;\n    display: flex;\n    gap: 0.5rem;\n    align-items: center;\n}\n.dgg-tweaks-update-dialog .card__field-label {\n    font: 400 .88rem/1.25rem Inter,system-ui,sans-serif;\n}\n.dgg-tweaks-update-dialog .card__field {\n    display: flex;\n}\n.dgg-tweaks-update-dialog input[type=\"checkbox\"] {\n    appearance: none;\n    background-color: #18191b;\n    margin: 0;\n    overflow: hidden;\n    font: inherit;\n    color: #edeef0;\n    width: 1rem;\n    height: 1rem;\n    border: 1px solid #43484e;\n    border-radius: 0.3125rem;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    transition: background-color 150ms ease 0s, border-color 150ms ease 0s;\n}\n.dgg-tweaks-update-dialog input[type=\"checkbox\"]:hover {\n    border-color:  #0090ff;\n}\n.dgg-tweaks-update-dialog input[type=\"checkbox\"]:checked {\n    background-color: #0090ff;\n    border-color:  #0090ff;\n}\n\n#chat-tools-wrap #chat-aggregate-links-btn .btn-icon.btn-icon {\n    background: rgba(0,0,0,0) var(--dgg-tweaks-links-icon) no-repeat center center;\n    background-size: contain;\n}\n\n.dgg-tweaks-aggregate-links {\n    display: flex;\n    flex-direction: column;\n}\n\n#chat-tools-wrap #dgg-tweaks-mentions-btn .btn-icon.btn-icon {\n    background: rgba(0,0,0,0) var(--dgg-tweaks-mentions-icon) no-repeat center center;\n    background-size: contain;\n}\n\n#chat-tools-wrap #dgg-tweaks-rustlesearch-btn .btn-icon.btn-icon {\n    background: rgba(0,0,0,0) var(--dgg-tweaks-logs-icon) no-repeat center center;\n    background-size: contain;\n}\n\n.dgg-tweaks-mentions-popup {\n    background: #080808;\n    padding: 8px 0px;\n}\n\ndiv.tippy-content:has(> .dgg-tweaks-mentions-popup) {\n    padding: 1px;\n    border-radius: 6px;\n    overflow: hidden;\n}\n\n#dgg-tweaks-mentions-button.dgg-tweaks-setting:has(input:not(:checked)) ~ #dgg-tweaks-mentions-force-timestamps.dgg-tweaks-setting {\n    display: none !important;\n}\n\n\n#dgg-tweaks-menubar-hover {\n    position: absolute;\n    top: 0%;\n    left: 0%;\n    right: 0%;\n    height: 64px;\n}\n\n.bigscreen .stream-panel--theater .header.dgg-tweaks-show-in-cinema-mode {\n    z-index: 25;\n    transition: transform 0.125s;\n    background-color: #111113;\n    transform: translateY(-100%);\n}\n.bigscreen .stream-panel--theater .header.dgg-tweaks-show-in-cinema-mode.active {\n    transform: translateY(0%);\n}\n\n\n#dgg-tweaks-controls-hover {\n    position: absolute;\n    bottom: 0%;\n    left: 0%;\n    right: 0%;\n    height: 64px;\n}\n\n.bigscreen .stream-panel--theater #stream-controls.dgg-tweaks-show-in-cinema-mode {\n    display: flex;\n    position: absolute;\n    bottom: 0px;\n    padding: 2em;\n    padding-top: 0;\n    transform: translateY(calc(100%));\n    transition: transform 0.125s;\n}\n.bigscreen .stream-panel--theater #stream-controls.dgg-tweaks-show-in-cinema-mode.active {\n    transform: translateY(0px);\n}\n\n@media (orientation: portrait), (max-width: 40rem) {\n    .bigscreen .stream-panel--theater #stream-controls.dgg-tweaks-show-in-cinema-mode {\n        transform: translateY(0px);\n        transition: none;\n    }\n    .bigscreen .stream-panel--theater #stream-controls.dgg-tweaks-show-in-cinema-mode {\n        background-color: #111113;\n        position: inherit;\n        flex-direction: row;\n        justify-content: space-between;\n        padding: 1rem;\n        display: flex;\n        gap: 1rem;\n        z-index: 3;\n        width: 100%;\n    }\n}\n","css/link-size.css":".msg-chat .text a.externallink {\n    position: relative;\n    display: inline;\n    border-width: 0px;\n    z-index: 1;\n    padding: calc(var(--link-size) * 0.5em) calc(var(--link-size) * 0.5em);\n    margin: calc(var(--link-size) * -0.5em);\n    -webkit-box-decoration-break: clone;\n    box-decoration-break: clone;\n}\n\n.msg-chat a.nsfw-link::after {\n    content: \"\";\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    border-style: dashed;\n    border-width: 1px 0 1px 0;\n    border-color: rgba(0,0,0,0) rgba(0,0,0,0) red rgba(0,0,0,0);\n    left: 0px;\n    right: 0px;\n}\n\n.msg-chat a.nsfl-link::after {\n    content: \"\";\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    border-style: dashed;\n    border-width: 1px 0 1px 0;\n    border-color: rgba(0,0,0,0) rgba(0,0,0,0) #fff000 rgba(0,0,0,0);\n    left: 0px;\n    right: 0px;\n}\n\n.msg-chat a.spoilers-link::after {\n    content: \"\";\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    border-style: dashed;\n    border-width: 1px 0 1px 0;\n    border-color: rgba(0,0,0,0) rgba(0,0,0,0) #ff80ce rgba(0,0,0,0);\n    left: 0px;\n    right: 0px;\n}\n\n.msg-chat .user {\n    position: relative;\n    z-index: 2;\n}\n\n.msg-chat a.embed-button {\n    z-index: 2;\n}\n","css/link-size-debug.css":".msg-chat .text a.externallink {\n    box-shadow: 0 0 0 1px #0090ff;\n}\n","css/resize-user-info.css":"#chat-user-info {\n    height: 300px;\n    max-width: none;\n}\n\n#chat-user-info .stalk.stalk {\n    min-height: 0px;\n    height: revert;\n    flex-grow: 1;\n}\n\n.chat-menu-inner.floating-window.floating-window {\n    height: 100% !important;\n}\n\n.user-info {\n    min-height: 0px;\n    display: flex;\n    flex-direction: column;\n    flex-grow: 1;\n}\n\n.resize-vertical {\n    width: calc(100% - 4px);\n    height: 8px;\n    position: absolute;\n    left: 0px;  \n    bottom: -4px;\n    cursor: ns-resize;\n}\n\n.resize-horizontal {\n    width: 8px;\n    height: calc(100% - 4px);\n    position: absolute;\n    top: 0px;\n    right: -4px;\n    cursor: ew-resize;\n}\n\n.resize-diagonal {\n    width: 12px;\n    height: 12px;\n    position: absolute;\n    bottom: -4px;\n    right: -4px;\n    cursor: nwse-resize;\n}","css/dgg-layout-fix.css":"body .navbar.navbar {\n    padding: .5rem 0;\n    gap: 1rem;\n}\nbody .navbar__item.navbar__item {\n    padding: 0 .5rem;\n}\nbody .navbar__items.navbar__socials.navbar__socials {\n  gap: 0;\n}\nbody .navbar__items.navbar__socials .navbar__icon.navbar__icon {\n  height: 1.5rem;\n}\n\nheader:has(~ #stream-wrap .stream-controls[data-embed-type=\"offline\"]) #close-embed-btn#close-embed-btn,\nheader:has(~ #stream-wrap .stream-controls[data-embed-type=\"live\"]) #close-embed-btn#close-embed-btn,\nheader:has(~ #stream-wrap .stream-controls[data-embed-type=\"host\"]) #close-embed-btn#close-embed-btn {\n  display: none;\n}\nheader:has(~ #stream-wrap .stream-controls[data-embed-type=\"embed\"]) #change-platform-btn#change-platform-btn,\nheader:has(~ #stream-wrap .stream-controls[data-embed-type=\"offline\"]) #change-platform-btn#change-platform-btn {\n  display: none;\n}\n\nbody .button.button {\n  padding: 0 .4rem;\n  height: 2rem;\n  align-self: center;\n}\n\nbody #stream-wrap#stream-wrap {\n  padding: 0;\n}\nbody #stream-controls#stream-controls {\n  gap: 0;\n  padding: 0 .5rem;\n}\nbody #stream-controls .stream-controls__group.stream-controls__group {\n  gap: 0;\n}\nbody #control-buttons#control-buttons {\n  min-width: fit-content; /* prevent vertical stacking */\n}\nbody .navbar__logo.navbar__logo {\n  min-width: fit-content; /* prevent horizontal squishing */\n}\nbody .stream-controls__group.stream-controls__group {\n  flex-direction: row;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  padding-bottom: 3px;\n}\nbody .control-badges.control-badges {\n  align-content: center;\n}\n@media (orientation: portrait), (max-width: 40rem) {\n  body .stream-panel .control-buttons.control-buttons {\n    flex-direction: row;\n    align-self: center;\n  }\n  body .stream-panel .stream-controls.stream-controls {\n    padding: 0;\n    flex-direction: column;\n  }\n}\n\n@container (width < 930px) {\n  body .control-buttons .button.button span {\n    display: none;\n  }\n  body .navbar__items .button.button span {\n    display: none;\n  }\n}\n@container (width < 1050px) {\n  body .navbar__socials.navbar__socials {\n    display: none;\n  }\n}"};

(function (module, exports, define, require) {
/**
 * @popperjs/core v2.11.8 - MIT License
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Popper={})}(this,(function(e){"use strict";function t(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function n(e){return e instanceof t(e).Element||e instanceof Element}function r(e){return e instanceof t(e).HTMLElement||e instanceof HTMLElement}function o(e){return"undefined"!=typeof ShadowRoot&&(e instanceof t(e).ShadowRoot||e instanceof ShadowRoot)}var i=Math.max,a=Math.min,s=Math.round;function f(){var e=navigator.userAgentData;return null!=e&&e.brands&&Array.isArray(e.brands)?e.brands.map((function(e){return e.brand+"/"+e.version})).join(" "):navigator.userAgent}function c(){return!/^((?!chrome|android).)*safari/i.test(f())}function p(e,o,i){void 0===o&&(o=!1),void 0===i&&(i=!1);var a=e.getBoundingClientRect(),f=1,p=1;o&&r(e)&&(f=e.offsetWidth>0&&s(a.width)/e.offsetWidth||1,p=e.offsetHeight>0&&s(a.height)/e.offsetHeight||1);var u=(n(e)?t(e):window).visualViewport,l=!c()&&i,d=(a.left+(l&&u?u.offsetLeft:0))/f,h=(a.top+(l&&u?u.offsetTop:0))/p,m=a.width/f,v=a.height/p;return{width:m,height:v,top:h,right:d+m,bottom:h+v,left:d,x:d,y:h}}function u(e){var n=t(e);return{scrollLeft:n.pageXOffset,scrollTop:n.pageYOffset}}function l(e){return e?(e.nodeName||"").toLowerCase():null}function d(e){return((n(e)?e.ownerDocument:e.document)||window.document).documentElement}function h(e){return p(d(e)).left+u(e).scrollLeft}function m(e){return t(e).getComputedStyle(e)}function v(e){var t=m(e),n=t.overflow,r=t.overflowX,o=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+o+r)}function y(e,n,o){void 0===o&&(o=!1);var i,a,f=r(n),c=r(n)&&function(e){var t=e.getBoundingClientRect(),n=s(t.width)/e.offsetWidth||1,r=s(t.height)/e.offsetHeight||1;return 1!==n||1!==r}(n),m=d(n),y=p(e,c,o),g={scrollLeft:0,scrollTop:0},b={x:0,y:0};return(f||!f&&!o)&&(("body"!==l(n)||v(m))&&(g=(i=n)!==t(i)&&r(i)?{scrollLeft:(a=i).scrollLeft,scrollTop:a.scrollTop}:u(i)),r(n)?((b=p(n,!0)).x+=n.clientLeft,b.y+=n.clientTop):m&&(b.x=h(m))),{x:y.left+g.scrollLeft-b.x,y:y.top+g.scrollTop-b.y,width:y.width,height:y.height}}function g(e){var t=p(e),n=e.offsetWidth,r=e.offsetHeight;return Math.abs(t.width-n)<=1&&(n=t.width),Math.abs(t.height-r)<=1&&(r=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:r}}function b(e){return"html"===l(e)?e:e.assignedSlot||e.parentNode||(o(e)?e.host:null)||d(e)}function x(e){return["html","body","#document"].indexOf(l(e))>=0?e.ownerDocument.body:r(e)&&v(e)?e:x(b(e))}function w(e,n){var r;void 0===n&&(n=[]);var o=x(e),i=o===(null==(r=e.ownerDocument)?void 0:r.body),a=t(o),s=i?[a].concat(a.visualViewport||[],v(o)?o:[]):o,f=n.concat(s);return i?f:f.concat(w(b(s)))}function O(e){return["table","td","th"].indexOf(l(e))>=0}function j(e){return r(e)&&"fixed"!==m(e).position?e.offsetParent:null}function E(e){for(var n=t(e),i=j(e);i&&O(i)&&"static"===m(i).position;)i=j(i);return i&&("html"===l(i)||"body"===l(i)&&"static"===m(i).position)?n:i||function(e){var t=/firefox/i.test(f());if(/Trident/i.test(f())&&r(e)&&"fixed"===m(e).position)return null;var n=b(e);for(o(n)&&(n=n.host);r(n)&&["html","body"].indexOf(l(n))<0;){var i=m(n);if("none"!==i.transform||"none"!==i.perspective||"paint"===i.contain||-1!==["transform","perspective"].indexOf(i.willChange)||t&&"filter"===i.willChange||t&&i.filter&&"none"!==i.filter)return n;n=n.parentNode}return null}(e)||n}var D="top",A="bottom",L="right",P="left",M="auto",k=[D,A,L,P],W="start",B="end",H="viewport",T="popper",R=k.reduce((function(e,t){return e.concat([t+"-"+W,t+"-"+B])}),[]),S=[].concat(k,[M]).reduce((function(e,t){return e.concat([t,t+"-"+W,t+"-"+B])}),[]),V=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"];function q(e){var t=new Map,n=new Set,r=[];function o(e){n.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach((function(e){if(!n.has(e)){var r=t.get(e);r&&o(r)}})),r.push(e)}return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){n.has(e.name)||o(e)})),r}function C(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&o(n)){var r=t;do{if(r&&e.isSameNode(r))return!0;r=r.parentNode||r.host}while(r)}return!1}function N(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function I(e,r,o){return r===H?N(function(e,n){var r=t(e),o=d(e),i=r.visualViewport,a=o.clientWidth,s=o.clientHeight,f=0,p=0;if(i){a=i.width,s=i.height;var u=c();(u||!u&&"fixed"===n)&&(f=i.offsetLeft,p=i.offsetTop)}return{width:a,height:s,x:f+h(e),y:p}}(e,o)):n(r)?function(e,t){var n=p(e,!1,"fixed"===t);return n.top=n.top+e.clientTop,n.left=n.left+e.clientLeft,n.bottom=n.top+e.clientHeight,n.right=n.left+e.clientWidth,n.width=e.clientWidth,n.height=e.clientHeight,n.x=n.left,n.y=n.top,n}(r,o):N(function(e){var t,n=d(e),r=u(e),o=null==(t=e.ownerDocument)?void 0:t.body,a=i(n.scrollWidth,n.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),s=i(n.scrollHeight,n.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),f=-r.scrollLeft+h(e),c=-r.scrollTop;return"rtl"===m(o||n).direction&&(f+=i(n.clientWidth,o?o.clientWidth:0)-a),{width:a,height:s,x:f,y:c}}(d(e)))}function _(e,t,o,s){var f="clippingParents"===t?function(e){var t=w(b(e)),o=["absolute","fixed"].indexOf(m(e).position)>=0&&r(e)?E(e):e;return n(o)?t.filter((function(e){return n(e)&&C(e,o)&&"body"!==l(e)})):[]}(e):[].concat(t),c=[].concat(f,[o]),p=c[0],u=c.reduce((function(t,n){var r=I(e,n,s);return t.top=i(r.top,t.top),t.right=a(r.right,t.right),t.bottom=a(r.bottom,t.bottom),t.left=i(r.left,t.left),t}),I(e,p,s));return u.width=u.right-u.left,u.height=u.bottom-u.top,u.x=u.left,u.y=u.top,u}function F(e){return e.split("-")[0]}function U(e){return e.split("-")[1]}function z(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function X(e){var t,n=e.reference,r=e.element,o=e.placement,i=o?F(o):null,a=o?U(o):null,s=n.x+n.width/2-r.width/2,f=n.y+n.height/2-r.height/2;switch(i){case D:t={x:s,y:n.y-r.height};break;case A:t={x:s,y:n.y+n.height};break;case L:t={x:n.x+n.width,y:f};break;case P:t={x:n.x-r.width,y:f};break;default:t={x:n.x,y:n.y}}var c=i?z(i):null;if(null!=c){var p="y"===c?"height":"width";switch(a){case W:t[c]=t[c]-(n[p]/2-r[p]/2);break;case B:t[c]=t[c]+(n[p]/2-r[p]/2)}}return t}function Y(e){return Object.assign({},{top:0,right:0,bottom:0,left:0},e)}function G(e,t){return t.reduce((function(t,n){return t[n]=e,t}),{})}function J(e,t){void 0===t&&(t={});var r=t,o=r.placement,i=void 0===o?e.placement:o,a=r.strategy,s=void 0===a?e.strategy:a,f=r.boundary,c=void 0===f?"clippingParents":f,u=r.rootBoundary,l=void 0===u?H:u,h=r.elementContext,m=void 0===h?T:h,v=r.altBoundary,y=void 0!==v&&v,g=r.padding,b=void 0===g?0:g,x=Y("number"!=typeof b?b:G(b,k)),w=m===T?"reference":T,O=e.rects.popper,j=e.elements[y?w:m],E=_(n(j)?j:j.contextElement||d(e.elements.popper),c,l,s),P=p(e.elements.reference),M=X({reference:P,element:O,strategy:"absolute",placement:i}),W=N(Object.assign({},O,M)),B=m===T?W:P,R={top:E.top-B.top+x.top,bottom:B.bottom-E.bottom+x.bottom,left:E.left-B.left+x.left,right:B.right-E.right+x.right},S=e.modifiersData.offset;if(m===T&&S){var V=S[i];Object.keys(R).forEach((function(e){var t=[L,A].indexOf(e)>=0?1:-1,n=[D,A].indexOf(e)>=0?"y":"x";R[e]+=V[n]*t}))}return R}var K={placement:"bottom",modifiers:[],strategy:"absolute"};function Q(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some((function(e){return!(e&&"function"==typeof e.getBoundingClientRect)}))}function Z(e){void 0===e&&(e={});var t=e,r=t.defaultModifiers,o=void 0===r?[]:r,i=t.defaultOptions,a=void 0===i?K:i;return function(e,t,r){void 0===r&&(r=a);var i,s,f={placement:"bottom",orderedModifiers:[],options:Object.assign({},K,a),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},c=[],p=!1,u={state:f,setOptions:function(r){var i="function"==typeof r?r(f.options):r;l(),f.options=Object.assign({},a,f.options,i),f.scrollParents={reference:n(e)?w(e):e.contextElement?w(e.contextElement):[],popper:w(t)};var s,p,d=function(e){var t=q(e);return V.reduce((function(e,n){return e.concat(t.filter((function(e){return e.phase===n})))}),[])}((s=[].concat(o,f.options.modifiers),p=s.reduce((function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e}),{}),Object.keys(p).map((function(e){return p[e]}))));return f.orderedModifiers=d.filter((function(e){return e.enabled})),f.orderedModifiers.forEach((function(e){var t=e.name,n=e.options,r=void 0===n?{}:n,o=e.effect;if("function"==typeof o){var i=o({state:f,name:t,instance:u,options:r}),a=function(){};c.push(i||a)}})),u.update()},forceUpdate:function(){if(!p){var e=f.elements,t=e.reference,n=e.popper;if(Q(t,n)){f.rects={reference:y(t,E(n),"fixed"===f.options.strategy),popper:g(n)},f.reset=!1,f.placement=f.options.placement,f.orderedModifiers.forEach((function(e){return f.modifiersData[e.name]=Object.assign({},e.data)}));for(var r=0;r<f.orderedModifiers.length;r++)if(!0!==f.reset){var o=f.orderedModifiers[r],i=o.fn,a=o.options,s=void 0===a?{}:a,c=o.name;"function"==typeof i&&(f=i({state:f,options:s,name:c,instance:u})||f)}else f.reset=!1,r=-1}}},update:(i=function(){return new Promise((function(e){u.forceUpdate(),e(f)}))},function(){return s||(s=new Promise((function(e){Promise.resolve().then((function(){s=void 0,e(i())}))}))),s}),destroy:function(){l(),p=!0}};if(!Q(e,t))return u;function l(){c.forEach((function(e){return e()})),c=[]}return u.setOptions(r).then((function(e){!p&&r.onFirstUpdate&&r.onFirstUpdate(e)})),u}}var $={passive:!0};var ee={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var n=e.state,r=e.instance,o=e.options,i=o.scroll,a=void 0===i||i,s=o.resize,f=void 0===s||s,c=t(n.elements.popper),p=[].concat(n.scrollParents.reference,n.scrollParents.popper);return a&&p.forEach((function(e){e.addEventListener("scroll",r.update,$)})),f&&c.addEventListener("resize",r.update,$),function(){a&&p.forEach((function(e){e.removeEventListener("scroll",r.update,$)})),f&&c.removeEventListener("resize",r.update,$)}},data:{}};var te={name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,n=e.name;t.modifiersData[n]=X({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},ne={top:"auto",right:"auto",bottom:"auto",left:"auto"};function re(e){var n,r=e.popper,o=e.popperRect,i=e.placement,a=e.variation,f=e.offsets,c=e.position,p=e.gpuAcceleration,u=e.adaptive,l=e.roundOffsets,h=e.isFixed,v=f.x,y=void 0===v?0:v,g=f.y,b=void 0===g?0:g,x="function"==typeof l?l({x:y,y:b}):{x:y,y:b};y=x.x,b=x.y;var w=f.hasOwnProperty("x"),O=f.hasOwnProperty("y"),j=P,M=D,k=window;if(u){var W=E(r),H="clientHeight",T="clientWidth";if(W===t(r)&&"static"!==m(W=d(r)).position&&"absolute"===c&&(H="scrollHeight",T="scrollWidth"),W=W,i===D||(i===P||i===L)&&a===B)M=A,b-=(h&&W===k&&k.visualViewport?k.visualViewport.height:W[H])-o.height,b*=p?1:-1;if(i===P||(i===D||i===A)&&a===B)j=L,y-=(h&&W===k&&k.visualViewport?k.visualViewport.width:W[T])-o.width,y*=p?1:-1}var R,S=Object.assign({position:c},u&&ne),V=!0===l?function(e,t){var n=e.x,r=e.y,o=t.devicePixelRatio||1;return{x:s(n*o)/o||0,y:s(r*o)/o||0}}({x:y,y:b},t(r)):{x:y,y:b};return y=V.x,b=V.y,p?Object.assign({},S,((R={})[M]=O?"0":"",R[j]=w?"0":"",R.transform=(k.devicePixelRatio||1)<=1?"translate("+y+"px, "+b+"px)":"translate3d("+y+"px, "+b+"px, 0)",R)):Object.assign({},S,((n={})[M]=O?b+"px":"",n[j]=w?y+"px":"",n.transform="",n))}var oe={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options,r=n.gpuAcceleration,o=void 0===r||r,i=n.adaptive,a=void 0===i||i,s=n.roundOffsets,f=void 0===s||s,c={placement:F(t.placement),variation:U(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:o,isFixed:"fixed"===t.options.strategy};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,re(Object.assign({},c,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:a,roundOffsets:f})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,re(Object.assign({},c,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:f})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}};var ie={name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var n=t.styles[e]||{},o=t.attributes[e]||{},i=t.elements[e];r(i)&&l(i)&&(Object.assign(i.style,n),Object.keys(o).forEach((function(e){var t=o[e];!1===t?i.removeAttribute(e):i.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,n.popper),t.styles=n,t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow),function(){Object.keys(t.elements).forEach((function(e){var o=t.elements[e],i=t.attributes[e]||{},a=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:n[e]).reduce((function(e,t){return e[t]="",e}),{});r(o)&&l(o)&&(Object.assign(o.style,a),Object.keys(i).forEach((function(e){o.removeAttribute(e)})))}))}},requires:["computeStyles"]};var ae={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.options,r=e.name,o=n.offset,i=void 0===o?[0,0]:o,a=S.reduce((function(e,n){return e[n]=function(e,t,n){var r=F(e),o=[P,D].indexOf(r)>=0?-1:1,i="function"==typeof n?n(Object.assign({},t,{placement:e})):n,a=i[0],s=i[1];return a=a||0,s=(s||0)*o,[P,L].indexOf(r)>=0?{x:s,y:a}:{x:a,y:s}}(n,t.rects,i),e}),{}),s=a[t.placement],f=s.x,c=s.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=f,t.modifiersData.popperOffsets.y+=c),t.modifiersData[r]=a}},se={left:"right",right:"left",bottom:"top",top:"bottom"};function fe(e){return e.replace(/left|right|bottom|top/g,(function(e){return se[e]}))}var ce={start:"end",end:"start"};function pe(e){return e.replace(/start|end/g,(function(e){return ce[e]}))}function ue(e,t){void 0===t&&(t={});var n=t,r=n.placement,o=n.boundary,i=n.rootBoundary,a=n.padding,s=n.flipVariations,f=n.allowedAutoPlacements,c=void 0===f?S:f,p=U(r),u=p?s?R:R.filter((function(e){return U(e)===p})):k,l=u.filter((function(e){return c.indexOf(e)>=0}));0===l.length&&(l=u);var d=l.reduce((function(t,n){return t[n]=J(e,{placement:n,boundary:o,rootBoundary:i,padding:a})[F(n)],t}),{});return Object.keys(d).sort((function(e,t){return d[e]-d[t]}))}var le={name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name;if(!t.modifiersData[r]._skip){for(var o=n.mainAxis,i=void 0===o||o,a=n.altAxis,s=void 0===a||a,f=n.fallbackPlacements,c=n.padding,p=n.boundary,u=n.rootBoundary,l=n.altBoundary,d=n.flipVariations,h=void 0===d||d,m=n.allowedAutoPlacements,v=t.options.placement,y=F(v),g=f||(y===v||!h?[fe(v)]:function(e){if(F(e)===M)return[];var t=fe(e);return[pe(e),t,pe(t)]}(v)),b=[v].concat(g).reduce((function(e,n){return e.concat(F(n)===M?ue(t,{placement:n,boundary:p,rootBoundary:u,padding:c,flipVariations:h,allowedAutoPlacements:m}):n)}),[]),x=t.rects.reference,w=t.rects.popper,O=new Map,j=!0,E=b[0],k=0;k<b.length;k++){var B=b[k],H=F(B),T=U(B)===W,R=[D,A].indexOf(H)>=0,S=R?"width":"height",V=J(t,{placement:B,boundary:p,rootBoundary:u,altBoundary:l,padding:c}),q=R?T?L:P:T?A:D;x[S]>w[S]&&(q=fe(q));var C=fe(q),N=[];if(i&&N.push(V[H]<=0),s&&N.push(V[q]<=0,V[C]<=0),N.every((function(e){return e}))){E=B,j=!1;break}O.set(B,N)}if(j)for(var I=function(e){var t=b.find((function(t){var n=O.get(t);if(n)return n.slice(0,e).every((function(e){return e}))}));if(t)return E=t,"break"},_=h?3:1;_>0;_--){if("break"===I(_))break}t.placement!==E&&(t.modifiersData[r]._skip=!0,t.placement=E,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}};function de(e,t,n){return i(e,a(t,n))}var he={name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name,o=n.mainAxis,s=void 0===o||o,f=n.altAxis,c=void 0!==f&&f,p=n.boundary,u=n.rootBoundary,l=n.altBoundary,d=n.padding,h=n.tether,m=void 0===h||h,v=n.tetherOffset,y=void 0===v?0:v,b=J(t,{boundary:p,rootBoundary:u,padding:d,altBoundary:l}),x=F(t.placement),w=U(t.placement),O=!w,j=z(x),M="x"===j?"y":"x",k=t.modifiersData.popperOffsets,B=t.rects.reference,H=t.rects.popper,T="function"==typeof y?y(Object.assign({},t.rects,{placement:t.placement})):y,R="number"==typeof T?{mainAxis:T,altAxis:T}:Object.assign({mainAxis:0,altAxis:0},T),S=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,V={x:0,y:0};if(k){if(s){var q,C="y"===j?D:P,N="y"===j?A:L,I="y"===j?"height":"width",_=k[j],X=_+b[C],Y=_-b[N],G=m?-H[I]/2:0,K=w===W?B[I]:H[I],Q=w===W?-H[I]:-B[I],Z=t.elements.arrow,$=m&&Z?g(Z):{width:0,height:0},ee=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},te=ee[C],ne=ee[N],re=de(0,B[I],$[I]),oe=O?B[I]/2-G-re-te-R.mainAxis:K-re-te-R.mainAxis,ie=O?-B[I]/2+G+re+ne+R.mainAxis:Q+re+ne+R.mainAxis,ae=t.elements.arrow&&E(t.elements.arrow),se=ae?"y"===j?ae.clientTop||0:ae.clientLeft||0:0,fe=null!=(q=null==S?void 0:S[j])?q:0,ce=_+ie-fe,pe=de(m?a(X,_+oe-fe-se):X,_,m?i(Y,ce):Y);k[j]=pe,V[j]=pe-_}if(c){var ue,le="x"===j?D:P,he="x"===j?A:L,me=k[M],ve="y"===M?"height":"width",ye=me+b[le],ge=me-b[he],be=-1!==[D,P].indexOf(x),xe=null!=(ue=null==S?void 0:S[M])?ue:0,we=be?ye:me-B[ve]-H[ve]-xe+R.altAxis,Oe=be?me+B[ve]+H[ve]-xe-R.altAxis:ge,je=m&&be?function(e,t,n){var r=de(e,t,n);return r>n?n:r}(we,me,Oe):de(m?we:ye,me,m?Oe:ge);k[M]=je,V[M]=je-me}t.modifiersData[r]=V}},requiresIfExists:["offset"]};var me={name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state,r=e.name,o=e.options,i=n.elements.arrow,a=n.modifiersData.popperOffsets,s=F(n.placement),f=z(s),c=[P,L].indexOf(s)>=0?"height":"width";if(i&&a){var p=function(e,t){return Y("number"!=typeof(e="function"==typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e)?e:G(e,k))}(o.padding,n),u=g(i),l="y"===f?D:P,d="y"===f?A:L,h=n.rects.reference[c]+n.rects.reference[f]-a[f]-n.rects.popper[c],m=a[f]-n.rects.reference[f],v=E(i),y=v?"y"===f?v.clientHeight||0:v.clientWidth||0:0,b=h/2-m/2,x=p[l],w=y-u[c]-p[d],O=y/2-u[c]/2+b,j=de(x,O,w),M=f;n.modifiersData[r]=((t={})[M]=j,t.centerOffset=j-O,t)}},effect:function(e){var t=e.state,n=e.options.element,r=void 0===n?"[data-popper-arrow]":n;null!=r&&("string"!=typeof r||(r=t.elements.popper.querySelector(r)))&&C(t.elements.popper,r)&&(t.elements.arrow=r)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function ve(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function ye(e){return[D,L,A,P].some((function(t){return e[t]>=0}))}var ge={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,n=e.name,r=t.rects.reference,o=t.rects.popper,i=t.modifiersData.preventOverflow,a=J(t,{elementContext:"reference"}),s=J(t,{altBoundary:!0}),f=ve(a,r),c=ve(s,o,i),p=ye(f),u=ye(c);t.modifiersData[n]={referenceClippingOffsets:f,popperEscapeOffsets:c,isReferenceHidden:p,hasPopperEscaped:u},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":p,"data-popper-escaped":u})}},be=Z({defaultModifiers:[ee,te,oe,ie]}),xe=[ee,te,oe,ie,ae,le,he,me,ge],we=Z({defaultModifiers:xe});e.applyStyles=ie,e.arrow=me,e.computeStyles=oe,e.createPopper=we,e.createPopperLite=be,e.defaultModifiers=xe,e.detectOverflow=J,e.eventListeners=ee,e.flip=le,e.hide=ge,e.offset=ae,e.popperGenerator=Z,e.popperOffsets=te,e.preventOverflow=he,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=popper.min.js.map

}).call(globalThis, undefined, undefined, undefined, undefined);

(function (module, exports, define, require) {
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("@popperjs/core")):"function"==typeof define&&define.amd?define(["@popperjs/core"],e):(t=t||self).tippy=e(t.Popper)}(this,(function(t){"use strict";var e="undefined"!=typeof window&&"undefined"!=typeof document,n=!!e&&!!window.msCrypto,r={passive:!0,capture:!0},o=function(){return document.body};function i(t,e,n){if(Array.isArray(t)){var r=t[e];return null==r?Array.isArray(n)?n[e]:n:r}return t}function a(t,e){var n={}.toString.call(t);return 0===n.indexOf("[object")&&n.indexOf(e+"]")>-1}function s(t,e){return"function"==typeof t?t.apply(void 0,e):t}function u(t,e){return 0===e?t:function(r){clearTimeout(n),n=setTimeout((function(){t(r)}),e)};var n}function p(t,e){var n=Object.assign({},t);return e.forEach((function(t){delete n[t]})),n}function c(t){return[].concat(t)}function f(t,e){-1===t.indexOf(e)&&t.push(e)}function l(t){return t.split("-")[0]}function d(t){return[].slice.call(t)}function v(t){return Object.keys(t).reduce((function(e,n){return void 0!==t[n]&&(e[n]=t[n]),e}),{})}function m(){return document.createElement("div")}function g(t){return["Element","Fragment"].some((function(e){return a(t,e)}))}function h(t){return a(t,"MouseEvent")}function b(t){return!(!t||!t._tippy||t._tippy.reference!==t)}function y(t){return g(t)?[t]:function(t){return a(t,"NodeList")}(t)?d(t):Array.isArray(t)?t:d(document.querySelectorAll(t))}function w(t,e){t.forEach((function(t){t&&(t.style.transitionDuration=e+"ms")}))}function x(t,e){t.forEach((function(t){t&&t.setAttribute("data-state",e)}))}function E(t){var e,n=c(t)[0];return null!=n&&null!=(e=n.ownerDocument)&&e.body?n.ownerDocument:document}function O(t,e,n){var r=e+"EventListener";["transitionend","webkitTransitionEnd"].forEach((function(e){t[r](e,n)}))}function C(t,e){for(var n=e;n;){var r;if(t.contains(n))return!0;n=null==n.getRootNode||null==(r=n.getRootNode())?void 0:r.host}return!1}var T={isTouch:!1},A=0;function L(){T.isTouch||(T.isTouch=!0,window.performance&&document.addEventListener("mousemove",D))}function D(){var t=performance.now();t-A<20&&(T.isTouch=!1,document.removeEventListener("mousemove",D)),A=t}function k(){var t=document.activeElement;if(b(t)){var e=t._tippy;t.blur&&!e.state.isVisible&&t.blur()}}var R=Object.assign({appendTo:o,aria:{content:"auto",expanded:"auto"},delay:0,duration:[300,250],getReferenceClientRect:null,hideOnClick:!0,ignoreAttributes:!1,interactive:!1,interactiveBorder:2,interactiveDebounce:0,moveTransition:"",offset:[0,10],onAfterUpdate:function(){},onBeforeUpdate:function(){},onCreate:function(){},onDestroy:function(){},onHidden:function(){},onHide:function(){},onMount:function(){},onShow:function(){},onShown:function(){},onTrigger:function(){},onUntrigger:function(){},onClickOutside:function(){},placement:"top",plugins:[],popperOptions:{},render:null,showOnCreate:!1,touch:!0,trigger:"mouseenter focus",triggerTarget:null},{animateFill:!1,followCursor:!1,inlinePositioning:!1,sticky:!1},{allowHTML:!1,animation:"fade",arrow:!0,content:"",inertia:!1,maxWidth:350,role:"tooltip",theme:"",zIndex:9999}),P=Object.keys(R);function j(t){var e=(t.plugins||[]).reduce((function(e,n){var r,o=n.name,i=n.defaultValue;o&&(e[o]=void 0!==t[o]?t[o]:null!=(r=R[o])?r:i);return e}),{});return Object.assign({},t,e)}function M(t,e){var n=Object.assign({},e,{content:s(e.content,[t])},e.ignoreAttributes?{}:function(t,e){return(e?Object.keys(j(Object.assign({},R,{plugins:e}))):P).reduce((function(e,n){var r=(t.getAttribute("data-tippy-"+n)||"").trim();if(!r)return e;if("content"===n)e[n]=r;else try{e[n]=JSON.parse(r)}catch(t){e[n]=r}return e}),{})}(t,e.plugins));return n.aria=Object.assign({},R.aria,n.aria),n.aria={expanded:"auto"===n.aria.expanded?e.interactive:n.aria.expanded,content:"auto"===n.aria.content?e.interactive?null:"describedby":n.aria.content},n}function V(t,e){t.innerHTML=e}function I(t){var e=m();return!0===t?e.className="tippy-arrow":(e.className="tippy-svg-arrow",g(t)?e.appendChild(t):V(e,t)),e}function S(t,e){g(e.content)?(V(t,""),t.appendChild(e.content)):"function"!=typeof e.content&&(e.allowHTML?V(t,e.content):t.textContent=e.content)}function B(t){var e=t.firstElementChild,n=d(e.children);return{box:e,content:n.find((function(t){return t.classList.contains("tippy-content")})),arrow:n.find((function(t){return t.classList.contains("tippy-arrow")||t.classList.contains("tippy-svg-arrow")})),backdrop:n.find((function(t){return t.classList.contains("tippy-backdrop")}))}}function N(t){var e=m(),n=m();n.className="tippy-box",n.setAttribute("data-state","hidden"),n.setAttribute("tabindex","-1");var r=m();function o(n,r){var o=B(e),i=o.box,a=o.content,s=o.arrow;r.theme?i.setAttribute("data-theme",r.theme):i.removeAttribute("data-theme"),"string"==typeof r.animation?i.setAttribute("data-animation",r.animation):i.removeAttribute("data-animation"),r.inertia?i.setAttribute("data-inertia",""):i.removeAttribute("data-inertia"),i.style.maxWidth="number"==typeof r.maxWidth?r.maxWidth+"px":r.maxWidth,r.role?i.setAttribute("role",r.role):i.removeAttribute("role"),n.content===r.content&&n.allowHTML===r.allowHTML||S(a,t.props),r.arrow?s?n.arrow!==r.arrow&&(i.removeChild(s),i.appendChild(I(r.arrow))):i.appendChild(I(r.arrow)):s&&i.removeChild(s)}return r.className="tippy-content",r.setAttribute("data-state","hidden"),S(r,t.props),e.appendChild(n),n.appendChild(r),o(t.props,t.props),{popper:e,onUpdate:o}}N.$$tippy=!0;var H=1,U=[],_=[];function z(e,a){var p,g,b,y,A,L,D,k,P=M(e,Object.assign({},R,j(v(a)))),V=!1,I=!1,S=!1,N=!1,z=[],F=u(wt,P.interactiveDebounce),W=H++,X=(k=P.plugins).filter((function(t,e){return k.indexOf(t)===e})),Y={id:W,reference:e,popper:m(),popperInstance:null,props:P,state:{isEnabled:!0,isVisible:!1,isDestroyed:!1,isMounted:!1,isShown:!1},plugins:X,clearDelayTimeouts:function(){clearTimeout(p),clearTimeout(g),cancelAnimationFrame(b)},setProps:function(t){if(Y.state.isDestroyed)return;at("onBeforeUpdate",[Y,t]),bt();var n=Y.props,r=M(e,Object.assign({},n,v(t),{ignoreAttributes:!0}));Y.props=r,ht(),n.interactiveDebounce!==r.interactiveDebounce&&(pt(),F=u(wt,r.interactiveDebounce));n.triggerTarget&&!r.triggerTarget?c(n.triggerTarget).forEach((function(t){t.removeAttribute("aria-expanded")})):r.triggerTarget&&e.removeAttribute("aria-expanded");ut(),it(),J&&J(n,r);Y.popperInstance&&(Ct(),At().forEach((function(t){requestAnimationFrame(t._tippy.popperInstance.forceUpdate)})));at("onAfterUpdate",[Y,t])},setContent:function(t){Y.setProps({content:t})},show:function(){var t=Y.state.isVisible,e=Y.state.isDestroyed,n=!Y.state.isEnabled,r=T.isTouch&&!Y.props.touch,a=i(Y.props.duration,0,R.duration);if(t||e||n||r)return;if(et().hasAttribute("disabled"))return;if(at("onShow",[Y],!1),!1===Y.props.onShow(Y))return;Y.state.isVisible=!0,tt()&&($.style.visibility="visible");it(),dt(),Y.state.isMounted||($.style.transition="none");if(tt()){var u=rt(),p=u.box,c=u.content;w([p,c],0)}L=function(){var t;if(Y.state.isVisible&&!N){if(N=!0,$.offsetHeight,$.style.transition=Y.props.moveTransition,tt()&&Y.props.animation){var e=rt(),n=e.box,r=e.content;w([n,r],a),x([n,r],"visible")}st(),ut(),f(_,Y),null==(t=Y.popperInstance)||t.forceUpdate(),at("onMount",[Y]),Y.props.animation&&tt()&&function(t,e){mt(t,e)}(a,(function(){Y.state.isShown=!0,at("onShown",[Y])}))}},function(){var t,e=Y.props.appendTo,n=et();t=Y.props.interactive&&e===o||"parent"===e?n.parentNode:s(e,[n]);t.contains($)||t.appendChild($);Y.state.isMounted=!0,Ct()}()},hide:function(){var t=!Y.state.isVisible,e=Y.state.isDestroyed,n=!Y.state.isEnabled,r=i(Y.props.duration,1,R.duration);if(t||e||n)return;if(at("onHide",[Y],!1),!1===Y.props.onHide(Y))return;Y.state.isVisible=!1,Y.state.isShown=!1,N=!1,V=!1,tt()&&($.style.visibility="hidden");if(pt(),vt(),it(!0),tt()){var o=rt(),a=o.box,s=o.content;Y.props.animation&&(w([a,s],r),x([a,s],"hidden"))}st(),ut(),Y.props.animation?tt()&&function(t,e){mt(t,(function(){!Y.state.isVisible&&$.parentNode&&$.parentNode.contains($)&&e()}))}(r,Y.unmount):Y.unmount()},hideWithInteractivity:function(t){nt().addEventListener("mousemove",F),f(U,F),F(t)},enable:function(){Y.state.isEnabled=!0},disable:function(){Y.hide(),Y.state.isEnabled=!1},unmount:function(){Y.state.isVisible&&Y.hide();if(!Y.state.isMounted)return;Tt(),At().forEach((function(t){t._tippy.unmount()})),$.parentNode&&$.parentNode.removeChild($);_=_.filter((function(t){return t!==Y})),Y.state.isMounted=!1,at("onHidden",[Y])},destroy:function(){if(Y.state.isDestroyed)return;Y.clearDelayTimeouts(),Y.unmount(),bt(),delete e._tippy,Y.state.isDestroyed=!0,at("onDestroy",[Y])}};if(!P.render)return Y;var q=P.render(Y),$=q.popper,J=q.onUpdate;$.setAttribute("data-tippy-root",""),$.id="tippy-"+Y.id,Y.popper=$,e._tippy=Y,$._tippy=Y;var G=X.map((function(t){return t.fn(Y)})),K=e.hasAttribute("aria-expanded");return ht(),ut(),it(),at("onCreate",[Y]),P.showOnCreate&&Lt(),$.addEventListener("mouseenter",(function(){Y.props.interactive&&Y.state.isVisible&&Y.clearDelayTimeouts()})),$.addEventListener("mouseleave",(function(){Y.props.interactive&&Y.props.trigger.indexOf("mouseenter")>=0&&nt().addEventListener("mousemove",F)})),Y;function Q(){var t=Y.props.touch;return Array.isArray(t)?t:[t,0]}function Z(){return"hold"===Q()[0]}function tt(){var t;return!(null==(t=Y.props.render)||!t.$$tippy)}function et(){return D||e}function nt(){var t=et().parentNode;return t?E(t):document}function rt(){return B($)}function ot(t){return Y.state.isMounted&&!Y.state.isVisible||T.isTouch||y&&"focus"===y.type?0:i(Y.props.delay,t?0:1,R.delay)}function it(t){void 0===t&&(t=!1),$.style.pointerEvents=Y.props.interactive&&!t?"":"none",$.style.zIndex=""+Y.props.zIndex}function at(t,e,n){var r;(void 0===n&&(n=!0),G.forEach((function(n){n[t]&&n[t].apply(n,e)})),n)&&(r=Y.props)[t].apply(r,e)}function st(){var t=Y.props.aria;if(t.content){var n="aria-"+t.content,r=$.id;c(Y.props.triggerTarget||e).forEach((function(t){var e=t.getAttribute(n);if(Y.state.isVisible)t.setAttribute(n,e?e+" "+r:r);else{var o=e&&e.replace(r,"").trim();o?t.setAttribute(n,o):t.removeAttribute(n)}}))}}function ut(){!K&&Y.props.aria.expanded&&c(Y.props.triggerTarget||e).forEach((function(t){Y.props.interactive?t.setAttribute("aria-expanded",Y.state.isVisible&&t===et()?"true":"false"):t.removeAttribute("aria-expanded")}))}function pt(){nt().removeEventListener("mousemove",F),U=U.filter((function(t){return t!==F}))}function ct(t){if(!T.isTouch||!S&&"mousedown"!==t.type){var n=t.composedPath&&t.composedPath()[0]||t.target;if(!Y.props.interactive||!C($,n)){if(c(Y.props.triggerTarget||e).some((function(t){return C(t,n)}))){if(T.isTouch)return;if(Y.state.isVisible&&Y.props.trigger.indexOf("click")>=0)return}else at("onClickOutside",[Y,t]);!0===Y.props.hideOnClick&&(Y.clearDelayTimeouts(),Y.hide(),I=!0,setTimeout((function(){I=!1})),Y.state.isMounted||vt())}}}function ft(){S=!0}function lt(){S=!1}function dt(){var t=nt();t.addEventListener("mousedown",ct,!0),t.addEventListener("touchend",ct,r),t.addEventListener("touchstart",lt,r),t.addEventListener("touchmove",ft,r)}function vt(){var t=nt();t.removeEventListener("mousedown",ct,!0),t.removeEventListener("touchend",ct,r),t.removeEventListener("touchstart",lt,r),t.removeEventListener("touchmove",ft,r)}function mt(t,e){var n=rt().box;function r(t){t.target===n&&(O(n,"remove",r),e())}if(0===t)return e();O(n,"remove",A),O(n,"add",r),A=r}function gt(t,n,r){void 0===r&&(r=!1),c(Y.props.triggerTarget||e).forEach((function(e){e.addEventListener(t,n,r),z.push({node:e,eventType:t,handler:n,options:r})}))}function ht(){var t;Z()&&(gt("touchstart",yt,{passive:!0}),gt("touchend",xt,{passive:!0})),(t=Y.props.trigger,t.split(/\s+/).filter(Boolean)).forEach((function(t){if("manual"!==t)switch(gt(t,yt),t){case"mouseenter":gt("mouseleave",xt);break;case"focus":gt(n?"focusout":"blur",Et);break;case"focusin":gt("focusout",Et)}}))}function bt(){z.forEach((function(t){var e=t.node,n=t.eventType,r=t.handler,o=t.options;e.removeEventListener(n,r,o)})),z=[]}function yt(t){var e,n=!1;if(Y.state.isEnabled&&!Ot(t)&&!I){var r="focus"===(null==(e=y)?void 0:e.type);y=t,D=t.currentTarget,ut(),!Y.state.isVisible&&h(t)&&U.forEach((function(e){return e(t)})),"click"===t.type&&(Y.props.trigger.indexOf("mouseenter")<0||V)&&!1!==Y.props.hideOnClick&&Y.state.isVisible?n=!0:Lt(t),"click"===t.type&&(V=!n),n&&!r&&Dt(t)}}function wt(t){var e=t.target,n=et().contains(e)||$.contains(e);"mousemove"===t.type&&n||function(t,e){var n=e.clientX,r=e.clientY;return t.every((function(t){var e=t.popperRect,o=t.popperState,i=t.props.interactiveBorder,a=l(o.placement),s=o.modifiersData.offset;if(!s)return!0;var u="bottom"===a?s.top.y:0,p="top"===a?s.bottom.y:0,c="right"===a?s.left.x:0,f="left"===a?s.right.x:0,d=e.top-r+u>i,v=r-e.bottom-p>i,m=e.left-n+c>i,g=n-e.right-f>i;return d||v||m||g}))}(At().concat($).map((function(t){var e,n=null==(e=t._tippy.popperInstance)?void 0:e.state;return n?{popperRect:t.getBoundingClientRect(),popperState:n,props:P}:null})).filter(Boolean),t)&&(pt(),Dt(t))}function xt(t){Ot(t)||Y.props.trigger.indexOf("click")>=0&&V||(Y.props.interactive?Y.hideWithInteractivity(t):Dt(t))}function Et(t){Y.props.trigger.indexOf("focusin")<0&&t.target!==et()||Y.props.interactive&&t.relatedTarget&&$.contains(t.relatedTarget)||Dt(t)}function Ot(t){return!!T.isTouch&&Z()!==t.type.indexOf("touch")>=0}function Ct(){Tt();var n=Y.props,r=n.popperOptions,o=n.placement,i=n.offset,a=n.getReferenceClientRect,s=n.moveTransition,u=tt()?B($).arrow:null,p=a?{getBoundingClientRect:a,contextElement:a.contextElement||et()}:e,c=[{name:"offset",options:{offset:i}},{name:"preventOverflow",options:{padding:{top:2,bottom:2,left:5,right:5}}},{name:"flip",options:{padding:5}},{name:"computeStyles",options:{adaptive:!s}},{name:"$$tippy",enabled:!0,phase:"beforeWrite",requires:["computeStyles"],fn:function(t){var e=t.state;if(tt()){var n=rt().box;["placement","reference-hidden","escaped"].forEach((function(t){"placement"===t?n.setAttribute("data-placement",e.placement):e.attributes.popper["data-popper-"+t]?n.setAttribute("data-"+t,""):n.removeAttribute("data-"+t)})),e.attributes.popper={}}}}];tt()&&u&&c.push({name:"arrow",options:{element:u,padding:3}}),c.push.apply(c,(null==r?void 0:r.modifiers)||[]),Y.popperInstance=t.createPopper(p,$,Object.assign({},r,{placement:o,onFirstUpdate:L,modifiers:c}))}function Tt(){Y.popperInstance&&(Y.popperInstance.destroy(),Y.popperInstance=null)}function At(){return d($.querySelectorAll("[data-tippy-root]"))}function Lt(t){Y.clearDelayTimeouts(),t&&at("onTrigger",[Y,t]),dt();var e=ot(!0),n=Q(),r=n[0],o=n[1];T.isTouch&&"hold"===r&&o&&(e=o),e?p=setTimeout((function(){Y.show()}),e):Y.show()}function Dt(t){if(Y.clearDelayTimeouts(),at("onUntrigger",[Y,t]),Y.state.isVisible){if(!(Y.props.trigger.indexOf("mouseenter")>=0&&Y.props.trigger.indexOf("click")>=0&&["mouseleave","mousemove"].indexOf(t.type)>=0&&V)){var e=ot(!1);e?g=setTimeout((function(){Y.state.isVisible&&Y.hide()}),e):b=requestAnimationFrame((function(){Y.hide()}))}}else vt()}}function F(t,e){void 0===e&&(e={});var n=R.plugins.concat(e.plugins||[]);document.addEventListener("touchstart",L,r),window.addEventListener("blur",k);var o=Object.assign({},e,{plugins:n}),i=y(t).reduce((function(t,e){var n=e&&z(e,o);return n&&t.push(n),t}),[]);return g(t)?i[0]:i}F.defaultProps=R,F.setDefaultProps=function(t){Object.keys(t).forEach((function(e){R[e]=t[e]}))},F.currentInput=T;var W=Object.assign({},t.applyStyles,{effect:function(t){var e=t.state,n={popper:{position:e.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};Object.assign(e.elements.popper.style,n.popper),e.styles=n,e.elements.arrow&&Object.assign(e.elements.arrow.style,n.arrow)}}),X={mouseover:"mouseenter",focusin:"focus",click:"click"};var Y={name:"animateFill",defaultValue:!1,fn:function(t){var e;if(null==(e=t.props.render)||!e.$$tippy)return{};var n=B(t.popper),r=n.box,o=n.content,i=t.props.animateFill?function(){var t=m();return t.className="tippy-backdrop",x([t],"hidden"),t}():null;return{onCreate:function(){i&&(r.insertBefore(i,r.firstElementChild),r.setAttribute("data-animatefill",""),r.style.overflow="hidden",t.setProps({arrow:!1,animation:"shift-away"}))},onMount:function(){if(i){var t=r.style.transitionDuration,e=Number(t.replace("ms",""));o.style.transitionDelay=Math.round(e/10)+"ms",i.style.transitionDuration=t,x([i],"visible")}},onShow:function(){i&&(i.style.transitionDuration="0ms")},onHide:function(){i&&x([i],"hidden")}}}};var q={clientX:0,clientY:0},$=[];function J(t){var e=t.clientX,n=t.clientY;q={clientX:e,clientY:n}}var G={name:"followCursor",defaultValue:!1,fn:function(t){var e=t.reference,n=E(t.props.triggerTarget||e),r=!1,o=!1,i=!0,a=t.props;function s(){return"initial"===t.props.followCursor&&t.state.isVisible}function u(){n.addEventListener("mousemove",f)}function p(){n.removeEventListener("mousemove",f)}function c(){r=!0,t.setProps({getReferenceClientRect:null}),r=!1}function f(n){var r=!n.target||e.contains(n.target),o=t.props.followCursor,i=n.clientX,a=n.clientY,s=e.getBoundingClientRect(),u=i-s.left,p=a-s.top;!r&&t.props.interactive||t.setProps({getReferenceClientRect:function(){var t=e.getBoundingClientRect(),n=i,r=a;"initial"===o&&(n=t.left+u,r=t.top+p);var s="horizontal"===o?t.top:r,c="vertical"===o?t.right:n,f="horizontal"===o?t.bottom:r,l="vertical"===o?t.left:n;return{width:c-l,height:f-s,top:s,right:c,bottom:f,left:l}}})}function l(){t.props.followCursor&&($.push({instance:t,doc:n}),function(t){t.addEventListener("mousemove",J)}(n))}function d(){0===($=$.filter((function(e){return e.instance!==t}))).filter((function(t){return t.doc===n})).length&&function(t){t.removeEventListener("mousemove",J)}(n)}return{onCreate:l,onDestroy:d,onBeforeUpdate:function(){a=t.props},onAfterUpdate:function(e,n){var i=n.followCursor;r||void 0!==i&&a.followCursor!==i&&(d(),i?(l(),!t.state.isMounted||o||s()||u()):(p(),c()))},onMount:function(){t.props.followCursor&&!o&&(i&&(f(q),i=!1),s()||u())},onTrigger:function(t,e){h(e)&&(q={clientX:e.clientX,clientY:e.clientY}),o="focus"===e.type},onHidden:function(){t.props.followCursor&&(c(),p(),i=!0)}}}};var K={name:"inlinePositioning",defaultValue:!1,fn:function(t){var e,n=t.reference;var r=-1,o=!1,i=[],a={name:"tippyInlinePositioning",enabled:!0,phase:"afterWrite",fn:function(o){var a=o.state;t.props.inlinePositioning&&(-1!==i.indexOf(a.placement)&&(i=[]),e!==a.placement&&-1===i.indexOf(a.placement)&&(i.push(a.placement),t.setProps({getReferenceClientRect:function(){return function(t){return function(t,e,n,r){if(n.length<2||null===t)return e;if(2===n.length&&r>=0&&n[0].left>n[1].right)return n[r]||e;switch(t){case"top":case"bottom":var o=n[0],i=n[n.length-1],a="top"===t,s=o.top,u=i.bottom,p=a?o.left:i.left,c=a?o.right:i.right;return{top:s,bottom:u,left:p,right:c,width:c-p,height:u-s};case"left":case"right":var f=Math.min.apply(Math,n.map((function(t){return t.left}))),l=Math.max.apply(Math,n.map((function(t){return t.right}))),d=n.filter((function(e){return"left"===t?e.left===f:e.right===l})),v=d[0].top,m=d[d.length-1].bottom;return{top:v,bottom:m,left:f,right:l,width:l-f,height:m-v};default:return e}}(l(t),n.getBoundingClientRect(),d(n.getClientRects()),r)}(a.placement)}})),e=a.placement)}};function s(){var e;o||(e=function(t,e){var n;return{popperOptions:Object.assign({},t.popperOptions,{modifiers:[].concat(((null==(n=t.popperOptions)?void 0:n.modifiers)||[]).filter((function(t){return t.name!==e.name})),[e])})}}(t.props,a),o=!0,t.setProps(e),o=!1)}return{onCreate:s,onAfterUpdate:s,onTrigger:function(e,n){if(h(n)){var o=d(t.reference.getClientRects()),i=o.find((function(t){return t.left-2<=n.clientX&&t.right+2>=n.clientX&&t.top-2<=n.clientY&&t.bottom+2>=n.clientY})),a=o.indexOf(i);r=a>-1?a:r}},onHidden:function(){r=-1}}}};var Q={name:"sticky",defaultValue:!1,fn:function(t){var e=t.reference,n=t.popper;function r(e){return!0===t.props.sticky||t.props.sticky===e}var o=null,i=null;function a(){var s=r("reference")?(t.popperInstance?t.popperInstance.state.elements.reference:e).getBoundingClientRect():null,u=r("popper")?n.getBoundingClientRect():null;(s&&Z(o,s)||u&&Z(i,u))&&t.popperInstance&&t.popperInstance.update(),o=s,i=u,t.state.isMounted&&requestAnimationFrame(a)}return{onMount:function(){t.props.sticky&&a()}}}};function Z(t,e){return!t||!e||(t.top!==e.top||t.right!==e.right||t.bottom!==e.bottom||t.left!==e.left)}return e&&function(t){var e=document.createElement("style");e.textContent=t,e.setAttribute("data-tippy-stylesheet","");var n=document.head,r=document.querySelector("head>style,head>link");r?n.insertBefore(e,r):n.appendChild(e)}('.tippy-box[data-animation=fade][data-state=hidden]{opacity:0}[data-tippy-root]{max-width:calc(100vw - 10px)}.tippy-box{position:relative;background-color:#333;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;white-space:normal;outline:0;transition-property:transform,visibility,opacity}.tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}.tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.tippy-box[data-placement^=left]>.tippy-arrow{right:0}.tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.tippy-box[data-placement^=right]>.tippy-arrow{left:0}.tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{width:16px;height:16px;color:#333}.tippy-arrow:before{content:"";position:absolute;border-color:transparent;border-style:solid}.tippy-content{position:relative;padding:5px 9px;z-index:1}'),F.setDefaultProps({plugins:[Y,G,K,Q],render:N}),F.createSingleton=function(t,e){var n;void 0===e&&(e={});var r,o=t,i=[],a=[],s=e.overrides,u=[],f=!1;function l(){a=o.map((function(t){return c(t.props.triggerTarget||t.reference)})).reduce((function(t,e){return t.concat(e)}),[])}function d(){i=o.map((function(t){return t.reference}))}function v(t){o.forEach((function(e){t?e.enable():e.disable()}))}function g(t){return o.map((function(e){var n=e.setProps;return e.setProps=function(o){n(o),e.reference===r&&t.setProps(o)},function(){e.setProps=n}}))}function h(t,e){var n=a.indexOf(e);if(e!==r){r=e;var u=(s||[]).concat("content").reduce((function(t,e){return t[e]=o[n].props[e],t}),{});t.setProps(Object.assign({},u,{getReferenceClientRect:"function"==typeof u.getReferenceClientRect?u.getReferenceClientRect:function(){var t;return null==(t=i[n])?void 0:t.getBoundingClientRect()}}))}}v(!1),d(),l();var b={fn:function(){return{onDestroy:function(){v(!0)},onHidden:function(){r=null},onClickOutside:function(t){t.props.showOnCreate&&!f&&(f=!0,r=null)},onShow:function(t){t.props.showOnCreate&&!f&&(f=!0,h(t,i[0]))},onTrigger:function(t,e){h(t,e.currentTarget)}}}},y=F(m(),Object.assign({},p(e,["overrides"]),{plugins:[b].concat(e.plugins||[]),triggerTarget:a,popperOptions:Object.assign({},e.popperOptions,{modifiers:[].concat((null==(n=e.popperOptions)?void 0:n.modifiers)||[],[W])})})),w=y.show;y.show=function(t){if(w(),!r&&null==t)return h(y,i[0]);if(!r||null!=t){if("number"==typeof t)return i[t]&&h(y,i[t]);if(o.indexOf(t)>=0){var e=t.reference;return h(y,e)}return i.indexOf(t)>=0?h(y,t):void 0}},y.showNext=function(){var t=i[0];if(!r)return y.show(0);var e=i.indexOf(r);y.show(i[e+1]||t)},y.showPrevious=function(){var t=i[i.length-1];if(!r)return y.show(t);var e=i.indexOf(r),n=i[e-1]||t;y.show(n)};var x=y.setProps;return y.setProps=function(t){s=t.overrides||s,x(t)},y.setInstances=function(t){v(!0),u.forEach((function(t){return t()})),o=t,v(!1),d(),l(),u=g(y),y.setProps({triggerTarget:a})},u=g(y),y},F.delegate=function(t,e){var n=[],o=[],i=!1,a=e.target,s=p(e,["target"]),u=Object.assign({},s,{trigger:"manual",touch:!1}),f=Object.assign({touch:R.touch},s,{showOnCreate:!0}),l=F(t,u);function d(t){if(t.target&&!i){var n=t.target.closest(a);if(n){var r=n.getAttribute("data-tippy-trigger")||e.trigger||R.trigger;if(!n._tippy&&!("touchstart"===t.type&&"boolean"==typeof f.touch||"touchstart"!==t.type&&r.indexOf(X[t.type])<0)){var s=F(n,f);s&&(o=o.concat(s))}}}}function v(t,e,r,o){void 0===o&&(o=!1),t.addEventListener(e,r,o),n.push({node:t,eventType:e,handler:r,options:o})}return c(l).forEach((function(t){var e=t.destroy,a=t.enable,s=t.disable;t.destroy=function(t){void 0===t&&(t=!0),t&&o.forEach((function(t){t.destroy()})),o=[],n.forEach((function(t){var e=t.node,n=t.eventType,r=t.handler,o=t.options;e.removeEventListener(n,r,o)})),n=[],e()},t.enable=function(){a(),o.forEach((function(t){return t.enable()})),i=!1},t.disable=function(){s(),o.forEach((function(t){return t.disable()})),i=!0},function(t){var e=t.reference;v(e,"touchstart",d,r),v(e,"mouseover",d),v(e,"focusin",d),v(e,"click",d)}(t)})),l},F.hideAll=function(t){var e=void 0===t?{}:t,n=e.exclude,r=e.duration;_.forEach((function(t){var e=!1;if(n&&(e=b(n)?t.reference===n:t.popper===n.popper),!e){var o=t.props.duration;t.setProps({duration:r}),t.hide(),t.state.isDestroyed||t.setProps({duration:o})}}))},F.roundArrow='<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>',F}));
//# sourceMappingURL=tippy-bundle.umd.min.js.map

}).call(globalThis, undefined, undefined, undefined, undefined);

var UTIL = (() => {

    function waitForCSS(href) {
        function check(observer, resolve) {
            const linkElement = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(link => link.href.includes(href));

            if (linkElement) {
                if (linkElement.sheet) {
                    observer.disconnect();
                    resolve(linkElement);
                } else {
                    linkElement.addEventListener('load', () => {
                        observer.disconnect();
                        resolve(linkElement);
                    });
                }
            }
        }
        return new Promise(resolve => {
            const observer = new MutationObserver(() => check(observer, resolve));

            observer.observe(document.head || document.documentElement, { childList: true, subtree: true });

            check(observer, resolve);
        });
    }

    function injectStylesheet(url, enabled = true) {
        const styleId = `dgg-tweaks-style-${url.replace(/[^a-z0-9_-]/gi, '-')}`;
        const existingLink = document.getElementById(styleId);
        if (existingLink !== null) {
            if (enabled) return;
            else existingLink.remove();
        }
        if (!enabled) return;

        const css = globalThis.DGG_TWEAKS_CSS?.[url];
        if (!css) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    return { waitForCSS, injectStylesheet };
})();

// Basic Declarative Markup to make HTML in JS
class HTMLNode {
    constructor(type, args = {}, ...children) {
        if (type === undefined) {
            this._args = {};
            this._children = [];
        } else {
            this._type = type;
            this._args = args;
            this._children = children.flat(Infinity);
        }
    }

    static fromElement(element) {
        const node = new HTMLNode();
        node._rawEl = element;
        return node;
    }

    build() {
        const el = this._rawEl ?? document.createElement(this._type);
        for (const key in this._args) {
            if (key === 'classes') el.classList.add(...this._args[key]);
            else if (key === 'events') {
                for (const type in this._args[key]) {
                    el.addEventListener(type, this._args[key][type]);
                }
            }
            else el[key] = this._args[key];
        }
        for (const child of this._children) {
            if (child === null || child === undefined || child === false) continue;
            if (typeof child === 'string') el.appendChild(document.createTextNode(child));
            else el.appendChild(child.build());
        }
        return el;
    }

    children(...children) {
        this._children.push(children.flat(Infinity));
        return this;
    }

    attrs(attrs) {
        Object.assign(this.args, attrs);
        return this;
    }
}
function el(type, args, ...children) {
    const node = new HTMLNode(type, args, ...children);
    return node;
}
function fromHTML(htmlElement) {
    return HTMLNode.fromElement(htmlElement);
}
function fromHTMLString(htmlString) {
    const container = document.createElement('div');
    container.innerHTML = htmlString;
    let nodes = [];
    for (const element of container.childNodes) {
        nodes.push(HTMLNode.fromElement(element));
    }
    container.remove();
    return nodes;
}


const REGEXES = (() => {
    const tlds = ["NORTHWESTERNMUTUAL", "TRAVELERSINSURANCE", "AMERICANEXPRESS", "KERRYPROPERTIES", "SANDVIKCOROMANT", "AFAMILYCOMPANY", "AMERICANFAMILY", "BANANAREPUBLIC", "CANCERRESEARCH", "COOKINGCHANNEL", "KERRYLOGISTICS", "WEATHERCHANNEL", "INTERNATIONAL", "LIFEINSURANCE", "SPREADBETTING", "TRAVELCHANNEL", "WOLTERSKLUWER", "CONSTRUCTION", "LPLFINANCIAL", "SCHOLARSHIPS", "VERSICHERUNG", "ACCOUNTANTS", "BARCLAYCARD", "BLACKFRIDAY", "BLOCKBUSTER", "BRIDGESTONE", "CALVINKLEIN", "CONTRACTORS", "CREDITUNION", "ENGINEERING", "ENTERPRISES", "FOODNETWORK", "INVESTMENTS", "KERRYHOTELS", "LAMBORGHINI", "MOTORCYCLES", "OLAYANGROUP", "PHOTOGRAPHY", "PLAYSTATION", "PRODUCTIONS", "PROGRESSIVE", "REDUMBRELLA", "RIGHTATHOME", "WILLIAMHILL", "ACCOUNTANT", "APARTMENTS", "ASSOCIATES", "BASKETBALL", "BNPPARIBAS", "BOEHRINGER", "CAPITALONE", "CONSULTING", "CREDITCARD", "CUISINELLA", "EUROVISION", "EXTRASPACE", "FOUNDATION", "HEALTHCARE", "IMMOBILIEN", "INDUSTRIES", "MANAGEMENT", "MITSUBISHI", "NATIONWIDE", "NEWHOLLAND", "NEXTDIRECT", "ONYOURSIDE", "PROPERTIES", "PROTECTION", "PRUDENTIAL", "REALESTATE", "REPUBLICAN", "RESTAURANT", "SCHAEFFLER", "SWIFTCOVER", "TATAMOTORS", "TECHNOLOGY", "TELEFONICA", "UNIVERSITY", "VISTAPRINT", "VLAANDEREN", "VOLKSWAGEN", "ACCENTURE", "ALFAROMEO", "ALLFINANZ", "AMSTERDAM", "ANALYTICS", "AQUARELLE", "BARCELONA", "BLOOMBERG", "CHRISTMAS", "COMMUNITY", "DIRECTORY", "EDUCATION", "EQUIPMENT", "FAIRWINDS", "FINANCIAL", "FIRESTONE", "FRESENIUS", "FRONTDOOR", "FUJIXEROX", "FURNITURE", "GOLDPOINT", "HISAMITSU", "HOMEDEPOT", "HOMEGOODS", "HOMESENSE", "HONEYWELL", "INSTITUTE", "INSURANCE", "KUOKGROUP", "LADBROKES", "LANCASTER", "LANDROVER", "LIFESTYLE", "MARKETING", "MARSHALLS", "MELBOURNE", "MICROSOFT", "PANASONIC", "PASSAGENS", "PRAMERICA", "RICHARDLI", "SCJOHNSON", "SHANGRILA", "SOLUTIONS", "STATEBANK", "STATEFARM", "STOCKHOLM", "TRAVELERS", "VACATIONS", "YODOBASHI", "ABUDHABI", "AIRFORCE", "ALLSTATE", "ATTORNEY", "BARCLAYS", "BAREFOOT", "BARGAINS", "BASEBALL", "BOUTIQUE", "BRADESCO", "BROADWAY", "BRUSSELS", "BUDAPEST", "BUILDERS", "BUSINESS", "CAPETOWN", "CATERING", "CATHOLIC", "CHRYSLER", "CIPRIANI", "CITYEATS", "CLEANING", "CLINIQUE", "CLOTHING", "COMMBANK", "COMPUTER", "DELIVERY", "DELOITTE", "DEMOCRAT", "DIAMONDS", "DISCOUNT", "DISCOVER", "DOWNLOAD", "ENGINEER", "ERICSSON", "ESURANCE", "ETISALAT", "EVERBANK", "EXCHANGE", "FEEDBACK", "FIDELITY", "FIRMDALE", "FOOTBALL", "FRONTIER", "GOODYEAR", "GRAINGER", "GRAPHICS", "GUARDIAN", "HDFCBANK", "HELSINKI", "HOLDINGS", "HOSPITAL", "INFINITI", "IPIRANGA", "ISTANBUL", "JPMORGAN", "LIGHTING", "LUNDBECK", "MARRIOTT", "MASERATI", "MCKINSEY", "MEMORIAL", "MERCKMSD", "MORTGAGE", "MOVISTAR", "OBSERVER", "PARTNERS", "PHARMACY", "PICTURES", "PLUMBING", "PROPERTY", "REDSTONE", "RELIANCE", "SAARLAND", "SAMSCLUB", "SECURITY", "SERVICES", "SHOPPING", "SHOWTIME", "SOFTBANK", "SOFTWARE", "STCGROUP", "SUPPLIES", "SYMANTEC", "TRAINING", "UCONNECT", "VANGUARD", "VENTURES", "VERISIGN", "WOODSIDE", "YOKOHAMA", "ABOGADO", "ACADEMY", "AGAKHAN", "ALIBABA", "ANDROID", "ATHLETA", "AUCTION", "AUDIBLE", "AUSPOST", "AVIANCA", "BANAMEX", "BAUHAUS", "BENTLEY", "BESTBUY", "BOOKING", "BROTHER", "BUGATTI", "CAPITAL", "CARAVAN", "CAREERS", "CARTIER", "CHANNEL", "CHARITY", "CHINTAI", "CITADEL", "CLUBMED", "COLLEGE", "COLOGNE", "COMCAST", "COMPANY", "COMPARE", "CONTACT", "COOKING", "CORSICA", "COUNTRY", "COUPONS", "COURSES", "CRICKET", "CRUISES", "DENTIST", "DIGITAL", "DOMAINS", "EXPOSED", "EXPRESS", "FARMERS", "FASHION", "FERRARI", "FERRERO", "FINANCE", "FISHING", "FITNESS", "FLIGHTS", "FLORIST", "FLOWERS", "FORSALE", "FROGANS", "FUJITSU", "GALLERY", "GENTING", "GODADDY", "GROCERY", "GUITARS", "HAMBURG", "HANGOUT", "HITACHI", "HOLIDAY", "HOSTING", "HOTELES", "HOTMAIL", "HYUNDAI", "ISELECT", "ISMAILI", "JEWELRY", "JUNIPER", "KITCHEN", "KOMATSU", "LACAIXA", "LANCOME", "LANXESS", "LASALLE", "LATROBE", "LECLERC", "LIAISON", "LIMITED", "LINCOLN", "MARKETS", "METLIFE", "MONSTER", "NETBANK", "NETFLIX", "NETWORK", "NEUSTAR", "OKINAWA", "OLDNAVY", "ORGANIC", "ORIGINS", "PHILIPS", "PIONEER", "POLITIE", "REALTOR", "RECIPES", "RENTALS", "REVIEWS", "REXROTH", "SAMSUNG", "SANDVIK", "SCHMIDT", "SCHWARZ", "SCIENCE", "SHIKSHA", "SHRIRAM", "SINGLES", "SPIEGEL", "STAPLES", "STARHUB", "STORAGE", "SUPPORT", "SURGERY", "SYSTEMS", "TEMASEK", "THEATER", "THEATRE", "TICKETS", "TIFFANY", "TOSHIBA", "TRADING", "WALMART", "WANGGOU", "WATCHES", "WEATHER", "WEBSITE", "WEDDING", "WHOSWHO", "WINDOWS", "WINNERS", "XFINITY", "YAMAXUN", "YOUTUBE", "ZUERICH", "ABARTH", "ABBOTT", "ABBVIE", "ACTIVE", "AFRICA", "AGENCY", "AIRBUS", "AIRTEL", "ALIPAY", "ALSACE", "ALSTOM", "ANQUAN", "ARAMCO", "AUTHOR", "BAYERN", "BEAUTY", "BERLIN", "BHARTI", "BLANCO", "BOSTIK", "BOSTON", "BROKER", "CAMERA", "CAREER", "CASEIH", "CASINO", "CENTER", "CHANEL", "CHROME", "CHURCH", "CIRCLE", "CLAIMS", "CLINIC", "COFFEE", "COMSEC", "CONDOS", "COUPON", "CREDIT", "CRUISE", "DATING", "DATSUN", "DEALER", "DEGREE", "DENTAL", "DESIGN", "DIRECT", "DOCTOR", "DUNLOP", "DUPONT", "DURBAN", "EMERCK", "ENERGY", "ESTATE", "EVENTS", "EXPERT", "FAMILY", "FLICKR", "FUTBOL", "GALLUP", "GARDEN", "GEORGE", "GIVING", "GLOBAL", "GOOGLE", "GRATIS", "HEALTH", "HERMES", "HIPHOP", "HOCKEY", "HOTELS", "HUGHES", "IMAMAT", "INSURE", "INTUIT", "JAGUAR", "JOBURG", "JUEGOS", "KAUFEN", "KINDER", "KINDLE", "KOSHER", "LANCIA", "LATINO", "LAWYER", "LEFRAK", "LIVING", "LOCKER", "LONDON", "LUXURY", "MADRID", "MAISON", "MAKEUP", "MARKET", "MATTEL", "MOBILE", "MOBILY", "MONASH", "MORMON", "MOSCOW", "MUSEUM", "MUTUAL", "NAGOYA", "NATURA", "NISSAN", "NISSAY", "NORTON", "NOWRUZ", "OFFICE", "OLAYAN", "ONLINE", "ORACLE", "ORANGE", "OTSUKA", "PFIZER", "PHOTOS", "PHYSIO", "PIAGET", "PICTET", "QUEBEC", "RACING", "REALTY", "REISEN", "REPAIR", "REPORT", "REVIEW", "ROCHER", "ROGERS", "RYUKYU", "SAFETY", "SAKURA", "SANOFI", "SCHOOL", "SCHULE", "SEARCH", "SECURE", "SELECT", "SHOUJI", "SOCCER", "SOCIAL", "STREAM", "STUDIO", "SUPPLY", "SUZUKI", "SWATCH", "SYDNEY", "TAIPEI", "TAOBAO", "TARGET", "TATTOO", "TENNIS", "TIENDA", "TJMAXX", "TKMAXX", "TOYOTA", "TRAVEL", "UNICOM", "VIAJES", "VIKING", "VILLAS", "VIRGIN", "VISION", "VOTING", "VOYAGE", "VUELOS", "WALTER", "WARMAN", "WEBCAM", "XIHUAN", "YACHTS", "YANDEX", "ZAPPOS", "ACTOR", "ADULT", "AETNA", "AMFAM", "AMICA", "APPLE", "ARCHI", "AUDIO", "AUTOS", "AZURE", "BAIDU", "BEATS", "BIBLE", "BINGO", "BLACK", "BOATS", "BOSCH", "BUILD", "CANON", "CARDS", "CHASE", "CHEAP", "CISCO", "CITIC", "CLICK", "CLOUD", "COACH", "CODES", "CROWN", "CYMRU", "DABUR", "DANCE", "DEALS", "DELTA", "DODGE", "DRIVE", "DUBAI", "EARTH", "EDEKA", "EMAIL", "EPOST", "EPSON", "FAITH", "FEDEX", "FINAL", "FOREX", "FORUM", "GALLO", "GAMES", "GIFTS", "GIVES", "GLADE", "GLASS", "GLOBO", "GMAIL", "GREEN", "GRIPE", "GROUP", "GUCCI", "GUIDE", "HOMES", "HONDA", "HORSE", "HOUSE", "HYATT", "IKANO", "INTEL", "IRISH", "IVECO", "JETZT", "KOELN", "KYOTO", "LAMER", "LEASE", "LEGAL", "LEXUS", "LILLY", "LINDE", "LIPSY", "LIXIL", "LOANS", "LOCUS", "LOTTE", "LOTTO", "LUPIN", "MACYS", "MANGO", "MEDIA", "MIAMI", "MONEY", "MOPAR", "MOVIE", "NADEX", "NEXUS", "NIKON", "NINJA", "NOKIA", "NOWTV", "OMEGA", "OSAKA", "PARIS", "PARTS", "PARTY", "PHONE", "PHOTO", "PIZZA", "PLACE", "POKER", "PRAXI", "PRESS", "PRIME", "PROMO", "QUEST", "RADIO", "REHAB", "REISE", "RICOH", "ROCKS", "RODEO", "RUGBY", "SALON", "SENER", "SEVEN", "SHARP", "SHELL", "SHOES", "SKYPE", "SLING", "SMART", "SMILE", "SOLAR", "SPACE", "SPORT", "STADA", "STORE", "STUDY", "STYLE", "SUCKS", "SWISS", "TATAR", "TIRES", "TIROL", "TMALL", "TODAY", "TOKYO", "TOOLS", "TORAY", "TOTAL", "TOURS", "TRADE", "TRUST", "TUNES", "TUSHU", "UBANK", "VEGAS", "VIDEO", "VODKA", "VOLVO", "WALES", "WATCH", "WEBER", "WEIBO", "WORKS", "WORLD", "XEROX", "YAHOO", "ZIPPO", "local", "onion", "AARP", "ABLE", "ADAC", "AERO", "AIGO", "AKDN", "ALLY", "AMEX", "ARAB", "ARMY", "ARPA", "ARTE", "ASDA", "ASIA", "AUDI", "AUTO", "BABY", "BAND", "BANK", "BBVA", "BEER", "BEST", "BIKE", "BING", "BLOG", "BLUE", "BOFA", "BOND", "BOOK", "BUZZ", "CAFE", "CALL", "CAMP", "CARE", "CARS", "CASA", "CASE", "CASH", "CBRE", "CERN", "CHAT", "CITI", "CITY", "CLUB", "COOL", "COOP", "CYOU", "DATA", "DATE", "DCLK", "DEAL", "DELL", "DESI", "DIET", "DISH", "DOCS", "DOHA", "DUCK", "DUNS", "DVAG", "ERNI", "FAGE", "FAIL", "FANS", "FARM", "FAST", "FIAT", "FIDO", "FILM", "FIRE", "FISH", "FLIR", "FOOD", "FORD", "FREE", "FUND", "GAME", "GBIZ", "GENT", "GGEE", "GIFT", "GMBH", "GOLD", "GOLF", "GOOG", "GUGE", "GURU", "HAIR", "HAUS", "HDFC", "HELP", "HERE", "HGTV", "HOST", "HSBC", "ICBC", "IEEE", "IMDB", "IMMO", "INFO", "ITAU", "JAVA", "JEEP", "JOBS", "JPRS", "KDDI", "KIWI", "KPMG", "KRED", "LAND", "LEGO", "LGBT", "LIDL", "LIFE", "LIKE", "LIMO", "LINK", "LIVE", "LOAN", "LOFT", "LOVE", "LTDA", "LUXE", "MAIF", "MEET", "MEME", "MENU", "MINI", "MINT", "MOBI", "MODA", "MOTO", "NAME", "NAVY", "NEWS", "NEXT", "NICO", "NIKE", "OLLO", "OPEN", "PAGE", "PARS", "PCCW", "PICS", "PING", "PINK", "PLAY", "PLUS", "POHL", "PORN", "POST", "PROD", "PROF", "QPON", "RAID", "READ", "REIT", "RENT", "REST", "RICH", "RMIT", "ROOM", "RSVP", "RUHR", "SAFE", "SALE", "SARL", "SAVE", "SAXO", "SCOR", "SCOT", "SEAT", "SEEK", "SEXY", "SHAW", "SHIA", "SHOP", "SHOW", "SILK", "SINA", "SITE", "SKIN", "SNCF", "SOHU", "SONG", "SONY", "SPOT", "STAR", "SURF", "TALK", "TAXI", "TEAM", "TECH", "TEVA", "TIAA", "TIPS", "TOWN", "TOYS", "TUBE", "VANA", "VISA", "VIVA", "VIVO", "VOTE", "VOTO", "WANG", "WEIR", "WIEN", "WIKI", "WINE", "WORK", "XBOX", "YOGA", "ZARA", "ZERO", "ZONE", "exit", "zkey", "AAA", "ABB", "ABC", "ACO", "ADS", "AEG", "AFL", "AIG", "ANZ", "AOL", "APP", "ART", "AWS", "AXA", "BAR", "BBC", "BBT", "BCG", "BCN", "BET", "BID", "BIO", "BIZ", "BMS", "BMW", "BNL", "BOM", "BOO", "BOT", "BOX", "BUY", "BZH", "CAB", "CAL", "CAM", "CAR", "CAT", "CBA", "CBN", "CBS", "CEB", "CEO", "CFA", "CFD", "COM", "CRS", "CSC", "DAD", "DAY", "DDS", "DEV", "DHL", "DIY", "DNP", "DOG", "DOT", "DTV", "DVR", "EAT", "ECO", "EDU", "ESQ", "EUS", "FAN", "FIT", "FLY", "FOO", "FOX", "FRL", "FTR", "FUN", "FYI", "GAL", "GAP", "GDN", "GEA", "GLE", "GMO", "GMX", "GOO", "GOP", "GOT", "GOV", "HBO", "HIV", "HKT", "HOT", "HOW", "IBM", "ICE", "ICU", "IFM", "INC", "ING", "INK", "INT", "IST", "ITV", "JCB", "JCP", "JIO", "JLL", "JMP", "JNJ", "JOT", "JOY", "KFH", "KIA", "KIM", "KPN", "KRD", "LAT", "LAW", "LDS", "LLC", "LOL", "LPL", "LTD", "MAN", "MAP", "MBA", "MED", "MEN", "MIL", "MIT", "MLB", "MLS", "MMA", "MOE", "MOI", "MOM", "MOV", "MSD", "MTN", "MTR", "NAB", "NBA", "NEC", "NET", "NEW", "NFL", "NGO", "NHK", "NOW", "NRA", "NRW", "NTT", "NYC", "OBI", "OFF", "ONE", "ONG", "ONL", "OOO", "ORG", "OTT", "OVH", "PAY", "PET", "PHD", "PID", "PIN", "PNC", "PRO", "PRU", "PUB", "PWC", "QVC", "RED", "REN", "RIL", "RIO", "RIP", "RUN", "RWE", "SAP", "SAS", "SBI", "SBS", "SCA", "SCB", "SES", "SEW", "SEX", "SFR", "SKI", "SKY", "SOY", "SRL", "SRT", "STC", "TAB", "TAX", "TCI", "TDK", "TEL", "THD", "TJX", "TOP", "TRV", "TUI", "TVS", "UBS", "UNO", "UOL", "UPS", "VET", "VIG", "VIN", "VIP", "WED", "WIN", "WME", "WOW", "WTC", "WTF", "XIN", "XXX", "XYZ", "YOU", "YUN", "ZIP", "bit", "gnu", "i2p", "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BM", "BN", "BO", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "ER", "ES", "ET", "EU", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "ST", "SU", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UK", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"];

    const gtld = `(?:${[...tlds].join('|')})`;
    const unicodeShortcuts = {
        'p{L}':
            '\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC',
        'p{N}':
            '\\u0030-\\u0039\\u00B2\\u00B3\\u00B9\\u00BC-\\u00BE\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u09F4-\\u09F9\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0B72-\\u0B77\\u0BE6-\\u0BF2\\u0C66-\\u0C6F\\u0C78-\\u0C7E\\u0CE6-\\u0CEF\\u0D66-\\u0D75\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F33\\u1040-\\u1049\\u1090-\\u1099\\u1369-\\u137C\\u16EE-\\u16F0\\u17E0-\\u17E9\\u17F0-\\u17F9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19DA\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\u2070\\u2074-\\u2079\\u2080-\\u2089\\u2150-\\u2182\\u2185-\\u2189\\u2460-\\u249B\\u24EA-\\u24FF\\u2776-\\u2793\\u2CFD\\u3007\\u3021-\\u3029\\u3038-\\u303A\\u3192-\\u3195\\u3220-\\u3229\\u3248-\\u324F\\u3251-\\u325F\\u3280-\\u3289\\u32B1-\\u32BF\\uA620-\\uA629\\uA6E6-\\uA6EF\\uA830-\\uA835\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19',
        'p{Sc}':
            '\\u0024\\u00A2-\\u00A5\\u058F\\u060B\\u09F2\\u09F3\\u09FB\\u0AF1\\u0BF9\\u0E3F\\u17DB\\u20A0-\\u20B9\\uA838\\uFDFC\\uFE69\\uFF04\\uFFE0\\uFFE1\\uFFE5\\uFFE6',
        'p{Sk}':
            '\\u005E\\u0060\\u00A8\\u00AF\\u00B4\\u00B8\\u02C2-\\u02C5\\u02D2-\\u02DF\\u02E5-\\u02EB\\u02ED\\u02EF-\\u02FF\\u0375\\u0384\\u0385\\u1FBD\\u1FBF-\\u1FC1\\u1FCD-\\u1FCF\\u1FDD-\\u1FDF\\u1FED-\\u1FEF\\u1FFD\\u1FFE\\u309B\\u309C\\uA700-\\uA716\\uA720\\uA721\\uA789\\uA78A\\uFBB2-\\uFBC1\\uFF3E\\uFF40\\uFFE3',
        'p{So}':
            '\\u00A6\\u00A9\\u00AE\\u00B0\\u0482\\u060E\\u060F\\u06DE\\u06E9\\u06FD\\u06FE\\u07F6\\u09FA\\u0B70\\u0BF3-\\u0BF8\\u0BFA\\u0C7F\\u0D79\\u0F01-\\u0F03\\u0F13\\u0F15-\\u0F17\\u0F1A-\\u0F1F\\u0F34\\u0F36\\u0F38\\u0FBE-\\u0FC5\\u0FC7-\\u0FCC\\u0FCE\\u0FCF\\u0FD5-\\u0FD8\\u109E\\u109F\\u1390-\\u1399\\u1940\\u19DE-\\u19FF\\u1B61-\\u1B6A\\u1B74-\\u1B7C\\u2100\\u2101\\u2103-\\u2106\\u2108\\u2109\\u2114\\u2116\\u2117\\u211E-\\u2123\\u2125\\u2127\\u2129\\u212E\\u213A\\u213B\\u214A\\u214C\\u214D\\u214F\\u2195-\\u2199\\u219C-\\u219F\\u21A1\\u21A2\\u21A4\\u21A5\\u21A7-\\u21AD\\u21AF-\\u21CD\\u21D0\\u21D1\\u21D3\\u21D5-\\u21F3\\u2300-\\u2307\\u230C-\\u231F\\u2322-\\u2328\\u232B-\\u237B\\u237D-\\u239A\\u23B4-\\u23DB\\u23E2-\\u23F3\\u2400-\\u2426\\u2440-\\u244A\\u249C-\\u24E9\\u2500-\\u25B6\\u25B8-\\u25C0\\u25C2-\\u25F7\\u2600-\\u266E\\u2670-\\u26FF\\u2701-\\u2767\\u2794-\\u27BF\\u2800-\\u28FF\\u2B00-\\u2B2F\\u2B45\\u2B46\\u2B50-\\u2B59\\u2CE5-\\u2CEA\\u2E80-\\u2E99\\u2E9B-\\u2EF3\\u2F00-\\u2FD5\\u2FF0-\\u2FFB\\u3004\\u3012\\u3013\\u3020\\u3036\\u3037\\u303E\\u303F\\u3190\\u3191\\u3196-\\u319F\\u31C0-\\u31E3\\u3200-\\u321E\\u322A-\\u3247\\u3250\\u3260-\\u327F\\u328A-\\u32B0\\u32C0-\\u32FE\\u3300-\\u33FF\\u4DC0-\\u4DFF\\uA490-\\uA4C6\\uA828-\\uA82B\\uA836\\uA837\\uA839\\uAA77-\\uAA79\\uFDFD\\uFFE4\\uFFE8\\uFFED\\uFFEE\\uFFFC\\uFFFD',
    };
    const letter = unicodeShortcuts['p{L}'];
    const number = unicodeShortcuts['p{N}'];
    const iriChar = letter + number;
    const pathChar = `${iriChar}/\\-+=_&~*%@|#.,:;'?!${unicodeShortcuts['p{Sc}']}${unicodeShortcuts['p{Sk}']}${unicodeShortcuts['p{So}']}`;
    const endChar = `${iriChar}/\\-+=_&~*%;${unicodeShortcuts['p{Sc}']}`;
    const octet = '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])';
    const ipAddr = `(?:\\b${octet}\\.${octet}\\.${octet}\\.${octet}\\b)`;
    const iri = `[${iriChar}](?:[${iriChar}\\-]*[${iriChar}])?`;
    const domain = `(?:${iri}\\.)+`;
    const hostName = `(?:${domain}${gtld}|${ipAddr})`;
    const wellBrack = `\\[[${pathChar}]*(?:\\[[${pathChar}]*\\][${pathChar}]*)*\\]`;
    const wellParen = `\\([${pathChar}]*(?:\\([${pathChar}]*\\)[${pathChar}]*)*\\)`;
    const wellAll = `${wellParen}|${wellBrack}`;
    const pathCont = `(?:[${pathChar}]*(?:${wellAll}|[${endChar}])+)+`;
    const path = `(?:${pathCont}|/|\\b|$)`;
    const port = '(?::[0-9]+)?';
    const webURL = `(?:${hostName}${port}/${path})|(?:${hostName}${port}(?:\\b|$))`;
    const scheme = '(https?|ftp|wss?)://';
    const strict = `\\b${scheme}${pathCont}`;
    const relaxed = `${strict}|${webURL}`;
    const linkRegex = new RegExp(relaxed, 'gi');

    let emotes = null;
    async function getEmotes() {
        if (!emotes || !emotes.length) {
            const styleLink = await UTIL.waitForCSS("emotes.css");
            const emotesUrl = styleLink.href.replace(".css", ".json");
            const res = await fetch(emotesUrl);
            const emotesJson = await res.json();
            emotes = emotesJson.map(emote => emote.prefix);
        }
        return emotes;
    }
    let emoteRegex = null; // Cache emote regex (could be long)
    async function getEmoteRegex() {
        if (!emoteRegex || !emotes || !emotes.length) {
            const emotes = await getEmotes();
            emoteRegex = new RegExp(`(^|\\s)(${emotes.join('|')})(?=$|\\s)`, 'gm');
        }
        return emoteRegex;
    }

    // Stolen directly from hashlinkconverter.js in dgg chat-gui
    class HashLinkConverter {
        constructor() {
            this.hasHttp = /^http[s]?:\/{0,2}/;
            this.youtubeRegex = /^(?:shorts|live|embed)\/([A-Za-z0-9-_]{11})$/;
            this.twitchClipRegex = /^[^/]+\/clip\/([A-Za-z0-9-_]*)$/;
            this.twitchVODRegex = /^videos\/(\d+)$/;
            this.rumbleEmbedRegex = /^embed\/([a-z0-9]+)\/?$/;
        }

        convert(urlString) {
            if (!urlString) {
                throw new Error(MISSING_ARG_ERROR);
            }
            const url = new URL(
                // if a url doesn't have a protocol, URL throws an error
                urlString.match(this.hasHttp) ? urlString : `https://${urlString}`,
            );
            const pathname = url.pathname.slice(1);
            let match;
            let videoId;
            let timestamp;
            switch (url.hostname) {
                case 'www.twitch.tv':
                case 'twitch.tv':
                    match = pathname.match(this.twitchClipRegex);
                    if (match) {
                        return `#twitch-clip/${match[1]}`;
                    }
                    match = pathname.match(this.twitchVODRegex);
                    if (match) {
                        return `#twitch-vod/${match[1]}`;
                    }
                    return `#twitch/${pathname}`;
                case 'clips.twitch.tv':
                    return `#twitch-clip/${pathname}`;
                case 'www.youtube.com':
                case 'youtube.com':
                    match = pathname.match(this.youtubeRegex);
                    timestamp = url.searchParams.get('t');
                    videoId = url.searchParams.get('v') ?? match?.[1];
                    if (!videoId) {
                        throw new Error(MISSING_VIDEO_ID_ERROR);
                    }
                    return timestamp
                        ? `#youtube/${videoId}?t=${timestamp}`
                        : `#youtube/${videoId}`;
                case 'www.youtu.be':
                case 'youtu.be':
                    timestamp = url.searchParams.get('t');
                    return timestamp
                        ? `#youtube/${pathname}?t=${timestamp}`
                        : `#youtube/${pathname}`;
                case 'www.rumble.com':
                case 'rumble.com':
                    match = pathname.match(this.rumbleEmbedRegex);
                    if (match) {
                        return `#rumble/${match[1]}`;
                    }
                    throw new Error(RUMBLE_EMBED_ERROR);
                case 'www.kick.com':
                case 'kick.com':
                    if (url.searchParams.has('clip') || pathname.startsWith('video/')) {
                        throw new Error(INVALID_LINK_ERROR);
                    }
                    return `#kick/${pathname}`;
                default:
                    throw new Error(INVALID_LINK_ERROR);
            }
        }
    }
    const hashlinkConverter = new HashLinkConverter();

    function encodeLinkUrl(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, (v) => {
                const hi = v.charCodeAt(0);
                const low = v.charCodeAt(1);
                return `&#${(hi - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000};`;
            })
            .replace(/([^#-~| |!])/g, (v) => `&#${v.charCodeAt(0)};`)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    function renderUrlEmbed(str) {
        let extraclass = '';

        if (/\b(?:NSFL)\b/i.test(str)) extraclass = 'nsfl-link';
        else if (/\b(?:NSFW)\b/i.test(str)) extraclass = 'nsfw-link';
        else if (/\b(?:SPOILERS)\b/i.test(str)) extraclass = 'spoilers-link';

        return str.replace(linkRegex, (url, scheme) => {
            const decodedUrl = url;
            const m = decodedUrl.match(linkRegex);
            if (m) {
                const normalizedUrl = encodeLinkUrl(normalizeUrl(m[0]));

                let embedHashLink = '';
                try {
                    embedHashLink = hashlinkConverter.convert(decodedUrl);
                } catch { }

                const maxUrlLength = 90;
                let urlText = normalizedUrl;
                if (
                    !(document.querySelector('input[name="showentireurl"]')?.checked ?? false) &&
                    urlText.length > maxUrlLength
                ) {
                    urlText = `${urlText.slice(0, 40)}...${urlText.slice(-40)}`;
                }

                const extra = encodeLinkUrl(decodedUrl.substring(m[0].length));
                const href = `${scheme ? '' : 'http://'}${normalizedUrl}`;

                const embedTarget = window.top !== this ? '_top' : '_blank';
                const embedUrl = window.location.origin + '/bigscreen' + embedHashLink;
                return embedHashLink
                    ? `<a target="_blank" class="externallink ${extraclass}" href="${href}" rel="nofollow">${urlText}</a><a target="${embedTarget}" class="embed-button" href="${embedUrl}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="14.4" viewBox="0 0 640 512"><path d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z"  fill="#fff"/></svg></a>`
                    : `<a target="_blank" class="externallink ${extraclass}" href="${href}" rel="nofollow">${urlText}</a>${extra}`;
            }
            return url;
        });
    }
    function normalizeUrl(url) {
        if (/(x|twitter)\.com\/\w{1,15}\/status\/\d{2,19}\?/i.test(url)) return url.split('?')[0];
        if (/^(?:(?:https|http):\/\/)?(?:www\.)?youtu(?:be\.com|\.be)/i.test(url)) {
            try {
                const ytLink = new URL(url);
                ytLink.searchParams.delete('si');
                return ytLink.href;
            } catch {
                return url;
            }
        }
        return url;
    }

    const embedRegex = /(^|\s)(#(kick|twitch|twitch-vod|twitch-clip|youtube|youtube-live|facebook|rumble|vimeo)\/([\w\d]{3,64}\/videos\/\d{10,20}|[\w-]{3,64}|\w{7}\/\?pub=\w{5})(?:\?t=(\d+)s?)?)\b/g;
    async function renderChatMessage(str) {
        let htmlString = str;

        if (htmlString.startsWith('/me ')) htmlString = htmlString.slice(4);

        // Greentext
        if (str.indexOf('>') === 0) htmlString = `<span class="greentext">${htmlString}</span>`;

        // Emotes
        const regex = await getEmoteRegex();
        htmlString = htmlString.replace(regex, '$1<div title="$2" class="emote $2">$2 </div>');

        // Slash embeds
        let extraclass = '';
        if (/\b(?:NSFL)\b/i.test(str)) extraclass = 'nsfl-link';
        else if (/\b(?:NSFW)\b/i.test(str)) extraclass = 'nsfw-link';
        else if (/\b(?:SPOILERS)\b/i.test(str)) extraclass = 'spoilers-link';

        const target = window.top !== this ? '_top' : '_blank';
        const baseUrl = window.location.origin + '/bigscreen';
        htmlString = htmlString.replace(embedRegex, `$1<a class="externallink bookmarklink ${extraclass}" href="${baseUrl}$2" target="${target}">$2</a>`);

        // Links
        htmlString = renderUrlEmbed(htmlString);

        return htmlString;
    }

    return { renderChatMessage };
})();

// SETTINGS

const VERSION = globalThis.DGG_TWEAKS_VERSION ?? "1.20";

const STORAGE = {
    async get(key) {
        if (typeof GM_getValue === 'function') return GM_getValue(key);
        const raw = localStorage.getItem(`dgg-tweaks:${key}`);
        return raw === null ? undefined : JSON.parse(raw);
    },
    async set(key, value) {
        if (typeof GM_setValue === 'function') {
            GM_setValue(key, value);
            return;
        }
        localStorage.setItem(`dgg-tweaks:${key}`, JSON.stringify(value));
    }
};

const INPUT_TYPES = {
    CHECKBOX: Symbol('checkbox'),
    NUMBER_FIELD: Symbol('number_field'),
    SELECT: Symbol('select'),
    BUTTON: Symbol('button')
}
const settingsMenuDef = [
    {
        heading: "Chat",
        subheading: "Settings that affect DGG Chat (including embeds)",
        fields: [
            [INPUT_TYPES.CHECKBOX, 'resize-user-info', "Resizable User Info", "Allow for resizing the user right click info menu"],
            [INPUT_TYPES.CHECKBOX, 'mentions-button', "Mentions Button", "Adds a button to the bottom of chat to view recent mentions"],
            [INPUT_TYPES.CHECKBOX, 'mentions-force-timestamps', "Force Mentions Timestamps", "Always show timestamps for mentions"],
            [INPUT_TYPES.CHECKBOX, 'rustlesearch-button', "Rustlesearch Button", "Adds a button to the bottom of chat to search your logs"],
            [INPUT_TYPES.NUMBER_FIELD, 'link-size', "Link Size", 'Increase the clickable area for links (no visual change)', "1.00", 1.00],
            [INPUT_TYPES.CHECKBOX, 'link-size-debug', "Visualise Link Size", "Show an outline around the clickable area (debug option)"],
            [INPUT_TYPES.SELECT, 'aggregate-links-button', "'Aggregate Links' Button", "Mode for a new 'Aggregate Links' button in chat", [['off', 'Disabled'], ['link', 'Links Only'], ['name', 'Include Usernames'], ['full', 'Full Messages']]],
        ]
    },
    {
        heading: "Big Screen",
        subheading: "Settings that affect the Big Screen",
        fields: [
            [INPUT_TYPES.CHECKBOX, 'bigscreen-menubar', "Cinema Mode Menu Bar", "Slide out the menu bar on hover while in Cinema Mode"],
            [INPUT_TYPES.CHECKBOX, 'bigscreen-controls', "Cinema Mode Controls", "Slide out the bottom stream controls on hover while in Cinema Mode"],
            [INPUT_TYPES.CHECKBOX, 'dgg-layout-fix', "DGG Layout Fix Script", "DGG Layout Fix script from chatter_here. Overrides the options above"],
        ]
    },
];

let settings = {
    'bigscreen-menubar': true,
    'bigscreen-controls': false,
    'link-size': 1.00,
    'link-size-debug': false,
    'aggregate-links-button': 'off',
    'resize-user-info': true,
    'dgg-layout-fix': false,
    'mentions-button': true,
    'mentions-force-timestamps': false,
    'rustlesearch-button': true
};

function changeSetting(key, value) {
    settings[key] = value;
    STORAGE.set('settings', settings);
    onSettingsChanged();
}

async function loadSettings() {
    const loaded = await STORAGE.get('settings');
    settings = Object.assign(settings, loaded);
}

// PAGE TYPES

const PAGE_TYPES = {
    BIGSCREEN: Symbol('bigscreen'),
    CHAT: Symbol('chat'),
    SETTINGS: Symbol('settings'),
    DEFAULT: Symbol('default')
};
const PAGE_TYPE = getPageType();

function getPageType() {
    var path = window.location.pathname;

    if (path === '/bigscreen') return PAGE_TYPES.BIGSCREEN;
    if (path === '/embed/chat') return PAGE_TYPES.CHAT;
    if (path.startsWith('/profile')) return PAGE_TYPES.SETTINGS;

    return PAGE_TYPES.DEFAULT;
}

// UI ELEMENTS
const CHAT_UI = {
    [INPUT_TYPES.CHECKBOX]: (key, label, description) => el('div', { classes: ['form-group', 'checkbox', 'dgg-tweaks-setting'], id: 'dgg-tweaks-' + key },
        el('label', { title: description, for: 'dgg-tweaks-' + key },
            el('input', {
                name: 'dgg-tweaks-' + key,
                type: 'checkbox',
                checked: settings[key],
                events: { change: e => changeSetting(key, e.target.checked) }
            }),
            label
        )
    ),
    [INPUT_TYPES.NUMBER_FIELD]: (key, label, description, placeholder, min = undefined, max = undefined) => el('div', { classes: ['form-group', 'dgg-tweaks-setting'], id: 'dgg-tweaks-' + key },
        el('label', { title: description, for: 'dgg-tweaks-' + key }, label),
        el('input', {
            classes: ['form-control'],
            type: 'number',
            name: 'dgg-tweaks-' + key,
            value: settings[key],
            min,
            max,
            placeholder,
            events: {
                change: e => changeSetting(key, parseFloat(e.target.value))
            }
        })
    ),
    [INPUT_TYPES.SELECT]: (key, label, description, options) => el('div', { classes: ['form-group', 'dgg-tweaks-setting'], id: 'dgg-tweaks-' + key },
        el('label', { title: description, for: 'dgg-tweaks-' + key }, label),
        el('select', {
            classes: ['form-control'],
            name: 'dgg-tweaks-' + key,
            events: {
                change: e => changeSetting(key, e.target.value)
            }
        }, ...options.map(option => el('option', { value: option[0], selected: option[0] === settings[key] ? true : undefined }, option[1])))
    ),
    [INPUT_TYPES.BUTTON]: (key, label, description, buttonText, click) => el('div', { classes: ['form-group', 'dgg-tweaks-setting'], id: 'dgg-tweaks-' + key },
        el('label', { title: description, for: 'dgg-tweaks-' + key }, label),
        el('input', {
            classes: ['form-control'],
            type: 'button',
            name: 'dgg-tweaks-' + key,
            events: { click },
            value: buttonText
        })
    )
}

function renderField(context, field) {
    const [fieldType, ...args] = field;
    return context[fieldType](...args);
}

function chatSettingsMenu() {
    const menu = el('div', { id: 'dgg-tweaks-settings' },
        el('h3', { classes: ['dgg-tweaks-settings-title'] }, "DGG Tweaks"),
        ...settingsMenuDef.map(section => el('section', { classes: ['dgg-tweaks-settings-section'] },
            el('h4', { classes: ['dgg-tweaks-settings-heading'] }, section.heading),
            ...section.fields.map(field => renderField(CHAT_UI, field))
        ))
    ).build();

    document.getElementById('chat-settings-form').appendChild(menu);
}

// LINK AGGREGATION BUTTON
function openLinkAggregatorPopup() {
    const linksRaw = document.querySelectorAll('.externallink');
    const urls = new Set();
    let messages = [];
    for (const linkEl of linksRaw) {
        if (urls.has(linkEl.href)) continue;

        const message = linkEl.closest('div.msg-user');
        //const username = linkEl.closest('div.msg-user')?.querySelector('a.user')?.textContent;
        if (!message) continue;

        urls.add(linkEl.href);
        ['off', 'Disabled'], ['link', 'Links Only'], ['name', 'Include Usernames'], ['full', 'Full Messages']
        if (settings['aggregate-links-button'] === 'link') {
            messages.push(fromHTML(linkEl.cloneNode(true)));
        } else if (settings['aggregate-links-button'] === 'name') {
            const cloned = message.cloneNode(true);
            cloned.querySelector('.text').replaceWith(linkEl.cloneNode(true));
            messages.push(fromHTML(cloned));
        } else {
            messages.push(fromHTML(message.cloneNode(true)));
        }
    }
    const linkButton = document.getElementById('chat-aggregate-links-btn');
    var popupContent = el('div', { classes: ['dgg-tweaks-aggregate-links'] }, ...messages).build();
    if (messages.length) linkButton._tippy.setContent(popupContent.outerHTML);
    else linkButton._tippy.setContent("<div class='dgg-tweaks-aggregate-links'>No links found in chat</div>");

    if (linkButton._tippy.state.isShown) linkButton._tippy.hide();
    else linkButton._tippy.show();
}

function addLinkAggregationButton() {
    var linkButton = document.getElementById('chat-aggregate-links-btn');
    if (settings["aggregate-links-button"] === 'off') linkButton?.remove();
    else {
        if (!linkButton) {
            const focusButton = document.getElementById('chat-watching-focus-btn');
            linkButton = focusButton.cloneNode(true);
            linkButton.id = 'chat-aggregate-links-btn';
            focusButton.before(linkButton);
            linkButton.addEventListener('click', openLinkAggregatorPopup);
            linkButton.removeAttribute('data-tippy-content');
            tippy(linkButton, {
                trigger: 'click',
                interactive: true,
                allowHTML: true,
                content: "",
                maxWidth: 'none',
            });
        }
    }
}

function showTimeEnabled() {
    return document.getElementById("chat").classList.contains("pref-showtime");
}

const FULL_DATE_FORMAT = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    suffix: true
};

const TIME_FORMAT = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
}

function formatTimestamp(timestamp, options = FULL_DATE_FORMAT) {
    const { suffix = false, ...formatOptions } = options;
    const date = new Date(timestamp);

    let formatted = new Intl.DateTimeFormat("en-GB", formatOptions).format(date);
    if (suffix) {
        const day = date.getDate();
        formatted = formatted.replace(day.toString(), `${day}${getDaySuffix(day)}`);
    }
    return formatted;
}

function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function buildTemplatedChatMessage(username, text, timestamp = Date.now()) {
    const fullDate = formatTimestamp(timestamp, FULL_DATE_FORMAT);
    const time = formatTimestamp(timestamp, TIME_FORMAT);
    const elementString = `<div class="msg-chat msg-user" data-username="${username.toLowerCase()}"><time class="time" title="${fullDate}" data-unixtimestamp="${timestamp}">${time}</time>  <a title="" class="user">${username}</a><span class="ctrl">: </span> <span class="text">${text}</span></div>`;
    const templateContainer = document.createElement('template');
    templateContainer.innerHTML = elementString;
    return templateContainer.content.childNodes[0];
}

// RESIZE USER INFO

const RESIZE_AXIS = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
    DIAGONAL: 'diagonal'
}

let currentResizeAxis = RESIZE_AXIS.DIAGONAL;

function startInfoResize(axis) {
    document.addEventListener("mouseup", endResize);
    document.addEventListener("mousemove", resizeInfo);
    currentResizeAxis = axis;
}

function resizeInfo(e) {
    const el = document.querySelector('#chat-user-info');

    const left = parseInt(el.style.left.slice(0, el.style.left.length - 2));
    const top = parseInt(el.style.top.slice(0, el.style.top.length - 2));

    if (currentResizeAxis != RESIZE_AXIS.HORIZONTAL) el.style.height = e.clientY - top + "px";
    if (currentResizeAxis != RESIZE_AXIS.VERTICAL) el.style.width = e.clientX - left + "px";
}

function endResize() {
    document.removeEventListener("mouseup", endResize);
    document.removeEventListener("mousemove", resizeInfo);
}

async function injectInfoResize() {
    const infoBox = document.querySelector('#chat-user-info');
    UTIL.injectStylesheet('css/resize-user-info.css', settings['resize-user-info']);
    if (settings['resize-user-info']) {
        if (!infoBox.querySelector('#info-resize-vertical')) infoBox.appendChild(el('div', { id: 'info-resize-vertical', classes: ['resize-vertical'], events: { mousedown: () => startInfoResize(RESIZE_AXIS.VERTICAL) } }).build());
        if (!infoBox.querySelector('#info-resize-horizontal')) infoBox.appendChild(el('div', { id: 'info-resize-horizontal', classes: ['resize-horizontal'], events: { mousedown: () => startInfoResize(RESIZE_AXIS.HORIZONTAL) } }).build());
        if (!infoBox.querySelector('#info-resize-diagonal')) infoBox.appendChild(el('div', { id: 'info-resize-diagonal', classes: ['resize-diagonal'], events: { mousedown: () => startInfoResize(RESIZE_AXIS.DIAGONAL) } }).build());
    } else {
        infoBox.querySelector('#info-resize-vertical')?.remove();
        infoBox.querySelector('#info-resize-horizontal')?.remove();
        infoBox.querySelector('#info-resize-diagonal')?.remove();
    }
}

// USER INFO BOX

async function injectToUserInfo() {
    await injectInfoResize();
}

let infoActive = false;
const infoObserver = new MutationObserver((mutations) => {
    mutations.forEach(mu => {
        if (mu.type !== 'attributes' && mu.attributeName !== 'class') return;
        const newInfoActive = mu.target.classList.contains('active');
        if (newInfoActive && !infoActive) injectToUserInfo();
        infoActive = newInfoActive;
    });
});

function registerInfoObserver() {
    if (settings['resize-user-info']) {
        const infoBox = document.getElementById('chat-user-info');
        if (infoBox) infoObserver.observe(infoBox, { attributes: true });
    } else {
        infoObserver.disconnect();
    }
}

// DGG-LAYOUT-FIX
function applyDGGLayoutFix() {
    const moveBefore = (el, newSibling) => newSibling?.parentNode?.insertBefore(el, newSibling);
    const moveAppend = () => (el, newParent) => newParent?.appendChild(el);

    document.querySelector('.navbar .navbar__item[href="/donate"]')?.remove(); // redundant
    document.querySelector('.navbar .navbar__item[href="/"')?.remove(); // redundant

    // TODO tinker with responsive collapsing
    const moneyButtons = document.createElement("div");
    moneyButtons.className = "navbar__items _layoutfix_navbar__money";

    moveAppend(
        document.getElementById("donate-btn"),
        // document.querySelector(".navbar__items.navbar__navigation")
        moneyButtons
    );
    moveAppend(
        document.getElementById("subscribe-btn"),
        // document.querySelector(".navbar__items.navbar__navigation")
        moneyButtons
    );
    moveBefore(
        document.getElementById("control-title"),
        document.querySelector(".control-badges")
    );
    moveBefore(
        document.getElementById("stream-controls"),
        document.getElementById("embed")
    );
    moveBefore(
        document.getElementById("control-buttons"),
        // document.querySelector('.navbar__actions')
        document.querySelector(".navbar__actions>:first-child")
    );
    moveBefore(
        moneyButtons,
        document.querySelector(".navbar__actions>:first-child")
    );
}

// MENTION BUTTON
function getCurrentChatUsername() {
    return document.getElementById("chat-input-control")?.placeholder?.split(' ')[2];
}

async function openMentionsPopup() {
    const mentionsButton = document.getElementById('dgg-tweaks-mentions-btn');

    if (mentionsButton._tippy.state.isShown) return;
    
    mentionsButton._tippy.setContent(`<div class='dgg-tweaks-mentions-popup' style='padding: 8px 12px;'>Loading...</div>`);
    mentionsButton._tippy.show();

    const username = getCurrentChatUsername();

    let messages = [];

    const res = await fetch(`https://www.destiny.gg/api/chat/mentions?username=${encodeURIComponent(username)}&limit=10`);
    const json = (await res.json()).data;
    const msgArr = Array.isArray(json) ? json : Object.values(json).filter(item => typeof item !== "string" && item);
    msgArr.sort((a, b) => a.date - b.date);

    async function processMessage(message) {
        const messageContent = await REGEXES.renderChatMessage(message.text);
        messages.push(fromHTML(buildTemplatedChatMessage(message.nick, messageContent, message.date * 1000)));
    }
    var promises = []
    for (const message of msgArr) {
        promises.push(processMessage(message));
    }
    await Promise.allSettled(promises);
    
    if (messages.length) {
        var popupContent = el('div', { classes: ['dgg-tweaks-mentions-popup', settings['mentions-force-timestamps'] && 'pref-showtime'] }, ...messages).build();
        mentionsButton._tippy.setContent(popupContent.outerHTML);
    }
    else mentionsButton._tippy.setContent("<div class='dgg-tweaks-mentions-popup'>No mentions found</div>");
}

function openRustlesearch() {
    const username = getCurrentChatUsername();
    if (!username) return;

    const url = new URL('https://rustlesearch.dev/');
    url.searchParams.set('channel', 'Destinygg');
    url.searchParams.set('start_date', '2010-01-01');
    url.searchParams.set('username', username);
    window.open(url.toString(), '_blank', 'noopener');
}

function addRustlesearchButton() {
    var rustlesearchButton = document.getElementById('dgg-tweaks-rustlesearch-btn');
    if (!settings["rustlesearch-button"]) rustlesearchButton?.remove();
    else if (!rustlesearchButton) {
        const mentionsButton = document.getElementById('dgg-tweaks-mentions-btn');
        const whisperButton = document.getElementById('chat-whisper-btn');
        const anchorButton = mentionsButton ?? whisperButton;
        if (!anchorButton) return;

        rustlesearchButton = anchorButton.cloneNode(true);
        rustlesearchButton.id = 'dgg-tweaks-rustlesearch-btn';
        rustlesearchButton.title = 'Search your Rustlesearch logs';
        rustlesearchButton.setAttribute('aria-label', 'Search your Rustlesearch logs');
        anchorButton.after(rustlesearchButton);
        rustlesearchButton.addEventListener('click', openRustlesearch);
        rustlesearchButton.removeAttribute('data-tippy-content');
    }
}

function addMentionsButton() {
    var mentionsButton = document.getElementById('dgg-tweaks-mentions-btn');
    if (!settings["mentions-button"]) mentionsButton?.remove();
    else if (!mentionsButton) {
        const whisperButton = document.getElementById('chat-whisper-btn');
        mentionsButton = whisperButton.cloneNode(true);
        mentionsButton.id = 'dgg-tweaks-mentions-btn';
        whisperButton.after(mentionsButton);
        mentionsButton.addEventListener('click', openMentionsPopup);
        mentionsButton.removeAttribute('data-tippy-content');
        tippy(mentionsButton, {
            trigger: 'click',
            interactive: true,
            allowHTML: true,
            content: "",
            maxWidth: 'none',
        });
    }
}

// CINEMA MODE

function cinemaModeOpenTop() {
    const header = document.querySelector("header.header");
    header.classList.add("active");

    const intervalId = setInterval(close, 125); // Deal with exiting window
    function close() {
        if (header.matches(":hover")) return;
        clearInterval(intervalId);
        header.classList.remove("active");
        header.removeEventListener('mouseleave', close);
    }
    header.addEventListener('mouseleave', close);
}

function toggleCinemaModeTop() {
    const domElId = "dgg-tweaks-menubar-hover";
    const showClass = "dgg-tweaks-show-in-cinema-mode";
    const enabled = settings['bigscreen-menubar'];

    const header = document.querySelector("header.header");
    header.classList.remove(showClass);

    document.getElementById(domElId)?.remove();
    if (!enabled) return;

    const element = el('div', { id: domElId, events: { 'mouseenter': cinemaModeOpenTop } }).build();
    document.querySelector(".stream-panel__backdrop").appendChild(element);

    header.classList.add(showClass);
}

function cinemaModeOpenBottom() {
    const header = document.querySelector("#stream-controls");
    header.classList.add("active");

    const intervalId = setInterval(close, 125); // Deal with exiting window
    function close() {
        if (header.matches(":hover")) return;
        clearInterval(intervalId);
        header.classList.remove("active");
        header.removeEventListener('mouseleave', close);
    }
    header.addEventListener('mouseleave', close);
}

function toggleCinemaModeBottom() {
    const domElId = "dgg-tweaks-controls-hover";
    const showClass = "dgg-tweaks-show-in-cinema-mode";
    const enabled = settings['bigscreen-controls'];

    const header = document.querySelector("#stream-controls");
    header.classList.remove(showClass);

    document.getElementById(domElId)?.remove();
    if (!enabled) return;

    const element = el('div', { id: domElId, events: { 'mouseenter': cinemaModeOpenBottom } }).build();
    document.querySelector(".stream-panel__backdrop").appendChild(element);

    header.classList.add(showClass);
}

// MAIN

async function onLoad() {
    if (PAGE_TYPE === PAGE_TYPES.CHAT) {
        chatSettingsMenu();
        UTIL.injectStylesheet('css/link-size.css');
        registerInfoObserver();
    } else {
    }
    if (PAGE_TYPE === PAGE_TYPES.BIGSCREEN) {
        toggleCinemaModeTop();
        toggleCinemaModeBottom();
        UTIL.injectStylesheet('css/dgg-layout-fix.css', settings['dgg-layout-fix']);
        if (settings['dgg-layout-fix']) applyDGGLayoutFix();
    }
}

async function onSettingsChanged() {
    if (PAGE_TYPE === PAGE_TYPES.CHAT) {
        UTIL.injectStylesheet('css/link-size-debug.css', settings['link-size-debug']);
        document.body.style.setProperty('--link-size', isNaN(Number(settings['link-size'])) ? 0 : settings['link-size'] - 1);
        addLinkAggregationButton();
        addMentionsButton();
        addRustlesearchButton();
        registerInfoObserver();
        if (document.querySelector('#chat-user-info')?.classList.contains('active')) await injectInfoResize();
    }
}

async function main() {
    UTIL.injectStylesheet('css/base.css');
    await loadSettings();
    await onLoad();
    await onSettingsChanged();
}

if (document.readyState !== "loading") main();
else document.addEventListener("DOMContentLoaded", main);

})();
