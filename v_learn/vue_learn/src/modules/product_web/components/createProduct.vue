<template>
    <div class="createProduct">
        <div class="createProduct_title">Create Category</div>
        <div class="createProduct_input createProduct_share">
            <span>Search Category: </span>
            <el-autocomplete placeholder="Please enter category" v-model="category" :fetch-suggestions="querySuggestion" @select="handleSelect">
                <template slot-scope="props">
                    <div style="width: 100%;height: 30px;line-height: 30px;">
                        <template v-for="(prop, index) in props.item">
                            <span v-if="index != (props.item.length - 1)">{{ prop.categoryName }}  >  </span>
                            <span v-else>{{ prop.categoryName }}</span>
                        </template>
                    </div>
                </template>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-autocomplete>
            <div style="clear: both"></div>
        </div>
        <div class="createProduct_position createProduct_share">
            <span>Current Position: </span>
            <div class="createProduct_content">
                <template v-for="(categoryName, index) in breadcrumbList">
                    <div v-if="index != (breadcrumbList.length - 1)" class="createProduct_div"><span>{{ categoryName }}</span><em class="createProduct_icon"> > </em></div>
                    <div v-else class="createProduct_div"><span>{{ categoryName }}</span></div>
                </template>
            </div>
            <div style="clear: both"></div>
        </div>
        <div class="createProduct_list createProduct_share">
            <span>Select Category: </span>
            <div class="createProduct_select">
                <div class="createProduct_first createProduct_child">
                    <div class="createProduct_search">
                      <el-input placeholder="Please enter first category" v-model="firstCategory">
                          <i slot="prefix" class="el-input__icon el-icon-search"></i>
                      </el-input>
                    </div>
                    <div class="createProduct_first_list createProduct_child_list" ref='firstUl'>
                        <template v-for="firstCategoryArr in firstCategoryList" >
                            <div ref='firstDiv' :class='[firstCategoryArr.isActive ? "active" : "", "categoryListOption"]' @click="firstCategoryOptionEvt(firstCategoryArr)">
                                {{ firstCategoryArr.categoryName }}
                            </div>
                        </template>
                    </div>
                    <div class="createProduct_first_add" @click="addCategoryOptionsEvt('first')">
                        Add First-Level Category
                    </div>
                </div>
                <div class="createProduct_pointer">
                    <i class="el-icon-d-arrow-right"></i>
                </div>
                <div class="createProduct_second createProduct_child">
                    <div class="createProduct_search">
                        <el-input placeholder="Please enter second category" v-model="secondCategory">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <div class="createProduct_second_list createProduct_child_list" ref='secondUl'>
                        <template v-for="secondCategoryArr in secondCategoryList">
                            <div ref='secondDiv' :class='[secondCategoryArr.isActive ? "active" : "", "categoryListOption"]' @click="secondCategoryOptionEvt(secondCategoryArr)">
                                {{ secondCategoryArr.categoryName }}
                            </div>
                        </template>
                    </div>
                    <div class="createProduct_second_add" @click="addCategoryOptionsEvt('second')">
                        Add Second-Level Category
                    </div>
                </div>
                <div class="createProduct_pointer">
                    <i class="el-icon-d-arrow-right"></i>
                </div>
                <div class="createProduct_third createProduct_child">
                    <div class="createProduct_search">
                        <el-input placeholder="Please enter third category" v-model="thirdCategory">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <div class="createProduct_third_list createProduct_child_list" ref='thirdUl'>
                        <template v-for="thirdCategoryArr in thirdCategoryList">
                            <div ref='thirdDiv' :class='[thirdCategoryArr.isActive ? "active" : "", "categoryListOption"]' @click="thirdCategoryOptionEvt(thirdCategoryArr)">
                                {{ thirdCategoryArr.categoryName }}
                            </div>
                        </template>
                    </div>
                    <div class="createProduct_third_add" @click="addCategoryOptionsEvt('third')">
                        Add Third-Level Category
                    </div>
                </div>
            </div>
            <div style="clear: both"></div>
        </div>
        <div class="createProduct_btns">
            <el-button type="success" @click="createProductEvt">
                <div class="btns_text">Next</div>
                <div class="btns_text">Fill in Product Details</div>
            </el-button>
        </div>
        <add-category-dialog v-if="addCategoryDialogVisible"
                             :dataVisible.sync="addCategoryDialogVisible"
                             :type.sync="type"
                             :sequenceNum.sync="sequenceNum"
                             :parentCategoryId.sync="parentCategoryId"
                             v-on:createProductSuccess.sync="createProductSuccessEvt"
        ></add-category-dialog>
    </div>
</template>
<script>
  import Utils from '~utils/index'
  import productApi from '~api/productapi'
  import addCategoryDialog from './addCategoryDialog.vue'
  export default {
      data(){
          return {
              category : '',
              firstCategory : '',
              secondCategory : '',
              thirdCategory : '',
              firstCategoryList : [],
              secondCategoryList : [],
              thirdCategoryList : [],
              tempFirstCategoryList : [],
              tempSecondCategoryList : [],
              tempThirdCategoryList : [],
              breadcrumbList : [],
              selectedFirstCategory : null,
              selectedSecondCategory : null,
              selectedThirdCategory : null,
              isSelected : false,
              addCategoryDialogVisible : false
          }
      },
      mounted(){
          productApi.listGivenClassfication({
              "categoryId" : "DefaultRootCategory"
          }).then(d => {
              if (d.success == true) {
                  if (d.data && d.data.categoryList && d.data.categoryList.length) {
                      this.firstCategoryList.splice(0)
                      this.tempFirstCategoryList.splice(0)

                      this.tempFirstCategoryList = this.tempFirstCategoryList.concat(this.formatData(d.data.categoryList))
                      this.firstCategoryList = (this.formatData(d.data.categoryList)).map(item => {
                          item.isActive = false;
                          return item
                      })
                  }
              } else {
                  this.$showErrorMessage(d.message)
              }
          }).catch(err => {
              this.$showErrorMessage(err)
          })
      },
      components: {
          addCategoryDialog
      },
      watch : {
          firstCategory(newVal){
              this.tempFirstCategoryList = this.tempFirstCategoryList.map(item => {
                  if(item.categoryId == this.selectedFirstCategory.categoryId){
                      item.isActive = true
                  }else {
                      item.isActive = false
                  }

                  return item;
              });
              this.firstCategoryList = this.tempFirstCategoryList.filter(item => {
                  return item.categoryName.indexOf(newVal) > -1
              })
          },
          secondCategory(newVal){
              this.tempSecondCategoryList = this.tempSecondCategoryList.map(item => {
                  if(item.categoryId == this.selectedSecondCategory.categoryId){
                      item.isActive = true
                  }else {
                      item.isActive = false
                  }

                  return item;
              });
              this.secondCategoryList = this.tempSecondCategoryList.filter(item => {
                  return item.categoryName.indexOf(newVal) > -1
              })
          },
          thirdCategory(newVal){
              this.tempThirdCategoryList = this.tempThirdCategoryList.map(item => {
                  if(item.categoryId == this.selectedThirdCategory.categoryId){
                      item.isActive = true
                  }else {
                      item.isActive = false
                  }

                  return item;
              });
              this.thirdCategoryList = this.tempThirdCategoryList.filter(item => {
                  return item.categoryName.indexOf(newVal) > -1
              })
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
          createProductSuccessEvt(data){
              let obj = {
                  categoryId: data.categoryId,
                  categoryName: data.categoryName,
                  sequenceNum: data.sequenceNum,
                  isActive : false
              };
              if(data.type == 'first'){
                  this.firstCategoryList = [obj].concat(this.firstCategoryList)
                  this.tempFirstCategoryList = [obj].concat(this.tempFirstCategoryList)
                  this.firstCategoryOptionEvt(obj)
              }else if(data.type == 'second'){
                  this.secondCategoryList = [obj].concat(this.secondCategoryList)
                  this.tempSecondCategoryList = [obj].concat(this.tempSecondCategoryList)
                  this.secondCategoryOptionEvt(obj)
              }else if(data.type == 'third'){
                  this.thirdCategoryList = [obj].concat(this.thirdCategoryList)
                  this.tempThirdCategoryList = [obj].concat(this.tempThirdCategoryList)
                  this.thirdCategoryOptionEvt(obj)
              }
          },
          querySuggestion (queryString, cb) {
              if (!queryString) {
                  cb([])
                  return false
              }
              productApi.quickListClassfication({
                  keyWord: queryString.trim()
              }).then(d => {
                  if (d.success == true) {
                      if (d.data && d.data.categoryIdAndNameList && d.data.categoryIdAndNameList.length) {
                          cb(d.data.categoryIdAndNameList)
                      } else {
                          cb([])
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                      cb([])
                  }
              }).catch(err => {
                  cb([])
                  this.$showErrorMessage(err)
              })
          },
          handleSelect(data){
              let t = this;
              let categoryNameArr = data.map(item => {
                  return item.categoryName;
              })
              let categoryIdArr = data.map(item => {
                return item.categoryId;
              })

              this.category = categoryNameArr.join(' > ');

              this.breadcrumbList.splice(0);
              this.breadcrumbList = this.breadcrumbList.concat(categoryNameArr);

              if(data.length == 1){
                  let firstCategory = null;
                  this.firstCategoryList = this.firstCategoryList.map(item => {
                      if(categoryIdArr[0] == item.categoryId){
                          firstCategory = item;
                          item.isActive = true;
                      }
                      return item
                  })

                  this.firstCategoryOptionEvt(firstCategory);

              }else if(data.length == 2){
                  let t = this;
                  let firstCategory = null;

                  this.firstCategoryList = this.firstCategoryList.map(item => {
                      if(categoryIdArr[0] == item.categoryId){
                          firstCategory = item;
                          item.isActive = true;
                      }
                      return item
                  })

                  this.firstCategoryOptionEvt(firstCategory, function (d) {
                      let secondCategory = null;
                      t.secondCategoryList = (t.formatData(d.data.categoryList)).map(item => {
                          if(item.categoryId == categoryIdArr[1]){
                              secondCategory = item;
                              item.isActive = true;
                          }else{
                              item.isActive = false;
                          }

                          return item
                      });

                      t.secondCategoryOptionEvt(secondCategory);
                  });
              }else if(data.length == 3){
                  let t = this;
                  let firstCategory = null;

                  this.firstCategoryList = this.firstCategoryList.map(item => {
                      if(categoryIdArr[0] == item.categoryId){
                          firstCategory = item;
                          item.isActive = true;
                      }
                      return item
                  })

                  this.firstCategoryOptionEvt(firstCategory, function (d) {
                      let secondCategory = null;
                      t.secondCategoryList = (t.formatData(d.data.categoryList)).map(item => {
                          if (item.categoryId == categoryIdArr[1]) {
                              secondCategory = item;
                              item.isActive = true;
                          } else {
                              item.isActive = false;
                          }

                          return item
                      });

                      t.secondCategoryOptionEvt(secondCategory, function (d) {
                          let thirdCategory = null;
                          t.thirdCategoryList = (t.formatData(d.data.categoryList)).map(item => {
                              if (item.categoryId == categoryIdArr[2]) {
                                  thirdCategory = item;
                                  item.isActive = true;
                              } else {
                                  item.isActive = false;
                              }

                              return item
                          });

                          t.thirdCategoryOptionEvt(thirdCategory);
                      });
                  })
              }
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
          firstCategoryOptionEvt(data, callback){
              let t = this;
              this.selectedFirstCategory = data;
              this.commonCategoryOptionEvt(this.firstCategoryList, data);
              this.$nextTick(() => {
                  let firstList = this.firstCategoryList.map(item => {
                      return item.isActive
                  })
                  let firstDiv = this.$refs.firstDiv[firstList.indexOf(true)];
                  this.$refs.firstUl.scrollTop = firstDiv.offsetTop - firstDiv.offsetHeight;
              })

              this.breadcrumbList.splice(0);
              this.breadcrumbList = this.breadcrumbList.concat([data.categoryName])

              this.secondCategoryList.splice(0)
              this.thirdCategoryList.splice(0)

              this.selectedSecondCategory = null
              this.selectedThirdCategory = null

              this.getCommonCategoryList(data.categoryId, function (d) {
                  if (d.data && d.data.categoryList && d.data.categoryList.length) {
                      t.secondCategoryList.splice(0)
                      t.tempSecondCategoryList.splice(0)

                      t.tempSecondCategoryList = t.tempSecondCategoryList.concat(t.formatData(d.data.categoryList))
                      t.secondCategoryList = (t.formatData(d.data.categoryList)).map(item => {
                          item.isActive = false;
                          return item
                      })

                      typeof callback == "function" && callback(d);
                  }
              });
          },
          secondCategoryOptionEvt(data, callback){
              let t = this;
              this.selectedSecondCategory = data;
              this.commonCategoryOptionEvt(this.secondCategoryList, data)
              this.$nextTick(() => {
                  let secondList = this.secondCategoryList.map(item => {
                    return item.isActive
                  })
                  let secondDiv = this.$refs.secondDiv[secondList.indexOf(true)];
                  this.$refs.secondUl.scrollTop = secondDiv.offsetTop - secondDiv.offsetHeight;
              })

              this.breadcrumbList.splice(1);
              this.breadcrumbList = this.breadcrumbList.concat([data.categoryName])

              this.thirdCategoryList.splice(0)
              this.selectedThirdCategory = null

              this.getCommonCategoryList(data.categoryId, function (d) {
                  if (d.data && d.data.categoryList && d.data.categoryList.length) {
                      t.thirdCategoryList.splice(0)
                      t.tempThirdCategoryList.splice(0)

                      t.tempThirdCategoryList = t.tempThirdCategoryList.concat(t.formatData(d.data.categoryList))
                      t.thirdCategoryList = (t.formatData(d.data.categoryList)).map(item => {
                          item.isActive = false;
                          return item
                      })

                      typeof callback == "function" && callback(d);
                  }
              });
          },
          thirdCategoryOptionEvt(data){
              this.selectedThirdCategory = data;
              this.commonCategoryOptionEvt(this.thirdCategoryList, data)
              this.$nextTick(() => {
                  let thirdList = this.thirdCategoryList.map(item => {
                      return item.isActive
                  })
                  let thirdDiv = this.$refs.thirdDiv[thirdList.indexOf(true)];
                  this.$refs.thirdUl.scrollTop = thirdDiv.offsetTop - thirdDiv.offsetHeight;
              })

              this.breadcrumbList.splice(2);
              this.breadcrumbList = this.breadcrumbList.concat([data.categoryName])
          },
          commonCategoryOptionEvt(list, data){
              list = list.map(item => {
                  if(item.categoryId == data.categoryId){
                      item.isActive = true;
                  }else{
                      item.isActive = false;
                  }

                  return item
              })
          },
          addCategoryOptionsEvt(type){
              if(type == 'first'){
                  this.parentCategoryId = 'DefaultRootCategory';
                  this.sequenceNum = this.tempFirstCategoryList.length + 1;
              }
              if(type == 'second'){
                  if(!this.selectedFirstCategory){
                      this.$showErrorMessage('Please select first category!')
                      return false
                  }else{
                      this.parentCategoryId = this.selectedFirstCategory.categoryId;
                      this.sequenceNum = this.tempSecondCategoryList.length + 1
                  }
              }
              if(type == 'third'){
                  if(!this.selectedSecondCategory){
                      this.$showErrorMessage('Please select second category!')
                      return false
                  }else{
                      this.parentCategoryId = this.selectedSecondCategory.categoryId;
                      this.sequenceNum = this.tempThirdCategoryList.length + 1
                  }
              }

              this.type = type;
              this.addCategoryDialogVisible = true
          },
          createProductEvt(){
              if(!this.selectedThirdCategory){
                  this.$showErrorMessage('Please select category!')
                  return false
              }

              this.$router.push({
                  path: '/addProductFeature',
                  query: {
                      firstCategoryId: this.selectedFirstCategory.categoryId,
                      secondCategoryId: this.selectedSecondCategory.categoryId,
                      thirdCategoryId: this.selectedThirdCategory.categoryId,
                  }
              })
          }
      }
  }
</script>
<style>
    .createProduct_input .el-input__inner{
        height: 40px;
    }
</style>
<style scoped>
    .createProduct{
        background-color: #ffffff;
        padding: 10px 20px 20px 20px;
    }
    .createProduct_title{
        height: 40px;
        line-height: 40px;
        color: #424242;
        font-size: 18px;
    }
    .createProduct_input{
        height: 40px;
        line-height: 40px;
    }
    .createProduct_share span{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #424242;
        float: left;
    }
    .createProduct_share{
        margin-top: 10px;
    }
    .createProduct_share .el-autocomplete{
        width: 50%;
        float: left;
        margin-left: 15px;
    }
    .createProduct_share .createProduct_content{
        float: left;
        margin-left: 15px;
    }
    .createProduct_content .createProduct_div{
        float: left;
    }
    .createProduct_content span{
        display: inline-block;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        border: 1px dashed #67c23a;
        color: #333;
    }
    .createProduct_content .createProduct_icon{
        width: 40px;
        height: 40px;
        display: inline-block;
        line-height: 40px;
        padding: 0 10px;
        text-align: center;
        color: #9e9e9e;
        font-style: normal;
        font-size: 16px;
    }
    .createProduct_share .createProduct_select{
        float: left;
        margin-left: 15px;
        width: 85%;
    }
    .createProduct_btns{
        margin: 70px 0 0 ;
        text-align: center;
    }
    .createProduct_child{
        float: left;
        width: 30%;
        border: 1px solid #dcdfe6;
        padding: 5px;
    }
    .createProduct_search{
        width:100%;
    }
    .createProduct_child_list{
        height: 300px;
        overflow-y: scroll;
        width: 100%;
        border: 1px solid #dcdfe6;
        margin-top: 5px;
        position: relative;
    }
    .categoryListOption{
        height: 25px;
        line-height: 25px;
        padding-left: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .categoryListOption:hover,
    .categoryListOption.active{
        background-color: #67c23a;
        color: #ffffff;
        cursor: pointer;
    }
    .createProduct_first_add,
    .createProduct_second_add,
    .createProduct_third_add{
        width: 100%;
        height: 30px;
        line-height: 30px;
        border: 1px solid #67c23a;
        background-color: #ffffff;
        color: #67c23a;
        margin-top: 5px;
        text-align: center;
        cursor: pointer;
    }
    .createProduct_pointer{
        padding: 0 10px;
        width: 4%;
        float: left;
        text-align: center;
        margin-top: 180px;
    }
    .createProduct_btns .btns_text{
        line-height: 20px;
    }
</style>
