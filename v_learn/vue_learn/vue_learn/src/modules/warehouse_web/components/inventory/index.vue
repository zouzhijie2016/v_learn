<template>
    <div>
        <LeftMenu></LeftMenu>
        <div class="center_main">
            <el-tabs class="tab_box" v-model="activeName2" type="border-card">
                <el-tab-pane label="Modify Model" name="first">
                    <ModifyModel v-if="activeName2==='first'"></ModifyModel>
                </el-tab-pane>
                <el-tab-pane label="Modification Logs" name="second">
                    <ModificationLogs v-if="activeName2==='second'"></ModificationLogs>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import {myInventoryMixin} from '~warehouse-common/comp/warehouseMixins'
export default {
    data () {
        return {
            activeName2: 'first'
        }
    },
    mixins: [myInventoryMixin],
    methods: {},
    mounted () {
        document.title = 'Inventory | Warehouse | OCMS-BIM'
    },
    updated () {
    },
    components: {
        LeftMenu: () => import('~warehouse-common/comp/leftmenu.vue'),
        ModifyModel: () => import('./changeproductmodel.vue'),
        ModificationLogs: () => import('./imeimodifylogs.vue')
    }
}
</script>
<style scoped>
    .tab_box{
        background: #fff;
    }
    .center_main {
        overflow-y: auto;
        zoom: 1;
        width: 100%;
        transition: margin-right 0.3s ease-in-out;
        padding-left: 188px;
        min-height: 300px;
    }
</style>
