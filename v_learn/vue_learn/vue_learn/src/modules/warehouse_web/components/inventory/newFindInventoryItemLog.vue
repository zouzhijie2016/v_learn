<template>
  <div>
    <left-menu :urlPermiss.sync="urlPermissData"></left-menu>
    <div class="center_main">
      <div class="list_box">
        <div class="list_box_tit">
          Inventory log[{{obj.inventoryItemId}}]
        </div>
        <el-table :data="inventoryItemDetailData.list" border style="width: 100%;" class="list_table">
          <el-table-column prop="inventoryItemDetailSeqId" label="Inventory Item Seq Id" sortable width="170"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="effectiveDate" label="Effective Date" sortable width="140"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="operator" label="Operator" sortable class-name="list_table_column"
                           width="100"></el-table-column>
          <el-table-column prop="quantityOnHandDiff" label="QTY Diff" sortable width="100"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="availableToPromiseDiff" label="ATP Diff	" sortable width="100"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="usageType" label="Usage Type" sortable class-name="list_table_column"
                           width="120"></el-table-column>
          <el-table-column prop="orderId" label="Order Id" sortable class-name="list_table_column"
                           width="100"></el-table-column>
          <el-table-column prop="fromWarehouse" label="From Warehouse" sortable width="140"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="toWarehouse" label="To Warehouse" sortable width="140"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="reasonEnumId" label="Adjust Reason" sortable width="140"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="qty" label="QTY" sortable
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="atp" label="ATP" sortable
                           class-name="list_table_column"></el-table-column>
        </el-table>
        <div class="page_box" v-if="inventoryItemDetailData.list && inventoryItemDetailData.list.length">
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="inventoryItemDetailData.total"
            :page-size="inventoryItemDetailData.pageSize"
            :current-page.sync="obj.pageNum"
            @current-change="getInventoryItemDetail">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import leftMenu from '~warehouse-common/comp/leftmenu.vue'
import inventoryItemApi from '~api/warehouse/findInventoryItemApi'
import {myInventoryMixin} from '~warehouse-common/comp/warehouseMixins'
import Utils from '~utils/index'
export default{
    data () {
        return {
            obj: {
                inventoryItemId: '',
                loading: false,
                pageNum: 1
            },
            oPara: {name: '', value: ''},
            urlPermissData: '/warehouse_web/index.html#/newFindInventoryItem',
            inventoryItemDetailData: {}
        }
    },
    components: {
        leftMenu
    },
    mixins: [myInventoryMixin],
    mounted () {
        this.setOptions(this.$route.params)
        if (this.oPara.name != 'inventoryId') {
            return false
        }
        let reg = new RegExp('^([a-zA-Z0-9])+$')
        if (!reg.test(this.oPara.value)) {
            this.$showErrorMessage('The parameter has an illegal character!')
            return false
        }
        var inventoryItemId = this.oPara.value
        localStorage.setItem('inventoryItemId', inventoryItemId)
        this.obj.inventoryItemId = inventoryItemId || localStorage.getItem('inventoryItemId')
        this.getInventoryItemDetail()
    },
    methods: {
        setOptions (val) {
            var _self = this
            val = val.sParams
            if (val && val.indexOf(':') > -1) {
                val.replace(/(\w+)\s*:\s*([\w-]+)/g, function (a, b, c) {
                    b && (_self.oPara.name = b) && (_self.oPara.value = c)
                })
            }
        },
        getInventoryItemDetail () {
            var _this = this
            inventoryItemApi.getInventoryItemDetailList(this.obj).then(d => {
                if (d.success) {
                    if (d.data && d.data.list) {
                        d.data.list.map(function (item) {
                            item.quantityOnHandDiff = _this.setQty(item.quantityOnHandDiff)
                            item.availableToPromiseDiff = _this.setQty(item.availableToPromiseDiff)
                            item.effectiveDate = Utils.getServerDateStrByLocal(parseInt(item.effectiveDate), 'dd/MM/yyyy hh:mm:ss')
                        })
                    }
                    _this.inventoryItemDetailData = d.data
                } else {
	                _this.$showErrorMessage(d)
                }
            }).catch(e => {
                _this.$showErrorMessage(e)
            })
        },
        setQty (quantity) {
            var arrayQuantity = quantity.toString().split('.')
            return arrayQuantity[0] ? arrayQuantity[0] : '0'
        },

    }
}
</script>
<style>
  .list_table .list_table_column > div {
    padding-right: 5px;
    padding-left: 5px;
  }
</style>
<style scoped>
  .center_main {
    overflow-y: auto;
    zoom: 1;
    width: 100%;
    transition: margin-right 0.3s ease-in-out;
    padding-left: 188px;
    min-height: 300px;
    padding-bottom: 80px;
  }

  .list_box {
    background-color: #fff;
    padding: 10px 24px 24px;
    border: 1px solid #dbdbdb;
    margin-bottom: 10px;
  }

  .list_box .list_box_tit {
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .list_table {
    font-size: 12px;
  }

  .page_box {
    text-align: right;
    margin-top: 10px;
  }
</style>
