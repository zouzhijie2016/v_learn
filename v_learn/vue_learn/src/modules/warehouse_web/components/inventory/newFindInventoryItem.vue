<template>
  <div>
    <left-menu></left-menu>
    <div class="center_main">
      <div class="search_box">
        <div class="search_box_tit">Find Inventory Item</div>
        <div class="search">
          <el-row class="search_row">
            <el-col :span="7" class="col_box col_product">
              <label class="find_item_form_label find_item_form_left">Model</label>
              <el-input v-model.trim="search.internalName" size="small"></el-input>
            </el-col>
            <el-col :span="8" class="col_box">
              <label class="find_item_form_label">IMEI/Serial Number</label>
              <el-input v-model.trim="search.serialNumber" size="small"></el-input>
            </el-col>
            <el-col :span="8" class="col_box">
              <label class="find_item_form_label">Warehouse</label>
              <el-select v-model.trim="search.facilityIdToFind" size="small" filterable placeholder="Please select...">
                <el-option
                  v-for="item in facilityNamesOption"
                  :key="item.facilityId"
                  :label="item.facilityName"
                  :value="item.facilityId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7" class="col_box">
              <label class="find_item_form_label find_item_form_left">Product ID</label>
              <el-input v-model.trim="search.productId">
                  <i slot="suffix" class="el-input__icon el-icon-more" @click="moreProductIconClick"></i>
              </el-input>
            </el-col>
            <el-col :span="8" class="col_box">
              <label class="find_item_form_label">Lot ID</label>
              <el-input v-model.trim="search.lotId">
                  <i slot="suffix" class="el-input__icon el-icon-more" @click="moreLotIconClick"></i>
              </el-input>
            </el-col>
            <el-col :span="4" class="col_box">
              <span class="find_item_form_contain">Contains QOH=0</span>
              <el-checkbox v-model="containsQOH" size="small" class="dialog_checkbox"></el-checkbox>
            </el-col>
            <el-col :span="2" :offset="2" class="col_box col_box_btn">
              <el-button class="button" size="small" :loading="loading" @click="getInventoryItem()" type="primary"
                         icon="el-icon-search">Search
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="list_box" v-loading="loading" element-loading-text="Loading...">
        <div class="list_box_tit">Inventory Items</div>
        <el-table :data="datalist" border style="width: 100%;" :default-sort="{prop: 'inventoryItemId'}"
                  class="list_table">
          <el-table-column label="Inventory Item ID" sortable width="110" align="center"
                           class-name="list_table_column">
            <template slot-scope="props">
              <a :href="showEditPage ? '/warehouse/control/EditInventoryItem?inventoryItemId='+props.row.inventoryItemId : 'javascript:void(0)'">{{props.row.inventoryItemId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="productId" label="Product ID" sortable width="100"
                           class-name="list_table_column">
            <template slot-scope="props">
              <a @click="setProductId(props.row.productId)" href="javascript:void(0)">{{props.row.productId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="internalName" label="Model" sortable class-name="list_table_column"
                           width="140"></el-table-column>
          <el-table-column prop="description" label="Product Attribute" sortable width="140"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="serialNumber" label="IMEI/Serial Number" sortable width="155"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="lotId" label="Lot ID" sortable class-name="list_table_column" width="70"></el-table-column>
          <el-table-column prop="datetimeReceived" label="Date Received" sortable width="150"
                           class-name="list_table_column"></el-table-column>
          <el-table-column label="Status" sortable class-name="list_table_column"
                           width="110">
            <template slot-scope="props">
              {{props.row | formatStatus}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityOnHandTotal" label="QOH" sortable   align="right"  width="65"
                           class-name="list_table_column"></el-table-column>
          <el-table-column prop="facilityName" label="Inventory Warehouse" sortable width="170"
                           class-name="list_table_column"></el-table-column>
          <el-table-column label="Inventory Log" width="70" sortable   align="center">
            <template slot-scope="props">
              <a @click="gotoLog(props.row.inventoryItemId)" href="javascript:void(0)">Log</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="page_box" v-if="inventoryItemDataPage && inventoryItemDataPage.total>0">
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="inventoryItemDataPage.total"
            :page-size="inventoryItemDataPage.pageSize"
            :current-page.sync="search.pageNum"
            @current-change="getPageInventoryItem">
          </el-pagination>
        </div>
      </div>
    </div>
    <select-product-dialog v-if="productDialogFormVisible" :dataProductId.sync="search.productId"
                           :dataVisible.sync="productDialogFormVisible"></select-product-dialog>
    <select-lot-dialog v-if="lotDialogFormVisible" :dataLotId.sync="search.lotId"
                       :dataVisible.sync="lotDialogFormVisible"></select-lot-dialog>
  </div>
</template>
<script>
import selectProductDialog from './../../common/dialog/productListDialog.vue'
import selectLotDialog from './../../common/dialog/lotListDialog.vue'
import leftMenu from '~warehouse-common/comp/leftmenu.vue'
import inventoryItemApi from '~api/warehouse/findInventoryItemApi'
import {myInventoryMixin} from '~warehouse-common/comp/warehouseMixins'
import Utils from '~utils/index'
export default{
    data () {
        return {
            productIdDialog: '',
            loading: false,
            productDialogFormVisible: false,
            lotDialogFormVisible: false,
            containsQOH: false,
            facilityNamesOption: [],
            search: {
                productId: '',
                lotId: '',
                serialNumber: '',
                internalName: '',
                facilityIdToFind: '',
                flag: 'N',
                pageNum: 1
            },
            showEditPage: true,
            datalist: [],
            inventoryItemDataPage: {
                pageNum: 1,
                pageSize: 20,
                pages: 1,
                total: 0,
                size: 0
            },
            isManual: false
        }
    },
    mixins: [myInventoryMixin],
    watch: {
        'containsQOH': function (newVal) {
            if (newVal) {
                this.search.flag = 'Y'
            } else {
                this.search.flag = 'N'
            }
        }
    },
    filters: {
        formatStatus (value) {
            return value.serialNumber && !value.statusId ? 'IXF_REQUESTED' : value.statusId
        }
    },
    components: {
        leftMenu,
        selectProductDialog,
        selectLotDialog
    },
    mounted () {
        inventoryItemApi.getFacilityList().then(d => {
            console.dir(d)
            if (d.success) {
                this.facilityNamesOption = this.facilityNamesOption.concat(d.data.inventoryFacilitys)
                this.facilityNamesOption.unshift({'facilityId': '', 'facilityName': 'ALL'})
                this.search.facilityIdToFind = d.data.defaultFacilityId
            }
            this.getInventoryItem(false, 1)
        }).catch(e => {
            this.getInventoryItem(false, 1)
        })
    },
    methods: {
        moreProductIconClick () {
            this.productDialogFormVisible = true
        },
        moreLotIconClick () {
            this.lotDialogFormVisible = true
        },
        gotoLog (id) {
            window.open('/warehouse_web/index.html#/newFindInventoryItemLog/inventoryId:' + id)
        },
        setProductId (productId) {
            this.search.productId = productId
            this.selectInventoryItem(false, 1)
        },
        getInventoryItem () {
            this.selectInventoryItem(false, 1)
        },
        getPageInventoryItem () {
            if (!this.isManual) {
                this.selectInventoryItem(true)
            } else {
                this.isManual = false
            }
        },
        selectInventoryItem (isOnlyList = false, pageIndex) {
            var _this = this
            _this.loading = true
            _this.$getCommonPageListApi(inventoryItemApi.getInventoryItemList, {
                productId: _this.search.productId,
                lotId: _this.search.lotId,
                serialNumber: _this.search.serialNumber,
                internalName: _this.search.internalName,
                facilityIdToFind: _this.search.facilityIdToFind,
                flag: _this.search.flag,
                isOnlyList: isOnlyList,
                pageSize: _this.inventoryItemDataPage.pageSize,
                pageNum: pageIndex || _this.search.pageNum
            }, d => {
                if (d.data && d.data.pageInfo && d.data.pageInfo.list) {
                    d.data.pageInfo.list.map(function (item) {
                        var quantity = item.quantityOnHandTotal
                        var arrayQuantity = quantity.toString().split('.')
                        item.quantityOnHandTotal = arrayQuantity[0] ? arrayQuantity[0] : '0'
                        item.datetimeReceived = Utils.getServerDateStrByLocal(parseInt(item.datetimeReceived), 'dd/MM/yyyy hh:mm:ss')
                    })
                }
                _this.showEditPage = d.data.showEditPage
                _this.datalist = d.data.pageInfo.list
                if (_this.search.pageNum != d.data.pageInfo.pageNum) {
                    _this.isManual = true
                    _this.search.pageNum = d.data.pageInfo.pageNum
                }
            }).then((results) => {
                _this.loading = false
                if (results.length > 1) {
                    if (results[1].success) {
                        _this.inventoryItemDataPage.total = results[1].data.pageInfo.total
                        _this.inventoryItemDataPage.pageSize = results[1].data.pageInfo.pageSize
                    } else {
                        _this.inventoryItemDataPage.total = _this.inventoryItemDataPage.pageSize * (_this.search.pageNum + 1)
                    }
                }
            })
        }

    }
}
</script>
<style>
  .list_table .list_table_column > div {
    padding-right: 5px;
    padding-left: 5px;
    word-break: break-word;
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

  .find_item_form_label {
    font-size: 12px;
    min-width: 140px;
    text-align: right;
    margin-right: 10px;
    margin-bottom: 0px;
  }

  .col_box .find_item_form_contain {
    font-weight: bold;
    font-size: 12px;
    min-width: 140px;
    text-align: right;
    margin-right: 10px;
  }
  .find_item_form_left{
    min-width:70px;
  }

  .search_box {
    margin-bottom: 15px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 10px 24px 24px;
    background-color: #fff;
  }

  .search_row {
    margin-bottom: 15px;
  }

  .search_box_tit {
    font-size: 14px;
    font-weight: bold;
    line-height: 40px;
  }

  .center_main {
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

  .col_box {
    display: flex;
    align-items: center;
  }

  .page_box {
    text-align: right;
    margin-top: 10px;
  }

  .list_table {
    font-size: 12px;
  }

</style>
