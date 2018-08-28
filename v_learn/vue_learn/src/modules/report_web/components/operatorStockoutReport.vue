<template>
    <div class="stockOutReport_box">
        <div class="stockOutReport_title">Operator Stockout Report</div>
        <div class="stockOutReport_search">
            <el-form :model="searchForm" class="stockOutReport_form" :inline="true">
                <el-row :gutter="10">
                    <el-col :span="9">
                        <el-form-item label="Product">
                            <el-autocomplete style="width: 300px"
                                    :trigger-on-focus="suggestion.triggerOnFocus"
                                    v-model.trim="searchForm.productId"
                                    @input="changeConditionEvt"
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
                    <el-col :span="6">
                        <el-form-item label="From">
                            <el-select size="small" v-model="searchForm.from" @change="changeConditionEvt" clearable filterable placeholder="Please Select">
                                <el-option
                                        v-for="item in fromData"
                                        :key="item.facilityId"
                                        :label="item.facilityName"
                                        :value="item.facilityId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="To">
                            <el-select size="small" v-model="searchForm.to" @change="changeConditionEvt" clearable filterable placeholder="Please Select">
                                <el-option
                                        v-for="item in toData"
                                        :key="item.facilityId"
                                        :label="item.facilityName"
                                        :value="item.facilityId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="10">
                        <el-form-item style="width: 100%;" class="searchDateList">
                            <label class="form_label">Search Date</label>
                            <el-date-picker type="date"
                                            :editable="false"
                                            :clearable="false"
                                            :picker-options="searchForm.fromPickerOptions"
                                            v-model.trim="searchForm.beginToTime"
                                            @change="changeConditionEvt"
                                            format="dd/MM/yyyy"
                                            size="small"
                                            placeholder="DD/MM/YYYY" style="width:33%">
                            </el-date-picker>
                            <label class="col_datepicker_label" style="width:5%;text-align:center">-</label>
                            <el-date-picker type="date"
                                            :editable="false"
                                            :clearable="false"
                                            @change="changeConditionEvt"
                                            :picker-options="searchForm.toPickerOptions"
                                            v-model.trim="searchForm.endToTime"
                                            format="dd/MM/yyyy"
                                            size="small"
                                            placeholder="DD/MM/YYYY" style="width:33%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading"  @click="searchStockOutReport('1')">Search</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="stockOutReport_content">
            <div class="stockOutReport_toolBar">
                <div class="stockOutReport_toolBar_title">Operator Stockout Report List</div>
                <div class="stockOutReport_toolBar_exportList">
                    <el-button type="primary" size="small" icon="el-icon-download" :disabled="!exportStatus" :loading="searchForm.exportStockOutReportLoading" @click="exportStockOutReportList">Export</el-button>
                </div>
                <div class="stockOutReport_toolBar_totalList" v-if="stockOutReportListData.pageMap.total > 0">
                    Display {{ stockOutReportListData.pageMap.startRow }} - {{ stockOutReportListData.pageMap.endRow }} item, {{ stockOutReportListData.pageMap.total }} results in total
                </div>
            </div>
            <div v-loading="loadingTableData" element-loading-text="Loading">
                <el-table :data="stockOutReportListData.list" style="width: 100%;font-size: 12px" :default-sort="{ prop: 'transferCompleteDate',order: 'descending' }">
                    <el-table-column prop="productId" label="Product ID" align="left" width="120"></el-table-column>
                    <el-table-column label="Description" align="left">
                        <template slot-scope="scope">
                            <span v-if="scope.row.description">{{ scope.row.brandName }} | {{ scope.row.model }} | {{ scope.row.description }}</span>
                            <span v-else>{{ scope.row.brandName }} | {{ scope.row.model }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="shipNumber" label="Shipment Quantity" align="center"></el-table-column>
                    <el-table-column prop="transferNumber" label="Transfer Quantity" align="center"></el-table-column>
                    <el-table-column prop="outStockDate" label="OutStock Date" align="center"></el-table-column>
                    <el-table-column prop="completeDate" label="Transfer Complete Date" align="center"></el-table-column>
                    <el-table-column prop="fromWarehouse" label="From" align="center"></el-table-column>
                    <el-table-column prop="toWarehouse" label="To" align="center"></el-table-column>
                </el-table>
                <div class="page_box" v-if="stockOutReportListData.list && stockOutReportListData.list.length">
                    <el-pagination
                            layout="prev, pager, next, jumper"
                            :total="stockOutReportListData.pageMap.total"
                            :page-size="stockOutReportListData.pageMap.pageSize"
                            :current-page.sync="stockOutReportListData.pageMap.pageNum"
                            @current-change="searchStockOutReport(stockOutReportListData.pageMap.pageNum)">
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
import ReportApi from '~api/reportapi'
import {mapState} from 'vuex'
import ProSuggest from './productseggest.vue'

Vue.component('ProductSuggest', ProSuggest)

export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            toData: [],
            fromData: [],
            exportStatus: true,
            loadingTableData: false,
            searchForm: {
                productId: '',
                productHiddenId: '',
                from: '',
                to: '',
                beginToTime: '',
                endToTime: '',
                beginDate: '',
                endDate: '',
                pageSize: '10',
                searchLoading: false,
                exportStockOutReportLoading: false,
                fromPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date())
                    }
                },
                toPickerOptions: {
                    disabledDate (date) {
                        return date > Utils.getPartialDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000), compareFormat)
                    }
                }
            },
            suggestion: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            },
            stockOutReportListData: {
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
        ReportApi.findAllPermissionFacilityOrderByEgatee().then(d => {
            if (d.success == true) {
                this.toData.splice(0)
                this.fromData.splice(0)

                if (d.data && d.data.length) {
                    this.toData = this.toData.concat(d.data)
                    this.fromData = this.fromData.concat(d.data.sort(function (a, b) {
                        if (a.facilityName > b.facilityName) {
                            return 1
                        } else {
                            return -1
                        }
                    }))
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
        'stockOutReportListData.pageMap.endRow': function () {
            if (this.stockOutReportListData.pageMap.endRow > this.stockOutReportListData.pageMap.total) {
                this.stockOutReportListData.pageMap.endRow = this.stockOutReportListData.pageMap.total
            }
        },
        'searchForm.productId': function () {
            if(!this.searchForm.productId){
                this.searchForm.productHiddenId = ''
            }
        }
    },
    mounted () {
        let beginDate = new Date(this.timeNow - 24 * 60 * 60 * 1000)
        let endDate = new Date(this.timeNow)

        let dateList = this.setDateEvt(beginDate, endDate)

        this.searchForm.beginToTime = dateList.beginDate
        this.searchForm.endToTime = dateList.endDate

        this.searchStockOutReport('1')
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
        changeConditionEvt () {
            this.exportStatus = true
        },
        searchStockOutReport (paramsList) {
            this.searchStockOutReportList(paramsList)
        },
        selectSuggession (item) {
            this.exportStatus = true
            this.searchForm.productHiddenId = item.productId
            if (item.description) {
                this.searchForm.productId = item.productId + ':' + item.brandName + ' ' + item.internalName + ' ' + item.description
            } else {
                this.searchForm.productId = item.productId + ':' + item.brandName + ' ' + item.internalName
            }
        },
        querySuggestion (queryString, cb) {
            if (!queryString) {
                this.searchForm.productHiddenId = ''
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
                        this.searchForm.productHiddenId = ''
                        cb([])
                    }
                } else {
                    this.$showErrorMessage(d.message)
                    this.searchForm.productHiddenId = ''
                    cb([])
                }
            }).catch(err => {
                this.$showErrorMessage(err)
                this.searchForm.productHiddenId = ''
                cb([])
            })
        },
        compareDateEvt () {
            var date = null

            if (typeof this.searchForm.endToTime == 'number') {
                date = this.searchForm.endToTime
            } else {
                date = (new Date(this.searchForm.endToTime)).getTime()
            }

            if (typeof this.searchForm.beginToTime == 'number') {
                if (this.searchForm.beginToTime <= date) {
                    return true
                } else {
                    return false
                }
            } else {
                if ((new Date(this.searchForm.beginToTime)).getTime() <= date) {
                    return true
                } else {
                    return false
                }
            }
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
                fromWarehouse: this.searchForm.from,
                startDate: this.searchForm.beginDate,
                endDate: this.searchForm.endDate,
                toWarehouse: this.searchForm.to,
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
        exportStockOutReportList () {
            if (!this.compareDateEvt()) {
                this.$message.error("Start date can't be greater than end date.")

                return false
            }
            if (!this.exportStatus) {
                this.$message({
                    showClose: true,
                    message: 'Export is processing, please wait for a moment. If you feel hold too long and want export again, refresh the web browser.',
                    type: 'warning',
                    duration: '5000'
                })
                return false
            }
            location.href = '/api/warehouse/v1/stockOutReport/exportStockOutReport' + this.getParamsStr(this.getParams())
            this.exportStatus = false
        },
        searchStockOutReportList (params) {
            var t = this

            if (!this.compareDateEvt()) {
                this.$message.error("Start date can't be greater than end date.")

                return false
            }

            this.searchForm.searchLoading = true
            this.loadingTableData = true

            var paramsContent = Object.assign({}, this.getParams(), {
                pageNum: params || '1',
                pageSize: this.searchForm.pageSize
            })

            ReportApi.findStockOutReport(paramsContent).then(d => {
                t.searchForm.searchLoading = false
                t.loadingTableData = false
                if (d.success == true) {
                    if (d.data && d.data.list && d.data.list.length) {
                        this.stockOutReportListData.list.splice(0)
                        this.stockOutReportListData.list = this.stockOutReportListData.list.concat(d.data.list)
                        this.stockOutReportListData.pageMap = {
                            total: d.data.total,
                            pageSize: d.data.pageSize,
                            pageNum: d.data.pageNum,
                            startRow: d.data.startRow,
                            endRow: d.data.endRow
                        }
                    } else {
                        this.stockOutReportListData.list.splice(0)
                    }
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                this.searchForm.searchLoading = false
                this.loadingTableData = false
                this.$showErrorMessage(err)
            })
        },
        formatDateEvt (d) {
            let date = new Date(d)
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            month = month < 10 ? '0' + month : month
            let day = date.getDate()
            day = day < 10 ? ('0' + day) : day

            return year + '-' + month + '-' + day
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
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
    .stockOutReport_box{
        background-color: #ffffff;
    }
    .searchDateList .el-form-item__content{
        width: 100%;
    }
    .form_label{
        font-size: 12px;
        margin-right: 10px;
    }
    .stockOutReport_title{
        height: 40px;
        margin:0 10px;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #dbdbdb;
    }
    .stockOutReport_search{
        border: 1px solid #dbdbdb;
        padding: 10px;
        margin: 10px 10px 0 10px;
    }
    .salesReport_search .el-form-item__label{
        font-size: 12px;
    }
    .stockOutReport_content{
        padding: 10px;
    }
    .stockOutReport_toolBar{
        height: 30px;
        width: 100%;
        margin: 5px 0;
    }
    .stockOutReport_toolBar .stockOutReport_toolBar_title{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
        float: left;
    }
    .stockOutReport_toolBar .stockOutReport_toolBar_exportList{
        margin-left: 10px;
        float: right;
    }
    .stockOutReport_toolBar .stockOutReport_toolBar_totalList{
        float: right;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }
    .page_box {
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
