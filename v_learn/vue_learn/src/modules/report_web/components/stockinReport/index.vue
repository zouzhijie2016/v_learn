<template>
    <div class="stockin_box">
        <div class="search_box">
            <div class="search_title">
                Stockin Report
            </div>
            <div class="search_content">
                <el-row type="flex">
                    <el-col :span="2"  class="field_label">
                        Product
                    </el-col>
                    <el-col :span="8">
                        <el-autocomplete style="width:90%"
                                         :trigger-on-focus="suggestion.triggerOnFocus"
                                         @input="changeConditionEvt(true)"
                                         v-model.trim="search.productInfo"
                                         :fetch-suggestions="querySuggestionDebounce"
                                         @select="selectSuggession">
                            <template slot-scope="scope">
                                <div v-for="item in scope" :valueKey="item">
                                    <div class="suggestionList" v-if="item.description">{{item.productId}}:{{ item.brandName }} {{ item.internalName }} {{item.description}}</div>
                                    <div class="suggestionList" v-else>{{item.productId}}:{{ item.brandName }} {{ item.internalName }}</div>
                                </div>
                            </template>
                        </el-autocomplete>
                    </el-col>

                    <el-col :span="2" class="field_label">
                        Warehouse
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="search.warehouseId" clearable filterable
                                   placeholder="Please Select">
                            <el-option
                                    v-for="item in search.warehouseList"
                                    :key="item.facilityId"
                                    :label="item.facilityName"
                                    :value="item.facilityId">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="2" class="field_label">
                        Start Date
                    </el-col>
                    <el-col :span="8">
                        <el-date-picker type="date"
                                        size="small"
                                        :editable="false"
                                        :clearable="false"
                                        :picker-options="search.startPickerOptions"
                                        v-model.trim="search.startDate"
                                        format="dd/MM/yyyy"
                                        placeholder="DD/MM/YYYY">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="2" class="field_label">
                        End Date
                    </el-col>
                    <el-col :span="8">
                        <el-date-picker type="date"
                                        size="small"
                                        :clearable="false"
                                        :editable="false"
                                        :picker-options="search.endPickerOptions"
                                        v-model.trim="search.endDate"
                                        format="dd/MM/yyyy"
                                        placeholder="DD/MM/YYYY">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" icon="el-icon-search" @click="searchStockInReport" :loading="listLoading">
                            Search
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="table_box" >
            <div class="header_box">
                <div class="table_title">
                    Stockin Report
                </div>
                <div class="button_box">
                    <el-button type="primary" icon="el-icon-download" :loading="exportLoading" @click="exportStockInReport">Export</el-button>
                </div>
            </div>
            <div class="list_box" v-loading="listLoading" element-loading-text="Loading">
                <el-table :data="list"
                          style="width: 100%;font-size: 12px;"
                          empty-text="There is no Stockin Report data.">
                    <!--<el-table-column type="index" label="No." width="70"></el-table-column>-->
                    <el-table-column prop="productId" sortable label="ProductId" width="110">

                    </el-table-column>
                    <el-table-column prop="description" label="Description">

                    </el-table-column>
                    <el-table-column label="Unit Cost" width="110">
                        <template slot-scope="scope">
                            {{scope.row.unitCost || 0 | toDicimal}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="receiveQuantity" label="Received Quantity" width="130">
                        <template slot-scope="scope">
                            {{scope.row.receiveQuantity | toDicimal(0)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Transfer Quantity" width="130">
                        <template slot-scope="scope">
                            {{scope.row.transferQuantity | toDicimal(0)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Sales Return Quantity" width="160">
                        <template slot-scope="scope">
                            {{scope.row.returnQty | toDicimal(0)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Total Quantity" width="120">
                        <template slot-scope="scope">
                            {{+scope.row.receiveQuantity + +scope.row.returnQty+ +scope.row.transferQuantity | toDicimal(0)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="receiveTime" sortable label="Received Time" width="125">

                    </el-table-column>
                    <el-table-column prop="facilityName" sortable label="Warehouse" width="140">

                    </el-table-column>
                </el-table>
                <div class="page_box" v-if="pageInfo.total>0">
                    <el-pagination layout="prev, pager, next, jumper"
                                   :total="pageInfo.total"
                                   :page-size="pageInfo.pageSize"
                                   :current-page.sync="search.curpage"
                                   @current-change="getPageStockInReport">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import Utils from '~utils/index'
import ReportApi from '~api/reportapi'
import {download} from '~utils/custom/downloadHelper'

var dateFormat = 'yyyy/MM/dd'
export default {
    data () {
        let _this = this
        return {
            listLoading: false,
            exportLoading: false,
            search: {
                curpage: 1,
                warehouseList: [],
                productId: '',
                productInfo: '',
                startDate: null,
                endDate: null,
                warehouseId: '',
                startPickerOptions: {
                    disabledDate (d) {
                        if (_this.search.endDate) {
                            return Utils.getPartialDate(d, dateFormat) > Utils.getPartialDate(_this.search.endDate, dateFormat)
                        }
                        return false
                    }
                },
                endPickerOptions: {
                    disabledDate (d) {
                        if (_this.search.startDate) {
                            return Utils.getPartialDate(d, dateFormat) < Utils.getPartialDate(_this.search.startDate, dateFormat)
                        }
                        return false
                    }
                }
            },
            list: [],
            pageInfo: {
                pageNum: 1,
                pageSize: 15,
                pages: 1,
                total: 0,
                size: 0
            },
            suggestion: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            }
        }
    },
    created () {
        this.search.startDate = Utils.getPartialDate(new Date(+new Date() - 2 * 24 * 60 * 60 * 1000), dateFormat)
        this.search.endDate = Utils.getPartialDate(new Date(+new Date() - 24 * 60 * 60 * 1000), dateFormat)
        this.findAllPermissionFacilityApi()
        this.querySuggestionDebounce = Utils.debounce(this.querySuggestion, 500)
    },
    mounted () {
        this.queryOperatorReportDataApi()
    },
    methods: {
        searchStockInReport () {
            this.search.curpage = 1
            this.queryOperatorReportDataApi()
        },
        changeConditionEvt (data) {
            if (data) {
                this.search.productId = ''
            }
        },
        selectSuggession (item) {
            this.search.productId = item.productId
            if (item.description) {
                this.search.productInfo = item.productId + ':' + item.brandName + ' ' + item.internalName + ' ' + item.description
            } else {
                this.search.productInfo = item.productId + ':' + item.brandName + ' ' + item.internalName
            }
        },
        querySuggestion (queryString, cb) {
            if (!queryString) {
                cb([])
                return false
            }
            ReportApi.findActiveProductBykeyWordModel.getInstance().execute({
                keyWord: queryString.trim()
            }).then(d => {
                if (d.success == true) {
                    if (d.data && d.data.productInfoBOList && d.data.productInfoBOList.length) {
                        cb(d.data.productInfoBOList)
                    } else {
                        cb([])
                    }
                } else {
                    this.$message({
                        type: 'info',
                        message: 'Successfully operated',
                        showClose: true
                    })
                    cb([])
                }
            }).catch(err => {
                cb([])
                this.$showErrorMessage(err)
            })
        },
        getPageStockInReport (pageObj) {
            this.queryOperatorReportDataApi(true)
        },
        tableRowClassName (row, index) {
            if (index % 2 === 1) {
                return 'row-bg'
            }
            return ''
        },
        findAllPermissionFacilityApi () {
            ReportApi.findAllPermissionFacility.getInstance().execute({})
                .then(r => {
                    if (r.success) {
                        this.search.warehouseList = r.data
                    } else {
                        this.$showErrorMessage(r.message)
                    }
                }).catch(err => {
                    this.$showErrorMessage(err)
                })
        },
        exportStockInReport () {
            this.exportLoading = true
            ReportApi.exportXReceivedData.getInstance().execute({
                productId: this.search.productId,
                facilityId: this.search.warehouseId,
                startDate: this.getServerTimeStamp(this.search.startDate),
                endDate: this.getMaxServerTimeStamp(this.search.endDate),
                pageSize: this.pageInfo.pageSize,
                pageNum: this.search.curpage
            }, {
                progress: (progressEvent) => {}
            }).then(res => {
                this.exportLoading = false
                download(res.data, res.headers['x-filename'] || 'StockInReport.csv')
            }).catch(err => {
                this.exportLoading = false
                this.$showErrorMessage(err)
            })
        },
        queryOperatorReportDataApi (isOnlyList = false) {
            this.listLoading = true
            this.$getCommonPageListApi(ReportApi.queryReportData, {
                productId: this.search.productId,
                facilityId: this.search.warehouseId,
                startDate: this.getServerTimeStamp(this.search.startDate),
                endDate: this.getMaxServerTimeStamp(this.search.endDate),
                pageSize: this.pageInfo.pageSize,
                pageNum: this.search.curpage,
                isOnlyList: isOnlyList
            }, (d) => {
                this.list.splice(0)
                this.list = this.list.concat(d.data.list || [])
                this.search.curpage = d.data.pageNum
            }).then(results => {
                this.listLoading = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.pageInfo.total = results[1].data.total
                        this.pageInfo.pageSize = results[1].data.pageSize
                    } else {
                        this.pageInfo.total = this.pageInfo.pageSize * (this.search.curpage)
                    }
                }
            })
        },
        cancelAllRequestApi () {
            ReportApi.exportReceivedData.getInstance().abort()
            ReportApi.findActiveProductBykeyWord.getInstance().abort()
            ReportApi.findAllPermissionFacility.getInstance().abort()
        },
        getServerTimeStamp (d) {
            return d ? Utils.getServerTimestamp(d, dateFormat) || '' : ''
        },
        getMaxServerTimeStamp (d) {
            if (d) {
                d = Utils.parseDate(d)
                var newD = new Date(d.setDate(d.getDate() + 1))
                return Utils.getServerTimestamp(newD, dateFormat) - 1 || ''
            }
            return ''
        }
    },
    destoryed () {
        this.cancelAllRequestApi()
    },
    deactivated () {
        this.cancelAllRequestApi()
    }
}
</script>
<style scoped>

    .stockin_box {
        overflow: hidden;
        position: relative;
        padding-left: 10px;
        padding-right: 10px;
    }

    .stockin_box .search_box {
        background: #fff;
        overflow: hidden;
        min-height: 100px;
        padding: 10px 20px 10px 20px;
    }

    .search_box .el-select, .search_box .el-input {
        width: 90%;
    }

    .search_box .el-row {
        margin-top: 10px;
    }

    .search_box .search_title {
        height: 30px;
        width: 100%;
        line-height: 30px;
        font-size: 16px;
        color: #424242;
        display: inline-block;
        margin-bottom: 5px;
    }

    .search_box .search_content {
        border: 1px solid rgb(223, 234, 236);
        padding: 10px;
    }

    .search_box .field_label{
        line-height: 30px;
        height: 30px;
        font-weight: bold;
    }


    .stockin_box .table_box {
        margin-top: 10px;
        background: #fff;
        overflow: hidden;
        min-height: 100px;
        padding: 10px 20px 10px 20px;
    }

    .table_box .header_box {
        margin-bottom: 5px;
        overflow: hidden;
    }

    .header_box .table_title {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        color: #424242;
        display: inline-block;
    }

    .header_box .button_box {
        float: right;
    }

    .table_box .list_box {
        overflow: hidden;
        display: block;
    }

    .table_box .row-bg {
        background: #fafafa !important;
    }

    .table_box .page_box {
        margin-top: 15px;
        float: right;
    }
    .suggestionList{
        text-overflow: ellipsis;
        overflow: hidden;
        width:100%;
    }
</style>
