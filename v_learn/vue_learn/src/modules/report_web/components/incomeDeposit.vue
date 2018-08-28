<template>
    <div>
        <el-row class="tac">
            <el-col :span="4">
                <report-menu :extendOptions.sync="extendOptions"></report-menu>
            </el-col>
            <el-col :span="20">
                <div class="incomeDeposit_box">
                    <div class="incomeDeposit_title">Income Deposit</div>
                    <div class="incomeDeposit_search">
                        <el-form :model="searchForm" class="incomeDeposit_form" :inline="true">
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item  class="createdDateList">
                                        <label class="form_label">Date Created</label>
                                        <el-date-picker type="date"
                                                        :editable="false"
                                                        :clearable="true"
                                                        :picker-options="searchForm.createdBeginPickerOptions"
                                                        v-model.trim="searchForm.createdBeginToTime"
                                                        format="dd/MM/yyyy"
                                                        size="small"
                                                        placeholder="DD/MM/YYYY" style="width:33%;">
                                        </el-date-picker>
                                        <label class="col_datepicker_label" style="width:5%;text-align:center;">-</label>
                                        <el-date-picker type="date"
                                                        :editable="false"
                                                        :clearable="true"
                                                        :picker-options="searchForm.createdEndPickerOptions"
                                                        v-model.trim="searchForm.createdEndToTime"
                                                        format="dd/MM/yyyy"
                                                        size="small"
                                                        placeholder="DD/MM/YYYY" style="width:33%;">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="Status">
                                        <el-select size="small" v-model="searchForm.status" placeholder="Select Status">
                                            <el-option
                                              v-for="item in statusData"
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="Process ID">
                                        <el-input size="small" v-model.trim="searchForm.processId"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item  class="searchDateList">
                                        <label class="form_label">Date of Sales</label>
                                        <el-date-picker type="date"
                                                        :editable="false"
                                                        :clearable="true"
                                                        :picker-options="searchForm.salesBeginPickerOptions"
                                                        v-model.trim="searchForm.salesBeginToTime"
                                                        format="dd/MM/yyyy"
                                                        size="small"
                                                        placeholder="DD/MM/YYYY" style="width:33%;">
                                        </el-date-picker>
                                        <label class="col_datepicker_label" style="width:5%;text-align:center;">-</label>
                                        <el-date-picker type="date"
                                                        :editable="false"
                                                        :clearable="true"
                                                        :picker-options="searchForm.salesEndPickerOptions"
                                                        v-model.trim="searchForm.salesEndToTime"
                                                        format="dd/MM/yyyy"
                                                        size="small"
                                                        placeholder="DD/MM/YYYY" style="width:33%;">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item label="Store">
                                        <el-select size="small" v-model="searchForm.store" clearable placeholder="Select store">
                                            <el-option
                                              v-for="item in storesData"
                                              :key="item.storeId"
                                              :label="item.storeName"
                                              :value="item.storeId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading" @click="searchIncomeDepositList('1')">Search</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-button @click="createDialogEvt" type="default" size="small" icon="el-icon-plus">Created a New Process</el-button>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="incomeDeposit_list">
                        <div class="incomeDeposit_list_toolBar">
                            <div class="incomeDeposit_list_title">Process List</div>
                        </div>
                        <div v-loading="loadingTable" element-loading-text="Loading">
                            <el-table :data="incomeDepositListData.list" style="width: 100%;font-size: 12px;" :default-sort="{ prop: 'updateTime',order: 'descending' }" class="salesReport_list_table">
                                <el-table-column type="index" label="No." align="center"></el-table-column>
                                <el-table-column prop="processId" label="Process ID" align="left"></el-table-column>
                                <el-table-column prop="storeName" label="Store" align="left" width="105px"></el-table-column>
                                <el-table-column prop="salesDate" label="Date of Sales" width="95px" align="center">
                                    <template slot-scope="scope">
                                        {{ scope.row.salesDate | formatDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="depositAmount" label="Deposit" align="right" width="105px">
                                    <template slot-scope="scope">
                                        {{ scope.row.depositAmount | formatNumber }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="depositDate" label="Date of Deposit" width="120px" class-name="list_width" align="center">
                                    <template slot-scope="scope">
                                        {{ scope.row.depositDate | formatDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="Status" width="85px" align="center"></el-table-column>
                                <el-table-column prop="updateTime" label="Date Last Modified" align="center" width="135px">
                                    <template slot-scope="scope">
                                        {{ scope.row.updateTime | formatShowData }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="updateUser" label="Operator Last Modified" width="105px" class-name="list_width" align="left">
                                  <template slot-scope="scope">
                                    {{ scope.row.updateUser }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="Operation" align="left" width="140px">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.status == 'Created' || scope.row.status == 'Contradicted'">
                                            <el-button type="text" @click="editDialogEvt(scope.row)" size="small">Edit</el-button>
                                            <el-button type="text" @click="submitDialogEvt(scope.row)" size="small">Submit</el-button>
                                            <el-button type="text" @click="deleteDialogEvt(scope.row)" size="small">Delete</el-button>
                                        </div>
                                        <div v-if="scope.row.status == 'Submitted' || scope.row.status == 'Affirmed'">
                                            <el-button type="text" @click="viewDialogEvt(scope.row)" size="small">View</el-button>
                                        </div>
                                    </template>
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
        <submit-dialog v-if="submitDialogVisible" :dataVisible.sync="submitDialogVisible" :extendOptions.sync="extendOptions" v-on:refreshProcess="getProcessEvt"></submit-dialog>
        <operator-dialog v-if="operatorDialogVisible" :dataVisible.sync="operatorDialogVisible" :extendOptions.sync="extendOptions" v-on:refreshProcess="getProcessEvt"></operator-dialog>
    </div>
</template>
<script>
import Utils from '~utils/index'
import ReportApi from '~api/reportapi'
import reportMenu from '~report-common/reportMenu.vue'
import submitDialog from '~report-common/submitDialog.vue'
import operatorDialog from '~report-common/operatorDialog.vue'
import { incomeMixin } from '~report-common/reportMixins'
import {mapState} from 'vuex'
import * as types from '~store/mutation-types'

export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            statusData: [{
                id: '',
                name: 'All'
            }, {
                id: '0',
                name: 'Created'
            }, {
                id: '2',
                name: 'Submitted'
            }, {
                id: '1',
                name: 'Affirmed'
            }, {
                id: '-1',
                name: 'Contradicted'
            }],
            storesData: [],
            loadingTable: false,
            submitDialogVisible: false,
            operatorDialogVisible: false,
            searchForm: {
                searchLoading: false,
                store: '',
                processId: '',
                status: '',
                createdEndToTime: '',
                createdBeginToTime: '',
                salesBeginToTime: '',
                salesEndToTime: '',
                salesDateBegin: '',
                salesDateEnd: '',
                depositDateBegin: '',
                depositDateEnd: '',
                pageSize: 15,
                curpage: 1,
                salesEndPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                },
                salesBeginPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                },
                createdBeginPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                },
                createdEndPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                }
            },
            extendOptions: {
                id: '',
                dataType: '',
                dataStatus: '',
                urlPermiss: 'incomeDeposit'
            },
            incomeDepositListData: {
                list: [],
                pageMap: {
                    pageNum: 1,
                    pageSize: 15,
                    pages: 0,
                    total: 0,
                    startRow: 0,
                    endRow: 0
                }
            }
        }
    },
    components: {
        reportMenu,
        submitDialog,
        operatorDialog
    },
    mixins: [incomeMixin],
    created () {
        let t = this
        this.searchIncomeDepositList('1')

        ReportApi.queryStoreGroupList({
            type: 'SALE'
        }).then(d => {
            if (d.success == true) {
                if (d.data && d.data.length) {
                    t.storesData.splice(0)
                    d.data.forEach(function (elem) {
                        t.storesData = t.storesData.concat(elem.storeList)
                    })
                } else {
                    t.storesData = []
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })

        // update red pointer by enter in this page
        ReportApi.updateNoticesAsRead().then(d => {
            if (d.success == true) {
                if (d.data) {
                    this.$store.commit(types.TOTAL_INCOME_MESSAGE, d.data.StoreManager || 0)
                    this.$store.commit(types.TOTAL_AUDIT_MESSAGE, d.data.Auditor || 0)
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })
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
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow'
        ])
    },
    methods: {
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        compareDateEvt (begin, end) {
            var date = null

            if (typeof end == 'number') {
                date = end
            } else {
                date = (new Date(end)).getTime()
            }

            if (typeof begin == 'number') {
                if (begin <= date) {
                    return true
                } else {
                    return false
                }
            } else {
                if ((new Date(begin)).getTime() <= date) {
                    return true
                } else {
                    return false
                }
            }
        },
        setFromDateEvt (beginDate) {
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
        beginDateChangeEvt (newVal) {
            return newVal ? Utils.getServerTimestamp(newVal) : ''
        },
        getParams () {
            this.searchForm.salesDateBegin = this.searchForm.salesBeginToTime ? this.beginDateChangeEvt(this.setFromDateEvt(this.searchForm.salesBeginToTime)) : 0
            this.searchForm.salesDateEnd = this.searchForm.salesEndToTime ? this.beginDateChangeEvt(this.setEndDateEvt(this.searchForm.salesEndToTime)) : 0
            this.searchForm.depositDateBegin = this.searchForm.createdBeginToTime ? this.beginDateChangeEvt(this.setFromDateEvt(this.searchForm.createdBeginToTime)) : 0
            this.searchForm.depositDateEnd = this.searchForm.createdEndToTime ? this.beginDateChangeEvt(this.setEndDateEvt(this.searchForm.createdEndToTime)) : 0

            return {
                salesDateBegin: this.searchForm.salesDateBegin,
                salesDateEnd: this.searchForm.salesDateEnd,
                depositDateBegin: this.searchForm.depositDateBegin,
                depositDateEnd: this.searchForm.depositDateEnd,
                shopId: this.searchForm.store,
                status: this.searchForm.status,
                processId: this.searchForm.processId,
                pageSize: this.searchForm.pageSize,
                rawOffset: this.zoneOffset
            }
        },
        getProcessEvt () {
            this.searchIncomeDepositList('1')
        },
        searchIncomeDepositList (params, isOnlyList = false) {
            var t = this
            if (!this.compareDateEvt(this.getParams().depositDateBegin, this.getParams().depositDateEnd)) {
                this.$message.error("Date created start date can't be greater than end date.")

                return false
            }
            if (!this.compareDateEvt(this.getParams().salesDateBegin, this.getParams().salesDateEnd)) {
                this.$message.error("Sales date Start date can't be greater than end date.")

                return false
            }

            var paramsContent = Object.assign({}, this.getParams(), {
                pageNum: params || this.searchForm.curpage,
                isOnlyList: isOnlyList
            })
            this.searchForm.searchLoading = true
            this.loadingTable = true
            this.$getCommonPageListApi(ReportApi.findAccountCheckingSheets, paramsContent, d => {
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
        createDialogEvt () {
            this.extendOptions.dataType = 'Create'
            this.extendOptions.id = ''
            this.operatorDialogVisible = true
        },
        editDialogEvt (data) {
            if (!data.id) {
                return false
            }
            this.extendOptions.dataType = 'Edit'
            this.extendOptions.id = data.id
            this.extendOptions.dataStatus = data.status
            this.operatorDialogVisible = true
        },
        submitDialogEvt (data) {
            if (!data.id) {
                return false
            }
            this.extendOptions.id = data.id
            this.extendOptions.dataStatus = data.status
            this.extendOptions.dataType = 'Submit'
            this.submitDialogVisible = true
        },
        deleteDialogEvt (data) {
            this.$confirm('Are you sure to Delete this process?', 'Delete Process', {
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Delete',
                closeOnClickModal: false,
                cancelButtonClass: 'cancelCustomClass',
                confirmButtonClass: 'confirmCustomClass',
                customClass: 'customDeleteClass',
                type: 'warning'
            }).then(() => {
                ReportApi.delAccountCheckingSheet({
                    id: data.id
                }).then(d => {
                    if (d.success == true) {
                        this.$message({
                            type: 'success',
                            message: d.data
                        })
                        this.getProcessEvt()
                    } else {
                        this.$showErrorMessage(d.message)
                    }
                }).catch(err => {
                    this.$showErrorMessage(err)
                })
            }).catch(() => {

            })
        },
        viewDialogEvt (data) {
            if (!data.id) {
                return false
            }
            this.extendOptions.id = data.id
            this.extendOptions.dataStatus = data.status
            this.extendOptions.dataType = 'View'
            this.submitDialogVisible = true
        }
    }
}
</script>
<style>
    .list_width{
        padding-right: 5px;
        padding-left: 5px;
        word-wrap:break-word;
    }
    .cancelCustomClass{
        float: right;
        margin-left: 20px;
    }
    .confirmCustomClass{
        float: right;
    }
    .customDeleteClass .el-message-box__btns{
        clear: both;
        float: right;
    }
</style>
<style scoped>
    .incomeDeposit_box{
        background-color: #ffffff;
        margin-left:10px;
    }
    .form_label{
        font-size: 12px;
        margin-right: 10px;
        color: #48616A;
    }
    .incomeDeposit_title{
        height: 40px;
        margin:0 10px;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #dbdbdb;
    }
    .incomeDeposit_search{
        border: 1px solid #dbdbdb;
        padding: 10px;
        margin: 10px 10px 0 10px;
    }
    .incomeDeposit_list{
      padding: 10px;
    }
    .incomeDeposit_list_toolBar{
        height: 30px;
        width: 100%;
        margin: 5px 0;
    }
    .incomeDeposit_list_toolBar .incomeDeposit_list_title{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
        float: left;
    }
    .page_list_box{
        margin: 15px 0;
        float: right;
        margin-right: -5px;
    }
</style>
