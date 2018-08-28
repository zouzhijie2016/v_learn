
var routes = [
    {path: '/', name: 'default', component: r => require(['~warehouse-components/index.vue'], r), meta: {keepAlive: true}},
    {path: '/changeproductmodel', name: 'changeproductmodel', component: r => require(['~warehouse-components/inventory/index.vue'], r)},
    {path: '/newFindInventoryItem', name: 'newFindInventoryItem', component: r => require(['~warehouse-components/inventory/newFindInventoryItem.vue'], r)},
    {path: '/newFindInventoryItemLog/:sParams', name: 'newFindInventoryItemLog', component: r => require(['~warehouse-components/inventory/newFindInventoryItemLog.vue'], r)},
    {path: '/demo/table', name: 'table', component: r => require(['~warehouse-components/demo/table.vue'], r), meta: {keepAlive: true}},
    {path: '/shippingNeedOrderList', name: 'shippingNeedOrderList', component: r => require(['~warehouse-components/shipping/shippingNeedOrderList.vue'], r)},
    {path: '/printPackageData/:sParams',
        name: 'printPackageData',
        component: r => require(['~warehouse-common/comp/printPackageData.vue'], r),
        meta: {
            isHeaderHide: true,
            isFooterHide: true
        }},
    {path: '/printShipmentData/:sParams',
        name: 'printPackageData',
        component: r => require(['~warehouse-common/comp/printShipmentData.vue'], r),
        meta: {
            isHeaderHide: true,
            isFooterHide: true
        }},
    {path: '/parkOrder', name: 'parkOrder', component: r => require(['~warehouse-components/shipping/parkOrder.vue'], r)},
    {path: '/parkOrderToPack', name: 'parkOrderToPack', component: r => require(['~warehouse-components/shipping/parkOrderToPack.vue'], r)},
    {path: '/parkOrderToComplete', name: 'parkOrderToComplete', component: r => require(['~warehouse-components/shipping/parkOrderToComplete.vue'], r)},
    {path: '/scheduleShipment', name: 'scheduleShipment', component: r => require(['~warehouse-components/shipping/scheduleShipment.vue'], r)},
    {path: '/completeShipment', name: 'completeShipment', component: r => require(['~warehouse-components/shipping/completeShipment.vue'], r)},
    {path: '/newInventoryLog', name: 'newInventoryLog', component: r => require(['~warehouse-components/inventory/newInventoryLog.vue'], r)},
    {path: '/requireInventory', name: 'requireInventory', component: r => require(['~warehouse-components/inventory/requireInventory/index.vue'], r)},
    {path: '/operatorApplication',
        name: 'operatorApplication',
        component: r => require(['~warehouse-components/inventory/requireInventory/operatorApplication.vue'], r),
        meta: {
            isHeaderHide: true,
            isFooterHide: true
        }
    },
    {path: '/viewOperatorApplication',
        name: 'viewOperatorApplication',
        component: r => require(['~warehouse-components/inventory/requireInventory/viewOperatorApplication.vue'], r),
        meta: {
            isHeaderHide: true,
            isFooterHide: true
        }
    },
    {path: '/managerApproveApplication',
        name: 'managerApproveApplication',
        component: r => require(['~warehouse-components/inventory/requireInventory/managerApproveApplication.vue'], r),
        meta: {
            isHeaderHide: true,
            isFooterHide: true
        }
    },
    {path: '/warehouseApproveApplication',
        name: 'warehouseApproveApplication',
        component: r => require(['~warehouse-components/inventory/requireInventory/warehouseApproveApplication.vue'], r),
        meta: {
            isHeaderHide: true,
            isFooterHide: true
        }
    },
	{path: '/receiveItem',
		name: 'receiveItem',
		component: r => require(['~warehouse-components/inventory/receiveItem/index.vue'], r),
		meta: {
			isContentSelf: true
		}
	},
	  {path: '/checkStock', name: 'checkStock', component: r => require(['~warehouse-components/inventory/checkStock.vue'], r)},
	  {path: '/stockLogDetail/:sParams', name: 'stockLogDetail', component: r => require(['~warehouse-components/inventory/stockLogDetail.vue'], r)},
    {path: '/IMEIManagerment', name: 'IMEIManagerment', component: r => require(['~warehouse-components/inventory/imeimanagerment.vue'], r)},
]
// export default routes
module.exports = routes
