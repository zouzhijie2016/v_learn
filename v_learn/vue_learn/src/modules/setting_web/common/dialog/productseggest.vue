<template>
    <li @click="selectItem">
        <el-col :title="item">{{item}}</el-col>
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
            type: String,
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
