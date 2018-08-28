<template>
    <div>
        <div class="search_box">
            <el-row type="flex">
                <el-col :span="6" class="col_box">
                    <label>IMEI</label>
                    <el-input v-model.trim="search.imei"></el-input>
                </el-col>
                <el-col :span="6" class="col_box">
                    <label>From</label>
                    <el-date-picker type="date"
                                    size="small"
                                    :picker-options="search.fromPickerOptions"
                                    v-model="search.fromTime"
                                    format="dd/MM/yyyy"
                                    placeholder="DD/MM/YYYY">
                    </el-date-picker>
                </el-col>
                <el-col :span="6" class="col_box">
                    <label>To</label>
                    <el-date-picker type="date"
                                    size="small"
                                    format="dd/MM/yyyy"
                                    :picker-options="search.toPickerOptions"
                                    v-model="search.toTime"
                                    placeholder="DD/MM/YYYY">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-button class="button" :loading="search.loading" @click="getLogs" type="primary"
                               icon="el-icon-search">
                        Search
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div class="container" v-loading="search.loading">
            <div class="list_box">
                <el-table :data="list"
                          style="width: 100%"
                          @sort-change="sortLogList"
                          :default-sort="{prop: 'createTime', order: 'descending'}"
                          empty-text="There is no IMEI Modification Logs data."
                          :row-class-name="tableRowClassName">
                    <el-table-column
                            type="index"
                            label="No."
                            width="70">
                    </el-table-column>
                    <el-table-column
                            prop="imei"
                            label="IMEI"
                            width="170">
                    </el-table-column>
                    <el-table-column
                            label="Description After Modification">
                        <template slot-scope="scope">
                            {{scope.row.toProductId}}
                            {{scope.row.toModel}}
                            {{scope.row.toDescription || ''}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Description Before Modification">
                        <template slot-scope="scope">
                            {{scope.row.fromProductId}}
                            {{scope.row.fromModel}}
                            {{scope.row.fromDescription || ''}}
                        </template>
                    </el-table-column>
                    <!--:sort-method="sortLastModify"-->
                    <el-table-column
                            prop="createTime"
                            label="Date Modified"
                            sortable="custom"
                            width="140">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | dateFormat}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="operator"
                            label="Operator"
                            width="120">
                    </el-table-column>
                </el-table>
            </div>
            <div class="page_box" v-if="imeiloglist.total && imeiloglist.total>0">
                <el-pagination layout="prev, pager, next, jumper"
                               :total="imeiloglist.total"
                               :page-size="imeiloglist.pageSize"
                               :current-page.sync="search.curpage"
                               @current-change="getPageLogs">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import WareHouseApi from '~api/warehouseapi'
import Utils from '~utils/index'

export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            search: {
                imei: '',
                fromTime: '',
                serverFromTime: '',
                fromPickerOptions: {
                    disabledDate: (time) => {
                        if (_this.search.toTime) {
                            return time > Utils.getPartialDate(_this.search.toTime, compareFormat)
                        }
                        return false
                    }
                },
                toTime: '',
                serverToTime: '',
                toPickerOptions: {
                    disabledDate: (time) => {
                        if (_this.search.fromTime) {
                            return time < Utils.getPartialDate(_this.search.fromTime)
                        }
                        return false
                    }
                },
                loading: false,
                curpage: 1,
                orderBy: 1 // 1表示反序；0为正序
            },
            list: [],
            imeiloglist: {
                pageNum: 1,
                pageSize: 20,
                pages: 1,
                total: 0,
                size: 0
            },
            sortLastModify (pre, cur) {
                console.log('111111111111111')
                return pre - cur > 0
            },
            isManual: false
        }
    },
    watch: {
        'search.fromTime': function (newVal) {
            this.search.serverFromTime = newVal ? Utils.getServerTimestamp(newVal) || '' : ''
        },
        'search.toTime': function (newVal) {
            if (newVal) {
                var d = Utils.parseDate(newVal)
                var newD = new Date(d.setDate(d.getDate() + 1))
                this.search.serverToTime = Utils.getServerTimestamp(newD) - 1 || ''
            } else {
                this.search.serverToTime = ''
            }
        }
    },
    methods: {
        sortLogList (col, prop, order) {
            if (col.order === 'ascending') {
                this.search.orderBy = 0
            } else {
                this.search.orderBy = 1
            }
            if (this.isNotFirstSortEvent) {
                this.getIMEILogsList(true)
            } else {
                this.isNotFirstSortEvent = true
            }
        },
        tableRowClassName (row, index) {
            if (index % 2 === 1) {
                return 'info-row'
            }
            return ''
        },
        getPageLogs () {
            // TODO: hack handle double page request!!
            if (!this.isManual) {
                this.getIMEILogsList(true)
            } else {
                this.isManual = false
            }
        },
        getLogs () {
            this.getIMEILogsList(false, 1)
        },
        getIMEILogsList (isOnlyList = false, pageIndex) {
            this.search.loading = true
            this.$getCommonPageListApi(WareHouseApi.findIMEIWithProductIdLog, {
                fromTime: this.search.serverFromTime,
                imei: this.search.imei,
                toTime: this.search.serverToTime,
                pageSize: 10,
                pageNum: pageIndex || this.search.curpage,
                isOnlyList: isOnlyList,
                orderBy: this.search.orderBy
            }, d => {
                this.list = d.data.list
                if (this.search.curpage != d.data.pageNum) {
                    this.isManual = true
                    this.search.curpage = d.data.pageNum
                }
            }).then((results) => {
                this.search.loading = false
                // 处理分页信息-****
                if (results.length > 1) {
                    if (results[1].success) {
                        this.imeiloglist.total = results[1].data.total
                        this.imeiloglist.pageSize = results[1].data.pageSize
                    } else {
                        this.imeiloglist.total = this.imeiloglist.pageSize * (this.search.curpage + 1)
                    }
                }
            })
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        }
    },
    filters: {
        dateFormat (val) {
            if (!val) return ''
            return Utils.getServerDateStrByLocal(val)
        }
    }
}
</script>
<style scoped>
    .container {
    }

    .container:after {
        content: '';
        clear: both;
        display: block;
    }

    .search_box {
        margin-bottom: 15px;
        margin-top: 15px;
    }

    .col_box {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
    }

    .col_box label {
        min-width: 40px;
        margin-bottom: 0px;
    }

    .list_box {

    }

    .info-row {
        background: #fafafa !important;
    }

    .page_box {
        margin-top: 15px;
        float: right;
        margin-right: -5px;
    }
</style>
