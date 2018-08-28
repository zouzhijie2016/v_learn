<template>
    <div>
        <h1>订单功能列表</h1>
        <div class="list">
            <router-link to="/salesReturn">sales Return</router-link>
            <router-link to="/createSalesReturn">Create Sales Return</router-link>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    created () {
        document.title = 'Order Detail | Order Management | OCMS-BIM'
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
