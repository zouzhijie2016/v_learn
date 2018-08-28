<template>
  <div class="addProductFeature">
      <div class="baseInfo">
          <div class="baseInfo_title">
              Basic Information
              <el-button v-if="form.productId" type="success" class="asyc_btn" :loading="syncProductLoading" @click="syncProductEvt">B2R Sync</el-button>
          </div>
          <div class="baseInfo_content">
              <el-form :inline="true" :model="form">
                  <el-row>
                      <el-col :span="6">
                          <el-form-item label="Product ID :">
                              <span>{{ form.productId }}</span>
                          </el-form-item>
                      </el-col>
                      <el-col :span="6">
                          <el-form-item label="Product Type :">
                              <span>{{ form.productType }}</span>
                          </el-form-item>
                      </el-col>
                      <el-col :span="6">
                          <el-form-item label="Model :">
                              <el-input v-model="form.internalName" style="width: 180px"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="6">
                          <el-form-item label="Brand Name :">
                              <el-input v-model="form.brandName" style="width: 180px"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row v-if="modelLength > 0">
                      <el-col :offset="12" :span="12">
                              <span :class="{'paddingLeftClass' : true, 'redColor': modelLength > 40 }">Input : {{ modelLength }}/40 character</span>
                      </el-col>
                  </el-row>
              </el-form>
          </div>
      </div>
      <div class="productCategory">
          <div class="productCategory_title">Product Category</div>
          <div class="productCategory_select">
              <span class="productCategory_span">Reselect Category :</span>
              <div class="productCategory_categoryList">
                  <el-form :inline="true" :model="categoryForm">
                      <el-form-item>
                          <el-select size="small" v-model="categoryForm.firstCategory" @change="changeFirstCategoryEvt" style="width: 235px">
                              <el-option
                                  v-for="item in firstCategoryData"
                                  :key="item.categoryId"
                                  :label="item.categoryName"
                                  :value="item.categoryId">
                              </el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item>
                          <el-select size="small" v-model="categoryForm.secondCategory" @change="changeSecondCategoryEvt" style="width: 235px">
                              <el-option
                                  v-for="item in secondCategoryData"
                                  :key="item.categoryId"
                                  :label="item.categoryName"
                                  :value="item.categoryId">
                              </el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item>
                          <el-select size="small" v-model="categoryForm.thirdCategory" @change="changeThirdCategoryEvt" style="width: 235px">
                              <el-option
                                  v-for="item in thirdCategoryData"
                                  :key="item.categoryId"
                                  :label="item.categoryName"
                                  :value="item.categoryId">
                              </el-option>
                          </el-select>
                      </el-form-item>
                  </el-form>
              </div>
              <div style="clear: both;"></div>
          </div>
      </div>
      <div class="attributesList">
          <div class="attributesList_title">Attributes List</div>
          <div class="attributesList_content">
              <div class="attributesList_content_title">
                  <el-row>
                      <el-col :span="5">
                          <div class="left_title">Attributes</div>
                      </el-col>
                      <el-col :span="19">
                          <div class="right_title">Attribute Values</div>
                      </el-col>
                  </el-row>
              </div>
              <div class="attributesList_content_list">
                  <div class="attributesList_content_detail">
                      <el-row v-for="(list, index) in initCategoryArrary" :key="index">
                          <el-col :span="5">
                              <div class="attr_content">
                                  <span :class='["attr_span", list.isActive ? "active" : ""]'>{{ list.productFeatureName }}</span>
                                  <div class="attr_operator">
                                      <i class="el-icon-close" @click="deleteAttrContentEvt(list)"></i>
                                      <i class="el-icon-edit" @click="editAttrContentEvt(list)"></i>
                                  </div>
                                  <div class="attr_icon">
                                      <i class="el-icon-caret-right"></i>
                                  </div>
                              </div>
                          </el-col>
                          <el-col :span="19">
                              <template v-if="list.featureVOList">
                                  <template v-for="attr in list.featureVOList">
                                      <div class="attr_value_content">
                                          <span :class='["attr_value_span", attr.isActive ? "active" : ""]' @click="attrValuesEvt(attr)">{{ attr.featureName }}</span>
                                          <div class="attr_value_operator">
                                              <i class="el-icon-close" @click="deleteAttrValuesContentEvt(attr)"></i>
                                              <i class="el-icon-edit" @click="editAttrValuesContentEvt(list.productFeatureTypeId, attr)"></i>
                                          </div>
                                      </div>
                                  </template>
                              </template>
                              <div class="attr_value_content">
                                  <el-button type="success" icon="el-icon-plus" @click="addAttrValuesContentEvt(list.productFeatureTypeId)">Add</el-button>
                              </div>
                          </el-col>
                      </el-row>
                  </div>
                  <div class="attributesList_content_operator">
                      <div class="operator_left_title">
                          <el-button v-show="isShowAddBtns" type="success" icon="el-icon-plus" @click="addAttrContentEvt">Add Attributes</el-button>
                      </div>
                      <div class="operator_right_title">
                          <el-button type="success" icon="el-icon-printer" @click="generateSkuEvt" :loading="generateSkuLoading" class="generate_btn">Generate SKU</el-button>
                      </div>
                      <div style="clear: both;"></div>
                  </div>
              </div>
          </div>
          <div class="attributesList_table" v-if="initTableArrary.length">
              <el-table :data="initTableArrary" style="width: 100%;font-size: 12px">
                  <el-table-column v-for="(list, index) in initTableHeadArrary" :key="index" :prop="list" :label="list" align="center"></el-table-column>
                  <el-table-column prop="productIdSku" label="Product ID(SKU)" align="center"></el-table-column>
                  <el-table-column label="Ean" align="center" width="160">
                      <template slot-scope="scope">
                          <input type="number" :ref="scope.row.productIdSku" @click="clickInputEvt(scope.row)" @keyup.enter="enterInputEvt(scope.row)" v-number.undigit.unsign class="common_theme" v-model.trim="scope.row.EAN" />
                      </template>
                  </el-table-column>
                  <el-table-column label="Sync" align="center">
                      <template slot-scope="scope">
                          <a v-if="scope.row.sync" href="javascript:void(0)" class="sync_success"></a>
                          <a v-else href="javascript:void(0)" class="sync_fail"></a>
                      </template>
                  </el-table-column>
                  <el-table-column label="Operation" align="center">
                      <template slot-scope="scope">
                          <el-switch
                              @change="changeSwitchEvt(scope.row)"
                              v-model="scope.row.isActive"
                              active-color="#ff4949"
                              inactive-color="#13ce66"
                              active-text="Disabled"
                              inactive-text="Enabled"
                              active-value="N"
                              inactive-value="Y">
                          </el-switch>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
          <div class="attributesList_operator" v-if="form.productId">
              <el-button type="success" icon="el-icon-check" :loading="saveInfoLoading" @click="saveInfoEvt">Save Info</el-button>
              <el-button type="success" icon="el-icon-edit" @click="editPriceEvt">Edit Price</el-button>
          </div>
      </div>
      <add-attr-values-dialog v-if="addAttrValuesDialogVisible"
                           :dataVisible.sync="addAttrValuesDialogVisible"
                           :dataParams.sync="dataList"
                           v-on:createAttrValuesSuccess="createAttrValuesSuccessEvt"
                           v-on:createAttrSuccess="createAttrSuccessEvt"
                           v-on:editAttrValuesSuccess="editAttrValuesSuccessEvt"
                           v-on:editAttrSuccess="editAttrSuccessEvt"
      ></add-attr-values-dialog>
  </div>
</template>
<script>
  import Utils from '~utils/index'
  import productApi from '~api/productapi'
  import addAttrValuesDialog from './addAttrValuesDialog.vue'
  import { productMixin } from '~product-modules/common/productMixins'
  export default {
      data(){
          return {
              addAttrValuesDialogVisible: false,
              firstCategoryData : [{
                  categoryId : "",
                  categoryName : "Please select"
              }],
              secondCategoryData : [{
                  categoryId : "",
                  categoryName : "Please select"
              }],
              thirdCategoryData : [{
                  categoryId : "",
                  categoryName : "Please select"
              }],
              form : {
                  productId : '',
                  productType : 'FINISHED_GOOD',
                  internalName : '',
                  brandName : ''
              },
              categoryForm : {
                  firstCategory : '',
                  secondCategory : '',
                  thirdCategory : ''
              },
              initCategoryList : null,
              initCategoryArrary : [],
              initTableArrary : [],
              tempInitTableArrary : [],
              initTableHeadArrary : [],
              isShowAddBtns : true,
              dataList: {
                  type : '',
                  parentId : '',
                  categoryId : '',
                  futureId : '',
                  currentName : ''
              },
              syncProductLoading : false,
              saveInfoLoading : false,
              generateSkuLoading : false,
              modelLength : 0
          }
      },
      components: {
          addAttrValuesDialog
      },
      watch : {
          'form.internalName'(value){
              this.modelLength = value.length
          }
      },
      mixins: [productMixin],
      mounted(){
          if(this.$route.query.thirdCategoryId){
              this.initCategoryList = Object.assign({}, this.$route.query);

              this.getCategoryByParams();
              this.getFirstCategoryOptions()
          }else if(this.$route.query.productId){
              this.form.productId = this.$route.query.productId;
              this.getHadCheckedList(this.$route.query.productId);
              this.setTableList(this.$route.query.productId);
              this.getFindProductAndCategory(this.$route.query.productId)
          }
      },
      methods: {
          formatData(data){
              if(!data.length){ return [] }

              return data.sort(function(a, b){
                  if(a.sequenceNum == b.sequenceNum){
                      return a.categoryId - b.categoryId;
                  }else{
                      return a.sequenceNum - b.sequenceNum;
                  }
              })
          },
          getFindProductAndCategory(data){
              if(!data) return false;

              productApi.findProductAndCategory({
                  productId: data
              }).then(d => {
                  if (d.success == true) {
                      if(d.data){
                          this.form.productId = d.data.productId;
                          this.form.internalName = d.data.internalName;
                          this.form.brandName = d.data.brandName;

                          this.initCategoryList = Object.assign({}, {
                              firstCategoryId: d.data.firstId,
                              secondCategoryId: d.data.secondId,
                              thirdCategoryId: d.data.thirdId,
                          });

                          this.getFirstCategoryOptions()
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.$showErrorMessage(err)
              })
          },
          getCategoryByParams(data){
              let params = null;
              if(data){
                  params =  {
                      categoryId: data.categoryId,
                      parentCategoryId: data.parentCategoryId
                  }
              }else{
                  params = {
                      categoryId: this.initCategoryList.thirdCategoryId,
                      parentCategoryId: this.initCategoryList.secondCategoryId
                  }
              }
              productApi.listCategoryFeatureTree(params).then(d => {
                  if (d.success == true) {
                      this.initCategoryArrary.splice(0)
                      if(d.data && !d.data.length){
                          return false
                      }
                      (d.data).forEach(item => {
                          if(item.featureTypeAndFeatureVO && item.featureTypeAndFeatureVO.length){
                              this.initCategoryArrary = this.initCategoryArrary.concat(item.featureTypeAndFeatureVO);
                          }
                      })

                      if(this.initCategoryArrary.length){
                          this.initCategoryArrary.forEach(item => {
                              item.isActive = false;
                              if(item.featureVOList && item.featureVOList.length){
                                  item.featureVOList.forEach(itemList => {
                                      itemList.isActive = false
                                  })
                              }
                          })
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.$showErrorMessage(err)
              })
          },
          getFirstCategoryOptions(){
              let t = this;

              this.getCommonCategoryList('DefaultRootCategory', function (d) {
                  if (d.data && d.data.categoryList && d.data.categoryList.length) {
                      let firstFlag = false;
                      t.firstCategoryData.splice(1);

                      t.firstCategoryData = t.firstCategoryData.concat((t.formatData(d.data.categoryList)).map(item => {
                          if(item.categoryId == t.initCategoryList.firstCategoryId){
                              t.categoryForm.firstCategory = t.initCategoryList.firstCategoryId;
                              firstFlag = true
                          }
                          return item
                      }));

                      if(firstFlag){
                          t.getCommonCategoryList(t.initCategoryList.firstCategoryId, function (d) {
                              if (d.data && d.data.categoryList && d.data.categoryList.length) {
                                  let secondFlag = false;
                                  t.secondCategoryData.splice(1);

                                  t.secondCategoryData = t.secondCategoryData.concat((t.formatData(d.data.categoryList)).map(item => {
                                      if(item.categoryId == t.initCategoryList.secondCategoryId){
                                          t.categoryForm.secondCategory = t.initCategoryList.secondCategoryId;
                                          secondFlag = true
                                      }
                                      return item
                                  }));

                                  if(secondFlag){
                                      t.getCommonCategoryList(t.initCategoryList.secondCategoryId, function (d) {
                                          if (d.data && d.data.categoryList && d.data.categoryList.length) {
                                              t.thirdCategoryData.splice(1);

                                              t.thirdCategoryData = t.thirdCategoryData.concat((t.formatData(d.data.categoryList)).map(item => {
                                                  if(item.categoryId == t.initCategoryList.thirdCategoryId){
                                                      t.categoryForm.thirdCategory = t.initCategoryList.thirdCategoryId;
                                                  }
                                                  return item
                                              }));
                                          }
                                      })
                                  }
                              }
                          })
                      }
                  }
              });
          },
          getCommonCategoryList(data, callback){
              if(!data) return false;

              productApi.listGivenClassfication({
                  "categoryId" : data
              }).then(d => {
                  if (d.success == true) {
                      typeof callback == "function" && callback(d);
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.$showErrorMessage(err)
              })
          },
          syncProductEvt(){
              this.syncProductLoading = true;
              productApi.syncProductApi({
                  productId: this.form.productId
              }).then(d => {
                  this.syncProductLoading = false;
                  if (d.success == true) {
                      if(d.errCode == 0){
                          this.$showSuccessMessage('Global synchronize success!');
                          this.setTableList(this.form.productId);
                      }else{
                          this.$showSuccessMessage('Global synchronize fail!');
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.syncProductLoading = false;
                  this.$showErrorMessage(err)
              })
          },
          attrValuesEvt(data){
              if(this.initCategoryArrary.length){
                  this.initCategoryArrary.forEach(item => {
                      let selected;
                      if(item.featureVOList && item.featureVOList.length){
                          (item.featureVOList).forEach(itemList => {
                              if( itemList.featureID == data.featureID){
                                  itemList.isActive = !itemList.isActive
                              }
                          });

                          selected = (item.featureVOList).filter(itemFilter => {
                            return itemFilter.isActive == true
                          })

                          if(selected.length){
                              item.isActive = true
                          }else{
                              item.isActive = false
                          }
                      }
                  })

                  this.initCategoryArrary = [].concat(this.initCategoryArrary);
              }
          },
          disCartsEvt(dataList){
              let twodDscartes = function (a, b) {
                  let ret = [];
                  for (let i = 0; i < a.length; i++) {
                      for (let j = 0; j < b.length; j++) {
                          ret.push(ft(a[i], b[j]));
                      }
                  }
                  return ret;
              }
              let ft = function (a, b) {
                  if (!(a instanceof Array)){
                      a = [a];
                  }
                  let ret = a.slice(0);
                  ret.push(b);
                  return ret;
              }
              return (function (data) {
                  let len = data.length;
                  if (len == 0)
                      return [];
                  else if (len == 1)
                      return data[0];
                  else {
                      let r = data[0];
                      for (let i = 1; i < len; i++) {
                          r = twodDscartes(r, data[i]);
                      }
                      return r;
                  }
              })(dataList);
          },
          generateSkuEvt(){
              if(this.form.productType == '' || this.form.internalName == '' || this.form.brandName == ''){
                  this.$showErrorMessage('Please fill in the basic information of the product!');
                  return false;
              }

              if(this.categoryForm.firstCategory == '' || this.categoryForm.secondCategory == '' || this.categoryForm.thirdCategory == ''){
                  this.$showErrorMessage('Please select catalogues');
                  return false;
              }

              //生成时必须选择一个属性
              //当没有生成productId时, 可以不选择属性，否则必须要选择一个属性

              let selectedAttrValueList = false;
              let selectedAttr = this.initCategoryArrary.filter(item => {
                  return item.isActive == true
              });

              if(this.form.productId) {
                  if (!selectedAttr.length) {
                      this.$showErrorMessage('The attribute can not be empty!');
                      return false
                  }

                  selectedAttr.forEach(item => {
                      if(item.featureVOList && item.featureVOList.length){
                          let selectedAttrValue = item.featureVOList.filter(itemList => {
                              return itemList.isActive == true
                          })

                          if(!selectedAttrValue.length){
                              selectedAttrValueList = true
                          }
                      }
                  })

                  if(selectedAttrValueList || selectedAttr.length != this.initCategoryArrary.length){
                      this.$showErrorMessage('The attribute corresponding to the attribute value can not be empty!');

                      return false
                  }
              }

              let paramsObject = {}
              let shouldLessForty = [];
              let isTrueList = [];
              selectedAttr.length && selectedAttr.forEach(item => {
                  let paramsList = []
                  let paramsNameList = []
                  if(item.featureVOList && item.featureVOList.length){
                      item.featureVOList.forEach(itemList => {
                          if(itemList.isActive){
                              paramsList.push(itemList.featureID);
                              paramsNameList.push(itemList.featureName);
                          }
                      })

                      paramsObject[item.productFeatureTypeId] = paramsList
                      shouldLessForty.push(paramsNameList);
                  }
              })

              if(shouldLessForty.length == 1){
                  shouldLessForty.forEach(item => {
                      item.forEach(itemList => {
                          if((itemList.length + this.modelLength) > 40){
                              isTrueList.push(itemList)
                          }
                      })
                  });
              }else{
                  let commonList = this.disCartsEvt(shouldLessForty);
                  commonList.forEach(item => {
                      if(((item.join('')).length + this.modelLength) > 40){
                          isTrueList.push(item.join('+'));
                      }
                  })
              }

              if(isTrueList.length){
                  let isTrueListString = isTrueList.join(' / ')

                  this.$confirm(isTrueListString + '   The model+attributes should be within 40 characters, please adjust it.', 'Tips', {
                      confirmButtonText: 'Confirm',
                      cancelButtonText: 'Cancel',
                      showClose: false,
                      type: 'warning'
                  }).then(() => {
                  }).catch(() => {
                  });

                  return false
              }

              this.generateSkuLoading = true
              let setParams = Object.assign({}, this.form, {
                  productCategoryId: this.categoryForm.thirdCategory
              })
              productApi.anotherAddVariantProduct({
                  productFeature: selectedAttr.length > 0 ? [paramsObject] : [],
                  productList : [setParams]
              }).then(d => {
                  this.generateSkuLoading = false
                  if (d.success == true) {
                      if(d.data){
                          this.form.productId = d.data.productId;
                          this.setTableList(d.data.productId);
                          this.getHadCheckedList(d.data.productId);
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.generateSkuLoading = false
                  this.$showErrorMessage(err)
              })
          },
          getHadCheckedList(data){
              if(!data) return false;

              productApi.findTableHead({
                  productId: data
              }).then(d => {
                  if (d.success == true) {
                      this.isShowAddBtns = false;
                      if(d.data){
                          this.initCategoryArrary.splice(0)

                          let tempList = []
                          for (let key in d.data.resultMap){
                              tempList.push(d.data.resultMap[key]);
                          }

                          if(tempList.length){
                              tempList.forEach(item => {
                                  item.isActive = false;
                                  item.featureVOList = [].concat(item.productFeatureList);
                                  this.$set(item, 'productFeatureName', item.description);
                                  this.$set(item, 'productFeatureTypeId', item.productFeatureTypeId);
                                  item.featureVOList.forEach(itemList => {
                                      itemList.isActive = false
                                      this.$set(itemList, 'featureName', itemList.description);
                                      this.$set(itemList, 'featureID', itemList.productFeatureId);
                                  })
                              })
                          }
                          this.initCategoryArrary = [].concat(tempList);
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.$showErrorMessage(err)
              })
          },
          setTableList(data){
              if(!data) return false;

              productApi.findAllProductFeature({
                  productId: data
              }).then(d => {
                  if (d.success == true) {
                      if(d.data && d.data.priceProductFeatureMap){
                          let priceProductFeatureMap = d.data.priceProductFeatureMap;
                          this.initTableHeadArrary.splice(0);
                          this.initTableArrary.splice(0);

                          for(let key in priceProductFeatureMap){
                              this.initTableArrary.push(priceProductFeatureMap[key]);
                          }
                          if(this.initTableArrary.length){
                              this.initTableArrary.forEach(item => {
                                  for(let key in item.productFeatureMap){
                                      if(this.initTableHeadArrary.indexOf(key) == -1){
                                          this.initTableHeadArrary.push(key)
                                      }
                                      this.$set(item, key, item.productFeatureMap[key])
                                      this.$set(item, 'tempEAN', item.EAN);
                                  }
                              })
                          }
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.$showErrorMessage(err)
              })
          },
          getCommonParams(){
              return {
                  productId: this.form.productId,
                  productTypeId: this.form.productType,
                  internalName: this.form.internalName,
                  brandName: this.form.brandName,
                  productCategoryId: this.categoryForm.thirdCategory
              }
          },
          saveInfoEvt(){
              let params = this.getCommonParams();
              let dataParams = {
                  type : 'EAN',
                  productList : []
              };

              if(params.productId == '' || params.internalName == '' || params.brandName == '' ){
                  this.$showErrorMessage('Please fill in the basic information of the product!');
                  return false;
              }

              if(this.categoryForm.firstCategory == '' || this.categoryForm.secondCategory == '' || this.categoryForm.thirdCategory  == ''){
                  this.$showErrorMessage('Please select catalogues');
                  return false;
              }

              this.initTableArrary.forEach(item => {
                  if(item.EAN != item.tempEAN){
                      dataParams.productList.push({
                          product: item.productIdSku,
                          type: "EAN",
                          value: item.EAN
                      })
                  }
              });

              this.saveInfoLoading = true;
              productApi.createProductAndGotoPrice(params).then(d => {
                  this.saveInfoLoading = false;
                  if (d.success == true) {
                      if(!dataParams.productList.length){
                          this.$showSuccessMessage('Save info success.');
                          return false
                      }
                      this.updateEanInfo(dataParams);
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.saveInfoLoading = false;
                  this.$showErrorMessage(err)
              })
          },
          updateEanInfo(data){
              productApi.updateGoodIdentificationinfo(data).then(d => {
                  if (d.success == true) {
                      this.$showSuccessMessage('Save success.');
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.$showErrorMessage(err)
              })
          },
          editPriceEvt(){
              if(!this.form.productId){
                  this.$showErrorMessage('Product Id not null');
              }
              this.$router.push({
                  path: '/editProductPriceRules',
                  query: {
                      productId : this.form.productId
                  }
              });
          },
          clickInputEvt(data){
              if(data.EAN){
                  this.$confirm('Do you want to delete the existed code and input a new one ?', 'Title', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                  }).then(() => {
                      this.initTableArrary.forEach(item => {
                          if(item.productIdSku == data.productIdSku){
                              item.EAN = ''
                          }
                      })
                  }).catch(() => {
                  });
              }
          },
          enterInputEvt(data){
              if(!data.EAN){
                  return false
              }
              let reg = new RegExp("(^([0-9]{8})$)|(^([0-9]{13})$)");
              if(!reg.test(data.EAN)){
                  this.$showErrorMessage(data.EAN + '  is not correct EAN code,Please enter correct code');
                  this.initTableArrary.forEach(item => {
                      if(item.productIdSku == data.productIdSku){
                          item.EAN = ''
                      }
                  })
                  return false;
              }
          },
          addAttrValuesContentEvt(data){
              this.dataList.type = 'child';
              this.dataList.parentId = data;
              this.dataList.categoryId = '';
              this.dataList.futureId = '';
              this.dataList.currentName = '';

              this.addAttrValuesDialogVisible = true
          },
          addAttrContentEvt(){
              this.dataList.type = 'parent';
              if(this.categoryForm.thirdCategory){
                  this.dataList.categoryId = this.categoryForm.thirdCategory;
              }else if(this.categoryForm.secondCategory){
                  this.dataList.categoryId = this.categoryForm.secondCategory;
              }else if(this.categoryForm.firstCategory){
                  this.dataList.categoryId = this.categoryForm.firstCategory;
              }

              this.dataList.parentId = '';
              this.dataList.futureId = '';
              this.dataList.currentName = '';

              this.addAttrValuesDialogVisible = true
          },
          deleteAttrContentEvt(data){
              this.$confirm('Are you sure to delete feature type ' + data.productFeatureName + ' ? This action cannot be recovered!', 'Title', {
                  confirmButtonText: 'Confirm',
                  cancelButtonText: 'Cancel',
                  type: 'warning'
              }).then(() => {
                  productApi.deleteProductFeatureType({
                      productFeatureTypeId: data.productFeatureTypeId
                  }).then(d => {
                      if (d.success == true) {
                          this.initCategoryArrary.forEach((item, index) => {
                              if(item.productFeatureTypeId == data.productFeatureTypeId){
                                  this.initCategoryArrary.splice(index, 1);
                              }
                          })
                      }else{
                          this.$showErrorMessage(d.message)
                      }
                  }).catch(err => {
                      this.$showErrorMessage(err)
                  })
              }).catch(() => {
              });
          },
          editAttrContentEvt(data){
              this.dataList.type = 'parent';
              this.dataList.parentId = data.productFeatureTypeId;
              this.dataList.currentName = data.productFeatureName;
              this.dataList.futureId = '';
              this.dataList.categoryId = '';

              this.addAttrValuesDialogVisible = true
          },
          deleteAttrValuesContentEvt(data){
              this.$confirm('Are you sure to delete product feature '+ data.featureName +' ? This action cannot be recovered!', 'Title', {
                  confirmButtonText: 'Confirm',
                  cancelButtonText: 'Cancel',
                  type: 'warning'
              }).then(() => {
                  productApi.deleteProduceFeature({
                      productFeatureId: data.featureID
                  }).then(d => {
                      if (d.success == true) {
                          this.initCategoryArrary.forEach(item => {
                              item.featureVOList.forEach((itemList, index) => {
                                  if(itemList.featureID == data.featureID){
                                      item.featureVOList.splice(index, 1)
                                  }
                              })
                          })
                      }else{
                          this.$showErrorMessage(d.message)
                      }
                  }).catch(err => {
                      this.$showErrorMessage(err)
                  })
              }).catch(() => {
              });
          },
          editAttrValuesContentEvt(parentId, data){
              this.dataList.type = 'child';
              this.dataList.parentId = parentId;
              this.dataList.futureId = data.featureID;
              this.dataList.currentName = data.featureName;
              this.dataList.categoryId = '';

              this.addAttrValuesDialogVisible = true
          },
          createAttrValuesSuccessEvt(data){
              this.initCategoryArrary.forEach(item => {
                  if(item.productFeatureTypeId == data.productFeatureTypeId){
                      item.featureVOList = item.featureVOList.concat([{
                          isActive : false,
                          featureName : data.description,
                          featureID : data.productFeatureId
                      }])
                  }
              })
          },
          createAttrSuccessEvt(data){
              this.initCategoryArrary = this.initCategoryArrary.concat([{
                  featureVOList : [],
                  isActive : false,
                  productFeatureName : data.description,
                  productFeatureTypeId : data.productFeatureTypeId
              }])
          },
          editAttrValuesSuccessEvt(data){
              this.initCategoryArrary.forEach(item => {
                  if(item.productFeatureTypeId == data.productFeatureTypeId){
                      item.featureVOList.forEach(itemList => {
                          if(itemList.featureID == data.productFeatureId){
                              itemList.featureName = data.description
                          }
                      })
                  }
              })
          },
          editAttrSuccessEvt(data){
              this.initCategoryArrary.forEach(item => {
                  if(item.productFeatureTypeId == data.productFeatureTypeID){
                      item.productFeatureName = data.productFeatureTypeName
                  }
              })
          },
          changeFirstCategoryEvt(){
              let t = this;
              this.categoryForm.secondCategory = ''
              this.categoryForm.thirdCategory = ''

              if(!this.categoryForm.firstCategory){
                  this.secondCategoryData.splice(1);
                  this.thirdCategoryData.splice(1);

                  this.initCategoryArrary.splice(0)
              }else{
                  this.getCommonCategoryList(this.categoryForm.firstCategory, function (d) {
                      if (d.data && d.data.categoryList && d.data.categoryList.length) {
                          t.secondCategoryData.splice(1);
                          t.secondCategoryData = t.secondCategoryData.concat(t.formatData(d.data.categoryList))
                      }
                  });
              }

              this.$nextTick(() => {
                  if(!this.form.productId){
                      if(!this.categoryForm.firstCategory) {
                          return false
                      }
                      this.getCategoryByParams({
                          categoryId : this.categoryForm.firstCategory,
                          parentCategoryId : 'DefaultRootCategory'
                      })
                  }
              })
          },
          changeSecondCategoryEvt(){
              let t = this;
              this.categoryForm.thirdCategory = ''

              if(!this.categoryForm.secondCategory){
                  this.thirdCategoryData.splice(1);
              }else{
                  this.getCommonCategoryList(this.categoryForm.secondCategory, function (d) {
                      if (d.data && d.data.categoryList && d.data.categoryList.length) {
                          t.thirdCategoryData.splice(1);
                          t.thirdCategoryData = t.thirdCategoryData.concat(t.formatData(d.data.categoryList))
                      }
                  });
              }

              this.$nextTick(() => {
                  if(!this.form.productId){
                      if(!this.categoryForm.secondCategory) {
                          this.getCategoryByParams({
                              categoryId : this.categoryForm.firstCategory,
                              parentCategoryId : 'DefaultRootCategory'
                          })

                          return false
                      }
                      this.getCategoryByParams({
                          categoryId : this.categoryForm.secondCategory,
                          parentCategoryId : this.categoryForm.firstCategory
                      })
                  }
              })
          },
          changeThirdCategoryEvt(){
              this.$nextTick(() => {
                  if(!this.form.productId){
                      if(!this.categoryForm.thirdCategory) {
                          this.getCategoryByParams({
                              categoryId : this.categoryForm.secondCategory,
                              parentCategoryId : this.categoryForm.firstCategory
                          })

                          return false
                      }
                      this.getCategoryByParams({
                          categoryId : this.categoryForm.thirdCategory,
                          parentCategoryId : this.categoryForm.secondCategory
                      })
                  }
              })
          },
          changeSwitchEvt(data){
              productApi.updateProductIsActive({
                  productId: data.productIdSku,
                  isActive: data.isActive
              }).then(d => {
                  if (d.success == true) {
                      if(d.data){
                          let message = (d.data.isActive == 'N' ? 'Disabled' : 'Enabled');
                          this.$showSuccessMessage('Operation change to : ' + message);
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.$showErrorMessage(err)
              })
          }
      }
  }
</script>
<style scoped>
  .baseInfo{
      width: 100%;
      padding: 5px 10px;
      background-color: #ffffff;
  }
  .attributesList_title,
  .productCategory_title,
  .baseInfo_title{
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
  }
  .asyc_btn{
      float: right;
  }
  .baseInfo_content{
      margin-top: 5px;
  }
  .productCategory{
      background-color: #ffffff;
      padding: 5px 10px;
      margin-top: 10px;
      width: 100%;
  }
  .productCategory_select{
      margin-top: 5px;
  }
  .productCategory_span{
      float: left;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      padding-right: 10px;
      color: #424242;
  }
  .productCategory_categoryList{
      float: left;
  }
  .attributesList{
      background-color: #ffffff;
      padding: 5px 10px;
      margin-top: 10px;
      width: 100%;
  }
  .attributesList_content{
      background-color: #f7f7f7;
      padding: 10px 5px;
  }
  .left_title,
  .right_title{
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-weight: bold;
      color: #424242;
  }
  .attr_content{
      width: 100%;
      text-align: center;
      margin-left: 20px;
  }
  .attr_value_content:hover .attr_value_operator,
  .attr_content:hover .attr_operator{
      display: block;
  }
  .attr_span{
      min-width: 160px;
      display: inline-block;
      border: 1px dashed #8cc152;
      line-height: 30px;
      color: #424242;
      font-size: 12px;
      background-color: #dceacd;
      float: left;
      cursor: pointer;
  }
  .attr_value_operator,
  .attr_operator,
  .attr_icon{
      float: left;
  }
  .attr_operator,
  .attr_value_operator{
      height: 30px;
      text-align: center;
      display: none;
  }
  .attr_value_operator i,
  .attr_operator i{
      display: block;
      height: 16px;
      line-height: 16px;
      text-align: center;
      width: 20px;
      font-size: 14px;
      cursor: pointer;
  }
  .attr_icon{
      height: 30px;
      text-align: center;
      line-height: 30px;
      width: 20px;
      font-size: 14px;
  }
  .attr_value_content{
      float: left;
      width: 16.6%;
      height: 30px;
      margin-bottom: 10px;
  }
  .attr_value_span{
      display: inline-block;
      border: 1px dashed #8cc152;
      line-height: 30px;
      color: #424242;
      font-size: 12px;
      background-color: #dceacd;
      padding: 0 10px;
      float: left;
      cursor: pointer;
  }
  .attributesList_content_operator{
      margin-top: 15px;
  }
  .generate_btn{
      float: right;
  }
  .attributesList_operator{
      margin-top: 15px;
      text-align: right;
      padding: 15px 0;
  }
  .operator_left_title{
      margin-left: 20px;
      float: left;
  }
  .operator_right_title{
      text-align: right;
      float: right;
  }
  .attr_span.active,
  .attr_value_span.active{
      background-color: #8cc152;
      color: #ffffff;
  }
  .attributesList_table{
      margin-top: 15px;
  }
  .sync_success{
      display:inline-block;
      width:15px;
      height:15px;
      border-radius:50%;
      background-color:#8CC152;
  }
  .sync_fail{
      display:inline-block;
      width:15px;
      height:15px;
      border-radius:50%;
      background-color:red;
  }
  .redColor{
      color: #e50038;
  }
  .paddingLeftClass{
      padding-left: 60px;
  }
</style>
