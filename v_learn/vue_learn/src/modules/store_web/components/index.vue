<template>
    <div>
        <h1>Store</h1>
        <div class="list">
            <router-link to="/shipmentWarehouse?productStoreId=10170">Shipment Warehouse</router-link>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    created () {
        document.title = 'Shipment Warehouse | Store | OCMS-BIM'
        this.setSelectedUrl()
    },
    activated () {
        this.setSelectedUrl()
    },
    methods: {
        setSelectedUrl () {
            this.selectedUrl = location.href
        }
    }
}
</script>
<style scoped>
    a{
        display: block;
    }
    .list{
        margin:0 auto;
        text-align:center;
    }
</style>
