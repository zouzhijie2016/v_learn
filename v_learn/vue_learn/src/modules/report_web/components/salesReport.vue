<template>
    <div>
        <el-row class="tac">
            <el-col :span="4">
                <report-menu :extendOptions.sync="extendOptions"></report-menu>
            </el-col>
            <el-col :span="20">
                <div class="salesReport_box">
                    <div class="salesReport_title">Sales Report</div>
                    <div class="salesReport_search">
                        <el-form :model="searchForm" class="salesReport_form" :inline="true">
                              <el-row>
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
                              </el-row>
                              <el-row>
                                  <el-form-item label="Payment">
                                      <el-select size="small" v-model="searchForm.paymentMethod" clearable placeholder="Select Payment Method">
                                          <el-option
                                            v-for="item in paymentMethodData"
                                            :key="item.productMethodId"
                                            :label="item.productMethodName"
                                            :value="item.productMethodId">
                                          </el-option>
                                      </el-select>
                                  </el-form-item>
                                  <el-form-item  class="searchDateList">
                                      <label class="form_label">Search Date</label>
                                      <el-date-picker type="date"
                                                      :editable="false"
                                                      :clearable="false"
                                                      :picker-options="searchForm.fromPickerOptions"
                                                      v-model.trim="searchForm.beginToTime"
                                                      format="dd/MM/yyyy"
                                                      size="small"
                                                      placeholder="DD/MM/YYYY" style="width:33%;">
                                      </el-date-picker>
                                      <label class="col_datepicker_label" style="width:5%;text-align:center;">-</label>
                                      <el-date-picker type="date"
                                                      :editable="false"
                                                      :clearable="false"
                                                      :picker-options="searchForm.toPickerOptions"
                                                      v-model.trim="searchForm.endToTime"
                                                      format="dd/MM/yyyy"
                                                      size="small"
                                                      placeholder="DD/MM/YYYY" style="width:33%;">
                                      </el-date-picker>
                                  </el-form-item>
                                  <el-form-item>
                                      <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading"  @click="searchSalesReport('1')">Search</el-button>
                                  </el-form-item>
                              </el-row>
                          </el-form>
                    </div>
                    <div class="salesReport_content">
                        <div class="salesReport_list">
                            <div class="salesReport_list_toolBar">
                                <div class="salesReport_list_title">Sales Details</div>
                                <div class="salesReport_list_exportList">
                                    <el-button type="primary" size="small" icon="el-icon-download" :loading="searchForm.exportListLoading" @click="exportSalesReportList">Export</el-button>
                                </div>
                                <div class="salesReport_list_totalList" v-if="salesReportListData.pageMap.total > 0">
                                    Display {{ salesReportListData.pageMap.startRow + 1 }} - {{ salesReportListData.pageMap.endRow }} item, {{ salesReportListData.pageMap.total }} results in total
                                </div>
                            </div>
                            <div v-loading="loadingTableListData" element-loading-text="Loading">
                                <el-table :data="salesReportListData.headBean" style="width: 100%;font-size: 12px;" :default-sort="{ prop: 'orderDate',order: 'descending' }" class="salesReport_list_table">
                                    <el-table-column prop="orderDate" label="Order Time" align="left"></el-table-column>
                                    <!--<el-table-column prop="category" label="Category" align="left" ></el-table-column>-->
                                    <el-table-column prop="productId" label="Product ID" align="left"></el-table-column>
                                    <el-table-column prop="description" label="Description" class-name="list_table_column" align="left" width="120"></el-table-column>
                                    <el-table-column prop="quantity" class-name="list_table_column" width="65" label="Quantity" align="right">
                                        <template slot-scope="scope">
                                            {{ scope.row.quantity | formatNumber }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="unitPrice" class-name="list_table_column" label="Unit Price" width="90" align="right">
                                        <template slot-scope="scope">
                                            {{ scope.row.unitPrice | formatNumber }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="subTotal" label="Sub Total" width="90" class-name="list_table_column" align="right">
                                        <template slot-scope="scope">
                                            {{ scope.row.subTotal | formatNumber }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-for="item in costPriceList" class-name="list_table_column" width="90" :key="item.id" :prop="item.id" :label="item.name" align="right" >
                                      <template slot-scope="scope">
                                          {{ scope.row[item.id] | formatNumber }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column prop="adjustment" class-name="list_table_column" width="85" label="Adjustment" align="right">
                                        <template slot-scope="scope">
                                            {{ scope.row.adjustment | formatNumber }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="payment" class-name="list_table_column" width="65" label="Payment" align="center"></el-table-column>
                                    <el-table-column prop="receivables" class-name="list_table_column" width="85" label="Receivables" align="right">
                                        <template slot-scope="scope">
                                            {{ scope.row.receivables | formatNumber }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="salesChannel" class-name="list_table_column" width="65" label="Sales Channel" align="center"></el-table-column>
                                    <el-table-column prop="storeName" class-name="list_table_column" label="Store" width="70"  align="left"></el-table-column>
                                </el-table>
                                <div class="page_list_box" v-if="salesReportListData.headBean && salesReportListData.headBean.length">
                                    <el-pagination
                                      layout="prev, pager, next, jumper"
                                      :total="salesReportListData.pageMap.total"
                                      :page-size="salesReportListData.pageMap.pageSize"
                                      :current-page.sync="salesReportListData.pageMap.pageNum"
                                      @current-change="searchSalesReportList(salesReportListData.pageMap.pageNum)">
                                    </el-pagination>
                                </div>
                                <div style="clear: both;"></div>
                            </div>
                        </div>
                        <div class="salesReport_sum">
                            <div class="salesReport_sum_toolBar">
                                <div class="salesReport_sum_title">Payment Summary</div>
                                <div class="salesReport_sum_exportList">
                                    <el-button type="primary" size="small" icon="el-icon-download" :loading="searchForm.exportSumLoading" @click="exportSalesReportSum">Export</el-button>
                                </div>
                                <div class="salesReport_sum_totalList" v-if="salesReportSumData.pageMap.total > 0">
                                    Display {{ salesReportSumData.pageMap.startRow }} - {{ salesReportSumData.pageMap.endRow }} item, {{ salesReportSumData.pageMap.total }} results in total
                                </div>
                            </div>
                            <div v-loading="loadingTableSumData" element-loading-text="Loading">
                                <el-table :data="salesReportSumData.footerBean" style="width: 100%;font-size: 12px;" :default-sort="{ prop: 'date',order: 'descending' }" class="salesReport_sum_table">
                                    <el-table-column prop="date" label="Date" align="center"></el-table-column>
                                    <el-table-column prop="totalPayment" label="Total Payment"  align="right"></el-table-column>
                                    <el-table-column prop="cash" label="Cash" align="right"></el-table-column>
                                    <el-table-column prop="cheque" label="Cheque" align="right"></el-table-column>
                                    <el-table-column prop="bankCard" label="Bank Card" align="right"></el-table-column>
                                    <el-table-column prop="mobileMoney" label="Mobile Money" align="right"></el-table-column>
                                    <el-table-column prop="credit" label="Credit" align="right"></el-table-column>
                                    <el-table-column prop="telegraphicTransfer" width="140" label="Telegraphic Transfer" align="right"></el-table-column>
                                </el-table>
                                <div class="page_sum_box" v-if="salesReportSumData.footerBean && salesReportSumData.footerBean.length">
                                    <el-pagination
                                      layout="prev, pager, next, jumper"
                                      :total="salesReportSumData.pageMap.total"
                                      :page-size="salesReportSumData.pageMap.pageSize"
                                      :current-page.sync="salesReportSumData.pageMap.pageNum"
                                      @current-change="searchSalesReportSum(salesReportSumData.pageMap.pageNum)">
                                    </el-pagination>
                                </div>
                                <div style="clear: both;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Vue from 'vue'
import Utils from '~utils/index'
import ReportApi from '~api/reportapi'
import {mapState} from 'vuex'
import ProSuggest from './productseggest.vue'
import reportMenu from '~report-common/reportMenu.vue'
import { incomeMixin } from '~report-common/reportMixins'
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
            paymentMethodData: [{
                productMethodId: 'CASH',
                productMethodName: 'Cash'
            }],
            costPriceList: [],
            loadingTableListData: false,
            loadingTableSumData: false,
            searchForm: {
                productId: '',
                productHiddenId: '',
                storeGroup: '',
                store: '',
                paymentMethod: '',
                beginToTime: '',
                endToTime: '',
                beginDate: '',
                endDate: '',
                pageSize: '10',
                searchLoading: false,
                exportListLoading: false,
                exportSumLoading: false,
                fromPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                },
                toPickerOptions: {
                    disabledDate (date) {
                        return date > Utils.getPartialDate(new Date(), compareFormat)
                    }
                }
            },
            extendOptions: {
                partyRole: '',
                urlPermiss: 'salesReport'
            },
            suggestion: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            },
            salesReportListData: {
                headBean: [],
                pageMap: {
                    total: '0',
                    pageSize: '10',
                    pageNum: '1',
                    startRow: '0',
                    endRow: '0'
                }
            },
            salesReportSumData: {
                footerBean: [],
                pageMap: {
                    total: '0',
                    pageSize: '10',
                    pageNum: '1',
                    startRow: '0',
                    endRow: '0'
                }
            },
            printContentList: {

            }
        }
    },
    components: {
        reportMenu
    },
    mixins: [incomeMixin],
    created () {
        ReportApi.queryStoreGroupList({
            type: 'SALE'
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
        'salesReportListData.pageMap.endRow': function () {
            if (this.salesReportListData.pageMap.endRow > this.salesReportListData.pageMap.total) {
                this.salesReportListData.pageMap.endRow = this.salesReportListData.pageMap.total
            }
        },
        'salesReportSumData.pageMap.endRow': function () {
            if (this.salesReportSumData.pageMap.endRow > this.salesReportSumData.pageMap.total) {
                this.salesReportSumData.pageMap.endRow = this.salesReportSumData.pageMap.total
            }
        },
        'searchForm.productId': function () {
            if(!this.searchForm.productId){
                this.searchForm.productHiddenId = ''
            }
        }
    },
    mounted () {
        let beginDate = new Date(this.timeNow)
        let endDate = new Date(this.timeNow)

        let dateList = this.setDateEvt(beginDate, endDate)

        this.searchForm.beginToTime = dateList.beginDate
        this.searchForm.endToTime = dateList.endDate

        this.searchSalesReport('1')
    },
    methods: {
        setDateEvt (beginDate, endDate) {
            beginDate.setHours(0)
            beginDate.setMinutes(0)
            beginDate.setSeconds(0)
            beginDate.setMilliseconds(0)

            endDate.setHours(23)
            endDate.setMinutes(59)
            endDate.setSeconds(59)
            endDate.setMilliseconds(0)

            return {
                beginDate: beginDate,
                endDate: endDate
            }
        },
        changeConditionEvt (data) {
            this.exportListStatus = true
            this.exportSumStatus = true
            if (data) {
                this.searchForm.productHiddenId = ''
            }
        },
        compareDateEvt () {
            var date = null

            if (typeof this.searchForm.endToTime == 'number') {
                date = (this.getLessThreeMonth(new Date(this.searchForm.endToTime))).getTime()
            } else {
                date = (this.getLessThreeMonth(this.searchForm.endToTime)).getTime()
            }

            if (typeof this.searchForm.beginToTime == 'number') {
                if (this.searchForm.beginToTime >= date && this.searchForm.beginToTime <= this.searchForm.endToTime) {
                    return true
                } else {
                    return false
                }
            } else {
                if ((new Date(this.searchForm.beginToTime)).getTime() >= date && (new Date(this.searchForm.beginToTime)).getTime() <= (new Date(this.searchForm.endToTime)).getTime()) {
                    return true
                } else {
                    return false
                }
            }
        },
        searchSalesReport (paramsList) {
            var t = this
            if (!this.compareDateEvt()) {
                this.$message.error("The date range is not allowed for more than 3 months or start date can't be greater than end date.")

                return false
            }
            this.searchForm.searchLoading = true

            var salesReportListPromise = new Promise(function (resolve) {
                t.searchSalesReportList(paramsList, function (data) {
                    resolve(data)
                })
            })
            var salesReportSumPromise = new Promise(function (resolve) {
                t.searchSalesReportSum(paramsList, function (data) {
                    resolve(data)
                })
            })

            Promise.all([salesReportListPromise, salesReportSumPromise]).then(function (arr) {
                t.searchForm.searchLoading = false
            }, function () {
                t.searchForm.searchLoading = false
            })
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
        beginDateChangeEvt (newVal) {
            return newVal ? Utils.getServerTimestamp(newVal) : ''
        },
        endDateChangeEvt (newVal) {
            if (newVal) {
                var d = Utils.parseDate(newVal)
                var newD = new Date(d.setDate(d.getDate() + 1))
                return Utils.getServerTimestamp(newD) - 1 || ''
            } else {
                return ''
            }
        },
        getParams () {
            let dateList = this.setDateEvt(this.searchForm.beginToTime, this.searchForm.endToTime)
            this.searchForm.beginDate = this.beginDateChangeEvt(dateList.beginDate)
            this.searchForm.endDate = this.beginDateChangeEvt(dateList.endDate)

            return {
                productId: this.searchForm.productHiddenId ? this.searchForm.productHiddenId : this.searchForm.productId,
                sgroupId: this.searchForm.storeGroup,
                storeId: this.searchForm.store,
                beginDate: this.searchForm.beginDate,
                endDate: this.searchForm.endDate,
                paymentMethod: this.searchForm.paymentMethod,
                pageSize: this.searchForm.pageSize,
                rawOffset: this.zoneOffset
            }
        },
        getParamsStr (params) {
            var paramStr = ''
            if (params) {
                for (var k in params) {
                    if (k && params[k] != null) {
                        var sParaVal = ''
                        if (typeof params[k] == 'string' || typeof params[k] == 'number') {
                            sParaVal = params[k]
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
        exportSalesReportList () {
            if (!this.compareDateEvt()) {
                this.$message.error("The date range is not allowed for more than 3 months or start date can't be greater than end date.")

                return false
            }

            this.searchForm.exportListLoading = true
            let params = Object.assign({}, this.getParams(), {
                type: 'SALE'
            })
            ReportApi.exportSalesReportDetails(params, {
                progress: (progressEvent) => {}
            }).then(res => {
                this.searchForm.exportListLoading = false
                download(res.data, res.headers['x-filename'] || 'salesReportDetails.csv')
            }).catch(err => {
                this.searchForm.exportListLoading = false
                this.$showErrorMessage(err)
            })
        },
        exportSalesReportSum () {
            if (!this.compareDateEvt()) {
                this.$message.error("The date range is not allowed for more than 3 months or start date can't be greater than end date.")

                return false
            }

            this.searchForm.exportSumLoading = true
            let params = Object.assign({}, this.getParams(), {
                type: 'SALE'
            })
            ReportApi.exportPaymentSummary(params, {
                progress: (progressEvent) => {}
            }).then(res => {
                this.searchForm.exportSumLoading = false
                download(res.data, res.headers['x-filename'] || 'paymentSummaryReport.csv')
            }).catch(err => {
                this.searchForm.exportSumLoading = false
                this.$showErrorMessage(err)
            })
        },
        searchSalesReportList (params, cb) {
            var t = this

            if (!this.compareDateEvt()) {
                this.$message.error("The date range is not allowed for more than 3 months or start date can't be greater than end date.")

                return false
            }
            this.loadingTableListData = true

            var paramsContent = Object.assign({}, this.getParams(), {
                pageNum: params || '1',
                type: 'SALE'
            })

            ReportApi.searchSalesReportDetails(paramsContent).then(d => {
                t.loadingTableListData = false
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success == true) {
                    if (d.data && d.data.salesOrderDetailList && d.data.salesOrderDetailList.length) {
                        this.salesReportListData.headBean.splice(0)
                        this.salesReportListData.headBean = this.salesReportListData.headBean.concat(d.data.salesOrderDetailList)
                    } else {
                        this.salesReportListData.headBean = []
                    }
                    if (d.data && d.data.pageMap) {
                        this.salesReportListData.pageMap = d.data.pageMap
                    }
                    if (d.data && d.data.productPriceName && d.data.productPriceName.length) {
                        this.costPriceList.splice(0)
                        this.costPriceList = this.costPriceList.concat(d.data.productPriceName)
                    } else {
                        this.costPriceList = []
                    }
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                typeof cb === 'function' && cb.apply(this, arguments)
                this.loadingTableListData = false
                this.$showErrorMessage(err)
            })
        },
        searchSalesReportSum (params, cb) {
            var t = this

            if (!this.compareDateEvt()) {
                this.$message.error("The date range is not allowed for more than 3 months or start date can't be greater than end date.")

                return false
            }

            this.loadingTableSumData = true

            var paramsContent = Object.assign({}, this.getParams(), {
                pageNum: params || '1',
                type: 'SALE'
            })
            ReportApi.queryPaymentSummary(paramsContent).then(d => {
                t.loadingTableSumData = false
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success == true) {
                    if (d.data && d.data.list && d.data.list.length) {
                        this.salesReportSumData.footerBean.splice(0)
                        this.salesReportSumData.footerBean = this.salesReportSumData.footerBean.concat(d.data.list)

                        this.salesReportSumData.pageMap = {
                            total: d.data.total,
                            pageSize: d.data.pageSize,
                            pageNum: d.data.pageNum,
                            startRow: d.data.startRow,
                            endRow: d.data.endRow
                        }
                    } else {
                        this.salesReportSumData.footerBean = []
                    }
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                this.loadingTableSumData = false
                typeof cb === 'function' && cb.apply(this, arguments)
                this.$showErrorMessage(err)
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
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        getLessThreeMonth (d) {
            var month = d.getMonth()

            if (month <= 3) {
                return new Date((d.getFullYear() - 1), (9 + month), d.getDate())
            } else {
                return new Date(d.getFullYear(), month - 3, d.getDate())
            }
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
<style>
    .salesReport_box{
        background-color: #ffffff;
        margin-left:10px;
    }
    .searchDateList .el-form-item__content{
        width: 100%;
    }
    .salesReport_box .form_label{
        font-size: 12px;
        text-align: center;
        width: 100px;
        color: #48616A;
    }
    .salesReport_title{
        height: 40px;
        margin:0 10px;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #dbdbdb;
    }
    .salesReport_search{
        border: 1px solid #dbdbdb;
        padding: 10px;
        margin: 10px 10px 0 10px;
    }
    .salesReport_search .el-form-item__label{
        font-size: 12px;
    }
    .salesReport_content{
        padding: 10px;
    }
    .salesReport_list_table .list_table_column > div {
        padding-right: 5px;
        padding-left: 5px;
        word-break: break-word;
    }
    .salesReport_list_toolBar,
    .salesReport_sum_toolBar{
        height: 30px;
        width: 100%;
        margin: 5px 0;
    }
    .salesReport_list_toolBar .salesReport_list_title,
    .salesReport_sum_toolBar .salesReport_sum_title{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
        float: left;
    }
    .salesReport_list_toolBar .salesReport_list_exportList,
    .salesReport_list_toolBar .salesReport_list_printList,
    .salesReport_sum_toolBar .salesReport_sum_exportList{
        margin-left: 10px;
        float: right;
    }
    .salesReport_list_toolBar .salesReport_list_totalList,
    .salesReport_sum_toolBar .salesReport_sum_totalList{
        float: right;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }
    .salesReport_sum{
        margin-top: 30px;
    }
    .page_list_box,
    .page_sum_box {
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
