import Util from './index'

export default {
    async queryStoreList () {
        const result = await Util.post('/api/order/v1/order/queryStoreList')
        return result
    },
	async queryStoreByGroup () {
		const result = await Util.post('/api/store/v1/storeGroup/queryStoreByGroup')
		return result
	},
    async queryIndexInfo (data) {
        const result = await Util.post('/api/order/v1/order/queryIndexInfo', data)
        return result
    },
    async queryProportionOfSale (data) {
        const result = await Util.post('/api/order/v1/order/queryProportionOfSale', data)
        return result
    },
    async querySaleTrendInfo (data) {
        const result = await Util.post('/api/order/v1/order/querySaleTrendInfo', data)
        return result
    },
    async querySalespersonRank (data) {
        const result = await Util.post('/api/order/v1/order/querySalespersonRank', data)
        return result
    },
    async queryStoreRank (data) {
        const result = await Util.post('/api/order/v1/order/queryStoreRank', data)
        return result
    },
    async queryTop5BestSelling (data) {
        const result = await Util.post('/api/order/v1/order/queryTop5BestSelling', data)
        return result
    }

}

