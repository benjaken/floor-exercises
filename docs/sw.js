if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let r={};const o=e=>i(e,c),l={module:{uri:c},exports:r,require:o};s[c]=Promise.all(n.map((e=>l[e]||o(e)))).then((e=>(t(...e),r)))}}define(["./workbox-8d71c224"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-9vpPH2ol.css",revision:null},{url:"assets/index-DyjDO0-V.js",revision:null},{url:"index.html",revision:"cb0b4fd99c33b5d339b9b3e2d191b4df"},{url:"registerSW.js",revision:"657ecbc400e4fc8ee1b0225c837ddd54"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/(.*?)\.(js|css|ts)/,new e.CacheFirst({cacheName:"js-css-cache",plugins:[]}),"GET"),e.registerRoute(/(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,new e.CacheFirst({cacheName:"image-cache",plugins:[]}),"GET")}));
