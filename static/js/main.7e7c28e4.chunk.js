(window["webpackJsonpesri-loader"]=window["webpackJsonpesri-loader"]||[]).push([[0],{117:function(e,t,a){e.exports=a(205)},122:function(e,t,a){},193:function(e,t,a){},205:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(8),i=a.n(l),o=(a(122),a(82),a(33)),s=(a(84),a(19)),c=(a(124),a(113)),u=(a(126),a(14)),d=(a(206),a(35)),h=a(18),f=a(21),m=a(22),p=a(31),v=a(23),b=a(32),y=(a(130),a(46)),w=a(43),g=a(104),E=a.n(g),O=a(105),j=a.n(O),k=a(106),S=a.n(k),B=a(107),I=a.n(B),V=a(26),C={url:"https://jsdev.arcgis.com/4.13/",css:!0,dojoConfig:{has:{"esri-native-promise":!0}}},R=(a(207),a(81)),M=Object(w.a)(function(e){function t(e,a){var n;return Object(f.a)(this,t),(n=Object(p.a)(this,Object(v.a)(t).call(this,e,a))).state={sliderValues:null},n.hasSlider=!1,n.onChange=function(e){n.setState({sliderValues:e})},n.onValuesChange=function(e){var t=Object(h.a)(e,2),a=t[0],r=t[1];n.store.onValuesChange(a,r)},n.createSlider=function(){!n.slider&&n.Slider&&n.sliderRef.current&&n.store.loaded&&(n.slider=new n.Slider({bins:n.store.bins,min:n.store.lowerBound,max:n.store.upperBound,values:[n.store.min||n.store.lowerBound,n.store.max||n.store.upperBound],excludedBarColor:"#bfbfbf",rangeType:"between",container:n.sliderRef.current,precision:0}),n.listener=n.slider.watch("values",n.onValuesChange))},n.sliderRef=r.a.createRef(),n.store=e.store,n}return Object(b.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){var e=this;Object(V.loadModules)(["esri/widgets/HistogramRangeSlider"],C).then((function(t){var a=Object(h.a)(t,1)[0];e.Slider=a,e.createSlider()})).catch((function(e){return console.log(e)}))}},{key:"componentWillUnmount",value:function(){this.listener&&this.listener.remove()}},{key:"render",value:function(){!this.slider&&this.store.loaded&&this.createSlider();var e=this.store.fieldInfo.alias;return r.a.createElement(r.a.Fragment,null,r.a.createElement("p",null,e),r.a.createElement("div",{style:{height:"6rem",paddingBottom:"1rem"}},r.a.createElement("div",{ref:this.sliderRef})))}}]),t}(r.a.Component)),x=Object(w.a)(function(e){function t(){var e,a;Object(f.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(p.a)(this,(e=Object(v.a)(t)).call.apply(e,[this].concat(r)))).state={renderer:null},a.onSelectChange=function(e){a.setState({renderer:e})},a}return Object(b.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(R.a,{size:"small"},r.a.createElement("h1",null,"Explore")),r.a.createElement(R.a,{size:"small",style:{marginTop:"10px"}},r.a.createElement("h1",null,"Apply Filters"),r.a.createElement(M,{store:this.props.store.filters[0]}),r.a.createElement(M,{store:this.props.store.filters[1]}),r.a.createElement(M,{store:this.props.store.filters[2]}),r.a.createElement(M,{store:this.props.store.filters[3]}),r.a.createElement(M,{store:this.props.store.filters[4]})))}}]),t}(r.a.Component)),L=a(9),_=a(114),A=function(e){function t(e){var a,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return Object(f.a)(this,t),(a=Object(p.a)(this,Object(v.a)(t).call(this,e))).bins=[],a.loaded=!1,a.min=null,a.max=null,a.where=null,a.lowerBound=n,a.upperBound=r,a.bins=[],a.loaded=!1,a}return Object(b.a)(t,e),Object(m.a)(t,[{key:"load",value:function(e){var a=this;Object(_.a)(Object(v.a)(t.prototype),"load",this).call(this,e);var n,r=this.field,l=this.lowerBound||0===this.lowerBound,i=this.upperBound||0===this.upperBound,o=Object(V.loadModules)(["esri/renderers/smartMapping/statistics/histogram"],C);if(l&&i)n=Promise.resolve([this.lowerBound,this.upperBound]);else{var s=[];l||s.push(function(e){return{onStatisticField:e,outStatisticField:"MIN_".concat(e),statisticType:"min"}}(r)),i||s.push(function(e){return{onStatisticField:e,outStatisticField:"MAX_".concat(e),statisticType:"max"}}(r)),n=e.queryFeatures({where:"1=1",outStatistics:s}).then((function(e){var t=e.features[0].attributes;return[l?a.lowerBound:t["MIN_".concat(r)],i?a.upperBound:t["MAX_".concat(r)]]}))}Promise.all([o,n]).then((function(t){var n=Object(h.a)(t,2),l=Object(h.a)(n[0],1)[0],i=n[1],o=Object(h.a)(i,2),s=o[0],c=o[1];return a.lowerBound=Math.floor(s),a.upperBound=Math.ceil(c),l({layer:e,field:r,numBins:50,minValue:a.lowerBound,maxValue:a.upperBound})})).then((function(e){a.bins=e.bins,a.loaded=!0}))}},{key:"onValuesChange",value:function(e,t){this.min=e,this.max=t,this.where=function(e,t,a){var n=t||0===t,r=a||0===a,l=null;return n&&r?l=e+" <= "+a+" AND "+e+" >= "+t:r?l=e+" <= "+a:n&&(l=e+" >= "+t),l}(this.field,e,t)}}]),t}(function(){function e(t){Object(f.a)(this,e),this.field=t,this.fieldInfo={}}return Object(m.a)(e,[{key:"load",value:function(e){var t=this;if(!e.loaded)throw"Please wait until the layer is loaded";this.fieldInfo=e.fields.find((function(e){return e.name===t.field}))}}]),e}());Object(L.i)(A,{min:L.n,max:L.n,where:L.n,loaded:L.n,load:L.d.bound,onValuesChange:L.d.bound});var z,F={appId:"o3Zbi02dIsAez6sL",portalUrl:"https://www.arcgis.com/sharing"},K={eventvalue:{visualVariables:[{type:"colorInfo",field:"eventvalue",valueExpression:null,stops:[{value:0,color:[255,252,212,255],label:"0"},{value:2,color:[177,205,194,255],label:null},{value:4,color:[98,158,176,255],label:"4"},{value:6,color:[56,98,122,255],label:null},{value:8,color:[13,38,68,255],label:"8"}]}],authoringInfo:{visualVariables:[{type:"colorInfo",minSliderValue:-9,maxSliderValue:10,theme:"high-to-low"}]},type:"simple",symbol:{color:[170,170,170,255],width:1.5,type:"esriSLS",style:"esriSLSSolid"}}},T=F.appId,H=F.portalUrl,N=function(){function e(t){Object(f.a)(this,e),this.credential={},this.layerId=t,this.filters=[new A("eventvalue"),new A("pedestrians_density"),new A("bicycles_density"),new A("harsh_cornering_ratio"),new A("harsh_acc_ratio")]}return Object(m.a)(e,[{key:"_loadLayers",value:function(){var e=this;this.view.whenLayerView(this.lyr).then((function(t){e.lyrView=t,e.filters.forEach((function(t){return t.load(e.lyr)}))}))}},{key:"_buildAutoRunEffects",value:function(){var e=this,t=z.debounce((function(e,t){e.filter={where:t}}));this.effectHandler=Object(L.e)((function(a){var n=e.where;e.lyrView&&t&&t(e.lyrView,n)}))}},{key:"load",value:function(e){var t,a,n,r=this;return Object(V.loadModules)(["esri/Map","esri/views/MapView","esri/layers/FeatureLayer","esri/core/promiseUtils","esri/identity/OAuthInfo","esri/identity/IdentityManager"],C).then((function(e){var l=Object(h.a)(e,6),i=l[0],o=l[1],s=l[2],c=l[3],u=l[4],d=l[5];z=c,r._buildAutoRunEffects(),t=i,a=o,n=s;var f=new u({appId:T});return d.registerOAuthInfos([f]),d.checkSignInStatus(H).catch((function(e){if("identity-manager:not-authenticated"===e.name)return d.getCredential(H)}))})).then((function(l){var i,o;return r.credential=l,r.user=l.userId,r.lyr=new n({portalItem:{id:r.layerId}}),i=r.lyr,o="eventvalue",Object(V.loadModules)(["esri/renderers/support/jsonUtils"],C).then((function(e){var t=Object(h.a)(e,1)[0];i.renderer=t.fromJSON(K[o])})),r.map=new t({basemap:"dark-gray-vector",layers:[r.lyr]}),r.view=new a({map:r.map,container:e,center:[-74.00157,40.71955],zoom:12}),r._loadLayers(),r.view}))}},{key:"where",get:function(){var e=this.filters.filter((function(e){return!!e.where})).map((function(e){return e.where})).join(" AND ");return e||"1=1"}}]),e}();Object(L.i)(N,{user:L.n,where:L.f,load:L.d.bound,_loadLayers:L.d.bound});var U=N,D=(a(193),y.a.Header),P=y.a.Content,W=y.a.Sider,J=function(){return r.a.createElement(E.a,{size:"18",filled:!0})},X=function(){return r.a.createElement(j.a,{size:"18",filled:!0})},q=function(){return r.a.createElement(S.a,{size:"20",filled:!0})},Z=function(){return r.a.createElement(I.a,{size:"17",filled:!0})},$=Object(w.a)(function(e){function t(e,a){var n;return Object(f.a)(this,t),(n=Object(p.a)(this,Object(v.a)(t).call(this,e,a))).state={collapsed:!0,loaded:!1,navKey:"Layers"},n.onCollapse=function(e){n.setState({collapsed:e})},n.onSelect=function(e){var t=n.state.navKey===e.key?null:e.key;n.setState({navKey:t})},n.onClose=function(){n.setState({navKey:null})},n.componentDidMount=function(){var e=Object(V.loadModules)(["esri/widgets/Search","esri/widgets/Legend"],C),t=n.store.load(n.mapViewRef.current);Promise.all([e,t]).then((function(e){var t=Object(h.a)(e,2),a=Object(h.a)(t[0],2),r=a[0],l=a[1],i=t[1];n.view=i;var o=new r({view:n.view});n.view.ui.add(o,"top-right");var s=new l({view:n.view});n.view.ui.add(s,"bottom-right"),n.view.ui.move("zoom","top-right")}))},n.mapViewRef=r.a.createRef(),n.store=new U("9524ea255f4e452bb1e79d951ed65a5f"),n}return Object(b.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e;switch(this.state.navKey){case"Layers":e=r.a.createElement(x,{store:this.store,map:this.map,layer:this.lyr,layerView:this.lyrView});break;case"Bookmarks":e=r.a.createElement("h1",null,"Woah this are some awesome bookmarks!");break;case"Route":e=r.a.createElement("h1",null,"Routing seems like a lot of work");break;case"About":e=r.a.createElement("h1",null,"This is a slick app! Thanks Max!");break;default:e=null}var t=this.store.user?r.a.createElement(d.a,{theme:"dark",mode:"horizontal",style:{lineHeight:"64px",float:"right"}},r.a.createElement(d.a.Item,{key:"sign in"},this.store.user)):null;return r.a.createElement(y.a,{style:{minHeight:"100vh"}},r.a.createElement(D,{style:{paddingLeft:"1rem",paddingRight:"0rem"}},r.a.createElement("h1",{style:{color:"rgba(255,255,255,0.8",float:"left"}},"Road Safety Score"),t),r.a.createElement(y.a,null,r.a.createElement(W,{collapsible:!0,collapsed:this.state.collapsed,onCollapse:this.onCollapse},r.a.createElement(d.a,{defaultSelectedKeys:["0"],mode:"inline",theme:"dark",selectedKeys:[this.state.navKey],onClick:this.onSelect},r.a.createElement(d.a.Item,{key:"Layers"},r.a.createElement(u.a,{component:J}),r.a.createElement("span",null,"Layers")),r.a.createElement(d.a.Item,{key:"Bookmarks"},r.a.createElement(u.a,{component:X}),r.a.createElement("span",null,"Bookmarks")),r.a.createElement(d.a.Item,{key:"Route"},r.a.createElement(u.a,{component:q}),r.a.createElement("span",null,"Route")),r.a.createElement(d.a.Item,{key:"About"},r.a.createElement(u.a,{component:Z}),r.a.createElement("span",null,"About")))),r.a.createElement(P,null,r.a.createElement(o.a,null,r.a.createElement(s.a,{span:24,style:{height:"calc(100vh - 64px)"}},r.a.createElement("div",{ref:this.mapViewRef,style:{width:"100%",height:"100%"}}),r.a.createElement(c.a,{closable:!1,placement:"left",visible:this.state.navKey,mask:!1,getContainer:!1,style:{position:"absolute",background:"#f5f5f5"},bodyStyle:{padding:"10px",background:"#f5f5f5",height:"100%"}},e))))))}}]),t}(r.a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement($,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},80:function(e,t,a){"use strict";a.r(t);var n=a(97),r=a.n(n);a.d(t,"RightOutline",(function(){return r.a}));var l=a(98),i=a.n(l);a.d(t,"LeftOutline",(function(){return i.a}))}},[[117,1,2]]]);
//# sourceMappingURL=main.7e7c28e4.chunk.js.map