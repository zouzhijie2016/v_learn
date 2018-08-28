<style scope>
    .list_table table td>div{
        font-size:12px;
    }
</style>
<template>
    <div>
        <div class="center_main">
            <div class="search_box">
                <div class="search_box_tit">Sales Return List</div>
                <el-row class="search_row">
                    <el-col :span="6" class="col_box">
                        <label class="sale_list_label">Order ID : </label>
                        <span class="sale_list_span">{{sale.orderId}}</span>
                    </el-col>
                    <el-col :span="12" class="col_box">
                        <label class="sale_list_label">Store : </label>
                        <span class="sale_list_span">{{sale.store}}</span>
                    </el-col>
                </el-row>
                <el-row class="search_row">
                    <el-col :span="6" class="col_box">
                        <label class="sale_list_label">Customer Name : </label>
                        <span class="sale_list_span">{{sale.customerName}}</span>
                    </el-col>
                    <el-col :span="6" class="col_box">
                        <label class="sale_list_label">Customer Mobile : </label>
                        <span class="sale_list_span">{{sale.customerMobile}}</span>
                    </el-col>
                    <el-col :span="12" class="col_box" >
                        <label class="sale_list_label">Customer Address : </label>
                        <span v-on="{ mouseenter : addressEnterOrOut , mouseleave : addressEnterOrOut}" class="sale_list_span">{{address}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="list_box">
                <router-link to="/createSalesReturn"><div class="new_return" ><i class="el-icon-plus"></i> New a Return</div></router-link>
                <el-table :data="orderSalesReturnlist.list" border show-summary :summary-method="setTotalSalesReturnList" style="width: 100%;" :default-sort="{prop: 'createDate'}" class="list_table">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div class="table_items">Return Items</div>
                            <el-row class="table_row" v-for="item in props.row.returnItemMapList"  :key="item">
                                <el-col :span="8">
                                  <span class="item_desc">Product Description: </span><span class="item_text_desc">{{item.productDesc}}</span></el-col>
                                <el-col :span="4">
                                  <span class="item_desc">IMEI: </span><span class="item_text">{{item.imei}}</span></el-col>
                                <el-col :span="4">
                                  <span class="item_desc">Product ID: </span><span class="item_text">{{item.productId}}</span></el-col>
                                <el-col :span="4">
                                  <span class="item_desc">EAN: </span><span class="item_text">{{item.EAN}}</span></el-col>
                                <el-col :span="4">
                                  <span class="item_desc">unit: </span><span class="item_text">{{item.unit}}</span></el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column  type="index"width="55"></el-table-column>
                    <el-table-column prop="returnNo" label="Return No"  ></el-table-column>
                    <el-table-column prop="returnReason" label="Return Reason"   width="150" class-name="tab_break"></el-table-column>
                    <el-table-column prop="responsibleParty" label="Responsible Party"  width="160"></el-table-column>
                    <el-table-column prop="operator" label="Operator"  ></el-table-column>
                    <el-table-column prop="createLongTime" label="Created Time"  width="155"></el-table-column>
                    <el-table-column prop="total" :label="CurrentTotal"  ></el-table-column>
                    <el-table-column prop="quantity" label="Qty(PCS)"  ></el-table-column>
                    <el-table-column prop="returnType" label="Return Type"  ></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import Utils from '~utils/index'
import OrderApi from '~api/orderapi'
export default {
    data () {
        return {
            addressIsEnter: false,
            isStoreDel: false,
            isStoreShow: true,
            CurrentTotal: 'Total',
            sale: {
                store: '',
                orderId: '',
                customerName: '',
                customerMobile: '',
                customerAddress: '',
                pageNum: 1
            },
            orderSalesReturnlist: {}
        }
    },
    computed: {
        'address': function () {
            this.sale.customerAddress = this.sale.customerAddress ? this.sale.customerAddress.toString() : ''
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
    created () {
        var orderId = this.$route.params.orderId
        if (!orderId) {
            orderId = this.$route.query.orderId
        }
        if (orderId) {
            localStorage.setItem('orderId', orderId)
        }
        this.sale.orderId = orderId || localStorage.getItem('orderId')
        this.getSalesReturnByOrderId(this.sale.orderId)
        this.getInitData()
    },
    methods: {
        getInitData () {
            OrderApi.findOrderCurrency().then(d => {
                if (d.success == true) {
                    if (d.data) {
                        this.CurrentTotal = (this.CurrentTotal + '(' + d.data + ')')
                    }
                }
            })
        },
        getSalesReturnByOrderId (orderId) {
            var _this = this
            var obj = {'orderId': orderId, 'pageNum': _this.sale.pageNum}
            OrderApi.getReturnSalesByOrderId(obj).then(d => {
                if (d.success) {
                    if (d.data && d.data.list) {
                        _this.setSalesData(d.data.list)
                        d.data.list = _this.formatDataList(d.data.list)
                    }
                    _this.orderSalesReturnlist = d.data
                } else {
                    _this.showErroMessage(d.message, 'Service exceptions！')
                }
            }).catch(err => {
                _this.showErroMessage(err.message, 'Service exceptions！')
            })
        },
        setTotalSalesReturnList (param) {
            const { data } = param
            var ghsTotal = 0, qtyTotal = 0
            for (var i = 0; i < data.length; i++) {
                var totalVal = data[i].total.replace(/,/gi, '')
                ghsTotal += (+totalVal)
                qtyTotal += Number(data[i].quantity)
            }
            ghsTotal = this.setPriceToThousands(ghsTotal)
            return ['Total', '', '', '', '', '', '', ghsTotal, qtyTotal]
        },
        addressEnterOrOut () {
            this.addressIsEnter = !this.addressIsEnter
        },
        formatDataList (list) {
            for (var i = 0; i < list.length; i++) {
                var createLongTime = Utils.getServerDateStrByLocal(list[i].createLongTime, 'dd/MM/yyyy hh:mm:ss')
                list[i].createLongTime = createLongTime
            }
            return list
        },
        setSalesData (val) {
            this.sale.orderId = val[0].orderId
            this.sale.store = val[0].store
            this.sale.customerName = val[0].customerName
            this.sale.customerMobile = val[0].customerMobile
            this.sale.customerAddress = val[0].customerAddress
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
    components: {}
}
</script>
<style>
  .list_box .tab_break>div{
     word-break: break-word;
   }
</style>
<style scoped>
    .search_box {
        margin-bottom: 15px;
        margin-top: 15px;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        padding: 10px 24px 24px;
        background-color: #fff;
    }
    .search_box_tit{
        font-size:14px;
        font-weight:bold;
        line-height:40px;
    }
    .search_box .sale_list_label,.search_box .sale_list_label{
      font-size:12px;
    }
    .search_row {
        margin-bottom: 10px;
    }
    .table_row>div{
        font-size:12px;
    }
    .table_items{
        font-size: 14px;
        font-weight:bold;
        line-height:30px;
    }
    .col_box {
        display: flex;
        align-items: center;
    }
    .col_box label {
       margin-right: 10px;
        margin-bottom: 0px;
    }
    .col_box_btn {
        margin-left: 10px;
    }
    .col_datepicker label {
        margin-left: 0px;
    }
    .col_datepicker .col_datepicker_label {
        margin-left: 0px;
        min-width: 10px;
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
      display: inline-block;
        padding:10px 15px;
        color:#1FBCD2;
        cursor:pointer;
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
