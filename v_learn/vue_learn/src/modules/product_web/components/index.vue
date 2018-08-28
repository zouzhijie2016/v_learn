<template>
    <div>
        <h1>Catalog</h1>
        <div class="list">
            <router-link to="/productsList">Products List</router-link>
          <router-link to="/category">category</router-link>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    created () {
        document.title = 'Products List | Catalog | OCMS-BIM'
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
