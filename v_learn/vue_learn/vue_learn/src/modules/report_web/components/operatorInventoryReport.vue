<template>
  <div>
      <div class="inventoryReport_box">
          <div class="inventoryReport_title">Operator Inventory Report</div>
          <div class="inventoryReport_search">
              <el-form :model="searchForm" class="inventoryReport_form" :inline="true">
                  <el-row :gutter="10">
                      <el-col :span="9">
                          <el-form-item label="Product">
                              <el-autocomplete style="width: 300px"
                                               :trigger-on-focus="suggestion.triggerOnFocus"
                                               @input="changeConditionEvt"
                                               v-model.trim="searchForm.productId"
                                               :fetch-suggestions="querySuggestionDebounce"
                                               @select="selectSuggession">
                                  <template slot-scope="scope">
                                      <div v-for="item in scope" :valueKey="item">
                                          <div class="suggestionList" v-if="item.description">{{item.productId}}:{{ item.brandName }} {{ item.internalName }} {{item.description}}</div>
                                          <div class="suggestionList" v-else>{{item.productId}}:{{ item.brandName }} {{ item.internalName }}</div>
                                      </div>
                                  </template>
                              </el-autocomplete>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7">
                          <el-form-item label="Store Groups">
                              <el-select size="small" v-model="searchForm.storeGroup" clearable @clear="clearGroupEvt" @change="changeGroupEvt" placeholder="Select Store Groups">
                                  <el-option
                                      v-for="item in storeGroupsData"
                                      :key="item.storeGroupId"
                                      :label="item.storeGroupName"
                                      :value="item.storeGroupId">
                                  </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="6">
                          <el-form-item label="Store">
                              <el-select size="small" v-model="searchForm.store" clearable placeholder="Select Store">
                                  <el-option
                                      v-for="item in storesData"
                                      :key="item.storeId"
                                      :label="item.storeName"
                                      :value="item.storeId">
                                  </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row>
                      <el-col :span="6">
                          <el-form-item label="Date">
                              <el-date-picker type="date"
                                              :editable="false"
                                              :clearable="false"
                                              :picker-options="searchForm.fromPickerOptions"
                                              v-model.trim="searchForm.beginToTime"
                                              format="dd/MM/yyyy"
                                              size="small"
                                              placeholder="DD/MM/YYYY">
                              </el-date-picker>
                          </el-form-item>
                      </el-col>
                      <el-col :span="4">
                          <el-form-item>
                              <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading"  @click="searchInventoryReport('1')">Search</el-button>
                          </el-form-item>
                      </el-col>
                  </el-row>
              </el-form>
          </div>
          <div class="inventoryReport_content">
              <div class="inventoryReport_list">
                  <div class="inventoryReport_list_toolBar">
                      <div class="inventoryReport_list_title">Operator Inventory Report List</div>
                      <div class="inventoryReport_list_exportList">
                          <el-button type="primary" size="small" icon="el-icon-download" :loading="searchForm.exportListLoading" @click="exportInventoryReportList">Export</el-button>
                      </div>
                      <div class="inventoryReport_list_totalList" v-if="inventoryReportListData.pageMap.total > 0">
                          Display {{ inventoryReportListData.pageMap.startRow }} - {{ inventoryReportListData.pageMap.endRow }} item, {{ inventoryReportListData.pageMap.total }} results in total
                      </div>
                  </div>
                  <div v-loading="loadingTableListData" element-loading-text="Loading">
                      <el-table :data="inventoryReportListData.list" style="width: 100%;font-size: 12px;" :default-sort="{ prop: 'recordDate',order: 'descending' }" class="inventoryReport_list_table">
                          <el-table-column prop="recordDate" label="Date" align="center"></el-table-column>
                          <el-table-column prop="productId" label="Product ID" align="left"></el-table-column>
                          <el-table-column label="Model" class-name="list_table_column" align="left">
                              <template slot-scope="scope">
                                  <div v-if="scope.row.brandName && scope.row.description">{{ scope.row.brandName }} | {{ scope.row.productName }} | {{ scope.row.description }}</div>
                                  <div v-else-if="scope.row.brandName && !scope.row.description">{{ scope.row.brandName }} | {{ scope.row.productName }}</div>
                                  <div v-else-if="!scope.row.brandName && scope.row.description">{{ scope.row.productName }} | {{ scope.row.description }}</div>
                                  <div v-else>{{ scope.row.productName }}</div>
                              </template>
                          </el-table-column>
                          <el-table-column prop="facilityName" label="Warehouse" class-name="list_table_column" align="left"></el-table-column>
                          <el-table-column prop="qoh" class-name="list_table_column" label="QTY" align="right"></el-table-column>
                          <el-table-column class-name="list_table_column" label="Unit Retail Price" align="right">
                              <template slot-scope="scope">
                                  {{ scope.row.price | formatNumber }}
                              </template>
                          </el-table-column>
                          <el-table-column  class-name="list_table_column" width="150px" label="Sub Total Retail Price" align="right">
                              <template slot-scope="scope">
                                  {{ scope.row.qoh *  scope.row.price | formatNumber }}
                              </template>
                          </el-table-column>
                      </el-table>
                      <div class="page_list_box" v-if="inventoryReportListData.list && inventoryReportListData.list.length">
                          <el-pagination
                              layout="prev, pager, next, jumper"
                              :total="inventoryReportListData.pageMap.total"
                              :page-size="inventoryReportListData.pageMap.pageSize"
                              :current-page.sync="inventoryReportListData.pageMap.pageNum"
                              @current-change="searchInventoryReport(inventoryReportListData.pageMap.pageNum, true)">
                          </el-pagination>
                      </div>
                      <div style="clear: both;"></div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Utils from '~utils/index'
import ReportApi from '~api/reportapi'
import {mapState} from 'vuex'
import ProSuggest from './productseggest.vue'
import * as types from '~store/mutation-types'
import {download} from '~utils/custom/downloadHelper'

Vue.component('ProductSuggest', ProSuggest)

export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            storeGroupsData: [],
            storesData: [],
            loadingTableListData: false,
            searchForm: {
                productId: '',
                productHiddenId: '',
                storeGroup: '',
                store: '',
                beginToTime: '',
                pageSize: 20,
                curpage: 1,
                searchLoading: false,
                exportListLoading: false,
                fromPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                }
            },
            suggestion: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            },
            inventoryReportListData: {
                list: [],
                pageMap: {
                    total: 0,
                    pageSize: 10,
                    pageNum: 1,
                    startRow: 0,
                    endRow: 0
                }
            }
        }
    },
    created () {
        ReportApi.queryStoreGroupList({
            type: 'OPERATOR'
        }).then(d => {
            if (d.success == true) {
                if (d.data && d.data.length) {
                    this.storeGroupsData.splice(0)
                    this.storeGroupsData = this.storeGroupsData.concat(d.data)
                } else {
                    this.storeGroupsData = []
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })
        this.querySuggestionDebounce = Utils.debounce(this.querySuggestion, 500)
    },
    watch: {
        'inventoryReportListData.pageMap.endRow': function () {
            if (this.inventoryReportListData.pageMap.endRow > this.inventoryReportListData.pageMap.total) {
                this.inventoryReportListData.pageMap.endRow = this.inventoryReportListData.pageMap.total
            }
        },
        'searchForm.productId': function () {
            if(!this.searchForm.productId){
                this.searchForm.productHiddenId = ''
            }
        }
    },
    mounted () {
        this.searchForm.beginToTime = new Date(this.timeNow - 24 * 60 * 60 * 1000)

        this.searchInventoryReport('1')
    },
    methods: {
        changeConditionEvt () {
            this.searchForm.productHiddenId = ''
        },
        selectSuggession (item) {
            this.searchForm.productHiddenId = item.productId
            if (item.description) {
                this.searchForm.productId = item.productId + ':' + item.brandName + ' ' + item.internalName + ' ' + item.description
            } else {
                this.searchForm.productId = item.productId + ':' + item.brandName + ' ' + item.internalName
            }
        },
        querySuggestion (queryString, cb) {
            if (!queryString) {
                cb([])
                return false
            }
            ReportApi.findActiveProductBykeyWord({
                keyWord: queryString.trim()
            }).then(d => {
                if (d.success == true) {
                    if (d.data && d.data.productInfoBOList && d.data.productInfoBOList.length) {
                        cb(d.data.productInfoBOList)
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
        getParams () {
            return {
                productId: this.searchForm.productHiddenId ? this.searchForm.productHiddenId : this.searchForm.productId,
                storeGroupId: this.searchForm.storeGroup,
                storeId: this.searchForm.store,
                date: this.formatDate(this.searchForm.beginToTime),
                pageSize: this.searchForm.pageSize,
                rawOffset: this.zoneOffset,
                type: 'OPERATOR'
            }
        },
        exportInventoryReportList () {
            this.searchForm.exportListLoading = true
            ReportApi.exportReportData(this.getParams(), {
                progress: (progressEvent) => {}
            }).then(res => {
                this.searchForm.exportListLoading = false
                download(res.data, res.headers['x-filename'] || 'operatorInventoryExport.csv')
            }).catch(err => {
                this.searchForm.exportListLoading = false
                this.$showErrorMessage(err)
            })
        },
        searchInventoryReport (params, isOnlyList = false) {
            var t = this
            this.loadingTableListData = true
            this.searchForm.searchLoading = true
            var paramsContent = Object.assign({}, this.getParams(), {
                pageNum: params || '1',
                isOnlyList: isOnlyList
            })

            this.$getCommonPageListApi(ReportApi.findReportData, paramsContent, d => {
                if (d.data && d.data.list && d.data.list.length) {
                    t.inventoryReportListData.list.splice(0)
                    t.inventoryReportListData.list = t.inventoryReportListData.list.concat(d.data.list)
                } else {
                    t.inventoryReportListData.list.splice(0)
                }
                t.searchForm.curpage = d.data.pageNum
            }).then((results) => {
                t.searchForm.searchLoading = false
                t.loadingTableListData = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.inventoryReportListData.pageMap.total = results[1].data.total
                        this.inventoryReportListData.pageMap.pageSize = results[1].data.pageSize
                        this.inventoryReportListData.pageMap.startRow = (this.searchForm.curpage - 1) * results[1].data.pageSize + 1
                        this.inventoryReportListData.pageMap.endRow = results[1].data.pageSize * this.searchForm.curpage > results[1].data.total ? results[1].data.total : results[1].data.pageSize * this.searchForm.curpage
                    } else {
                        this.inventoryReportListData.pageMap.total = this.inventoryReportListData.pageMap.pageSize * this.searchForm.curpage
                    }
                }
            })
        },
        changeGroupEvt (value) {
            if (this.storeGroupsData.length) {
                this.storeGroupsData.forEach((data) => {
                    if (data.storeGroupId == value) {
                        this.searchForm.store = ''
                        this.storesData.splice('0')
                        this.storesData = this.storesData.concat(data.storeList)
                    }
                })
            } else {
                this.searchForm.store = ''
                this.storesData = []
            }
        },
        clearGroupEvt () {
            this.searchForm.store = ''
            this.storesData = []
        },
        formatDate (val) {
            if (!val) {
                return val
            }
            return val ? Utils.getServerDateStrByLocal(Utils.getServerTimestamp(val), 'dd/MM/yyyy') : ''
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1)
        }
    },
    filters: {
        formatNumber (value) {
            if (!value) {
                return value
            }
            value = (value - 0).toFixed(2)
            return Utils.formatToThousands(value)
        }
    },
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow'
        ])
    }
}
</script>
<style scoped>
  .inventoryReport_box{
    background-color: #ffffff;
    margin-left:10px;
  }
  .salesReport_box .form_label{
    font-size: 12px;
    text-align: center;
    width: 100px;
    color: #48616A;
  }
  .inventoryReport_title{
    height: 40px;
    margin:0 10px;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #dbdbdb;
  }
  .inventoryReport_search{
    border: 1px solid #dbdbdb;
    padding: 10px;
    margin: 10px 10px 0 10px;
  }
  .inventoryReport_search .el-form-item__label{
    font-size: 12px;
  }
  .inventoryReport_content{
    padding: 10px;
  }
  .salesReport_list_table .list_table_column > div {
    padding-right: 5px;
    padding-left: 5px;
    word-break: break-word;
  }
  .inventoryReport_list_toolBar{
    height: 30px;
    width: 100%;
    margin: 5px 0;
  }
  .inventoryReport_list_toolBar .inventoryReport_list_title{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
    float: left;
  }
  .inventoryReport_list_toolBar .inventoryReport_list_exportList{
    margin-left: 10px;
    float: right;
  }
  .inventoryReport_list_toolBar .inventoryReport_list_totalList{
    float: right;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
  .page_list_box{
    margin: 15px 0;
    float: right;
    margin-right: -5px;
  }
  .suggestionList{
    text-overflow: ellipsis;
    overflow: hidden;
    width:100%;
  }
</style>
