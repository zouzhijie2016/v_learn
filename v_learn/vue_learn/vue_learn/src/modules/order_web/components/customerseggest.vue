<template>
    <li @click="selectItem">
        <el-col :title="item.firstName">{{item.firstName}}:{{item.contactNumber}}</el-col>
    </li>
</template>
<script>
export default {
    name: 'CustomerSuggest',
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
