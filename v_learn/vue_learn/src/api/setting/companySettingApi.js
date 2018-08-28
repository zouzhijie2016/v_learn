/**
 * Created by zhijie.zou.gong on 2017/12/18.
 */
import Util from './../index'

export default {
    async findCompaniesByConditions (data) {
        const result = await Util.post('/api/party/v1/company/findCompaniesByConditions', data)
        return result
    },
    async findCompanyByGinvenId (data) {
        const result = await Util.post('/api/party/v1/company/findCompanyByGinvenId', data)
        return result
    },
    async findCompanyName (data) {
        const result = await Util.post('/api/party/v1/company/findCompanyName', data)
        return result
    },
    async createCompany (data) {
        const result = await Util.post('/api/party/v1/company/createCompany', data)
        return result
    },
    async updateCompany (data) {
        const result = await Util.post('/api/party/v1/company/updateCompany', data)
        return result
    },
    async checkCompanyName (data) {
        const result = await Util.post('/api/party/v1/company/checkCompanyName', data)
        return result
    }
}

