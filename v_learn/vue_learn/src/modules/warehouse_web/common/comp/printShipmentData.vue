<template>
  <div style="width:100%;height:100%;" v-loading="loading" element-loading-text="Loading...">
    <div class="print_list" id="printList" ref="printList" style="width: 800px;margin: 0 auto;padding:30px 0px;" v-if="allShipmentItems.length>0">
        <template v-if="allShipmentItems.length > 0">
            <div v-for="i in printNums">
                <div v-for="(val,index) in allShipmentItems"
                     style="margin-bottom:80px;page-break-before:always">
                    <div style="border: 1px solid #333;padding:20px 20px 30px 20px;overflow: hidden;">
                        <div class="print_list_title"
                             style="width:700px;margin:0 auto;padding: 10px 0px;font-weight: bold;font-size: 24px;vertical-align:middle;line-height:30px;">
                            Shipment#{{ val.shipmentId }}<img style="width:220px;height:80px;display:inline-block;vertical-align:middle;" v-bind:id="'barcode'+index"/>
                        </div>
                        <div class="order_desc" style="width:700px;margin:0 auto;">
                            <div style="overflow: hidden;margin-bottom:15px;">
                                <div class="order_desc_group" style="float: left;width:220px;font-size:15px;">
                                    <label style="margin-right: 10px;">Shipment ID:</label><span>{{val.shipmentId}}</span></div>
                                <div class="order_desc_group" style="float: left;width:220px;font-size:15px;">
                                    <label style="margin-right: 10px;">Package ID:</label><span>{{val.packageId}}</span></div>
                                <div class="order_desc_group" style="float: left;width:220px;font-size:15px;">
                                    <label style="margin-right: 10px;">Belongs to Order:</label><span>{{val.belongsOrderId}}</span>
                                </div>
                            </div>
                            <div style="font-size:16px;">
                                <label style="margin-right: 10px;width:145px;text-align: right;">From Warehouse:</label><span style="border-bottom:1px solid #333;">{{val.fromWarehouse}}</span>
                            </div>
                            <div style="font-size:16px;">
                                <label style="margin-right: 10px;width:145px;text-align: right;">To Address:</label><span style="border-bottom:1px solid #333;">{{val.toAddress}}</span>
                            </div>
                            <div style="font-size:16px;">
                                <label style="margin-right: 10px;width:145px;text-align: right;">Receiver:</label><span style="border-bottom:1px solid #333;">{{val.receiveName ? val.receiveName : '----'}}, {{val.receivePhone ? val.receivePhone : '----'}}</span>
                            </div>
                            <div style="overflow: hidden;margin-top:15px;">
                                <div class="order_desc_group" style="float: left;width:220px;font-size:15px;">
                                    <label style="margin-right: 10px;">Driver:</label><span>{{val.driverName}}</span></div>
                                <div class="order_desc_group" style="float: left;width:220px;font-size:15px;">
                                    <label style="margin-right: 10px;">Tel:</label><span>{{val.telephone}}</span></div>
                                <div class="order_desc_group" style="float: left;width:220px;font-size:15px;">
                                    <label style="margin-right: 10px;">License No.:</label><span>{{val.licenseNo}}</span></div>
                            </div>
                            <div style="font-size:15px;">
                                <label style="margin-right: 10px;">Note:</label><span>{{val.note ? val.note : '----'}}</span>
                            </div>
                        </div>
                        <div class="order_list" style="margin-bottom: 20px;">
                            <div class="list_box_tit" style="padding: 8px 0px;font-weight: bold;font-size: 15px;">
                                <div>Package Items</div>
                            </div>
                            <table style="border-top: 1px solid rgb(223, 234, 236);width: 100%;">
                                <thead>
                                <tr style="height: 36px;">
                                    <th
                                            style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;font-size:14px;">
                                        No.
                                    </th>
                                    <th
                                            style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;font-size:14px;">
                                        Product
                                    </th>
                                    <th
                                            style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;font-size:14px;">
                                        IMEI
                                    </th>
                                    <th
                                            style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;font-size:14px;">
                                        Quantity
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,key) in val.shipmentPackageItemList" style="height:40px;font-size: 12px;">
                                    <td
                                            style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;font-size: 12px;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                        {{key+1}}
                                    </td>
                                    <td
                                            style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                        {{item.productName}}&nbsp;&nbsp;{{item.productFeature}}
                                    </td>
                                    <td
                                            style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                        <div v-if="item.productType == 'SERIALIZED_INV_ITEM'">
                                            <span v-for="imei in item.imeiList">{{imei}},</span>
                                        </div>
                                        <div v-if="item.productType == 'NON_SERIAL_INV_ITEM'">
                                            <span>----</span>
                                        </div>
                                    </td>
                                    <td
                                            style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                        {{item.quantity}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style="text-align: right;float:right;">
                            <div style="width:300px;text-align: left;margin-bottom:15px;font-size: 14px;"><span style="width:100px;text-align: right;display: inline-block">Signature</span></div>
                            <div style="width:300px;text-align: left;margin-bottom:15px;font-size: 14px;"><span style="width:100px;text-align: right;display: inline-block;margin-right:5px;">Warehouse:</span><span style="border-bottom:1px solid #333;width:150px;display: inline-block;padding-left:10px;"></span>.</div>
                            <div style="width:300px;text-align: left;margin-bottom:15px;font-size: 14px;"><span style="width:100px;text-align: right;display: inline-block;margin-right:5px;">Driver:</span><span style="border-bottom:1px solid #333;width:150px;display: inline-block;padding-left:10px;"></span>.</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
      <div v-if="!type" class="order_btn" style="text-align: center;" v-show="isPrint">
        <el-button @click="printDataBtn(true)" type="primary">Print</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import JsBarcode from 'jsbarcode'
import shippingApi from '~api/warehouse/shippingApi'
export default{
    data () {
        return {
            allShipmentItems: [
            ],
            elems: {arrs: []},
            oPara: {name: '', value: ''},
            type: '',
            isPrint: true,
            timeOut: '',
            loading: false,
	        docu:null,
            type:true,
            printNums:1,
        }
    },
    mounted () {
        var _self = this
	    document.title = 'Print Shipment | Shipping | OCMS-BIM'
        _self.setOptions(_self.$route.params)
        if (_self.oPara.name == 'shipmentId') {
        	_self.type = false;
            _self.getSingleShipmentDatas()
        } else if (_self.oPara.name == 'listShipmentId') {
            _self.getListShipmentDatas()
        }
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
        getListShipmentDatas () {
            var _self = this
            _self.loading = true
            var shipmentIdList = _self.oPara.value.split(',')
            shippingApi.getShipmentPackageListDetail({
                shipmentIdList: shipmentIdList
            }).then(d => {
                if (d.success) {
                    if (d.data) {
                        if(d.data[0].defaultCurrencyUomId == 'GHS'){
                        	_self.printNums = 2;
                        }
	                    _self.allShipmentItems.splice(0)
	                    _self.allShipmentItems = _self.allShipmentItems.concat(d.data)
                        clearTimeout(t)
                        var t = setTimeout(function () {
                            _self.allShipmentItems.forEach(function (item, index) {
                                var elemId = '#barcode' + index
                                var shipmentId = item.shipmentId
                                JsBarcode(elemId, '' + shipmentId, {
                                    format: 'CODE128',
                                    displayValue: true,
                                    fontSize: 24,
                                    fontOptions: 'bold'
                                })
                            })
	                        _self.printData();
                       }, 1000)
                        _self.loading = false
                    }
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.loading = false
                _self.$showErrorMessage(e.message)
            })
        },
        getSingleShipmentDatas () {
            var _self = this
            _self.loading = true
            shippingApi.getShippingPackageDetail({
                shipmentId: _self.oPara.value
            }).then(d => {
                _self.loading = false
                if (d.success) {
                    if (d.data) {
                        _self.allShipmentItems.splice(0)
                        _self.allShipmentItems = _self.allShipmentItems.concat(d.data)
                       clearTimeout(t)
                        var t = setTimeout(function () {
                            _self.allShipmentItems.forEach(function (item, index) {
                                var elemId = '#barcode' + index
                                var shipmentId = item.shipmentId
                                JsBarcode(elemId, '' + shipmentId, {
                                    format: 'CODE128',
                                    displayValue: true,
                                    fontSize: 24,
                                    fontOptions: 'bold'
                                })
                            })
                       }, 1000)
                    }
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.loading = false
                _self.$showErrorMessage(e.message)
            })
        },
	    printDataBtn(isClick){
        	this.isPrint = false;
            this.printData(isClick);
        },
        printData (isClick) {
	    	var _self = this;
	        _self.$nextTick(function(){
	        	let myWindow1 = null;
	        	if(isClick){
			        myWindow1 = window.open('',"_blank");
                }else{
			        myWindow1 = window.open('',"_self");
                }
		        let pElem = document.getElementById('printList').innerHTML
		        myWindow1.document.write(pElem)
		        myWindow1.print();
		        myWindow1.close();
		        if(isClick){
			        _self.isPrint = true;
                }
	        })
        }
    }
}
</script>
