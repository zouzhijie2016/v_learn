<template>
    <div v-if="priceListDataItem">
        <el-form :inline="true" :model="priceListDataItem" class="formInline" >
            <el-row>
                <el-form-item label="Agent Channel Price" label-width="150px">
                    <input v-if="parentToChildArr.currency != 'GHS'" type="text" v-number.undigit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.agentChannelPrice" @blur="changeAgentChannelPriceEvt" />
                    <input v-else type="text" v-number.digit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.agentChannelPrice" @blur="changeAgentChannelPriceEvt" />
                    <span class="currency_span">{{parentToChildArr.currency}}</span>
                </el-form-item>
                <el-form-item label="Wholesale Channel Price" label-width="170px">
                    <input v-if="parentToChildArr.currency != 'GHS'" type="text" v-number.undigit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.wholesaleChannelPrice" />
                    <input v-else type="text" v-number.digit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.wholesaleChannelPrice" />
                    <span class="currency_span">{{parentToChildArr.currency}}</span>
                </el-form-item>
                <el-form-item label="B2R Channel Price" label-width="150px">
                    <input v-if="parentToChildArr.currency != 'GHS'" type="text" v-number.undigit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.b2RChannelPrice" />
                    <input v-else type="text" v-number.digit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.b2RChannelPrice" />
                    <span class="currency_span">{{parentToChildArr.currency}}</span>
                </el-form-item>
                <el-form-item label="Retail Channel Price" label-width="150px" align="center">
                    <input v-if="parentToChildArr.currency != 'GHS'" type="text" v-number.undigit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.retailChannelPrice" />
                    <input v-else type="text" v-number.digit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.retailChannelPrice" />
                    <span class="currency_span">{{parentToChildArr.currency}}</span>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="Default Cost" label-width="150px">
                    <input v-if="parentToChildArr.currency != 'GHS'" type="text" v-number.undigit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.defaultCost" @blur="changeDefaultCost" />
                    <input v-else type="text" v-number.digit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.defaultCost" @blur="changeDefaultCost" />
                    <span class="currency_span">{{parentToChildArr.currency}}</span>
                </el-form-item>
                <el-form-item label="Banana Cost" label-width="170px" v-if="parentToChildArr.currency != 'GHS'">
                    <input type="text" v-number.undigit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.bananaCost" />
                    <span class="currency_span">{{parentToChildArr.currency}}</span>
                </el-form-item>
                <el-form-item label="Retail Cost" label-width="150px" v-if="parentToChildArr.currency != 'GHS'">
                    <input type="text" v-number.undigit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.retailCost" />
                    <span class="currency_span">{{parentToChildArr.currency}}</span>
                </el-form-item>
                <el-form-item label="Special Cost" label-width="150px" v-if="parentToChildArr.currency != 'GHS'">
                    <input type="text" v-number.undigit.unsign class="common_theme" style="width: 115px" v-model="priceListDataItem.specialCost" />
                    <span class="currency_span">{{parentToChildArr.currency}}</span>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
    props: ['priceListDataItem', 'parentToChildArr'],
    data () {
        return {
        }
    },
    mounted () {
    },
    methods: {
        changeAgentChannelPriceEvt () {
            this.priceListDataItem.bananaCost = this.priceListDataItem.agentChannelPrice
        },
        changeDefaultCost () {
            this.priceListDataItem.retailCost = this.priceListDataItem.defaultCost ? Math.round((this.priceListDataItem.defaultCost - 0) * this.parentToChildArr.retailCost) : this.priceListDataItem.defaultCost
            this.priceListDataItem.specialCost = this.priceListDataItem.defaultCost ? Math.round((this.priceListDataItem.defaultCost - 0) * this.parentToChildArr.specialCost) : this.priceListDataItem.defaultCost
        }
    }
}
</script>
<style>
    .formInline label{
        font-size: 12px;
        text-align: center;
    }
    .currency_span{
        font-size: 12px;
    }
</style>
