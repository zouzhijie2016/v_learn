webpackJsonp([26],{427:function(e,t,r){var n=r(428);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);r(154)("84e7bf18",n,!0)},428:function(e,t,r){t=e.exports=r(153)(void 0),t.push([e.i,".dc_span{float:right;margin-top:-15px}.proxy_iframe{min-height:500px;border:0;height:100%;width:100%}",""])},536:function(e,t,r){"use strict";function n(e){r(427)}Object.defineProperty(t,"__esModule",{value:!0});var a=r(75),c=r.n(a),o=r(76),i=r.n(o),s=r(236),l={name:"springAdminProxy",data:function(){return{dialogFormVisible:!1,dcCenter:{springBootAdminList:[],choiceDc:""},regions:{},count:1}},created:function(){var e=this;return i()(c.a.mark(function t(){var r,n;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.$Progress.start(),t.next=3,s.a.verifyDcCenter();case 3:r=t.sent,n=r.data,n.success&&(e.dcCenter.choiceDc=n.choiceDc,e.dcCenter.springBootAdminList=n.springBootAdminList,e.dcCenter.choiceDc||(e.dialogFormVisible=!0));case 6:case"end":return t.stop()}},t,e)}))()},mounted:function(){var e=this;return i()(c.a.mark(function t(){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},t,e)}))()},methods:{handleDcCenterChange:function(){var e=this;return i()(c.a.mark(function t(){var r,n,a;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r={},r.choiceDc=e.dcCenter.choiceDc,t.next=4,s.a.handleDcCenterChange(r);case 4:n=t.sent,a=n.data,console.log(a),a.success&&location.reload();case 8:case"end":return t.stop()}},t,e)}))()},handleShowDcCenterChange:function(){this.dialogFormVisible=!0}},watch:{},metaInfo:{}},d=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",[r("el-row",{attrs:{gutter:20}},[r("el-col",{attrs:{span:24}},[r("div",[r("el-card",{staticClass:"box-card"},[r("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[r("el-breadcrumb",{attrs:{separator:"/"}},[r("el-breadcrumb-item",{attrs:{to:{name:"/"}}},[e._v("Main")]),e._v(" "),r("el-breadcrumb-item",[e._v("Spring Admin Proxy")])],1),e._v(" "),r("span",{staticClass:"dc_span",on:{click:e.handleShowDcCenterChange}},[e._v("dcCenter : "+e._s(e.dcCenter.choiceDc))])],1),e._v(" "),r("iframe",{staticClass:"proxy_iframe",attrs:{frameborder:"0",src:"/__springAdmin"}})])],1)])],1)],1),e._v(" "),r("div"),e._v(" "),r("el-dialog",{attrs:{title:"请选择数据中心","close-on-click-modal":!1,"close-on-press-escape":!1,visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[r("el-form",{attrs:{model:e.dcCenter}},[r("el-form-item",{attrs:{label:"dc"}},[r("el-select",{attrs:{placeholder:"dc"},model:{value:e.dcCenter.choiceDc,callback:function(t){e.$set(e.dcCenter,"choiceDc",t)},expression:"dcCenter.choiceDc"}},e._l(e.dcCenter.springBootAdminList,function(e){return r("el-option",{key:e.name,attrs:{label:e.name,value:e.name}})}))],1)],1),e._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{attrs:{type:"primary"},on:{click:e.handleDcCenterChange}},[e._v("确 定")])],1)],1)],1)},u=[],h={render:d,staticRenderFns:u},m=h,p=r(99),f=n,v=p(l,m,!1,f,null,null);t.default=v.exports}});