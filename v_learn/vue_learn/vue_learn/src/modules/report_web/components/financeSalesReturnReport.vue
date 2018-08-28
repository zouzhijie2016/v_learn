<template>
    <div @click="clearEvent">
        <div class="center_main">
          <div class="search_box return_report_form">
            <el-row class="search_row">
              <el-col :span="6" class="col_box">
                <label class="return_report_form_label">Order ID</label>
                <el-input v-model.trim="search.orderId" size="small"></el-input>
              </el-col>
              <el-col :span="6" class="col_box">
                <label class="return_report_form_label">Store Group</label>
                <el-select v-model.trim="search.storeGroup" size="small"  placeholder="Please select..." @change="changeStoreGroup(search.storeGroup)">
                  <el-option
                    v-for="item in storeGroupOptions"
                    :key="item.storeGroupId"
                    :label="item.storeGroupName"
                    :value="item.storeGroupId">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="6" class="col_box">
                <label class="return_report_form_label">Store</label>
                <el-select v-model.trim="search.store" size="small"  placeholder="Please select...">
                  <el-option
                    v-for="item in getStoreByGroup"
                    :key="item.storeId"
                    :label="item.storeName"
                    :value="item.storeId">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="6" class="col_box col_product">
                <label class="return_report_form_label">Product</label>
                <input v-model.trim="search.product" class="input_product" placeholder="Model/Product ID/EAN/IMEI" @keyup="searchProduct" />
                <ul class="product_ul" v-show="isHasProduct" tabindex="22">
                  <li :class="index==selectProductIndex ? 'cur' : ''" :key="val.productId"  v-for="(val, index) in productList" @click="setProductToInput($event,index,val)" :data-productId="val.productId" >{{val.productId}}:{{val.productDesc}}</li>
                </ul>
              </el-col>
            </el-row>
            <el-row class="search_second search_row">
              <el-col :span="12" class="col_box col_datepicker">
                <label class="return_report_form_label">Create Date</label>
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
                <label class="return_report_form_label">Return No.</label>
                <el-input v-model.trim="search.returnNo" size="small" ></el-input>
              </el-col>
              <el-col :span="2" class="col_box col_box_btn">
                <el-button class="button" size="small" :loading="loading" @click="queryReturnReport(1)" type="primary"
                           icon="search">Search
                </el-button>
              </el-col>
            </el-row>
          </div>

            <div class="list_box">
              <div class="list_box_tit">
                <span class="result_nums">{{orderReturnReportList.total}}</span>&nbsp;&nbsp;Results for&nbsp;&nbsp;
                <span>
                        <span  class="result_store" v-show="isStoreShow"  v-on="{ mouseenter: storeEnter , mouseleave  : storeOut}">
                            <template v-if="resultStore">
                                "<span>{{resultStore}}</span>"<span class="result_store_del" v-show="isStoreDel" @click="delStore"></span>
                            </template>
                        </span>
                    </span>
              </div>
                <el-table :data="orderReturnReportList.list" border show-summary :summary-method="setTotalReturn" style="width: 100%;" :default-sort="{prop: 'createLongTime', order: 'descending'}" class="list_table">

                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div class="table_items">Return Items</div>
                            <el-row class="table_row" v-for="item in props.row.returnItemList" :key="item">
                                <el-col :span="8">
                                  <span class="item_desc">Product Description: </span><span class="item_text_desc">{{item.productDesc}}</span></el-col>
                                <el-col :span="4">
                                  <span class="item_desc">IMEI: </span><span class="item_text">{{item.imei}}</span></el-col>
                                <el-col :span="4">
                                  <span class="item_desc">Product ID: </span><span class="item_text">{{item.productId}}</span></el-col>
                                <el-col :span="4">
                                  <span class="item_desc">EAN: </span><span class="item_text">{{item.ean}}</span></el-col>
                                <el-col :span="4">
                                  <span class="item_desc">unit: </span><span class="item_text">{{item.unit}}</span></el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                  <el-table-column type="index" width="55"></el-table-column>
                  <el-table-column prop="orderId" label="Order ID" ></el-table-column>
                    <el-table-column prop="returnNo" label="Return No" sortable width="120"></el-table-column>
                    <el-table-column prop="returnReason" label="Return Reason"  width="150"  class-name="tab_break"></el-table-column>
                    <el-table-column prop="responsibleParty" label="Responsible Party" width="160" class-name="tab_break"></el-table-column>
                    <el-table-column prop="operator" label="Operator" ></el-table-column>
                    <el-table-column prop="createLongTime" label="Created Time" width="155"></el-table-column>
                    <el-table-column prop="total" label="Total(GHS)"  class-name="tab_break"></el-table-column>
                    <el-table-column prop="quantity" label="Qty(PCS)" ></el-table-column>
                    <el-table-column prop="returnType" label="Return Type" width="110"></el-table-column>
                </el-table>
            </div>
          <div class="page_box" v-if="orderReturnReportList.list && orderReturnReportList.list.length">
            <el-pagination
              @current-change="queryReturnReport"
              :current-page.sync="orderReturnReportList.pageNum"
              @size-change="changePageSize"
              :page-sizes="sizes"
              layout="total,sizes, prev, pager, next"
              :total="orderReturnReportList.total">
            </el-pagination>
          </div>
        </div>
    </div>
</template>
<script>
import Utils from '~utils/index'
import ReportApi from '~api/reportapi'
export default {
    data () {
        var _this = this
        return {
            addressIsEnter: false,
            isStoreDel: false,
            isStoreShow: true,
            selectProduct: null,
            resultStore: '',
            loading: false,
            timeOut: null,
            timer: 1000,
            isHasProduct: false,
            selectProductIndex: 0,
            productList: [],
            getStoreByGroup: [],
            storeOptions: [],
            storeGroupOptions: [],
            sizes: [10, 20, 30, 40, 50],
            search: {store: '',
                returnNo: '',
                orderId: '',
                storeGroup: '',
                product: '',
                fromPickerOptions: {
                    disabledDate (time) {
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
                serverFromTime: '',
                serverToTime: '',
                toPickerOptions: {
                    disabledDate (time) {
                        if (_this.search.serverFromTime) {
                            return time < _this.getCompareDate(_this.search.serverFromTime) || time > _this.getCompareDate(new Date())
                        }
                        return false
                    }
                }
            },
            orderReturnReportList: {
                pageNum: 1,
                pageSize: 10,
                pages: 1,
                list: [],
                total: 0,
                size: 0
            }
        }
    },
    computed: {
        'address': function () {
            this.sale.customerAddress = this.sale.customerAddress.toString()
            if (this.addressIsEnter) {
                return this.sale.customerAddress
            } else {
                if (this.sale.customerAddress.split('').length > 50) {
                    return this.sale.customerAddress.substr(0, 50) + '......'
                }
                return this.sale.customerAddress
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
        this.getStoreGroupData()
    },
    methods: {
        getStoreGroupData () {
            var _this = this
            ReportApi.getStoreGroupListData().then(d => {
                if (d.success) {
                    _this.storeOptions = d.data
                    d.data.forEach(function (value, index) {
                        _this.storeGroupOptions.push({'storeGroupId': value.storeGroupId, 'storeGroupName': value.storeGroupName})
                    })
                    _this.storeGroupOptions.unshift({'storeGroupId': '', 'storeGroupName': 'ALL'})
                }
            }).catch(err => {
                console.dir(err)
            })
        },
        changeStoreGroup (val) {
            var _this = this
            _this.search.store = ''
            _this.storeOptions.forEach(function (value, index) {
                if (value.storeGroupId == val) {
                    _this.getStoreByGroup = value.storeList
                    _this.getStoreByGroup.unshift({'storeId': '', 'storeName': 'ALL'})
                    return
                }
            })
        },
        changePageSize (size) {
            this.orderReturnReportList.pageSize = size
            this.queryReturnReport()
        },
        searchProduct (e) {
            var productInput = this.search.product
            var productInputLen = productInput.length
            var newExp = /^[0-9]*$/
            if (!productInput) {
                this.isHasProduct = false
                return false
            }
            if ((productInputLen == 8 || productInputLen == 13 || productInputLen == 15) && newExp.test(productInput) && e.keyCode == 13) {
                clearTimeout(this.timeOut)
                this.searchEanOrImei()
            } else {
                this.searchProductOrModel()
            }
        },
        searchEanOrImei () {
            var _this = this
            var productInput = _this.search.product
            var obj = {'product': productInput, 'store': _this.search.store}
            ReportApi.getProductEanOrImeiData(obj).then(d => {
                console.dir(d)
                if (d.success) {
                    _this.isHasProduct = true
                    _this.productList = d.data
                }
            }).catch(err => {
                this.$message({
                    showClose: true,
                    message: err.message || 'Service exceptions！',
                    type: 'error'
                })
            })
        },
        searchProductOrModel () {
            var _this = this
            clearTimeout(_this.timeOut)
            _this.timeOut = setTimeout(function () {
                _this.searchEanOrImei()
            }, _this.timer)
        },
        setProductToInput (e, index, val) {
            console.log(val)
            this.selectProductIndex = index
            this.selectProduct = val
            this.search.product = e.target.innerText
            this.isHasProduct = false
        },
        queryReturnReport (num) {
            var _this = this
            if (num) {
                _this.orderReturnReportList.pageNum = num
            }
            var arrs = _this.getStoreByGroup.filter(function (item) {
                return item.storeId === _this.search.store
            })
            _this.resultStore = arrs.length != 0 ? arrs[0].storeName : ''
            _this.loading = true
            var productInput = _this.search.product
            var productInputLen = productInput.length
            var productValue
            var newExp = /^[0-9]*$/

            if (!((productInputLen == 8 || productInputLen == 13 || productInputLen == 15) && newExp.test(productInput))) {
                productValue = _this.selectProduct ? _this.selectProduct.productId : ''
            } else {
                productValue = _this.search.product
            }
            ReportApi.getReturnReportByCondition({
                endTime: _this.search.endTime,
                fromPickerOptions: _this.search.fromPickerOptions,
                orderId: _this.search.orderId,
                pageNum: _this.orderReturnReportList.pageNum,
                pageSize: _this.orderReturnReportList.pageSize,
                product: productValue,
                returnNo: _this.search.returnNo,
                serverFromTime: _this.search.serverFromTime,
                serverToTime: _this.search.serverToTime,
                startTime: _this.search.startTime,
                store: _this.search.store,
                storeGroup: _this.search.storeGroup,
                toPickerOptions: _this.search.toPickerOptions
            }).then(d => {
                _this.loading = false
                _this.isStoreShow = true
                if (d.success) {
                    if (d.data && d.data.list) {
                        var list = d.data.list
                        for (var i = 0; i < list.length; i++) {
                            var createLongTime = Utils.getServerDateStrByLocal(list[i].createLongTime, 'dd/MM/yyyy hh:mm:ss')
                            list[i].createLongTime = createLongTime
                        }
                        d.data.list = list
                    }
                    _this.orderReturnReportList = d.data
                } else {
                    _this.$message({
                        showClose: true,
                        message: d.message || 'Service exceptions！',
                        type: 'error'
                    })
                }
            }).catch(err => {
                _this.loading = false
                _this.$message({
                    showClose: true,
                    message: err.message || 'Service exceptions！',
                    type: 'error'
                })
            })
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        setTotalReturn (param) {
            const { data } = param
            var ghsTotal = 0, qtyTotal = 0
            for (var i = 0; i < data.length; i++) {
                var totalVal = data[i].total.replace(/,/gi, '')
                ghsTotal += (+totalVal)
                qtyTotal += Number(data[i].quantity)
            }
            ghsTotal = this.setPriceToThousands(ghsTotal)
            return ['Total', '', '', '', '', '', '', '', ghsTotal, qtyTotal, '']
        },
        storeEnter () {
            this.isStoreDel = true
        },
        storeOut () {
            this.isStoreDel = false
        },
        clearEvent () {
            if (this.isHasProduct) {
                this.isHasProduct = false
            }
        },
        delStore () {
            this.search.store = ''
            this.search.storeGroup = ''
            this.resultStore = ''
            this.isStoreShow = false
            this.queryReturnReport(this.search)
        },
        setPriceToThousands (num) {
            if ((num + '').trim() == '') {
                return ''
            }
            if (isNaN(num)) {
                return ''
            }
            num = num + ''
            if (/^.*\..*$/.test(num)) {
                var pointIndex = num.lastIndexOf('.')
                var intPart = num.substring(0, pointIndex)
                var pointPart = num.substring(pointIndex + 1, num.length)
                intPart = intPart + ''
                var re = /(-?\d+)(\d{3})/
                while (re.test(intPart)) {
                    intPart = intPart.replace(re, '$1,$2')
                }
                num = intPart + '.' + pointPart
            } else {
                num = num + ''
                var regNg = /(-?\d+)(\d{3})/
                while (regNg.test(num)) {
                    num = num.replace(regNg, '$1,$2')
                }
            }
            return num
        }
    },

    mounted () {
        document.title = 'Inventory | Warehouse | OCMS-BIM'
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
  .return_report_form .return_report_form_label{
    font-size:12px;
  }
  .search_box {
    margin-bottom: 15px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 24px;
    background-color: #fff;
  }
  .center_main{
    padding-bottom:100px;
  }
  .search_row {
    margin-bottom: 20px;
  }
  .search_second{
    margin-bottom:0px;
  }
    .table_row>div{
        font-size:12px;
    }
    .table_items{
        font-size:14px;
        font-weight:bold;
        line-height:30px;
    }
    .input_product{
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
      width: 200px;
      font-size:12px;
    }
  .col_box {
    display: flex;
    align-items: center;
  }
  .col_product{
    position:relative;
  }
  .col_product .product_ul{
    position: absolute;
    top: 35px;
    left: -17px;
    width: 350px;
    border: 1px solid #dbdbdb;
    outline: none;
    z-index: 99;
  }
  .col_product .product_ul li{
    width: 100%;
    padding-left: 10px !important;
    height: 30px;
    line-height: 30px;
    font-size:12px;
    color: #424242;
    background: #FFFFFF;
    border-bottom: 1px solid #dbdbdb;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .col_product .product_ul li.cur{
    color: #ffffff;
    background: #1FBCD2;
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
    }
  .item_text_desc{
    display:inline-block;
    height:40px;
    vertical-align: middle;
    width:240px;
  }
  .item_text{
    display:inline-block;
    height:40px;
    vertical-align: middle;
  }
    .new_return{
        padding:10px 15px;
        color:#1FBCD2;
        cursor:pointer;
    }

    .result_store_del{
        display:inline-block;
        width:20px;
        height:20px;
        background:url(images/item2.png) no-repeat center center;
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
  .list_table .item_desc{
    display:inline-block;
    margin-right:10px;
    color:#99a9bf;
    height:40px;
    vertical-align: middle;
  }
    .page_box{
        text-align: right;
    }


</style>
