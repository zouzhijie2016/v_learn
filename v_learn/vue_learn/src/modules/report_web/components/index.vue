<template>
    <div>
        <h1>财务报表列表</h1>
        <div class="list">
            <router-link to="/salesReturnReportList">sales Return Report</router-link>
            <router-link to="/salesReport">sales Report</router-link>
            <router-link to="/operatorSalesReport">Operator Sales Report</router-link>
            <router-link to="/stockinReport">Stockin Report</router-link>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    created () {
        document.title = 'Report Management | Sales Return | OCMS-BIM'
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
