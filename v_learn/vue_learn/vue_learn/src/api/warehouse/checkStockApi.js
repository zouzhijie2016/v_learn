/**
 * Created by qinghua.gong on 2017/10/26.
 */
import Util from './../index'

export default {
    async getProductLists (data) {
        const result = await Util.postUrl('/ordermgr/control/new_gwtSuggestProductForCart',data)
        return result
    },
    async findProfixImei (data) {
        const result = await Util.post('/api/warehouse/v1/inventoryCheck/findProfixImei',data)
        return result
    },
	async queryFacility (data) {
		const result = await Util.post('/api/warehouse/v1/inventoryItem/queryFacility')
		return result
	},
	async exportStockData (data) {
		const result = await Util.getDownload('/api/warehouse/v1/inventoryCheck/exportTakeStockLog', data)
		return result
	},
	async downloadTemplate (data) {
		const result = await Util.getDownload('/commondefine_file/barcode-non-serialized.xls', data)
		return result
	},
	async getStockLogByCondition (data) {
		const result = await Util.post('/api/warehouse/v1/inventoryCheck/findTakeStockLogByCondition',data)
		return result
	},
	async getStockLogDetailById (data) {
		const result = await Util.get('/api/warehouse/v1/inventoryCheck/findTakeStockDetailLogById/'+data)
		return result
	},
	checkIMEIInventory: Util.createClass({
		method: 'post',
		url: '/api/warehouse/v1/inventoryCheck/checkIMEIInventory'
	}),
	checkEANInventory: Util.createClass({
		method: 'post',
		url: '/api/warehouse/v1/inventoryCheck/checkNonIMEIInventory'
	}),

}

