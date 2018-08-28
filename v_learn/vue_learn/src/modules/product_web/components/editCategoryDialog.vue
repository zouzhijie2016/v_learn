<template>
  <div>
    <el-dialog title="Category Details" custom-class="editDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="category_detail">
        <div class="detail_current">
          <div class="detail_current_title">Current Category Details</div>
          <el-row :gutter="20">
            <el-col :span="8" class="detail_current_show">
              <label>First Category Name:</label><span v-show="firstCategory">{{firstCategory}}</span>
            </el-col>
            <el-col :span="8" class="detail_current_show" v-show="secondCategory">
              <label>Second Category Name:</label><span>{{secondCategory}}</span>
            </el-col>
            <el-col :span="8" class="detail_current_show" v-show="thirdCategory">
              <label>Third Category Name:</label><span>{{thirdCategory}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="detail_feature">
          <div class="detail_feature_title">Product Category Feature</div>
          <div class="detail_feature_desc">
            <div class="feature_desc_group">
              <div class="category_box_loading" v-show="!isHasData" v-loading="loading"></div>
              <template v-if="isHasData">
                <div class="feature_desc_tag">
                  <div class="tag_name_text">First Category Feature :</div>
                  <template v-if="firstCategoryFeature.length>0 && firstCategoryFeatureList.length==0">
                    <div class="tag_name_list" v-for="ffitem in firstCategoryFeature">
                      <span class="tag_feature_name">{{ffitem.productFeatureName}}</span>
                    </div>
                  </template>
                  <div v-if="firstCategoryFeatureList.length>0">
                    <template v-for="fsitem in firstCategoryFeatureList">
                      <span :class="[fsitem.isActive ? 'tagChecked' : '', 'desc_tag_show']"
                            @click="checkFeature(fsitem,$event)">{{fsitem.description}}</span>
                    </template>
                  </div>
                </div>

                <div class="feature_desc_tag">
                  <div class="tag_name_text">Second Category Feature :</div>
                  <template v-if="secondCategoryFeature.length>0 && secondCategoryFeatureList.length==0">
                    <div class="tag_name_list" v-for="sfitem in secondCategoryFeature">
                      <span class="tag_feature_name">{{sfitem.productFeatureName}}</span>
                    </div>
                  </template>
                  <div v-if="secondCategoryFeatureList.length>0">
                    <template v-for="ssitem in secondCategoryFeatureList">
                      <span :class="[ssitem.isActive ? 'tagChecked' : '', 'desc_tag_show']"
                            @click="checkFeature(ssitem,$event)">{{ssitem.description}}</span>
                    </template>
                  </div>
                </div>

                <div class="feature_desc_tag">
                  <div class="tag_name_text">Third Category Feature :</div>
                  <template v-if="thirdCategoryFeature.length>0 && thirdCategoryFeatureList.length==0">
                    <div class="tag_name_list" v-for="tfitem in thirdCategoryFeature">
                      <span class="tag_feature_name">{{tfitem.productFeatureName}}</span>
                    </div>
                  </template>
                  <div v-if="thirdCategoryFeatureList.length>0">
                    <template v-for="tsitem in thirdCategoryFeatureList">
                    <span :class="[tsitem.isActive ? 'tagChecked' : '', 'desc_tag_show']"
                          @click="checkFeature(tsitem,$event)">{{tsitem.description}}</span>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="detail_btns">
          <el-button type="primary" @click="confirmFeature">Confirm</el-button>
          <el-button type="default" @click=" dataCloseVisible=false ">Cancel</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import productApi from '~api/productapi'
export default {
    props: ['dataVisible', 'categoryId', 'parentCategoryId'],
    data () {
        return {
            loading: true,
            isHasData: false,
            dataCloseVisible: true,
            firstCategory: '',
            secondCategory: '',
            thirdCategory: '',
            featureLists: [],
            checkedFeatrues: [],
            firstCategoryFeature: [],
            firstCategoryFeatureList: [],
            secondCategoryFeature: [],
            secondCategoryFeatureList: [],
            thirdCategoryFeature: [],
            thirdCategoryFeatureList: []
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    mounted () {
        var _self = this
        var obj = {'categoryId': this.categoryId, 'parentCategoryId': this.parentCategoryId}
        this.loading = true
        productApi.selectProductCategoryFeature(obj).then(d => {
            if (d.success && d.data) {
                for (var i = 0; i < d.data.length; i++) {
                    var name = ''
                    var nameList = ''
                    var category = ''
                    switch (d.data[i].categoryLevel) {
                        case 1:
                            name = 'firstCategoryFeature'
                            nameList = 'firstCategoryFeatureList'
                            category = 'firstCategory'
                            break
                        case 2:
                            name = 'secondCategoryFeature'
                            nameList = 'secondCategoryFeatureList'
                            category = 'secondCategory'
                            break
                        case 3:
                            name = 'thirdCategoryFeature'
                            nameList = 'thirdCategoryFeatureList'
                            category = 'thirdCategory'
                            break
                    }
                    _self[category] = d.data[i].categoryName
                    if (d.data[i].wholeFeatureType) {
                        d.data[i].wholeFeatureType.map(function (item) {
                            item.isActive = false
                        })
                    }
                    if (d.data[i].featureTypeAndFeatureVO && !d.data[i].wholeFeatureType) {
                        _self[name] = d.data[i].featureTypeAndFeatureVO
                        _self[nameList] = []
                    } else if (d.data[i].featureTypeAndFeatureVO && d.data[i].wholeFeatureType) {
                        _self[nameList] = d.data[i].wholeFeatureType
                        d.data[i].featureTypeAndFeatureVO.map(function (items) {
                            for (var j = 0; j < _self[nameList].length; j++) {
                                if (items.productFeatureTypeId == _self[nameList][j].productFeatureTypeId) {
                                    _self[nameList][j].isActive = true
                                    _self.checkedFeatrues.push(_self[nameList][j].productFeatureTypeId)
                                }
                            }
                        })
                        _self[name] = d.data[i].featureTypeAndFeatureVO
                    } else if (!d.data[i].featureTypeAndFeatureVO && d.data[i].wholeFeatureType) {
                        _self[name] = []
                        _self[nameList] = d.data[i].wholeFeatureType
                    } else {
                        _self[name] = []
                        _self[nameList] = []
                    }
                }
                this.isHasData = true
                this.loading = false
            }
        }).catch(e => {
            this.loading = false
            this.showErroMessage(e)
        })
    },
    methods: {
        confirmFeature () {
            var obj = {categoryId: this.categoryId, selectProductTypeID: this.checkedFeatrues}
            productApi.editProductCategoryFeature(obj).then(d => {
                console.dir(d)
                if (d.success) {
                    this.$message({message: 'updata success', type: 'success'})
                    this.$emit('update:dataVisible', false)
                } else {
                    this.showErroMessage(d.message)
                }
            }).catch(e => {
                this.showErroMessage(e)
                this.$emit('update:dataVisible', false)
            })
        },
        checkFeature (item) {
            if (item.isActive) {
                var index = this.checkedFeatrues.indexOf(item.productFeatureTypeId)
                this.checkedFeatrues.splice(index, 1)
                item.isActive = false
            } else {
                this.checkedFeatrues.push(item.productFeatureTypeId)
                item.isActive = true
            }
        },
        showErroMessage (err) {
            this.$showErrorMessage(err)
        }

    }
}
</script>
<style>
  .editDialog {
    width: 950px !important;
  }
</style>
<style scoped>
  .detail_current_title, .detail_feature_title {
    font-weight: bold;
    line-height: 35px;
    margin-bottom: 5px;
  }

  .detail_current {
    margin-bottom: 10px;
  }

  .detail_current_show > label, .detail_current_show > span {
    display: inline-block;
    line-height: 20px;
    vertical-align: middle;
    margin-right: 10px;
    font-size: 12px;
  }

  .detail_current_show > span {
    padding: 5px;
    border: 1px solid #cfd1d6;
    color: #878d99;
    background: #f3f4f5;
  }

  .category_box_loading {
    height: 40px;
    text-align: center;
  }

  .detail_feature {
    margin-bottom: 10px;
  }

  .feature_desc_tag .tagChecked {
    background-color: #8cc152;
    color: #fff;
  }

  .desc_tag_show {
    display: inline-block;
    padding: 0 5px;
    height: 24px;
    line-height: 22px;
    font-size: 12px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid transparent;
    white-space: nowrap;
    background-color: rgba(18, 206, 102, .1);
    border-color: rgba(18, 206, 102, .2);
    color: #13ce66;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .feature_desc_group {
    margin-bottom: 10px;
  }

  .feature_desc_tag {
    line-height: 25px;
  }

  .tag_name_list {
    display: inline-block;
  }

  .tag_name_list > span {
    margin-right: 10px;
  }

  .tag_feature_name {
    height: 30px;
    line-height: 30px;
    display: inline-block;
    padding: 0 5px;
    border: 1px dashed #8cc152;
    background: #dceacd;
    color: #424242;
    font-size: 12px;
    margin: 0 10px 10px 0;
  }
</style>
