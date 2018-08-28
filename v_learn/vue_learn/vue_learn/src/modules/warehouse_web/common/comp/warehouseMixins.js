/**
 * Created by qinghua.gong on 2017/11/28.
 */
let myShippingMixin = {
    created () {
        document.title = 'Shipping | Warehouse | OCMS-BIM'
        this.selectedUrl = '/shippingNeedOrderList'
    }
}
let myInventoryMixin = {
    created () {
        document.title = 'Inventory | Warehouse | OCMS-BIM'
        this.selectedUrl = '/receiveInventoryItem'
    }
}
export {myShippingMixin, myInventoryMixin}

