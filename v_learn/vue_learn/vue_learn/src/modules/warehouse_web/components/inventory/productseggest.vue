<template>
    <li @click="selectItem">
        <el-col :title="item.productId" :span="6">{{item.productId}}</el-col>
        <el-col  :title="item.model" :span="11">{{item.model}}</el-col>
        <el-col v-if="item.description" :title="item.description" :span="7">{{item.description}}</el-col>
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
            console.log('emit!!')
            this.$emit('click', this.item, e.currentTarget)
        }
    }
}
</script>
<style scoped>
    .el-col{
        text-overflow: ellipsis;
        overflow: hidden;
    }

    li:active{
        background: #1FBCD2;
    }
</style>