<template>
  <div>
      <el-row class="tac">
          <el-col :span="4">
              <report-menu :extendOptions.sync="extendOptions"></report-menu>
          </el-col>
          <el-col :span="20">
              <div class="auditIncomeDeposit_box">
                  <div class="auditIncomeDeposit_title">Audit Income Deposit</div>
                      <div class="auditIncomeDeposit_search">
                          <el-form :model="searchForm" class="auditIncomeDeposit_form" :inline="true">
                              <el-row>
                                  <el-col :span="6">
                                      <el-form-item label="Group">
                                          <el-select style="width: 170px" size="small" v-model="searchForm.group" @clear="clearGroupEvt" @change="changeGroupEvt" clearable placeholder="Select Group">
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
                                  <el-col :span="6">
                                      <el-form-item label="Status">
                                          <el-select style="width: 170px" size="small" v-model="searchForm.status" placeholder="Select Status">
                                              <el-option
                                                  v-for="item in statusData"
                                                  :key="item.statusId"
                                                  :label="item.statusName"
                                                  :value="item.statusId">
                                              </el-option>
                                          </el-select>
                                      </el-form-item>
                                  </el-col>
                                  <el-col :span="6">
                                      <el-form-item label="Process ID">
                                          <el-input style="width: 160px" size="small" v-model.trim="searchForm.processId"></el-input>
                                      </el-form-item>
                                  </el-col>
                              </el-row>
                              <el-row>
                                  <el-col :span="10">
                                      <el-form-item class="createdDateList">
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
                                  <el-col :span="10">
                                      <el-form-item class="searchDateList">
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
                                  <el-col :span="4">
                                      <el-form-item>
                                          <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading" @click="searchAuditIncomeDepositList('1')">Search</el-button>
                                      </el-form-item>
                                  </el-col>
                              </el-row>
                          </el-form>
                      </div>
                      <div class="auditIncomeDeposit_list">
                          <div class="auditIncomeDeposit_list_toolBar">
                              <div class="auditIncomeDeposit_list_title" v-if="auditIncomeDepositListData.pageMap.total > 0">
                                  Display {{ auditIncomeDepositListData.pageMap.startRow }} - {{ auditIncomeDepositListData.pageMap.endRow }} item, {{ auditIncomeDepositListData.pageMap.total }} results in total
                              </div>
                          </div>
                          <div v-loading="loadingTable" element-loading-text="Loading">
                              <el-table :data="auditIncomeDepositListData.list" style="width: 100%;font-size: 12px;" :default-sort="{ prop: 'updateTime',order: 'descending' }" class="salesReport_list_table">
                                  <el-table-column type="index" label="No." align="center"></el-table-column>
                                  <el-table-column prop="processId" label="Process ID" width="85px" align="left"></el-table-column>
                                  <el-table-column prop="storeName" label="Store" align="left"  width="120px"></el-table-column>
                                  <el-table-column prop="salesDate" label="Date of Sales" align="center">
                                      <template slot-scope="scope">
                                          {{ scope.row.salesDate | formatDate }}
                                      </template>
                                  </el-table-column>
                                  <el-table-column prop="depositAmount" label="Deposit" align="right" width="110px">
                                      <template slot-scope="scope">
                                          {{ scope.row.depositAmount | formatNumber }}
                                      </template>
                                  </el-table-column>
                                  <el-table-column prop="depositDate" label="Date of Deposit" width="120px" class-name="list_width" align="center">
                                      <template slot-scope="scope">
                                          {{ scope.row.depositDate | formatDate }}
                                      </template>
                                  </el-table-column>
                                  <el-table-column prop="status" label="Status" align="center"></el-table-column>
                                  <el-table-column prop="updateTime" label="Date Last Modified" align="center" width="135px">
                                      <template slot-scope="scope">
                                          {{ scope.row.updateTime | formatShowData }}
                                      </template>
                                  </el-table-column>
                                  <el-table-column prop="updateUser" label="Operator Last Modified" width="110px" class-name="list_width" align="left">
                                      <template slot-scope="scope">
                                          {{ scope.row.updateUser }}
                                      </template>
                                  </el-table-column>
                                  <el-table-column label="Operation" align="left" width="100px">
                                      <template slot-scope="scope">
                                          <div v-if="scope.row.status == 'Submitted'">
                                              <el-button type="text" @click="auditDialogEvt(scope.row)" size="small">Audit</el-button>
                                          </div>
                                          <div v-if="scope.row.status == 'Affirmed' || scope.row.status == 'Contradicted'">
                                              <el-button type="text" @click="viewDialogEvt(scope.row)" size="small">View</el-button>
                                          </div>
                                      </template>
                                  </el-table-column>
                              </el-table>
                              <div class="page_list_box" v-if="auditIncomeDepositListData.list && auditIncomeDepositListData.list.length">
                                  <el-pagination
                                      layout="prev, pager, next, jumper"
                                      :total="auditIncomeDepositListData.pageMap.total"
                                      :page-size="auditIncomeDepositListData.pageMap.pageSize"
                                      :current-page.sync="auditIncomeDepositListData.pageMap.pageNum"
                                      @current-change="searchAuditIncomeDepositList(auditIncomeDepositListData.pageMap.pageNum, true)">
                                  </el-pagination>
                              </div>
                              <div style="clear: both;"></div>
                          </div>
                      </div>
                  </div>
              </el-col>
        </el-row>
        <submit-dialog v-if="submitDialogVisible" :dataVisible.sync="submitDialogVisible" :extendOptions.sync="extendOptions"></submit-dialog>
        <audit-dialog v-if="auditDialogVisible" :dataVisible.sync="auditDialogVisible" :extendOptions.sync="extendOptions" v-on:refreshProcess="getProcessEvt"></audit-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import ReportApi from '~api/reportapi'
import reportMenu from '~report-common/reportMenu.vue'
import submitDialog from '~report-common/submitDialog.vue'
import auditDialog from '~report-common/auditDialog.vue'
import { incomeMixin } from '~report-common/reportMixins'
import {mapState} from 'vuex'
import * as types from '~store/mutation-types'

export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            statusData: [{
                statusId: '',
                statusName: 'All'
            }, {
                statusName: 'Submitted',
                statusId: '2'
            }, {
                statusName: 'Affirmed',
                statusId: '1'
            }, {
                statusName: 'Contradicted',
                statusId: '-1'
            }],
            groupData: [],
            storesData: [],
            loadingTable: false,
            submitDialogVisible: false,
            auditDialogVisible: false,
            searchForm: {
                searchLoading: false,
                store: '',
                salesEndToTime: '',
                createdEndToTime: '',
                salesBeginToTime: '',
                createdBeginToTime: '',
                salesEndToDate: '',
                createdEndToDate: '',
                salesBeginToDate: '',
                createdBeginToDate: '',
                salesEndPickerOptions: {
                    disabledDate (date) {
                        if(date > _this.getCompareDate(new Date(), compareFormat) || date < _this.getCompareDate(_this.getLessThreeMonth(new Date()), compareFormat)){
                            return true
                        }

                        return false
                    }
                },
                salesBeginPickerOptions: {
                    disabledDate (date) {
                        if(date > _this.getCompareDate(new Date(), compareFormat) || date < _this.getCompareDate(_this.getLessThreeMonth(new Date()), compareFormat)){
                            return true
                        }

                        return false
                    }
                },
                createdBeginPickerOptions: {
                    disabledDate (date) {
                        if(date > _this.getCompareDate(new Date(), compareFormat) || date < _this.getCompareDate(_this.getLessThreeMonth(new Date()), compareFormat)){
                            return true
                        }

                        return false
                    }
                },
                createdEndPickerOptions: {
                    disabledDate (date) {
                        if(date > _this.getCompareDate(new Date(), compareFormat) || date < _this.getCompareDate(_this.getLessThreeMonth(new Date()), compareFormat)){
                            return true
                        }

                        return false
                    }
                },
                status: '',
                processId: '',
                group: '',
                pageSize: 15,
                curpage: 1
            },
            extendOptions: {
                dataType: '',
                dataStatus: '',
                urlPermiss: 'auditIncomeDeposit'
            },
            auditIncomeDepositListData: {
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
        auditDialog
    },
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow'
        ])
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
        this.getProcessEvt()
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
        getProcessEvt () {
            this.searchAuditIncomeDepositList('1')
        },
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
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        getLessThreeMonth (d) {
            if (d.getMonth() - 3 <= 0) {
                return new Date((d.getFullYear() - 1), (d.getMonth() + 9), d.getDate())
            } else {
                return new Date(d.getFullYear(), d.getMonth() - 3, d.getDate())
            }
        },
        searchAuditIncomeDepositList (params, isOnlyList = false) {
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
            this.$getCommonPageListApi(ReportApi.findAuditAccountCheckingSheets, paramsContent, d => {
                if (d.data && d.data.list && d.data.list.length) {
                    t.auditIncomeDepositListData.list.splice(0)
                    t.auditIncomeDepositListData.list = t.auditIncomeDepositListData.list.concat(d.data.list)
                } else {
                    t.auditIncomeDepositListData.list.splice(0)
                }
                t.searchForm.curpage = d.data.pageNum
            }).then((results) => {
                this.searchForm.searchLoading = false
                this.loadingTable = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.auditIncomeDepositListData.pageMap.total = results[1].data.total
                        this.auditIncomeDepositListData.pageMap.pageSize = results[1].data.pageSize
                        this.auditIncomeDepositListData.pageMap.startRow = (this.searchForm.curpage - 1) * results[1].data.pageSize + 1
                        this.auditIncomeDepositListData.pageMap.endRow = results[1].data.pageSize * this.searchForm.curpage > results[1].data.total ? results[1].data.total : results[1].data.pageSize * this.searchForm.curpage
                    } else {
                        this.auditIncomeDepositListData.pageMap.total = this.auditIncomeDepositListData.pageMap.pageSize * this.searchForm.curpage
                    }
                }
            })
        },
        auditDialogEvt (data) {
            if (!data.id) {
                return false
            }
            this.extendOptions.id = data.id
            this.extendOptions.dataStatus = data.status
            this.extendOptions.dataType = 'Audit'
            this.auditDialogVisible = true
        },
        viewDialogEvt (data) {
            if (!data.id) {
                return false
            }
            this.extendOptions.id = data.id
            this.extendOptions.dataStatus = data.status
            this.extendOptions.dataType = 'View'
            this.submitDialogVisible = true
        },
        beginDateChangeEvt (newVal) {
            return newVal ? Utils.getServerTimestamp(newVal) : ''
        },
        getParams () {
            this.searchForm.salesBeginToDate = this.searchForm.salesBeginToTime ? this.beginDateChangeEvt(this.setFromDateEvt(this.searchForm.salesBeginToTime)) : 0
            this.searchForm.salesEndToDate = this.searchForm.salesEndToTime ? this.beginDateChangeEvt(this.setEndDateEvt(this.searchForm.salesEndToTime)) : 0
            this.searchForm.createdBeginToDate = this.searchForm.createdBeginToTime ? this.beginDateChangeEvt(this.setFromDateEvt(this.searchForm.createdBeginToTime)) : 0
            this.searchForm.createdEndToDate = this.searchForm.createdEndToTime ? this.beginDateChangeEvt(this.setEndDateEvt(this.searchForm.createdEndToTime)) : 0

            return {
                group: this.searchForm.group,
                shopId: this.searchForm.store,
                status: this.searchForm.status,
                processId: this.searchForm.processId,
                depositDateBegin: this.searchForm.createdBeginToDate,
                depositDateEnd: this.searchForm.createdEndToDate,
                salesDateBegin: this.searchForm.salesBeginToDate,
                salesDateEnd: this.searchForm.salesEndToDate,
                pageSize: this.searchForm.pageSize,
                rawOffset: this.zoneOffset
            }
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
</style>
<style scoped>
  .auditIncomeDeposit_box{
      background-color: #ffffff;
      margin-left:10px;
  }
  .form_label{
      font-size: 12px;
      margin-right: 10px;
      color: #48616A;
  }
  .auditIncomeDeposit_title{
      height: 40px;
      margin:0 10px;
      line-height: 40px;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid #dbdbdb;
  }
  .auditIncomeDeposit_search{
      border: 1px solid #dbdbdb;
      padding: 10px;
      margin: 10px 10px 0 10px;
  }
  .auditIncomeDeposit_list{
      padding: 10px;
  }
  .auditIncomeDeposit_list_toolBar{
      height: 30px;
      width: 100%;
      margin: 5px 0;
  }
  .auditIncomeDeposit_list_toolBar .auditIncomeDeposit_list_title{
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
