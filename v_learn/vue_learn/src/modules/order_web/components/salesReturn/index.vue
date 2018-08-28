<style scope>
    .list_table table td>div{
        font-size:12px;
    }
</style>
<template>
    <div>
        <div class="center_main">
            <div class="search_box">
                <el-row class="search_first search_row">
                    <el-col :span="6" class="col_box">
                        <label class="sale_list_form_label">Store</label>
                       <el-select v-model.trim="search.store"   filterable placeholder="Please select...">
                            <el-option
                                v-for="item in storeOptions"
                                :key="item.storeId"
                                :label="item.storeName"
                                :value="item.storeId">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" class="col_box">
                        <label class="sale_list_form_label">Return No.</label>
                        <el-input v-model.trim="search.returnNo"  ></el-input>
                    </el-col>
                    <el-col :span="6" class="col_box">
                        <label class="sale_list_form_label">Order ID</label>
                        <el-input v-model.trim="search.orderId" ></el-input>
                    </el-col>
                    <el-col :span="6" class="col_box"></el-col>
                </el-row>
                <el-row class="search_second search_row">
                    <el-col :span="12" class="col_box col_datepicker">
                        <label class="sale_list_form_label">Create Date</label>
                        <el-date-picker type="date"
                                        :picker-options="search.fromPickerOptions"
                                        v-model="search.serverFromTime"
                                        format="dd/MM/yyyy"
                                        size="small"
                                        placeholder="DD/MM/YYYY">
                        </el-date-picker>
                        <label class="col_datepicker_label">---</label>
                        <el-date-picker type="date"
                                        :picker-options="search.toPickerOptions"
                                        v-model="search.serverToTime"
                                        format="dd/MM/yyyy"
                                        size="small"
                                        placeholder="DD/MM/YYYY">
                        </el-date-picker>
                    </el-col>

                    <el-col :span="6" class="col_box">
                        <label class="sale_list_form_label">IMEI</label>
                        <input ref="imei" v-model.trim="search.imei" class="imei"  @keyup.enter="scanQRCode" ></input>
                    </el-col>
                    <el-col :span="2" class="col_box col_box_btn">
                        <el-button class="button"  :loading="loading" @click="querySalesReturn(1)" type="primary"
                                   icon="el-icon-search">
                            Search
                        </el-button>
                    </el-col>
                    <el-col :span="3" class="col_box col_box_btn">
                      <router-link to="/createSalesReturn"><div class="new_return"><i class="el-icon-plus"></i> New a Return</div></router-link>
                    </el-col>
                </el-row>
            </div>
            <div class="list_box">
                <div class="list_box_tit">
                    <span class="result_nums">{{filterItemsListData.total}}</span>&nbsp;&nbsp;Results for&nbsp;&nbsp;
                    <span>
                        <span  class="result_store" v-show="isStoreShow"  v-on="{ mouseenter: storeEnter , mouseleave  : storeOut}">
                            <template v-if="resultStore">
                                "<span>{{resultStore}}</span>"<span class="result_store_del" v-show="isStoreDel" @click="delStore"></span>
                            </template>
                        </span>
                    </span>
                </div>
                <el-table :data="filterItemsListData.list" border style="width: 100%;" :default-sort="{prop: 'createDate'}" class="list_table">
                    <el-table-column type="index"width="55"></el-table-column>
                    <el-table-column prop="createLongTime" label="Create Date" sortable width="160" align="left">
                      <template slot-scope="scope" >
                        <div v-for="val in scope.row.createLongTime">
                          <span>{{val}}</span><br>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="returnNo" label="Return no" sortable width="120" align="left"></el-table-column>
                    <el-table-column prop="orderId" label="Order ID" sortable width="120" align="left">
                        <template slot-scope="scope">
                            <a class="show_lists" type="text"  :href="'index.html#/salesReturnList?orderId='+scope.row.orderId" target="_blank"
                               >{{scope.row.orderId}}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="Return Items" width="220" align="left">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.returnItems" class="tab_break">
                                {{item}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="customer" label="Customer" sortable width="143" align="left"></el-table-column>
                    <el-table-column prop="amount" :label="currentAmount" sortable width="180" align="left"></el-table-column>
                    <el-table-column prop="operator" label="Operator"  width="120" align="left"></el-table-column>
                    <el-table-column prop="store" label="Store" sortable width="110" align="left" class-name="tab_break"></el-table-column>
                </el-table>
            </div>
            <div class="page_box" v-if="filterItemsListData.list && filterItemsListData.list.length">
                <el-pagination
                    @current-change="querySalesReturn"
                    @size-change="changePageSize"
                    :page-size="filterItemsListData.pageSize"
                    :current-page.sync="filterItemsListData.pageNum"
                    layout="total,sizes, prev, pager, next,jumper"
                    :total="filterItemsListData.total">
                </el-pagination>
            </div>

        </div>
    </div>
</template>
<script>
import Utils from '~utils/index'
import OrderApi from '~api/orderapi'
export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            isStoreDel: false,
            isStoreShow: false,
            resultStore: '',
            storeOptions: [],
            errmsg: '',
            loading: false,
            currentAmount: 'Amount',
            sizes: [10, 20, 30, 40, 50],
            search: {
                store: '',
                returnNo: '',
                orderId: '',
                serverFromTime: '',
                serverToTime: '',
                fromPickerOptions: {
                    disabledDate: (time) => {
                        if (_this.search.serverToTime) {
                            return time > _this.getCompareDate(_this.search.serverToTime)
                        }
                        if (!_this.search.serverToTime) {
                            return time > _this.getCompareDate(new Date())
                        }
                        return false
                    }
                },
                startTime: '',
                endTime: '',
                imei: '',
                toPickerOptions: {
                    disabledDate: (time) => {
                        if (_this.search.serverFromTime) {
                            return time < Utils.getPartialDate(_this.search.serverFromTime, compareFormat) || time > Utils.getPartialDate(new Date(), compareFormat)
                        }
                        return false
                    }
                }
            },
            filterItemsListData: {
                pageNum: 1,
                pageSize: 10,
                pages: 1,
                list: [],
                total: 0,
                size: 0
            }
        }
    },
    watch: {
        'search.serverFromTime': function (newVal) {
            this.search.startTime = newVal ? Utils.getServerTimestamp(newVal) || '' : ''
        },
        'search.serverToTime': function (newVal) {
            var d = Utils.parseDate(newVal)
            var newD = new Date(d.setDate(d.getDate() + 1))
            this.search.endTime = Utils.getServerTimestamp(newD) - 1 || ''
        }
    },
    created () {
        this.scanQRCode = Utils.debounce(this.searchIMEI, 500)
        this.getInitData()
    },
    methods: {
        getInitData () {
            var _this = this
            OrderApi.getStoreData().then(d => {
                if (d.success) {
                    _this.storeOptions = d.data
                    _this.storeOptions.unshift({'storeId': '', 'storeName': 'ALL'})
                    _this.search.store = d.data[1].storeId
                }
            })
            OrderApi.findOrderCurrency().then(d => {
                if (d.success == true) {
                    if (d.data) {
                        _this.currentAmount = (_this.currentAmount + '(' + d.data + ')')
                    }
                }
            })
        },
        changePageSize (size) {
            this.filterItemsListData.pageSize = size
            this.querySalesReturn()
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        querySalesReturn (num) {
            var _this = this
            if (num) {
                _this.filterItemsListData.pageNum = num
            }
            var arrs = _this.storeOptions.filter(function (item) {
                if (!item.storeId) {
                    return false
                }
                return item.storeId === _this.search.store
            })
            _this.resultStore = arrs.length != 0 ? arrs[0].storeName : ''
            _this.loading = true
            _this.apiSearchByCondition()
        },
        searchIMEI () {
            var _this = this
            var target = _this.$refs.imei
            var curImei = _this.search.imei
            if (!curImei) {
                return false
            }
            if (curImei.indexOf('|') != -1) {
                curImei = curImei.replace(/\|/g, '')
            }
            var reg = new RegExp('^([0-9]{15})$')
            if (!reg.test(curImei)) {
                _this.showErroMessage('Please enter correct IMEI code', '')
                target.focus()
                return
            }
        },
        apiSearchByCondition () {
            var _this = this
            OrderApi.getReturnSalesByCondition({
                store: _this.search.store,
                returnNo: _this.search.returnNo,
                orderId: _this.search.orderId,
                startTime: _this.search.startTime,
                endTime: _this.search.endTime,
                imei: _this.search.imei,
                pageNum: _this.filterItemsListData.pageNum,
                pageSize: _this.filterItemsListData.pageSize
            }).then(d => {
                _this.loading = false
                _this.isStoreShow = true
                if (d.success) {
                    if (d.data && d.data.list) {
                        var list = d.data.list
                        d.data.list = _this.formatDataList(list)
                    }
                    _this.filterItemsListData = d.data
                } else {
                    _this.showErroMessage(d.message, 'Service exceptions！')
                }
            }).catch(err => {
                _this.loading = false
                _this.showErroMessage(err.message, 'Service exceptions！')
            })
        },
        formatDataList (list) {
            for (var i = 0; i < list.length; i++) {
                var createLongTime = Utils.getServerDateStrByLocal(list[i].createLongTime, 'dd/MM/yyyy hh:mm:ss')
                var createLongTimes = createLongTime.split(' ')
                var item = list[i].returnItems != '' ? list[i].returnItems.split(',') : []
                for (var j = 0; j < item.length; j++) {
                    if (item[j] == '') {
                        item.splice(j, 1)
                        j = j - 1
                    }
                }
                list[i].createLongTime = createLongTimes
                if (item.length > 3) {
                    item = item.slice(0, 3)
                    item.push('......')
                    list[i].returnItems = item
                    continue
                }
                list[i].returnItems = item
            }
            return list
        },
        showReturnSalesById (id) {
            this.$router.push({name: 'salesReturnList', params: {orderId: id}})
        },
        storeEnter () {
            this.isStoreDel = true
        },
        storeOut () {
            this.isStoreDel = false
        },
        delStore () {
            this.search.store = ''
            this.resultStore = ''
            this.isStoreShow = false
            this.apiSearchByCondition(this.search)
        },
        showErroMessage (msg, type) {
            this.$message({
                showClose: true,
                message: msg || type,
                type: 'error'
            })
        }
    },
    mounted () {
        document.title = 'Sales Return | Order Management | OCMS-BIM'
    },
    updated () {
    },
    components: {}
}
</script>
<style>
  .list_box .tab_break>div{
    word-break: break-word;
  }
</style>
<style scoped>
    .center_main{
      padding-bottom:100px;
    }
    .search_box {
        margin-bottom: 15px;
        margin-top: 15px;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        padding: 24px;
        background-color: #fff;
    }
    .search_row {
        margin-bottom: 20px;
    }
    .search_box .sale_list_form_label{
      font-size:12px;
    }
    .search_second{
      margin-bottom:0px;
    }
    .search_box .imei {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid rgb(191, 211, 217);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: rgb(31, 54, 61);
        display: inline-block;
        font-size: inherit;
        height: 30px;
        line-height: 1;
        outline: none;
        padding: 3px 10px;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
    }
    .search_box .err_kwd {
        display: inline-block;
        color: red;
        font-size: 14px;
        margin-left: 5px;
    }
    .col_box {
        display: flex;
        align-items: center;
    }
    .col_box label.col_datepicker_label {
        margin-left: 10px;
        min-width: 10px;
    }
    .col_box label {
        min-width: 100px;
        text-align: right;
        margin-right: 10px;
        margin-bottom: 0px;
    }
    .col_box_btn {
        margin-left: 10px;
    }
    .col_datepicker label {
        margin-left: 0px;
    }
    .list_box {
        background-color: #fff;
        padding: 10px 24px 24px;
        border: 1px solid #dbdbdb;
        margin-bottom:10px;
    }
    .result_store_del{
        display:inline-block;
        width:20px;
        height:20px;
        background:url(./../images/item2.png) no-repeat center center;
        background-position:-175px -52px;
        cursor:pointer;
    }
    .list_box .list_box_tit {
        font-weight: bold;
        line-height: 30px;
        margin-bottom: 10px;
    }
    .list_box .result_store > span {
        color: red;
    }
    .list_table{
      font-size:12px;
    }
    .tab_break{
      word-break: break-word;
    }
    .new_return{
       padding:10px 15px;
        color:#1FBCD2;
        cursor:pointer;
    }
    .show_lists{
        color:#1FBCD2;
        cursor:pointer;
    }
    .page_box{
        text-align: right;
    }

</style>
