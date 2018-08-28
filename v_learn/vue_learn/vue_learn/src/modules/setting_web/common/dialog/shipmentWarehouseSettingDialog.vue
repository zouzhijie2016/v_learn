<template>
  <div>
    <el-dialog title="Shipment warehouse setting" custom-class="shipmentWarehouseSettingDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
          <div>
            <div class="shipment_title"><h3>Current Warehouse Available for Shipment for Store:<span
              class="shipment_title_name">{{storeName}}<span v-if="storeId">[{{storeId}}]</span></span></h3></div>
            <div class="shipment_table">
              <el-table :data="newHasShipmentWarehouse"  border style="width: 70%;" class="list_table">
                <el-table-column type="index" label="No." align="center"></el-table-column>
                <el-table-column prop="facilityName" label="Warehouse" align="center"
                                 class-name="list_table_column"></el-table-column>
                <el-table-column label="Operable" align="center" class-name="list_table_btn">
                  <template slot-scope="props">
                    <span @click="delWarehouse(props.row)" class="el-icon-mydel"></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="shipment_operate">
              <el-select v-model="warehouseId" placeholder="Select a Warehouse">
                <el-option v-for="item in warehouseOptions" :key="item.facilityId" :label="item.facilityName"
                           :value="item.facilityId"></el-option>
              </el-select>
              <el-button type="primary" @click="addWarehouseToHasWarehouse">Add</el-button>
            </div>
            <div class="shipment_btns">
              <el-button type="primary" @click="addWarehouseToStore">Confirm</el-button><el-button @click="closeWarehouseDialog">Cancel</el-button>
            </div>
          </div>
    </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import storeShippmentApi from '~api/storeShippmentApi'
import _ from 'lodash'
export default {
    props: ['dataWarehouseVisible', 'hasShipmentWarehouse', 'storeId', 'storeName', ],
    data () {
        return {
            dataCloseVisible: true,
            facilityId: '',
            warehouseId: '',
            warehouseOptions: [],
            newHasShipmentWarehouse: []
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataWarehouseVisible', this.dataCloseVisible)
        }
    },
    created () {
        this.newHasShipmentWarehouse = this.newHasShipmentWarehouse.concat(this.hasShipmentWarehouse)
        if (this.storeId) {
            this.getStoreShipInfo({storeId: this.storeId})
        } else {
            this.getNewStoreShipInfo()
        }
    },
    methods: {
        getNewStoreShipInfo () {
            this.getExceptFacility()
        },
        getStoreShipInfo (params) {
            var _self = this
            var selfStoreShipPromise = new Promise(function (resolve) {
                _self.getSelfStoreShipFacility(function (data) {
                    resolve(data)
                })
            })
            Promise.all([selfStoreShipPromise]).then(function (arr) {
                _self.getExceptFacility(params)
            }, function () {
            })
        },
        getSelfStoreShipFacility (cb) {
            storeShippmentApi.getStoreMsgByStoreId(this.storeId).then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    this.storeName = d.data.storeName
                    this.storeId = d.data.productStoreId
                    this.inventoryFacilityId = d.data.inventoryFacilityId
                } else {
                    this.$showErrorMessage(d.message, 'Service exceptions！')
                }
            }).catch(e => {
                typeof cb === 'function' && cb.apply(this, arguments)
                this.$showErrorMessage(e.message, 'Service exceptions！')
            })
        },
        getExceptFacility (params) {
            var _self = this
            storeShippmentApi.getAllFacility(params).then(d => {
                if (d.success) {
                    _self.warehouseOptions = d.data
                    _self.againSetFacility()
                }
            })
        },
        againSetFacility () {
            var _self = this
            if (_self.warehouseOptions.length > 0) {
                var options = _self.warehouseOptions.filter(function (item) {
                    var index = _.findIndex(_self.newHasShipmentWarehouse, function (chr) {
                        return item.facilityId == chr.facilityId
                    })
                    return index == -1
                })
                _self.warehouseOptions.splice(0)
                _self.warehouseOptions = _self.warehouseOptions.concat(options)
            }
        },
        delWarehouse (item) {
            var _self = this
            var index = Utils.findIndex(this.newHasShipmentWarehouse, function (val) {
                return val.facilityId === item.facilityId
            })
            this.warehouseOptions.unshift(this.newHasShipmentWarehouse[index])
            this.newHasShipmentWarehouse.splice(index, 1)
        // this.$emit("update:hasShipmentWarehouse",this.hasShipmentWarehouse);
        },
        addWarehouseToHasWarehouse () {
            var _self = this
            let no = -1
            var facilitys = _self.warehouseOptions.filter(function (item) {
                return item.facilityId === _self.warehouseId
            })
            no = Utils.findIndex(_self.warehouseOptions, function (val) {
                return val.facilityId === _self.warehouseId
            })
            if (facilitys.length == 0) {
                _self.$showErrorMessage('Please select warehouse！')
                return false
            }
            _self.warehouseOptions.splice(no, 1)
            _self.newHasShipmentWarehouse.push(facilitys[0])
            _self.warehouseId = ''
        },
        addWarehouseToStore () {
            console.dir(this.warehouseId)
            this.$emit('update:hasShipmentWarehouse', this.newHasShipmentWarehouse)
            this.$emit('update:dataWarehouseVisible', false)
        },
        closeWarehouseDialog () {
            this.$emit('update:dataWarehouseVisible', false)
        }
    }
}
</script>
<style>
  .shipmentWarehouseSettingDialog{
    width:790px;
  }
</style>
<style scoped>
  .shipment_title {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .shipment_title_name {
    color: #1FBCD2;
  }

  .shipment_operate .operate_click {
    margin: 10px 0px 20px;
    color: #1FBCD2;
    cursor: pointer;
  }
  .operate_add {
    margin: 10px 0px;
  }
  .shipment_btns{
    text-align: center;
  }
  .shipment_table{
    margin-bottom:10px;
  }
</style>
