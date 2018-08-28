<template>
    <div class="editPrice">
        <div class="editPrice_info">
            <el-form :inline="true" :model="editPriceForm">
                <el-row :gutter="20">
                    <el-col :span="5">
                        <el-form-item label="Product ID: ">
                            <span>{{ editPriceForm.productId }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Model: ">
                            <span>{{ editPriceForm.internalName }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Brand Name: ">
                            <span>{{ editPriceForm.brandName }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="editPrice_table">
            <div class="editPrice_table_title">Select Products</div>
            <el-table :data="tableData" style="width: 100%;font-size: 12px" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column v-for="item in dataTableList" :key="item.productFeatureTypeId" :prop="item.productFeatureTypeId" :label="item.productFeatureType" align="center"></el-table-column>
            </el-table>
        </div>
        <div class="editPrice_list">
            <div class="editPrice_list_title">Price Maintenance</div>
            <div class="editPrice_list_component">
                <div class="editPrice_condition">
                    <price-list :parentToChildArr.sync="parentToChildArr" :priceListDataItem.sync="defaultItem"></price-list>
                </div>
                <div class="editPrice_operator">
                    <div class="editPrice_btn">
                        <el-button type="primary" icon="el-icon-edit" @click="batchEditPriceEvt">Batch Edit Price</el-button>
                    </div>
                    <div class="editPrice_currency">
                        <label style="font-size: 12px">Currency</label>
                        <el-select v-model="parentToChildArr.currency" style="width: 130px" @change="changeCurrencyEvt">
                            <el-option
                                    v-for="item in currencyList"
                                    :key="item.currencyId"
                                    :label="item.currencyName"
                                    :value="item.currencyId">
                            </el-option>
                        </el-select>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            </div>
            <div class="editPrice_list_content" v-if="priceListData.length">
                <template>
                    <div v-for="item in priceListData">
                        <table-list :tableListDataItem.sync="item"></table-list>
                        <price-list :parentToChildArr.sync="parentToChildArr" :priceListDataItem.sync="item"></price-list>
                    </div>
                </template>
            </div>
        </div>
        <div class="editPrice_submit">
            <el-button class="submitBtn" :loading="submitBtnLoading" @click="submitBtnEvt" type="primary" icon="el-icon-check">Submit</el-button>
        </div>
    </div>
</template>
<script>
import Utils from '~utils/index'
import priceList from './priceList.vue'
import tableList from './tableList.vue'
import productApi from '~api/productapi'
export default {
    data () {
        return {
            submitBtnLoading: false,
            editPriceForm: {
                productId: '',
                internalName: '',
                brandName: ''
            },
            dataTableList: [],
            tableData: [],
            parentToChildArr: {
                currency: '',
                retailCost: 0,
                specialCost: 0
            },
            currencyList: [],
            priceListData: [],
            defaultItem: {
                productId: '',
                agentChannelPrice: '',
                wholesaleChannelPrice: '',
                b2RChannelPrice: '',
                retailChannelPrice: '',
                defaultCost: '',
                bananaCost: '',
                retailCost: '',
                specialCost: ''
            }
        }
    },
    components: {
        priceList,
        tableList
    },
    created () {
        var productId = this.$route.params.productId
        if (!productId) {
            productId = this.$route.query.productId
        }
        if (!productId) {
            this.$message('ProductID is null')
            return false
        }
        productApi.productPriceFindProductsInfo({
            productId: productId
        }).then(d => {
            if (d.success == true) {
                if (d.data) {
                    this.parentToChildArr.retailCost = d.data.retailCost
                    this.parentToChildArr.specialCost = d.data.specialCost
                    this.parentToChildArr.currency = d.data.uomId
                    this.currencyList = this.currencyList.splice(0)
                    this.currencyList.push({
                        currencyId: d.data.uomId,
                        currencyName: d.data.uomId
                    })
                }
                if (d.data && d.data.productInfo) {
                    this.editPriceForm.productId = d.data.productInfo.productId
                    this.editPriceForm.internalName = d.data.productInfo.internalName
                    this.editPriceForm.brandName = d.data.productInfo.brandName
                }
                if (d.data && d.data.productFeatureHeadList) {
                    this.dataTableList = this.dataTableList.splice(0)
                    this.dataTableList = this.dataTableList.concat(d.data.productFeatureHeadList, [{
                        'productFeatureTypeId': 'productId',
                        'productFeatureType': 'Product ID'
                    }])
                } else {
                    this.dataTableList = this.dataTableList.concat([{
                        'productFeatureTypeId': 'productId',
                        'productFeatureType': 'Product ID'
                    }])
                }
                if (d.data && d.data.productFeatureList) {
                    this.tableData = this.tableData.splice(0)
                    for (var i = 0; i < d.data.productFeatureList.length; i++) {
                        var objKey = {}
                        for (var k = 0; k < this.dataTableList.length; k++) {
                            if (this.dataTableList[k].productFeatureTypeId == 'productId') {
                                objKey[this.dataTableList[k].productFeatureTypeId] = (d.data.productFeatureList)[i][this.dataTableList[k].productFeatureTypeId]
                            } else {
                                objKey[this.dataTableList[k].productFeatureTypeId] = (d.data.productFeatureList)[i][this.dataTableList[k].productFeatureTypeId].description
                            }
                        }
                        this.tableData.push(objKey)
                    }
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })
    },
    methods: {
        handleSelectionChange (value) {
            if (value.length > 0) {
                var productList = value.map((data) => {
                    return data.productId
                })
                productApi.findAllcheckedProductPrice({
                    productList: productList
                }).then(d => {
                    if (d.success == true) {
                        this.priceListData.splice(0)
                        if (d.data && d.data.productIdMap) {
                            for (var n = 0; n < value.length; n++) {
                                let objList = {
                                    productId: value[n].productId,
                                    agentChannelPrice: '',
                                    wholesaleChannelPrice: '',
                                    b2RChannelPrice: '',
                                    retailChannelPrice: '',
                                    defaultCost: '',
                                    bananaCost: '',
                                    retailCost: '',
                                    specialCost: '',
                                    tableListColumn: this.dataTableList,
                                    tableListColumnData: [value[n]]
                                }
                                if (d.data.productIdMap[value[n].productId]) {
                                    var productIdMapList = d.data.productIdMap[value[n].productId]
                                    for (var m = 0; m < productIdMapList.length; m++) {
                                        if (productIdMapList[m].productStoreGroupId == 'RETAIL_COST_PRICE') {
                                            objList.retailCost = productIdMapList[m].price
                                        }
                                        if (productIdMapList[m].productStoreGroupId == 'EGATEE_COST_PRICE') {
                                            objList.bananaCost = productIdMapList[m].price
                                        }
                                        if (productIdMapList[m].productStoreGroupId == 'WHOLESALE') {
                                            objList.wholesaleChannelPrice = productIdMapList[m].price
                                        }
                                        if (productIdMapList[m].productStoreGroupId == 'SPECIAL_COST_PRICE') {
                                            objList.specialCost = productIdMapList[m].price
                                        }
                                        if (productIdMapList[m].productStoreGroupId == 'RETAIL') {
                                            objList.retailChannelPrice = productIdMapList[m].price
                                        }
                                        if (productIdMapList[m].productStoreGroupId == 'DEFAULT_COST_PRICE') {
                                            objList.defaultCost = productIdMapList[m].price
                                        }
                                        if (productIdMapList[m].productStoreGroupId == 'B2R') {
                                            objList.b2RChannelPrice = productIdMapList[m].price
                                        }
                                        if (productIdMapList[m].productStoreGroupId == 'AGENT') {
                                            objList.agentChannelPrice = productIdMapList[m].price
                                        }
                                    }
                                    this.priceListData.push(objList)
                                }
                            }
                        }
                    } else {
                        this.$showErrorMessage(d.message)
                    }
                }).catch(err => {
                    this.$showErrorMessage(err)
                })
            } else {
                this.priceListData = []
            }
        },
        batchEditPriceEvt () {
            let length = this.priceListData.length
            if (length == 0) {
                this.$message('Please select products.')
                return false
            }

            for (let j = 0; j < this.priceListData.length; j++) {
                if (this.priceListData[j].agentChannelPrice == '') {
                    this.priceListData[j].agentChannelPrice = this.defaultItem.agentChannelPrice
                }
                if (this.priceListData[j].wholesaleChannelPrice == '') {
                    this.priceListData[j].wholesaleChannelPrice = this.defaultItem.wholesaleChannelPrice
                }
                if (this.priceListData[j].b2RChannelPrice == '') {
                    this.priceListData[j].b2RChannelPrice = this.defaultItem.b2RChannelPrice
                }
                if (this.priceListData[j].retailChannelPrice == '') {
                    this.priceListData[j].retailChannelPrice = this.defaultItem.retailChannelPrice
                }
                if (this.priceListData[j].defaultCost == '') {
                    this.priceListData[j].defaultCost = this.defaultItem.defaultCost
                }
                if (this.priceListData[j].bananaCost == '') {
                    this.priceListData[j].bananaCost = this.defaultItem.bananaCost
                }
                if (this.priceListData[j].retailCost == '') {
                    this.priceListData[j].retailCost = this.defaultItem.retailCost
                }
                if (this.priceListData[j].specialCost == '') {
                    this.priceListData[j].specialCost = this.defaultItem.specialCost
                }
            }
        },
        changeCurrencyEvt (value) {
            this.parentToChildArr.currency = value
        },
        submitBtnEvt () {
            var defaultCostFlag = false
            var agentChannelPriceFlag = false
            var messageList = []
            this.submitBtnLoading = true
            if (this.priceListData.length == 0) {
                this.submitBtnLoading = false
                this.$message.info('Products no selected.')
                return false
            }
            for (var s = 0; s < this.priceListData.length; s++) {
                if (this.priceListData[s].agentChannelPrice == '') {
                    agentChannelPriceFlag = true
                }
                if (this.priceListData[s].defaultCost == '') {
                    defaultCostFlag = true
                }
            }

            if (agentChannelPriceFlag && defaultCostFlag) {
                this.submitBtnLoading = false
                this.$message.info('Please input the agent channel price and default cost.')
                return false
            }
            if (agentChannelPriceFlag) {
                this.submitBtnLoading = false
                this.$message.info('Please input the agent channel price.')
                return false
            }
            if (defaultCostFlag) {
                this.submitBtnLoading = false
                this.$message.info('Please input the default cost.')
                return false
            }

            var objKeyArr = {
                productPriceTypeId: 'DEFAULT_PRICE',
                productPricePurposeId: 'PURCHASE',
                currencyUomId: this.parentToChildArr.currency,
                fromDate: Utils.getServerTimestamp(new Date()),
                termUomId: null,
                customPriceCalcService: null
            }
            for (var l = 0; l < this.priceListData.length; l++) {
                messageList.push(Utils.extend({}, objKeyArr, {
                    productId: this.priceListData[l].productId,
                    productStoreGroupId: 'EGATEE_COST_PRICE',
                    price: (this.parentToChildArr.currency == 'GHS') ? '' : this.priceListData[l].bananaCost
                }))
                messageList.push(Utils.extend({}, objKeyArr, {
                    productId: this.priceListData[l].productId,
                    productStoreGroupId: 'RETAIL_COST_PRICE',
                    price: (this.parentToChildArr.currency == 'GHS') ? '' : this.priceListData[l].retailCost
                }))
                messageList.push(Utils.extend({}, objKeyArr, {
                    productId: this.priceListData[l].productId,
                    productStoreGroupId: 'RETAIL',
                    price: this.priceListData[l].retailChannelPrice
                }))
                messageList.push(Utils.extend({}, objKeyArr, {
                    productId: this.priceListData[l].productId,
                    productStoreGroupId: 'B2R',
                    price: this.priceListData[l].b2RChannelPrice
                }))
                messageList.push(Utils.extend({}, objKeyArr, {
                    productId: this.priceListData[l].productId,
                    productStoreGroupId: 'DEFAULT_COST_PRICE',
                    price: this.priceListData[l].defaultCost
                }))
                messageList.push(Utils.extend({}, objKeyArr, {
                    productId: this.priceListData[l].productId,
                    productStoreGroupId: 'AGENT',
                    price: this.priceListData[l].agentChannelPrice
                }))
                messageList.push(Utils.extend({}, objKeyArr, {
                    productId: this.priceListData[l].productId,
                    productStoreGroupId: 'WHOLESALE',
                    price: this.priceListData[l].wholesaleChannelPrice
                }))
                messageList.push(Utils.extend({}, objKeyArr, {
                    productId: this.priceListData[l].productId,
                    productStoreGroupId: 'SPECIAL_COST_PRICE',
                    price: (this.parentToChildArr.currency == 'GHS') ? '' : this.priceListData[l].specialCost
                }))
            }

            productApi.oneKeyUpdateAllProductPrice({
                productPriceList: messageList
            }).then(d => {
                this.submitBtnLoading = false
                if (d.success == true) {
                    this.$alert('Edit price success', 'Title', {
                        confirmButtonText: 'Confirm',
                        callback: () => {
                            this.$router.push({
                                path: '/productsList'
                            })
                        }
                    })
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                this.submitBtnLoading = false
                this.$showErrorMessage(err)
            })
        }
    }
}
</script>
<style>
    .editPrice{
        background: #ffffff;
        padding: 0 10px 10px 10px;
    }
    .editPrice_list{
        margin-top: 15px;
    }
    .editPrice_table_title,
    .editPrice_list_title{
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-weight: bold;
    }
    .editPrice_operator{
        width: 100%;
        padding: 10px 18px;
    }
    .editPrice_currency,
    .editPrice_btn{
        float: right;
    }
    .editPrice_currency{
        margin-right: 15px;
    }
    .editPrice_submit{
        margin-top: 10px;
        width: 100%;
        text-align: right;
    }
    .editPrice_submit .submitBtn{
        margin-right: 18px;
    }
    .editPrice_list_content{
        padding: 15px 0;;
    }
</style>
