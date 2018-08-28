<template>
    <li @click="selectItem">
        <el-col v-if="item.description" :title="item.productId">{{item.productId}}:{{item.description}}</el-col>
        <el-col v-else :title="item.productId">{{item.productId}}</el-col>
    </li>
</template>
<script>
export default {
    name: 'ProductSuggest',
    data () {
        return {}
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    methods: {
        selectItem (e) {
            this.$emit('click', this.item, e.currentTarget)
        }
    }
}
</script>
<style scoped>
    li{
        width: 100%;
    }
    .el-col{
        float: left;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    li:active{
        background: #1FBCD2;
    }
</style>