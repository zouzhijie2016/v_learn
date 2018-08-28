let productMixin = {
    created () {
        document.title = 'Product Maintain | Catalog | OCMS-BIM'
        this.selectedUrl = '/createProduct'
    }
}
export {
    productMixin
}

