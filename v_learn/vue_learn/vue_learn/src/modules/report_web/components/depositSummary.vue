<template>
    <div>
        <el-row class="tac">
            <el-col :span="4">
                <report-menu :extendOptions.sync="extendOptions"></report-menu>
            </el-col>
            <el-col :span="20">
                <div class="depositSummary_box">
                    <div class="depositSummary_title">Deposit Summary</div>
                    <div class="depositSummary_search">
                        <el-form :model="searchForm" class="depositSummary_form" :inline="true">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="Groups">
                                        <el-select style="width: 170px" size="small" v-model="searchForm.group" @clear="clearGroupEvt" @change="changeGroupEvt" clearable placeholder="Select Groups">
                                            <el-option
                                                v-for="item in groupData"
                                                :key="item.storeGroupId"
                                                :label="item.storeGroupName"
                                                :value="item.storeGroupId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="Store">
                                        <el-select style="width: 170px" size="small" v-model="searchForm.store" clearable placeholder="Select Store">
                                            <el-option
                                                v-for="item in storesData"
                                                :key="item.storeId"
                                                :label="item.storeName"
                                                :value="item.storeId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item class="searchDateList">
                                        <label class="form_label">Date of Sales</label>
                                        <el-date-picker type="date"
                                                        :editable="false"
                                                        :clearable="false"
                                                        :picker-options="searchForm.salesBeginPickerOptions"
                                                        v-model.trim="searchForm.salesBeginToTime"
                                                        format="dd/MM/yyyy"
                                                        size="small"
                                                        placeholder="DD/MM/YYYY" style="width:33%;">
                                        </el-date-picker>
                                        <label class="col_datepicker_label" style="width:5%;text-align:center;">-</label>
                                        <el-date-picker type="date"
                                                        :editable="false"
                                                        :clearable="false"
                                                        :picker-options="searchForm.salesEndPickerOptions"
                                                        v-model.trim="searchForm.salesEndToTime"
                                                        format="dd/MM/yyyy"
                                                        size="small"
                                                        placeholder="DD/MM/YYYY" style="width:33%;">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <el-form-item>
                                        <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading" @click="searchIncomeDepositList('1')">Search</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="depositSummary_list">
                        <div class="depositSummary_list_toolBar">
                            <div class="depositSummary_list_title">Summary</div>
                            <div class="exportList">
                                <el-button type="primary" size="small" icon="el-icon-download" :loading="searchForm.loadingExportTable" @click="exportProductList">Export</el-button>
                            </div>
                            <div class="totalList" v-if="incomeDepositListData.pageMap.total > 0">
                                Display {{ incomeDepositListData.pageMap.startRow }} - {{ incomeDepositListData.pageMap.endRow }} item, {{ incomeDepositListData.pageMap.total }} results in total
                            </div>
                        </div>
                        <div v-loading="loadingTable" element-loading-text="Loading">
                            <el-table :data="incomeDepositListData.list" style="width: 100%;font-size: 12px;" :default-sort="{ prop: 'storeName',order: 'descending' }" class="salesReport_list_table">
                                <el-table-column type="index" label="No." align="center"></el-table-column>
                                <el-table-column prop="storeName" label="Store" align="left"></el-table-column>
                                <el-table-column label="Date of Sales" align="center">
                                    <template slot-scope="scope">
                                      {{ scope.row.salesDateBegin | formatDate }} - {{ scope.row.salesDateEnd | formatDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="receivable" label="Receivable" align="right">
                                    <template slot-scope="scope">
                                        {{ scope.row.receivable | formatNumber }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="affirmedDeposit" label="Affirm Deposit" align="right">
                                    <template slot-scope="scope">
                                        {{ scope.row.affirmedDeposit | formatNumber }}
                                    </template>
                                </el-table-column>
                                <el-table-column  label="Receivable minus Affirmed" align="right">
                                    <template slot-scope="scope">
                                      {{ (scope.row.receivable - scope.row.affirmedDeposit) | formatNumber }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="affirmCount" label="Affirm Count" align="right" width="110px">
                                </el-table-column>
                            </el-table>
                            <div class="page_list_box" v-if="incomeDepositListData.list && incomeDepositListData.list.length">
                                <el-pagination
                                  layout="prev, pager, next, jumper"
                                  :total="incomeDepositListData.pageMap.total"
                                  :page-size="incomeDepositListData.pageMap.pageSize"
                                  :current-page.sync="incomeDepositListData.pageMap.pageNum"
                                  @current-change="searchIncomeDepositList(incomeDepositListData.pageMap.pageNum, true)">
                                </el-pagination>
                            </div>
                            <div style="clear: both;"></div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import ReportApi from '~api/reportapi'
import reportMenu from '~report-common/reportMenu.vue'
import { incomeMixin } from '~report-common/reportMixins'
import Utils from '~utils/index'
import {mapState} from 'vuex'
import {download} from '~utils/custom/downloadHelper'
import * as types from '~store/mutation-types'

export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            groupData: [],
            storesData: [],
            loadingTable: false,
            searchForm: {
                searchLoading: false,
                loadingExportTable: false,
                store: '',
                group: '',
                salesEndToTime: '',
                salesBeginToTime: '',
                pageSize: 10,
                curpage: 1,
                salesEndPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date())
                    }
                },
                salesBeginPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date())
                    }
                }
            },
            extendOptions: {
                dataType: '',
                urlPermiss: 'depositSummary'
            },
            incomeDepositListData: {
                list: [],
                pageMap: {
                    pageNum: 1,
                    pageSize: 10,
                    pages: 0,
                    total: 0,
                    startRow: 0,
                    endRow: 0
                }
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
                    this.groupData.splice(0)
                    this.groupData = this.groupData.concat(d.data)
                } else {
                    this.groupData = []
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })
    },
    mounted () {
        this.searchForm.salesBeginToTime = this.setBeginDateEvt(new Date((new Date()).setDate(1)))
        this.searchForm.salesEndToTime = this.setEndDateEvt(new Date())

        console.log(this.searchForm.salesBeginToTime, this.searchForm.salesEndToTime)

        this.searchIncomeDepositList('1')
    },
    filters: {
        formatNumber (value) {
            if (!value) {
                return value
            }
            value = (value - 0).toFixed(2)
            return Utils.formatToThousands(value)
        },
        formatDate (val) {
            if (!val) {
                return val
            }
            return Utils.getServerDateStrByLocal(val, 'dd/MM/yyyy')
        },
        formatShowData (val) {
            if (!val) {
                return val
            }
            return Utils.getServerDateStrByLocal(val, 'dd/MM/yyyy hh:mm:ss')
        }
    },
    methods: {
        changeGroupEvt (value) {
            if (this.groupData.length) {
                this.groupData.forEach((data) => {
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
        setBeginDateEvt (beginDate) {
            beginDate.setHours(0)
            beginDate.setMinutes(0)
            beginDate.setSeconds(0)
            beginDate.setMilliseconds(0)

            return beginDate
        },
        setEndDateEvt (endDate) {
            endDate.setHours(23)
            endDate.setMinutes(59)
            endDate.setSeconds(59)
            endDate.setMilliseconds(0)

            return endDate
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        searchIncomeDepositList (params, isOnlyList = false) {
            var t = this

            if (!this.compareDateEvt()) {
                this.$message.error("Start date can't be greater than end date.")

                return false
            }
            var paramsContent = Object.assign({}, this.getParams(), {
                pageNum: params || this.searchForm.curpage,
                isOnlyList: isOnlyList
            })
            this.searchForm.searchLoading = true
            this.loadingTable = true
            this.$getCommonPageListApi(ReportApi.findDepositSummary, paramsContent, d => {
                if (d.data && d.data.list && d.data.list.length) {
                    t.incomeDepositListData.list.splice(0)
                    t.incomeDepositListData.list = t.incomeDepositListData.list.concat(d.data.list)
                } else {
                    t.incomeDepositListData.list.splice(0)
                }
                t.searchForm.curpage = d.data.pageNum
            }).then((results) => {
                this.searchForm.searchLoading = false
                this.loadingTable = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.incomeDepositListData.pageMap.total = results[1].data.total
                        this.incomeDepositListData.pageMap.pageSize = results[1].data.pageSize
                        this.incomeDepositListData.pageMap.startRow = (this.searchForm.curpage - 1) * results[1].data.pageSize + 1
                        this.incomeDepositListData.pageMap.endRow = results[1].data.pageSize * this.searchForm.curpage > results[1].data.total ? results[1].data.total : results[1].data.pageSize * this.searchForm.curpage
                    } else {
                        this.incomeDepositListData.pageMap.total = this.incomeDepositListData.pageMap.pageSize * this.searchForm.curpage
                    }
                }
            })
        },
        exportProductList () {
            if (!this.compareDateEvt()) {
                this.$message.error("Start date can't be greater than end date.")

                return false
            }
            this.searchForm.loadingExportTable = true
            ReportApi.exportDepositSummary(this.getParams(), {
                progress: (progressEvent) => {}
            }).then(res => {
                this.searchForm.loadingExportTable = false
                download(res.data, res.headers['x-filename'] || 'DepositSummary.csv')
            }).catch(err => {
                this.searchForm.loadingExportTable = false
                this.$showErrorMessage(err)
            })
        },
        compareDateEvt () {
            var date = null

            if (typeof this.searchForm.salesEndToTime == 'number') {
                date = this.searchForm.salesEndToTime
            } else {
                date = (new Date(this.searchForm.salesEndToTime)).getTime()
            }

            if (typeof this.searchForm.salesBeginToTime == 'number') {
                if (this.searchForm.salesBeginToTime <= date) {
                    return true
                } else {
                    return false
                }
            } else {
                if ((new Date(this.searchForm.salesBeginToTime)).getTime() <= date) {
                    return true
                } else {
                    return false
                }
            }
        },
        getServerTimeStamp (newVal) {
            return newVal ? Utils.getServerTimestamp(newVal) : 0
        },
        getParams () {
            return {
                shopId: this.searchForm.store,
                group: this.searchForm.group,
                salesDateBegin: this.getServerTimeStamp(this.setBeginDateEvt(this.searchForm.salesBeginToTime)),
                salesDateEnd: this.getServerTimeStamp(this.setEndDateEvt(this.searchForm.salesEndToTime)),
                rawOffset: this.zoneOffset,
                pageSize: this.searchForm.pageSize
            }
        }
    },
    computed: {
        ...mapState([
            'zoneOffset',
            'timeNow'
        ])
    }
}
</script>
<style scoped>
    .depositSummary_box{
        background-color: #ffffff;
        margin-left:10px;
    }
    .form_label{
        font-size: 12px;
        margin-right: 10px;
        color: #48616A;
    }
    .depositSummary_title{
        height: 40px;
        margin:0 10px;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #dbdbdb;
    }
    .depositSummary_search{
        border: 1px solid #dbdbdb;
        padding: 10px;
        margin: 10px 10px 0 10px;
    }
    .depositSummary_list{
        padding: 10px;
    }
    .depositSummary_list_toolBar{
        height: 30px;
        width: 100%;
        margin: 5px 0;
    }
    .depositSummary_list_toolBar .depositSummary_list_title{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
        float: left;
    }
    .depositSummary_list_toolBar .totalList{
        float: right;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }
    .depositSummary_list_toolBar .exportList{
        margin-left: 10px;
        float: right;
    }
    .page_list_box{
        margin: 15px 0;
        float: right;
        margin-right: -5px;
    }
</style>
