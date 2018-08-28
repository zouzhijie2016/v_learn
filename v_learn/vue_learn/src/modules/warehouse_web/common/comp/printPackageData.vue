<template>
  <div style="padding: 30px 50px;" v-loading="initLoading" element-loading-text="Loading...">
    <div class="print_list" id="printList" style="width: 800px;margin: 0 auto;">
        <template v-if="allPackageItems.packageList.length > 0">
            <div v-for="i in printNums">
                <div v-for="(val,index) in allPackageItems.packageList"
           style="margin-bottom:20px;border: 1px solid #333;padding:20px;">
        <div class="print_list_title"
             style="width:700px;margin:0 auto;padding: 10px 0px;font-weight: bold;font-size: 24px;vertical-align:middle;line-height:30px;">
          Package#{{ val.packageId }}<img style="width:220px;height:80px;display:inline-block;vertical-align:middle;" v-bind:id="'barcode'+index"/>
        </div>
        <div class="order_desc" style="width:700px;margin:0 auto;">
          <div style="overflow: hidden;width:100%;margin-bottom:15px;">
            <div class="order_desc_group" style="width:45%;float:left;margin-bottom: 5px;font-size:15px;">
              <label style="margin-right: 10px;">Shipment ID:</label><span>{{val.shipmentId}}</span>
            </div>
            <div class="order_desc_group" style="width:45%;float:left;margin-bottom: 5px;font-size:15px;">
              <label style="margin-right: 10px;">Belongs to Order:</label><span>{{val.belongToOrder}}</span>
            </div>
          </div>
          <div style="overflow: hidden;width:100%">
            <div class="order_desc_group" style="width:100%;margin-bottom: 5px;font-size:16px;">
              <label style="margin-right: 10px;width:140px;text-align: right;">To Address:</label><span style="border-bottom:1px solid #333;">{{val.toAddress}}</span>
            </div>
              <div class="order_desc_group" style="width:100%;margin-bottom: 5px;font-size:16px;">
                  <label style="margin-right: 10px;width:140px;text-align: right;">Receive:</label><span style="border-bottom:1px solid #333;">{{val.receiveName ? val.receiveName : '----'}}, {{val.receivePhone ? val.receivePhone : '----'}}</span>
              </div>
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
                style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;font-size:14px;">
                Quantity
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in val.packageItemList" style="height:40px;font-size:12px;">
              <td
                style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;font-size: 12px;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                {{index+1}}
              </td>
              <td
                style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                {{item.productName}}&nbsp;&nbsp;{{item.productFeature}}
              </td>
              <td
                style="border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                {{item.quantity}}
              </td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
            </div>
        </template>
    </div>
  </div>
</template>
<script>
import JsBarcode from 'jsbarcode'
import shippingApi from '~api/warehouse/shippingApi'
export default{
    data () {
        return {
            initLoading: false,
            allPackageItems: {},
            elems: {arrs: []},
            oPara: {name: '', value: ''},
            isPrint: true,
            timeOut: '',
            printNums:1,
        }
    },
    mounted () {
        var _self = this
	    document.title = 'Print Package | Shipping | OCMS-BIM'
        _self.setOptions(_self.$route.params)
        if (_self.oPara.name != 'orderId') {
            return false
        }
        _self.getOrderDatas()
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
        getOrderDatas () {
            var _self = this
            var orderId = _self.oPara.value
            _self.initLoading = true
            shippingApi.getPackedCompleteOrder({
                orderId: orderId
            }).then(d => {
                if (d.success) {
                    if (d.data) {
                        _self.allPackageItems = d.data
                        _self.formatDatas()
                    }
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.initLoading = false
                _self.$showErrorMessage(e.message)
            })
        },
        formatDatas () {
            var _self = this
            var total = 0
            var packageIds = []
            if(_self.allPackageItems.defaultCurrencyUomId == 'GHS'){
            	_self.printNums = 1;
            }
            _self.allPackageItems.packageList.forEach(function (val, index) {
                packageIds.push(val.packageId)
                val.warehouseName = _self.allPackageItems.warehouseName
                val.toAddress = _self.allPackageItems.toAddress
                val.belongToOrder = _self.allPackageItems.orderId
	            val.receiveName = _self.allPackageItems.receiveName
	            val.receivePhone = _self.allPackageItems.receivePhone
                _self.elems.arrs.push({name: '#barcode' + index, packageId: val.packageId})
                val.packageItemList.forEach(function (item, key) {
                    item.id = key + 1
                    total += parseFloat(item.quantity)
                })
                val.packageItemList.push({id: 'Total', product: '', quantity: total})
            })
            clearTimeout(t)
            var t = setTimeout(function () {
                for (let i = 0; i < packageIds.length; i++) {
                    var elemId = '#barcode' + i
                    var packageId = packageIds[i]
                    JsBarcode(elemId, '' + packageId, {
                        format: 'CODE128',
                        displayValue: true,
                        fontSize: 24,
                        fontOptions: 'bold'
                    })
                }
               _self.printData();
            }, 1000)
            _self.initLoading = false
        },
	    printData () {
		    this.$nextTick(function(){
			    let myWindow1 = window.open('',"_self");
			    let pElem = document.getElementById('printList').innerHTML
			    myWindow1.document.write(pElem)
			    myWindow1.print();
			    myWindow1.close()
		    })
	    }
    }
}
</script>
