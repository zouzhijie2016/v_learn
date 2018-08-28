<template>
    <li @click="selectItem">
        <el-col>{{item.driverName}}</el-col>
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
        overflow: hidden;
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
