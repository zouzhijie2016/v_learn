webpackJsonp([6],{400:function(e,t,a){"use strict";var r=a(75),o=a.n(r),s=a(76),i=a.n(s),n=a(3);t.a={findProductInfoBykeyWord:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/product/findProductInfoBykeyWord",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},selectProductCategoryByParentId:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/productCategory/selectProductCategoryByParentId",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},lookupProductInfoAjax:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/product/LookupProductInfoAjax",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},exportProductList:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.get("/api/product/v1/product/ExportProductList",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},productListPermission:function(){var e=this;return i()(o.a.mark(function t(){var a;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.a.post("/api/product/v1/product/productListPermission");case 2:return a=e.sent,e.abrupt("return",a);case 4:case"end":return e.stop()}},t,e)}))()},productPriceFindProductsInfo:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/price/v1/productPrice/productPriceFindProductsInfo",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},findAllcheckedProductPrice:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/price/v1/productPrice/findAllcheckedProductPrice",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},oneKeyUpdateAllProductPrice:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/price/v1/productPrice/oneKeyUpdateAllProductPrice",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},getClassficationList:function(){var e=this;return i()(o.a.mark(function t(){var a;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.a.post("/api/product/v1/productCategory/queryAllProductCategoryAndSequenceNum");case 2:return a=e.sent,e.abrupt("return",a);case 4:case"end":return e.stop()}},t,e)}))()},selectProductCategory:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/productCategory/selectProductCategoryByParentId",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},selectProductCategoryFeature:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/productCategory/listCategoryFeatureTreeBycategoryID",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},editProductCategoryFeature:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/productFeatureTypeCategory/editFeatureTypeCategory",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},moveProductCategory:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/productCategoryRollup/moveClassfication",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},editProductCategory:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/productCategory/editClassfication",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},deleteProductCategory:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/productCategory/deleteClassfication",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()},createProductCategory:function(e){var t=this;return i()(o.a.mark(function a(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.a.post("/api/product/v1/productCategory/newProductCategory",e);case 2:return r=t.sent,t.abrupt("return",r);case 4:case"end":return t.stop()}},a,t)}))()}}},469:function(e,t,a){var r=a(470);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a(154)("7925c231",r,!0)},470:function(e,t,a){t=e.exports=a(153)(void 0),t.push([e.i,".category_box{background-color:#fff;border:1px solid #dbdbdb}.category_box_operate{padding:24px 12px 8px 24px}.category_box_loading{height:80px;text-align:center}.category_operate_span{cursor:pointer}.category_box_data{text-align:center;line-height:40px}.el-tree-node__content{height:40px;border-bottom:1px solid #dfeaec;font-size:12px}.el-tree-node__expand-icon{border-left-width:9px}.category_tree_arrow{display:inline-block}.category_box_tree{padding:14px 24px 24px}.category_box_title{background:#eef4f6;overflow:hidden}.category_box_title>span{display:inline-block;width:130px;float:right;height:40px;line-height:40px;vertical-align:middle;font-size:12px;font-weight:400;text-align:left;padding-left:5px;padding-right:5px;font-weight:700;margin-right:20px}.category_box_title .box_title_label{float:left;display:inline-block;width:32%}.category_box_title .box_title_move{float:left;display:inline-block;width:8%}.category_tree_label{display:inline-block;width:32%}.category_tree_move{display:inline-block;width:8%;margin-right:20px}.category_tree_name{display:inline;width:127px;vertical-align:middle;float:right;height:40px;line-height:40px;margin-right:20px}.categroy_tree_labelInput{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;background-image:none;border-radius:4px;border:1px solid #bfd3d9;-webkit-box-sizing:border-box;box-sizing:border-box;color:#1f363d;display:inline-block;font-size:inherit;height:30px;line-height:1;outline:none;padding:3px 10px;-webkit-transition:border-color .2s cubic-bezier(.645,.045,.355,1);transition:border-color .2s cubic-bezier(.645,.045,.355,1)}",""])},471:function(e,t,a){var r=a(472);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a(154)("53ff517a",r,!0)},472:function(e,t,a){t=e.exports=a(153)(void 0),t.push([e.i,".editDialog{width:950px!important}",""])},473:function(e,t,a){var r=a(474);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a(154)("30118fca",r,!0)},474:function(e,t,a){t=e.exports=a(153)(void 0),t.push([e.i,".detail_current_title[data-v-70d2ef1a],.detail_feature_title[data-v-70d2ef1a]{font-weight:700;line-height:35px;margin-bottom:5px}.detail_current[data-v-70d2ef1a]{margin-bottom:10px}.detail_current_show>label[data-v-70d2ef1a],.detail_current_show>span[data-v-70d2ef1a]{display:inline-block;line-height:20px;vertical-align:middle;margin-right:10px;font-size:12px}.detail_current_show>span[data-v-70d2ef1a]{padding:5px;border:1px solid #cfd1d6;color:#878d99;background:#f3f4f5}.category_box_loading[data-v-70d2ef1a]{height:40px;text-align:center}.detail_feature[data-v-70d2ef1a]{margin-bottom:10px}.feature_desc_tag .tagChecked[data-v-70d2ef1a]{background-color:#8cc152;color:#fff}.desc_tag_show[data-v-70d2ef1a]{display:inline-block;padding:0 5px;height:24px;line-height:22px;font-size:12px;border-radius:4px;-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid transparent;white-space:nowrap;background-color:rgba(18,206,102,.1);border-color:rgba(18,206,102,.2);color:#13ce66;margin-right:10px;margin-bottom:10px;cursor:pointer}.feature_desc_group[data-v-70d2ef1a]{margin-bottom:10px}.feature_desc_tag[data-v-70d2ef1a]{line-height:25px}.tag_name_list[data-v-70d2ef1a]{display:inline-block}.tag_name_list>span[data-v-70d2ef1a]{margin-right:10px}.tag_feature_name[data-v-70d2ef1a]{height:30px;line-height:30px;display:inline-block;padding:0 5px;border:1px dashed #8cc152;background:#dceacd;color:#424242;font-size:12px;margin:0 10px 10px 0}",""])},475:function(e,t,a){var r=a(476);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a(154)("df680d6e",r,!0)},476:function(e,t,a){t=e.exports=a(153)(void 0),t.push([e.i,".createDialog{width:600px!important}",""])},477:function(e,t,a){var r=a(478);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a(154)("68d35c31",r,!0)},478:function(e,t,a){t=e.exports=a(153)(void 0),t.push([e.i,".new_category_form[data-v-daaef44e]{margin-bottom:10px}.new_category_text[data-v-daaef44e]{width:200px}",""])},546:function(e,t,a){"use strict";function r(e){a(471),a(473)}function o(e){a(475),a(477)}function s(e){a(469)}Object.defineProperty(t,"__esModule",{value:!0});var i=a(400),n={props:["dataVisible","categoryId","parentCategoryId"],data:function(){return{loading:!0,isHasData:!1,dataCloseVisible:!0,firstCategory:"",secondCategory:"",thirdCategory:"",featureLists:[],checkedFeatrues:[],firstCategoryFeature:[],firstCategoryFeatureList:[],secondCategoryFeature:[],secondCategoryFeatureList:[],thirdCategoryFeature:[],thirdCategoryFeatureList:[]}},watch:{dataCloseVisible:function(){this.$emit("update:dataVisible",this.dataCloseVisible)}},mounted:function(){var e=this,t=this,a={categoryId:this.categoryId,parentCategoryId:this.parentCategoryId};this.loading=!0,i.a.selectProductCategoryFeature(a).then(function(a){if(a.success&&a.data){for(var r=0;r<a.data.length;r++){var o="",s="",i="";switch(a.data[r].categoryLevel){case 1:o="firstCategoryFeature",s="firstCategoryFeatureList",i="firstCategory";break;case 2:o="secondCategoryFeature",s="secondCategoryFeatureList",i="secondCategory";break;case 3:o="thirdCategoryFeature",s="thirdCategoryFeatureList",i="thirdCategory"}t[i]=a.data[r].categoryName,a.data[r].wholeFeatureType&&a.data[r].wholeFeatureType.map(function(e){e.isActive=!1}),a.data[r].featureTypeAndFeatureVO&&!a.data[r].wholeFeatureType?(t[o]=a.data[r].featureTypeAndFeatureVO,t[s]=[]):a.data[r].featureTypeAndFeatureVO&&a.data[r].wholeFeatureType?(t[s]=a.data[r].wholeFeatureType,a.data[r].featureTypeAndFeatureVO.map(function(e){for(var a=0;a<t[s].length;a++)e.productFeatureTypeId==t[s][a].productFeatureTypeId&&(t[s][a].isActive=!0,t.checkedFeatrues.push(t[s][a].productFeatureTypeId))}),t[o]=a.data[r].featureTypeAndFeatureVO):!a.data[r].featureTypeAndFeatureVO&&a.data[r].wholeFeatureType?(t[o]=[],t[s]=a.data[r].wholeFeatureType):(t[o]=[],t[s]=[])}e.isHasData=!0,e.loading=!1}}).catch(function(t){e.loading=!1,e.showErroMessage(t.message,"Service exceptions！")})},methods:{confirmFeature:function(){var e=this,t={categoryId:this.categoryId,selectProductTypeID:this.checkedFeatrues};i.a.editProductCategoryFeature(t).then(function(t){console.dir(t),t.success?(e.$message({message:"updata success",type:"success"}),e.$emit("update:dataVisible",!1)):e.showErroMessage(t.message,"Service exceptions！")}).catch(function(t){e.showErroMessage(t.message,"Service exceptions！"),e.$emit("update:dataVisible",!1)})},checkFeature:function(e){if(e.isActive){var t=this.checkedFeatrues.indexOf(e.productFeatureTypeId);this.checkedFeatrues.splice(t,1),e.isActive=!1}else this.checkedFeatrues.push(e.productFeatureTypeId),e.isActive=!0},showErroMessage:function(e,t){this.$message({showClose:!0,message:e||t,type:"error"})}}},c=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-dialog",{attrs:{title:"Category Details","custom-class":"editDialog",visible:e.dataCloseVisible,"close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.dataCloseVisible=t}}},[a("div",{staticClass:"category_detail"},[a("div",{staticClass:"detail_current"},[a("div",{staticClass:"detail_current_title"},[e._v("Current Category Details")]),e._v(" "),a("el-row",{attrs:{gutter:20}},[a("el-col",{staticClass:"detail_current_show",attrs:{span:8}},[a("label",[e._v("First Category Name:")]),a("span",{directives:[{name:"show",rawName:"v-show",value:e.firstCategory,expression:"firstCategory"}]},[e._v(e._s(e.firstCategory))])]),e._v(" "),a("el-col",{directives:[{name:"show",rawName:"v-show",value:e.secondCategory,expression:"secondCategory"}],staticClass:"detail_current_show",attrs:{span:8}},[a("label",[e._v("Second Category Name:")]),a("span",[e._v(e._s(e.secondCategory))])]),e._v(" "),a("el-col",{directives:[{name:"show",rawName:"v-show",value:e.thirdCategory,expression:"thirdCategory"}],staticClass:"detail_current_show",attrs:{span:8}},[a("label",[e._v("Third Category Name:")]),a("span",[e._v(e._s(e.thirdCategory))])])],1)],1),e._v(" "),a("div",{staticClass:"detail_feature"},[a("div",{staticClass:"detail_feature_title"},[e._v("Product Category Feature")]),e._v(" "),a("div",{staticClass:"detail_feature_desc"},[a("div",{staticClass:"feature_desc_group"},[a("div",{directives:[{name:"show",rawName:"v-show",value:!e.isHasData,expression:"!isHasData"},{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"category_box_loading"}),e._v(" "),e.isHasData?[a("div",{staticClass:"feature_desc_tag"},[a("div",{staticClass:"tag_name_text"},[e._v("First Category Feature :")]),e._v(" "),e.firstCategoryFeature.length>0&&0==e.firstCategoryFeatureList.length?e._l(e.firstCategoryFeature,function(t){return a("div",{staticClass:"tag_name_list"},[a("span",{staticClass:"tag_feature_name"},[e._v(e._s(t.productFeatureName))])])}):e._e(),e._v(" "),e.firstCategoryFeatureList.length>0?a("div",[e._l(e.firstCategoryFeatureList,function(t){return[a("span",{class:[t.isActive?"tagChecked":"","desc_tag_show"],on:{click:function(a){e.checkFeature(t,a)}}},[e._v(e._s(t.description))])]})],2):e._e()],2),e._v(" "),a("div",{staticClass:"feature_desc_tag"},[a("div",{staticClass:"tag_name_text"},[e._v("Second Category Feature :")]),e._v(" "),e.secondCategoryFeature.length>0&&0==e.secondCategoryFeatureList.length?e._l(e.secondCategoryFeature,function(t){return a("div",{staticClass:"tag_name_list"},[a("span",{staticClass:"tag_feature_name"},[e._v(e._s(t.productFeatureName))])])}):e._e(),e._v(" "),e.secondCategoryFeatureList.length>0?a("div",[e._l(e.secondCategoryFeatureList,function(t){return[a("span",{class:[t.isActive?"tagChecked":"","desc_tag_show"],on:{click:function(a){e.checkFeature(t,a)}}},[e._v(e._s(t.description))])]})],2):e._e()],2),e._v(" "),a("div",{staticClass:"feature_desc_tag"},[a("div",{staticClass:"tag_name_text"},[e._v("Third Category Feature :")]),e._v(" "),e.thirdCategoryFeature.length>0&&0==e.thirdCategoryFeatureList.length?e._l(e.thirdCategoryFeature,function(t){return a("div",{staticClass:"tag_name_list"},[a("span",{staticClass:"tag_feature_name"},[e._v(e._s(t.productFeatureName))])])}):e._e(),e._v(" "),e.thirdCategoryFeatureList.length>0?a("div",[e._l(e.thirdCategoryFeatureList,function(t){return[a("span",{class:[t.isActive?"tagChecked":"","desc_tag_show"],on:{click:function(a){e.checkFeature(t,a)}}},[e._v(e._s(t.description))])]})],2):e._e()],2)]:e._e()],2)])]),e._v(" "),a("div",{staticClass:"detail_btns"},[a("el-button",{attrs:{type:"primary"},on:{click:e.confirmFeature}},[e._v("Confirm")]),e._v(" "),a("el-button",{attrs:{type:"default"},on:{click:function(t){e.dataCloseVisible=!1}}},[e._v("Cancel")])],1)])])],1)},d=[],l={render:c,staticRenderFns:d},u=l,g=a(99),p=r,y=g(n,u,!1,p,"data-v-70d2ef1a",null),f=y.exports,h=a(12),v={props:["createDataVisible","parentCategoryList"],data:function(){return{dataCloseVisible:!0,isShowParentCategory:!1,isShowSecondCategory:!1,categoryName:"",categoryLevel:"",parentCategoryId:"",secondCategory:"",categoryLevelOptions:[{id:1,levelName:"First-Level"},{id:2,levelName:"Second-Level"},{id:3,levelName:"Third-Level"}],secondCategoryOpions:[]}},watch:{dataCloseVisible:function(){this.$emit("update:createDataVisible",this.dataCloseVisible)}},mounted:function(){console.dir(this.parentCategoryList)},methods:{selectLevel:function(){switch(this.categoryLevel){case 1:this.isShowParentCategory=!1,this.isShowSecondCategory=!1;break;case 2:this.isShowParentCategory=!0,this.parentCategoryId="",this.isShowSecondCategory=!1;break;case 3:this.isShowParentCategory=!0,this.parentCategoryId="",this.isShowSecondCategory=!0}},selectParent:function(){var e=this;if(e.isShowSecondCategory){var t=e.parentCategoryList.filter(function(t){return t.categoryId===e.parentCategoryId});t[0]&&(e.secondCategoryOpions=t[0].children?t[0].children:[])}},cancel:function(){this.$emit("update:createDataVisible",!1)},confirmToCreate:function(){var e=this,t="";if(!this.categoryLevel)return void this.showErroMessage("Category level Can not empty！");if(!this.categoryName.trim())return void this.showErroMessage("Category name Can not empty！");if(t=this.secondCategory?this.secondCategory:this.parentCategoryId,this.categoryLevel>1&&!t)return void this.showErroMessage("Parent Category Can not empty！");var a=h.a.getServerTimestampByServerDate(new Date),r={categoryLevel:this.categoryLevel,createTime:a,categoryName:this.categoryName.trim(),parentCategoryId:t};i.a.createProductCategory(r).then(function(t){t.success?(e.$message({message:"create success",type:"success"}),e.$emit("update:createDataVisible",!1),e.$emit("refreshList")):e.showErroMessage(t.message,"Service exceptions！")}).catch(function(t){e.showErroMessage(t.message,"Service exceptions！")})},showErroMessage:function(e,t){this.$message({showClose:!0,message:e||t,type:"error"})}}},m=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-dialog",{attrs:{title:"Create A New Category",visible:e.dataCloseVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,"custom-class":"createDialog"},on:{"update:visible":function(t){e.dataCloseVisible=t}}},[a("div",{staticClass:"new_category"},[a("el-form",{ref:"form",staticClass:"new_category_form",attrs:{"label-width":"120px"}},[a("el-form-item",{attrs:{label:"Category Level"}},[a("el-select",{staticClass:"new_category_text",attrs:{size:"small",placeholder:"Please select..."},on:{change:e.selectLevel},model:{value:e.categoryLevel,callback:function(t){e.categoryLevel=t},expression:"categoryLevel"}},e._l(e.categoryLevelOptions,function(e){return a("el-option",{key:e.id,attrs:{label:e.levelName,value:e.id}})}))],1),e._v(" "),a("el-form-item",{attrs:{label:" New Category"}},[a("el-input",{staticClass:"new_category_text",model:{value:e.categoryName,callback:function(t){e.categoryName=t},expression:"categoryName"}})],1),e._v(" "),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:e.isShowParentCategory,expression:"isShowParentCategory"}],attrs:{label:"Parent Category"}},[a("el-select",{staticClass:"new_category_text",attrs:{size:"small",placeholder:"Please select..."},on:{change:e.selectParent},model:{value:e.parentCategoryId,callback:function(t){e.parentCategoryId=t},expression:"parentCategoryId"}},e._l(e.parentCategoryList,function(e){return a("el-option",{key:e.categoryId,attrs:{label:e.categoryName,value:e.categoryId}})})),e._v(" "),a("el-select",{directives:[{name:"show",rawName:"v-show",value:e.isShowSecondCategory,expression:"isShowSecondCategory"}],staticClass:"new_category_text",attrs:{size:"small",placeholder:"Please select..."},model:{value:e.secondCategory,callback:function(t){e.secondCategory=t},expression:"secondCategory"}},e._l(e.secondCategoryOpions,function(e){return a("el-option",{key:e.categoryId,attrs:{label:e.categoryName,value:e.categoryId}})}))],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.confirmToCreate}},[e._v("Confirm to Create")]),e._v(" "),a("el-button",{on:{click:e.cancel}},[e._v("Cancel")])],1)],1)])],1)},C=[],_={render:m,staticRenderFns:C},x=_,w=a(99),b=o,I=w(v,x,!1,b,"data-v-daaef44e",null),k=I.exports,F={data:function(){return{isCollapse:!1,isRefresh:!1,categoryIdData:"",categoryDialogFormVisible:!1,createCategoryDialogFormVisible:!1,formatDatas:[],expandArrays:[],firstCategory:[],newStoreArrs:[],categoryList:[],defaultProps:{label:"categoryName",children:"children",id:"categoryId"},isEdit:!1,loading:!0}},components:{editCategoryDialog:f,createCategoryDialog:k},filters:{formatTime:function(e){return"111"}},mounted:function(){this.listClassfication()},methods:{recoverInput:function(){this.setEditToReading(this.categoryList)},filterNode:function(e,t){return!e||-1!==t.label.indexOf(e)},refreshCategory:function(){this.listClassfication()},editCategoryName:function(e,t,a){this.setEditToReading(e.data),t.isEdit=!0},setEditToReading:function(e){e.map(function(e){e.isEdit=!1,e.children&&e.children.length>0&&e.children.map(function(e){e.isEdit=!1,e.children&&e.children.length>0&&e.children.map(function(e){e.isEdit=!1})})})},setCategoryName:function(e){var t=this;if(13==event.keyCode){e.categoryName=event.target.value,e.categoryName=e.categoryName.replace(/(^\s*)|(\s*$)/g,""),e.isEdit=!1;var a={categoryId:e.categoryId,categoryName:e.categoryName,parentCategoryId:e.parentCategoryId};i.a.editProductCategory(a).then(function(a){a.success?(t.$message({message:"edit success",type:"success"}),e.categoryId=a.data.categoryId,e.categoryName=a.data.categoryName):t.showErroMessage(a.message,"Service exceptions！")}).catch(function(e){t.showErroMessage(e.message,"Service exceptions！")})}},removeCategory:function(e,t){var a=this;this.$confirm("Do you want to delete?","",{confirmButtonText:"confirm",cancelButtonText:"cancle",type:"warning"}).then(function(){var r={categoryId:t.categoryId,parentProductCategoryId:t.parentCategoryId};i.a.deleteProductCategory(r).then(function(r){r.success?(a.$message({message:"delete success",type:"success"}),e.remove(t)):a.showErroMessage(r.message,"Service exceptions！")}).catch(function(e){a.showErroMessage(e.message,"Service exceptions！")})})},editCategory:function(e,t,a){this.categoryDialogFormVisible=!0,this.categoryIdData=t.categoryId,this.parentCategoryIdData=t.parentCategoryId},moveDownCategory:function(e,t,a){if(1!=a.level||e.data.length!=t.sequenceNum){if(2==a.level||3==a.level){var r=a.parent.data.children.length;if(t.sequenceNum==r)return}this.loading=!0,this.newStoreArrs.splice(0),this.newStoreArrs=this.newStoreArrs.concat(this.categoryList),this.getDownVal(a.level,t.categoryId,t.parentCategoryId),this.moveForData(e,a.level,t)}},moveForData:function(e,t,a){var r=this,o="";switch(t){case 1:r.newStoreArrs.map(function(e,t){e.sequenceNum=t+1}),r.formatDatas.splice(0),r.formatDatas=r.formatDatas.concat(r.newStoreArrs);break;case 2:r.formatDatas.splice(0),r.newStoreArrs.map(function(e){if(e.categoryId==a.parentCategoryId){for(var t=0;t<e.children.length;t++)e.children[t].sequenceNum=t+1;return r.formatDatas=r.formatDatas.concat(e.children),void(o=e.categoryId)}});break;case 3:r.formatDatas.splice(0),r.newStoreArrs.map(function(e){e.children.map(function(t){if(t.categoryId==a.parentCategoryId){for(var s=0;s<t.children.length;s++)t.children[s].sequenceNum=s+1;return r.formatDatas=r.formatDatas.concat(e.children),void(o=t.categoryId)}})})}i.a.moveProductCategory({categoryJSONArr:r.formatDatas}).then(function(t){r.loading=!1,t.success?(r.$message({message:"move success",type:"success"}),r.categoryList.splice(0),r.categoryList=r.categoryList.concat(r.newStoreArrs),r.expandArrays.splice(0),r.expandArrays=r.expandArrays.concat(o),e.data.splice(0),e.data=e.data.concat(r.categoryList),console.dir(e.data)):r.showErroMessage(t.message,"Service exceptions！")}).catch(function(e){r.loading=!1,r.showErroMessage(e.message,"Service exceptions！")})},getDownVal:function(e,t,a){switch(e){case 1:for(var r=0;r<this.newStoreArrs.length;r++)if(this.newStoreArrs[r].categoryId==t){var o={};return o=this.newStoreArrs[r+1],this.newStoreArrs[r+1]=this.newStoreArrs[r],void(this.newStoreArrs[r]=o)}break;case 2:for(var s=0;s<this.newStoreArrs.length;s++)if(this.newStoreArrs[s].categoryId==a){var i=this.newStoreArrs[s].children;for(var n in i)if(i[n].categoryId==t){var c={};return c=i[parseInt(n)+1],i[parseInt(n)+1]=i[n],void(i[n]=c)}}break;case 3:for(var d=0;d<this.newStoreArrs.length;d++)for(var l=0;l<this.newStoreArrs[d].children.length;l++)if(this.newStoreArrs[d].children[l].categoryId==a){var u=this.newStoreArrs[d].children[l].children;for(var g in u)if(u[g].categoryId==t){var p={};return p=u[parseInt(g)+1],u[parseInt(g)+1]=u[g],void(u[g]=p)}}}},getUpVal:function(e,t,a){switch(e){case 1:for(var r=0;r<this.newStoreArrs.length;r++)if(this.newStoreArrs[r].categoryId==t){var o={};return o=this.newStoreArrs[r-1],this.newStoreArrs[r-1]=this.newStoreArrs[r],void(this.newStoreArrs[r]=o)}break;case 2:for(var s=0;s<this.newStoreArrs.length;s++)if(this.newStoreArrs[s].categoryId==a){var i=this.newStoreArrs[s].children;for(var n in i)if(i[n].categoryId==t){var c={};return c=i[parseInt(n)-1],i[parseInt(n)-1]=i[n],void(i[n]=c)}}break;case 3:for(var d=0;d<this.newStoreArrs.length;d++)for(var l=0;l<this.newStoreArrs[d].children.length;l++)if(this.newStoreArrs[d].children[l].categoryId==a){var u=this.newStoreArrs[d].children[l].children;for(var g in u)if(u[g].categoryId==t){var p={};return p=u[parseInt(g)-1],u[parseInt(g)-1]=u[g],void(u[g]=p)}}}},moveUpCategory:function(e,t,a){1!=t.sequenceNum&&(this.loading=!0,this.newStoreArrs.splice(0),this.newStoreArrs=this.newStoreArrs.concat(this.categoryList),this.getUpVal(a.level,t.categoryId,t.parentCategoryId),this.moveForData(e,a.level,t))},createCategory:function(){this.createCategoryDialogFormVisible=!0},formatTimeForTimestamp:function(e){return h.a.getServerDateStrByLocal(e,"dd/MM/yyyy hh:mm:ss")},formatTimeToTimestamp:function(e){var t=new Date(e);return h.a.getServerTimestampByServerDate(t)},listClassfication:function(){var e=this;this.loading=!0,i.a.getClassficationList().then(function(t){e.loading=!1,t.success&&t.data&&t.data.productCategoryBeanMap&&(e.categoryList.splice(0),e.categoryList=e.categoryList.concat(e.setSourceData(t.data.productCategoryBeanMap)))}).catch(function(t){e.loading=!1,e.showErroMessage(t.message,"Service exceptions！")})},setTargetData:function(e,t,a){var r=[];switch(a){case 1:t.map(function(e){r.push({categoryId:e.categoryId,categoryName:e.categoryName,createTime:e.createTime,parentCategoryId:e.parentCategoryId,sequenceNum:e.sequenceNum})});break;case 2:var o=e.parentCategoryId;r=t.filter(function(e){return e.categoryId==o})}return r},setSourceData:function(e){var t=[];for(var a in e){var r=e[a];if(r.isEdit=!1,"DefaultRootCategory"==r.parentCategoryId){var o=r.createTime;r.fixCreateTime=this.formatTimeForTimestamp(o),t.push(r),this.firstCategory=t,this.firstCategory=this.setGroupBy(this.firstCategory.sort(this.sortCompare("sequenceNum")))}}t.sort(this.sortCompare("sequenceNum"));for(var s=0;s<t.length;s++){var i=t[s].categoryId,n=[];t[s].children=n;for(var c in e){var d=e[c];if(d.isEdit=!1,d.parentCategoryId==i){var l=d.createTime;d.fixCreateTime=this.formatTimeForTimestamp(l),n.push(d)}}n=this.setGroupBy(n.sort(this.sortCompare("sequenceNum")))}for(var u=0;u<t.length;u++)for(var g=t[u].children,p=0;p<g.length;p++){var y=g[p].categoryId,f=[];g[p].children=f;for(var h in e){var v=e[h];if(v.isEdit=!1,v.parentCategoryId==y){var m=v.createTime;v.fixCreateTime=this.formatTimeForTimestamp(m),f.push(v)}}f=this.setGroupBy(f.sort(this.sortCompare("sequenceNum")))}for(var C in e)e[C].title=e[C].categoryName,e[C].key=e[C].categoryId;return console.dir(t),t},setGroupBy:function(e){return e.map(function(e,t){e.sequenceNum=t+1}),e},sortCompare:function(e){return function(t,a){var r=t[e],o=a[e];return r<o?-1:r>o?1:0}},renderContent:function(e,t){var a=this,r=t.node,o=t.data,s=t.store;return e("span",{class:"category_tree"},[e("span",{class:"category_tree_label"},[e("span",null,[o.isEdit?e("input",{attrs:{type:"text"},domProps:{value:o.categoryName},class:"categroy_tree_labelInput",on:{keyup:function(){return a.setCategoryName(o)}}},[]):r.label])]),e("span",{class:"category_tree_name"},[e("el-button",{attrs:{size:"mini",type:"success",plain:!0},on:{click:function(){return a.editCategory(s,o)}}},["View Or Edit"])]),e("span",{class:"category_tree_name"},[e("el-button",{attrs:{size:"mini",type:"success",plain:!0},on:{click:function(){return a.editCategoryName(s,o,r)}}},["Edit"]),e("el-button",{attrs:{size:"mini",type:"danger",plain:!0},on:{click:function(){return a.removeCategory(s,o)}}},["Delete"])]),e("span",{class:"category_tree_name"},[e("span",null,[o.fixCreateTime])]),e("span",{class:"category_tree_name"},[e("span",null,[o.categoryId])]),e("span",{class:"category_tree_move"},[e("span",{class:"el-icon-arrowdown",on:{click:function(){return a.moveDownCategory(s,o,r)}}},[]),e("span",{class:"el-icon-arrowup",on:{click:function(){return a.moveUpCategory(s,o,r)}}},[])])])},showErroMessage:function(e,t){this.$message({showClose:!0,message:e||t,type:"error"})}}},S=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"category_box",on:{click:e.recoverInput}},[a("div",{staticClass:"category_box_operate"},[a("el-row",[a("el-col",{attrs:{span:4}},[a("el-button",{attrs:{type:"primary"},on:{click:e.createCategory}},[e._v("Create")])],1),e._v(" "),a("el-col",{attrs:{span:2,offset:16}},[a("span",{staticClass:"category_operate_span",on:{click:e.refreshCategory}},[e._v("Refresh")])]),e._v(" "),a("el-col",{attrs:{span:2}},[a("span",{staticClass:"category_operate_span",on:{click:e.refreshCategory}},[e._v("Collapse All")])])],1)],1),e._v(" "),a("div",{staticClass:"category_box_tree"},[e._m(0),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:0==e.categoryList.length,expression:"categoryList.length==0"},{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"category_box_loading",attrs:{"element-loading-text":"Loading..."}}),e._v(" "),e.categoryList.length>0?[a("el-tree",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.categoryList,"element-loading-text":"Loading...",props:e.defaultProps,"empty-text":"no data","default-expanded-keys":e.expandArrays,"expand-on-click-node":!1,"node-key":"categoryId","render-content":e.renderContent}})]:e._e()],2),e._v(" "),e.categoryDialogFormVisible?a("edit-category-dialog",{attrs:{dataVisible:e.categoryDialogFormVisible,categoryId:e.categoryIdData,parentCategoryId:e.parentCategoryIdData},on:{"update:dataVisible":function(t){e.categoryDialogFormVisible=t},"update:categoryId":function(t){e.categoryIdData=t},"update:parentCategoryId":function(t){e.parentCategoryIdData=t}}}):e._e(),e._v(" "),e.createCategoryDialogFormVisible?a("create-category-dialog",{attrs:{createDataVisible:e.createCategoryDialogFormVisible,parentCategoryList:e.firstCategory},on:{"update:createDataVisible":function(t){e.createCategoryDialogFormVisible=t},"update:parentCategoryList":function(t){e.firstCategory=t},refreshList:e.refreshCategory}}):e._e()],1)},D=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"category_box_title"},[a("span",{staticClass:"box_title_dialog"},[e._v("Feature Relation")]),e._v(" "),a("span",{staticClass:"box_title_operate"},[e._v("Operation")]),e._v(" "),a("span",{staticClass:"box_title_date"},[e._v("Created Date")]),e._v(" "),a("span",{staticClass:"box_title_categoryId"},[e._v("Category ID")]),e._v(" "),a("span",{staticClass:"box_title_label"},[e._v("Category Name")]),e._v(" "),a("span",{staticClass:"box_title_move"},[e._v("Move")])])}],A={render:S,staticRenderFns:D},L=A,N=a(99),P=s,T=N(F,L,!1,P,null,null);t.default=T.exports}});