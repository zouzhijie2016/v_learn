<template>
    <div style="padding: 0 18px" v-if="tableListDataItem">
        <el-table :data="tableListDataItem.tableListColumnData" style="width: 100%;font-size: 12px;margin-bottom: 10px">
            <el-table-column v-for="item in tableListDataItem.tableListColumn" :key="item.productFeatureTypeId" :prop="item.productFeatureTypeId" :label="item.productFeatureType" align="center"></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: ['tableListDataItem'],
    data () {
        return {
        }
    }
}
</script>
<style>
</style>
