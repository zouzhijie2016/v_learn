import Util from './index'

export default {
    async findProductInfoBykeyWord (data) {
        const result = await Util.post('/api/product/v1/product/findProductInfoBykeyWord', data)
        return result
    },
    async selectProductCategoryByParentId (data) {
        const result = await Util.post('/api/product/v1/productCategory/selectProductCategoryByParentId', data)
        return result
    },
    async lookupProductInfoAjax (data) {
        const result = await Util.post('/api/product/v1/product/findProductList', data)
        return result
    },
    async exportProductList (data) {
        const result = await Util.getDownload('/api/product/v1/product/ExportProductList', data)
        return result
    },
    async productListPermission () {
        const result = await Util.post('/api/party/v1/product/productListPermission')
        return result
    },
    async productPriceFindProductsInfo (data) {
        const result = await Util.post('/api/price/v1/productPrice/productPriceFindProductsInfo', data)
        return result
    },
    async findAllcheckedProductPrice (data) {
        const result = await Util.post('/api/price/v1/productPrice/findAllcheckedProductPrice', data)
        return result
    },
    async oneKeyUpdateAllProductPrice (data) {
        const result = await Util.post('/api/price/v1/productPrice/oneKeyUpdateAllProductPrice', data)
        return result
    },
    async getClassficationList () {
        const result = await Util.post('/api/product/v1/productCategory/queryAllProductCategoryAndSequenceNum')
        return result
    },
    async selectProductCategory (data) {
        const result = await Util.post('/api/product/v1/productCategory/selectProductCategoryByParentId', data)
        return result
    },
    async selectProductCategoryFeature (data) {
        const result = await Util.post('/api/product/v1/productCategory/listCategoryFeatureTreeBycategoryID', data)
        return result
    },
    async editProductCategoryFeature (data) {
        const result = await Util.post('/api/product/v1/productFeatureTypeCategory/editFeatureTypeCategory', data)
        return result
    },
    async moveProductCategory (data) {
        const result = await Util.post('/api/product/v1/productCategoryRollup/moveClassfication', data)
        return result
    },
    async editProductCategory (data) {
        const result = await Util.post('/api/product/v1/productCategory/editClassfication', data)
        return result
    },
    async deleteProductCategory (data) {
        const result = await Util.post('/api/product/v1/productCategory/deleteClassfication', data)
        return result
    },
    async createProductCategory (data) {
        const result = await Util.post('/api/product/v1/productCategory/newProductCategory', data)
        return result
    },
    async quickListClassfication (data) {
        const result = await Util.post('/catalog/control/QuickListClassfication', data)
        return result
    },
    async listGivenClassfication (data) {
        const result = await Util.post('/catalog/control/ListGivenClassfication', data)
        return result
    },
    async createClassfication (data) {
        const result = await Util.post('/api/product/v1/productCategory/CreateClassfication', data)
        return result
    },
    async listCategoryFeatureTree (data) {
        const result = await Util.post('/catalog/control/listCategoryFeatureTree', data)
        return result
    },
    async anotherAddVariantProduct (data) {
        const result = await Util.post('/catalog/control/anotherAddVariantProduct', data)
        return result
    },
    async findAllProductFeature (data) {
        const result = await Util.post('/catalog/control/findAllProductFeature', data)
        return result
    },
    async findTableHead (data) {
        const result = await Util.post('/catalog/control/findTableHead', data)
        return result
    },
    async syncProductApi (data) {
        const result = await Util.post('/catalog/control/syncProductApi', data)
        return result
    },
    async createProductAndGotoPrice (data) {
        const result = await Util.post('/catalog/control/createProductAndGotoPrice', data)
        return result
    },
    async findProductAndCategory (data) {
        const result = await Util.post('/catalog/control/findProductAndCategory', data)
        return result
    },
    async newCreateProductFeatureType (data) {
        const result = await Util.post('/catalog/control/newCreateProductFeatureType', data)
        return result
    },
    async newAddProduceFeatur (data) {
        const result = await Util.post('/catalog/control/newAddProduceFeatur', data)
        return result
    },
    async editProductFeature (data) {
        const result = await Util.post('/catalog/control/editProductFeature', data)
        return result
    },
    async editProductFeatureType (data) {
        const result = await Util.post('/catalog/control/editProductFeatureType', data)
        return result
    },
    async deleteProduceFeature (data) {
        const result = await Util.post('/catalog/control/deleteProduceFeature', data)
        return result
    },
    async deleteProductFeatureType (data) {
        const result = await Util.post('/catalog/control/deleteProductFeatureType', data)
        return result
    },
    async updateGoodIdentificationinfo (data) {
        const result = await Util.post('/catalog/control/updateGoodIdentificationinfo', data)
        return result
    },
    async updateProductIsActive (data) {
        const result = await Util.post('/catalog/control/updateProductIsActive', data)
        return result
    }
}

