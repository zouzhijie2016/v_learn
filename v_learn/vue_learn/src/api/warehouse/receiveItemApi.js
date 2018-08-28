/**
 * Created by qinghua.gong on 2017/10/26.
 */
import Util from './../index'

export default {
    async checkReceiveProduct (data) {
        const result = await Util.post('/api/warehouse/v1/productStock/checkBlukReceiveProduct',data)
        return result
    },
	async receiveInventoryProduct (data) {
		const result = await Util.post('/api/warehouse/v1/productStock/bulkReceiveInventoryProduct',data)
		return result
	},
}

