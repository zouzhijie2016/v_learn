<template>
    <div class="productList_box">
        <!--<div class="productList_title">Basic Information Query</div>-->
        <div class="productList_search">
            <el-form :model="searchForm" class="productList_form" :inline="true">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item label="Model">
                            <el-input size="small" v-model.trim="searchForm.model"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Product ID">
                            <el-autocomplete
                                 :trigger-on-focus="sugession.triggerOnFocus"
                                 custom-item="ProductSuggest"
                                 v-model.trim="searchForm.productId"
                                 :fetch-suggestions="querySuggessionDebounce"
                                 @select="selectSuggession">
                                <template slot-scope="scope">
                                    <div v-for="item in scope" :valueKey="item">
                                        <div class="suggestionList" v-if="item.description">{{item.productId}}:{{item.description}}</div>
                                        <div class="suggestionList" v-else>{{item.productId}}</div>
                                    </div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="EAN">
                            <el-input size="small" v-model.trim="searchForm.ean"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="Product Status" style="text-align: right;width: 100%;">
                            <el-select size="small" v-model="searchForm.productStatus">
                                <el-option v-for="item in productStatusData" :key="item.productStatusId" :label="item.productStatusName" :value="item.productStatusId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="14">
                        <el-form-item label="Category">
                            <el-select size="small" v-model="searchForm.firstCategoryId" filterable clearable @clear="changeFirstCategory" style="width:30%" @change="changeFirstCategory"  placeholder="First Level">
                                <el-option v-for="item in firstCategoryData" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId"></el-option>
                            </el-select>
                            <el-select size="small" v-model="searchForm.secondCategoryId" filterable clearable @clear="changeSecondCategory" style="width:30%" @change="changeSecondCategory"  placeholder="Second Level">
                                <el-option v-for="item in secondCategoryData" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId"></el-option>
                            </el-select>
                            <el-select size="small" v-model="searchForm.thirdCategoryId" filterable clearable style="width:30%"  placeholder="Third Level">
                                <el-option v-for="item in thirdCategoryData" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item style="text-align: right;width: 100%;">
                            <label class="form_label">Created Time</label>
                            <el-date-picker type="date"
                                            :picker-options="searchForm.fromPickerOptions"
                                            v-model.trim="searchForm.beginToTime"
                                            format="dd/MM/yyyy"
                                            size="small"
                                            placeholder="DD/MM/YYYY" style="width:33%">
                            </el-date-picker>
                            <label class="col_datepicker_label" style="width:5%;text-align:center">-</label>
                            <el-date-picker type="date"
                                            :picker-options="searchForm.toPickerOptions"
                                            v-model.trim="searchForm.endToTime"
                                            format="dd/MM/yyyy"
                                            size="small"
                                            placeholder="DD/MM/YYYY" style="width:33%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-form-item style="width: 100%;text-align: right;">
                            <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading"  @click="searchProductList(1)">Search</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="productList_content">
            <div class="productList_content_toolBar">
                <div class="productList_content_title">Product List</div>
                <div class="exportList">
                    <el-button v-security='{"permission":"catalogProductsListExport"}' type="primary" size="small" icon="el-icon-download" :loading="searchForm.exportLoading" @click="exportProductList">Export</el-button>
                </div>
                <div class="totalList" v-if="productListData.pageMap.total > 0">
                    Display {{ productListData.pageMap.startRow }} - {{ productListData.pageMap.endRow }} item, {{ productListData.pageMap.total }} results in total
                </div>
            </div>
            <div class="loadingContent" v-loading="searchForm.searchLoading" element-loading-text="Loading">
                <el-table :data="productListData.resultPoductPriceList" style="width: 100%;font-size: 12px" :default-sort="{ prop: 'productId',order: 'descending' }" class="productList_table">
                    <el-table-column type="index" width="50" label="No."></el-table-column>
                    <el-table-column prop="productId" label="Product ID" align="left" width="110"></el-table-column>
                    <el-table-column prop="internalName" label="Model" align="left"></el-table-column>
                    <el-table-column prop="description" label="Description" align="left"  width="130"></el-table-column>
                    <el-table-column prop="productCategoryId" label="Category" align="left" width="140"></el-table-column>
                    <el-table-column prop="brandName" label="Brand" align="left"></el-table-column>
                    <el-table-column prop="ean" label="EAN" align="center" width="130"></el-table-column>
                    <el-table-column prop="currencyUomId" label="Currency" align="center"></el-table-column>
                    <el-table-column prop="cost" label="Cost" align="right" width="130">
                        <template slot-scope="scope">
                            {{ scope.row.cost | formatNumber }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Status" prop="isActive" align="center"></el-table-column>
                    <el-table-column label="Operation" align="center" width="160">
                        <template slot-scope="scope">
                            <a class="operatorList" v-if="$hasPermission('catalogProductsListEditCost')" :href="'/product_web/index.html#/editProductPriceRules?productId='+scope.row.spu" target="_blank" size="small">Edit Cost</a>
                            <a class="operatorList" v-if="$hasPermission('catalogProductsListEditInfo')" :href="'/product_web/index.html#/addProductFeature?productId='+scope.row.spu" target="_blank" size="small">Edit Info</a>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page_box" v-if="productListData.resultPoductPriceList && productListData.resultPoductPriceList.length">
                    <el-pagination
                            layout="prev, pager, next, jumper"
                            :total="productListData.pageMap.total"
                            :page-size="productListData.pageMap.pageSize"
                            :current-page.sync="searchForm.curpage"
                            @current-change="searchProductListPage">
                    </el-pagination>
                </div>
                <div style="clear: both;"></div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import Utils from '~utils/index'
import ProductApi from '~api/productapi'
import ProSuggest from './productseggest.vue'
import {download} from '~utils/custom/downloadHelper'

Vue.component('ProductSuggest', ProSuggest)

export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            firstCategoryData: [],
            secondCategoryData: [],
            thirdCategoryData: [],
            productStatusData: [{
                productStatusId: 'Y',
                productStatusName: 'Enabled'
            }, {
                productStatusId: 'N',
                productStatusName: 'Disabled'
            }],
            productListData: {
                resultPoductPriceList: [],
                pageMap: {
                    pageNum: 1,
                    pageSize: 15,
                    pages: 1,
                    total: 0,
                    size: 0,
                    startRow: 0,
                    endRow: 0
                }
            },
            sugession: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            },
            isManual : false,
            searchForm: {
                model: '',
                productId: '',
                ean: '',
                productStatus: 'Y',
                firstCategoryId: '',
                secondCategoryId: '',
                thirdCategoryId: '',
                beginTime: '',
                endTime: '',
                beginToTime: '',
                endToTime: '',
                curpage: 1,
                pageSize: 15,
                fromPickerOptions: {
                    disabledDate: (time) => {
                        if (_this.searchForm.endToTime) {
                            return time > _this.getCompareDate(_this.searchForm.endToTime)
                        }
                        if (!_this.searchForm.endToTime) {
                            return time > _this.getCompareDate(new Date())
                        }
                        return false
                    }
                },
                searchLoading: false,
                exportLoading: false,
                toPickerOptions: {
                    disabledDate: (time) => {
                        if (_this.searchForm.beginToTime) {
                            return time < Utils.getPartialDate(_this.searchForm.beginToTime, compareFormat) || time > Utils.getPartialDate(new Date(), compareFormat)
                        }
                        return false
                    }
                }
            }
        }
    },
    watch: {
        'searchForm.beginToTime': function (newVal) {
            this.searchForm.beginTime = newVal ? Utils.getServerTimestamp(newVal) || '' : ''
        },
        'searchForm.endToTime': function (newVal) {
            if (newVal) {
                var d = Utils.parseDate(newVal)
                var newD = new Date(d.setDate(d.getDate() + 1))
                this.searchForm.endTime = Utils.getServerTimestamp(newD) - 1 || ''
            } else {
                this.searchForm.endTime = ''
            }
        }
    },
    created () {
        this.querySuggessionDebounce = Utils.debounce(this.querySuggession, 500)
        this.searchProductList(1)
    },
    mounted () {
        var t = this
        this.queryCategoryList({
            'categoryId': 'DefaultRootCategory'
        }, function (d) {
            if (d.data && d.data.categoryList && d.data.categoryList.length) {
                t.firstCategoryData = (d.data.categoryList).sort(function (first, last) {
                    return first.sequenceNum - last.sequenceNum
                })
                t.secondCategoryData = []
                t.thirdCategoryData = []
            } else {
                t.firstCategoryData = []
            }
        })
    },
    methods: {
        getParamsStr (params) {
            var paramStr = ''
            if (params) {
                for (var k in params) {
                    if (k && params[k] != null) {
                        var sParaVal = ''
                        if (typeof params[k] == 'string' || typeof params[k] == 'number') {
                            if (k == 'internalName' && params[k].indexOf('+') != -1) {
                                sParaVal = params[k].replace(/\+/g, '----')
                            } else {
                                sParaVal = params[k]
                            }
                        } else if (typeof params[k] == 'object') {
                            sParaVal = JSON.stringify(params[k])
                        }
                        paramStr += '&' + k + '=' + sParaVal
                    }
                }
            }
            if (paramStr) {
                paramStr = '?' + paramStr.substring(1)
            }
            return paramStr
        },
        getParams () {
            return {
                'begintime': this.searchForm.beginTime,
                'ean': this.searchForm.ean,
                'endtime': this.searchForm.endTime,
                'internalName': this.searchForm.model,
                'isActive': this.searchForm.productStatus,
                'pageSize': this.productListData.pageMap.pageSize,
                'productCategoryId': this.searchForm.thirdCategoryId,
                'productCategoryId1': this.searchForm.firstCategoryId,
                'productCategoryId2': this.searchForm.secondCategoryId,
                'productId': this.searchForm.productId
            }
        },
        exportProductList () {
            let t = this;

            if (t.getParams().begintime > t.getParams().endtime) {
                t.$message.error("Start date can't be greater than end date.")

                return false
            }

            t.searchForm.exportLoading = true
            ProductApi.exportProductList(t.getParams(), {
                progress: (progressEvent) => {}
            }).then(res => {
                t.searchForm.exportLoading = false
                download(res.data, res.headers['x-filename'] || 'productList.csv')
            }).catch(err => {
                t.searchForm.exportLoading = false
                t.$showErrorMessage(err)
            })
        },
        searchProductListPage(){
            if (!this.isManual) {
                this.searchProductList(this.searchForm.curpage, true)
            } else {
                this.isManual = false
            }
        },
        searchProductList (pageNum, isOnlyList = false) {
            let t = this;
            if (this.getParams().begintime > this.getParams().endtime) {
              this.$message.error("Start date can't be greater than end date.")

              return false
            }
            this.searchForm.searchLoading = true
            var paramsContent = Object.assign({}, this.getParams(), {
                pageNum: pageNum || this.searchForm.curpage,
                isOnlyList: isOnlyList
            });
            this.$getCommonPageListApi(ProductApi.lookupProductInfoAjax, paramsContent, d => {
                if (d.data && d.data.list && d.data.list.length) {
                    t.productListData.resultPoductPriceList.splice(0)
                    t.productListData.resultPoductPriceList = t.productListData.resultPoductPriceList.concat(d.data.list)
                } else {
                    t.productListData.resultPoductPriceList.splice(0)
                }
                if (t.searchForm.curpage != d.data.pageNum) {
                    t.isManual = true
                    t.searchForm.curpage = d.data.pageNum
                }
            }).then((results) => {
                t.searchForm.searchLoading = false
                if (results.length > 1) {
                  if (results[1].success) {
                      t.productListData.pageMap.total = results[1].data.total
                      t.productListData.pageMap.pageSize = results[1].data.pageSize
                      t.productListData.pageMap.startRow = (results[1].data.pageNum - 1) * results[1].data.pageSize + 1
                      t.productListData.pageMap.endRow = results[1].data.pageSize * results[1].data.pageNum > results[1].data.total ? results[1].data.total : results[1].data.pageSize * results[1].data.pageNum
                  } else {
                      t.productListData.pageMap.total = t.productListData.pageMap.pageSize * t.searchForm.curpage
                  }
                } else {
                    t.productListData.pageMap.startRow = (t.searchForm.curpage - 1) * t.searchForm.pageSize + 1
                    t.productListData.pageMap.endRow = t.productListData.pageMap.pageSize * t.searchForm.curpage > t.productListData.pageMap.total ? t.productListData.pageMap.total : t.productListData.pageMap.pageSize * t.searchForm.curpage
                }
            })
        },
        changeFirstCategory () {
            var t = this
            if (this.searchForm.firstCategoryId == '') {
                this.secondCategoryData = []
                this.thirdCategoryData = []
                this.searchForm.secondCategoryId = ''
                this.searchForm.thirdCategoryId = ''
                return false
            }

            this.queryCategoryList({
                'categoryId': t.searchForm.firstCategoryId
            }, function (d) {
                if (d.data && d.data.categoryList && d.data.categoryList.length) {
                    t.secondCategoryData = d.data.categoryList.sort(function (first, last) {
                        return first.sequenceNum - last.sequenceNum
                    })
                } else {
                    t.secondCategoryData = []
                }
            })
        },
        changeSecondCategory () {
            var t = this
            if (this.searchForm.secondCategoryId == '') {
                this.thirdCategoryData = []
                this.searchForm.thirdCategoryId = ''
                return false
            }

            this.queryCategoryList({
                'categoryId': t.searchForm.secondCategoryId
            }, function (d) {
                if (d.data && d.data.categoryList && d.data.categoryList.length) {
                    t.thirdCategoryData = d.data.categoryList.sort(function (first, last) {
                        return first.sequenceNum - last.sequenceNum
                    })
                } else {
                    t.thirdCategoryData = []
                }
            })
        },
        queryCategoryList (data, callback) {
            ProductApi.selectProductCategoryByParentId(data).then(d => {
                if (d.success == true) {
                    callback && callback(d)
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                this.$showErrorMessage(err)
            })
        },
        querySuggession (querystring, cb) {
            if (!querystring) {
                cb([])
                return false
            }
            ProductApi.findProductInfoBykeyWord({
                keyWord: querystring.trim()
            }).then(d => {
                if (d.success == true) {
                    if (d.data && d.data.productInfoList && d.data.productInfoList.length) {
                        cb(d.data.productInfoList)
                    } else {
                        cb([])
                    }
                } else {
                    this.$showErrorMessage(d.message)
                    cb([])
                }
            }).catch(err => {
                this.$showErrorMessage(err)
                cb([])
            })
        },
        selectSuggession (item) {
            this.searchForm.productId = item.productId
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        }
    },
    filters: {
        formatNumber (value) {
            return Utils.formatToThousands(value)
        },
        formatValue (value) {
            return value == 'Y' ? 'Enabled' : 'Disabled'
        }
    }
}
</script>
<style>
    .productList_box{
        background-color: #ffffff;
        padding-top: 10px;
    }
    .el-form-item{
        margin-bottom: 10px;
    }
    .form_label{
        font-size: 12px;
        margin-right: 10px;
    }
    .productList_title{
        height: 40px;
        margin:0 10px;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #dbdbdb;
    }
    .productList_search{
        border: 1px solid #dbdbdb;
        padding: 10px;
        margin: 0 10px;
    }
    .productList_search .el-form-item__label{
        font-size: 12px;
    }
    .productList_content{
        padding: 10px;
    }
    .productList_content_toolBar{
        height: 30px;
        width: 100%;
        margin: 5px 0;
    }
    .productList_content_toolBar .productList_content_title{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
        float: left;
    }
    .productList_content_toolBar .totalList{
        float: right;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }
    .productList_content_toolBar .exportList{
        margin-left: 10px;
        float: right;
    }
    .page_box {
        margin: 15px 0;
        float: right;
        margin-right: -5px;
    }
    .operatorList:first-child{
        margin-right: 15px;
    }
    .suggestionList{
        text-overflow: ellipsis;
        overflow: hidden;
        width:100%;
    }
</style>
