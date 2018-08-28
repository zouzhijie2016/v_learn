<template>
    <div>
      <router-link to="/storeSetting">Store Setting</router-link>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    created () {
        document.title = 'Setting | OCMS-BIM'
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
</style>
