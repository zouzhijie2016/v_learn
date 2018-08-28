<template>
  <div>
    <h1>模块功能列表</h1>
    <div class="list">
      <router-link to="/changeproductmodel">Change Product Model</router-link>
      <router-link to="/newFindInventoryItem">Find Inventory Item</router-link>
      <router-link to="/checkStock">Check Stock</router-link>
      <router-link to="/demo/table">Demo table</router-link>
    </div>
  </div>
</template>
<script>
import * as types from '~store/mutation-types'
export default {
    data () {
        return {}
    },
    created () {
        document.title = 'Inventory | Warehouse | OCMS-BIM'
        this.setSelectedUrl()
    },
    activated () {
        this.setSelectedUrl()
    },
    methods: {
        setSelectedUrl () {
            this.selectedUrl = location.href
        }
    },
    mounted () {
        this.$store.commit(types.WH_TEST_PROPERTY, 'aaaaa')
    }
}
</script>
<style scoped>
  a {
    display: block;
  }

  .list {
    margin: 0 auto;
    text-align: center;
  }
</style>
