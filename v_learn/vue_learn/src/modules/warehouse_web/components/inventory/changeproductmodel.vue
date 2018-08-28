<template>
    <div>
        <div class="search_box">
            <!--<div class="search_box_tit">Search IMEI Product</div>-->
            <div class="search">
                <span style="width: 60px"> IMEI：</span>
                <input ref="imei" type="text" class="common_theme" style="width: 300px;" @keyup.enter="scanQRCode"
                       v-model.trim="search.imei"></input>
                <el-button :loading="search.loading" @click="searchIMEI" type="primary">Add
                </el-button>
                <span class="err_kwd">{{search.errmsg}}</span>
            </div>
        </div>
        <div class="list_box">
            <el-table border
                      max-height="450"
                      :data="imeiList"
                      :row-class-name="tableRowClassName"
                      empty-text="There is no IMEI commodity data."
                      class="imei_table">
                <el-table-column
                        label="No."
                        type="index"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="imei"
                        label="IMEI"
                        sortable>
                </el-table-column>
                <el-table-column sortable
                                 label="Current Model">
                    <template slot-scope="scope">
                        <span>{{scope.row.model}}  {{scope.row.description || ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column sortable
                                 prop="productId"
                                 label="Current Product ID">
                </el-table-column>
                <el-table-column
                        width="160"
                        label="Edit">
                    <template slot-scope="scope">
                        <el-button type="text" @click="removeIMEI(scope.row.imei)"
                                   size="small">Remove
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="invalid_box" v-if="isExistValid">
                <em>* </em>The IMEI <em>marked in red</em> is unavailable and cannot be modified, please remove them from the list.
            </div>
        </div>
        <div class="maintain_box">
            <div class="maintain_box_tit">Batch Edit Product ID / Model</div>
            <div class="maintain">
                <el-row>
                    <span>New Product Model：</span>
                    <el-autocomplete style="width: 40%"
                                     :trigger-on-focus="sugession.triggerOnFocus"
                                     v-model.trim="form.productID"
                                     :fetch-suggestions="querySuggessionDebounce"
                                     @select="selectSuggession"
                                     placeholder="Input Product ID / Model / EAN to search">
                        <template slot-scope="props">
                            <li>
                                <el-col :title="props.item.productId" :span="6">{{props.item.productId}}</el-col>
                                <el-col v-if="props.item.description" :title="props.item.description" :span="18">{{props.item.model}} {{props.item.description}}</el-col>
                            </li>
                        </template>
                    </el-autocomplete>
                    <div class="tips"><b>Tips：</b>The above IMEI products will be matched with the new product ID and
                        new model you choose, please choose carefully.
                    </div>
                </el-row>
                <el-row>
                    <span class="err_info" v-if="form.showNoData">Cannot find this item of product, please check.</span>
                </el-row>
                <el-row style="margin-top:30px;">
                    <el-col :span="4">
                        <el-button @click="updateIMEI" class="button" :loading="form.loading" type="primary">
                            Confirm to Change
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import WareHouseApi from '~api/warehouseapi'
import Utils from '~utils/index'

export default {
    data () {
        return {
            search: {
                imei: '',
                errmsg: '',
                loading: false
            },
            form: {
                productID: '',
                loading: false,
                selectItem: null,
                showNoData: false
            },
            imeiList: [
                //                    {
                //                    imei: '456456789789898',
                //                    model: 'TECNO C9',
                //                    productId: '100087-3',
                //                    inventoryItemId:'33800',
                //                    description:'Blue'
                //                }
            ],
            isExistValid: false,
            sugession: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            }

        }
    },
    created () {
        this.scanQRCode = Utils.debounce(this.searchIMEI, 500)
        this.querySuggessionDebounce = Utils.debounce(this.querySuggession, 500)
    },
    watch: {
        imeiList: function (newV) {
            if (!(newV && newV.length)) {
                this.isExistValid = false
            } else {
                this.isExistValid = newV.some(item => !item.isAvailable)
            }
        }
    },
    methods: {
        tableRowClassName ({row, rowIndex}) {
            if (!row.isAvailable) {
                return 'invaild_row'
            }
            return ''
        },
        getRealIMEIArr (target) {
            var curImei = this.search.imei
            var imeiArr = []
            if (!curImei) {
                this.search.errmsg = 'Please enter correct IMEI code'
                target.focus()
                return false
            }
            if (curImei.indexOf('|') != -1) {
                curImei = curImei.replace(/[|]/g, '')
            }

            if (curImei.length > 15 && curImei.length % 15 == 0) {
                let reg = new RegExp('^[0-9]*$')
                if (!reg.test(curImei)) {
                    this.search.errmsg = 'Please enter correct IMEI code'
                    target.focus()
                    return false
                }

                // 去重复
                let str = ''
                for (let i = 0, len = curImei.length; i < len; i++) {
                    str += curImei[i]
                    if ((i + 1) % 15 == 0) {
                        if (imeiArr.indexOf(str) < 0) {
                            imeiArr.push(str)
                        }
                        str = ''
                    }
                }
            } else {
                // 单个imei输入
                let reg = new RegExp('^([0-9]{15})$')
                if (!reg.test(curImei)) {
                    this.search.errmsg = 'Please enter correct IMEI code'
                    this.search.errmsg = 'Please enter correct IMEI code'
                    target.focus()
                    return
                }
                if (curImei.indexOf('012345678912456') > -1) {
                    this.search.imei = ''
                    return false
                }
                imeiArr.push(curImei)
            }
            return imeiArr
        },
        searchIMEI () {
            var target = this.$refs.imei
            var imeiArr = this.getRealIMEIArr(target)
            if (!(imeiArr && imeiArr.length)) {
                return false
            }
            this.search.errmsg = ''
            this.search.loading = true
            WareHouseApi.findProductByImei.getInstance().execute(imeiArr.join(',')).then(d => {
                this.search.loading = false
                if (d.success == true) {
                    this.search.imei = ''
                    if (d.data && d.data.length) {
                        var newData = d.data.filter((item) => {
                            var existData = this.imeiList.filter(l => {
                                return l.imei === item.imei
                            })
                            if (existData && existData.length) {
                                return false
                            }
                            return true
                        })
                        newData.forEach(item => {
                            this.$set(item, 'isAvailable', false)
                            item.statusId = item.statusId || ''
                            if (/^INV_AVAILABLE/g.test(item.statusId)) {
                                item.isAvailable = true
                            }
                        })
                        console.log(newData)
                        if (newData && newData.length) {
                            this.imeiList = this.imeiList.concat(newData)
                        }
                    }
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                this.search.loading = false
                this.$showErrorMessage(err)
            })
        },
        removeIMEI (imei) {
            var len = this.imeiList.length
            for (var i = 0; i < len; i++) {
                let obj = this.imeiList[i]
                if (obj.imei == imei) {
                    this.imeiList.splice(i, 1)
                    break
                }
            }
            //                this.imeiList.splice(index,1)
        },
        updateIMEI () {
            if (!(this.imeiList && this.imeiList.length)) {
                this.$showInfoMessage('Please choose to adjust the  IMEI products')
                return false
            }
            if (!this.form.selectItem) {
                this.$showErrorMessage('Please choose to adjust the goods')
                return false
            }
            if (this.isExistValid) {
                this.$showErrorMessage('Some IMEI cannot be modified, please remove them from the list before submitting.')
                return false
            }
            this.form.loading = true
            WareHouseApi.updateIMEIProductId.getInstance().execute({
                'fromProduct': this.imeiList,
                'toDescription': this.form.selectItem.description,
                'toModel': this.form.selectItem.model,
                'toProductId': this.form.selectItem.productId
            }).then(d => {
                this.form.loading = false
                if (d.success) {
                    this.imeiList.splice(0)
                    this.search.imei = ''
                    this.search.errmsg = ''
                    this.search.loading = false
                    this.form.productID = ''
                    this.form.loading = false
                    this.form.selectItem = null
                    this.form.showNoData = false
                    this.$showSuccessMessage('Modify Product Model Success!')
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                this.form.loading = false
                this.$showErrorMessage(err)
            })
        },
        querySuggession (querystring, cb) {
            if (!querystring) {
                cb([])
                return false
            }
            WareHouseApi.findProductModelByKeyword.getInstance().execute({
                keyword: querystring
            }).then(d => {
                if (d.success == true) {
                    if (d.data && d.data.list && d.data.list.length) {
                        this.form.showNoData = false
                        cb(d.data.list)
                    } else {
                        this.form.showNoData = true
                        cb([])
                    }
                } else {
                    this.$showInfoMessage('Successfully operated')
                    cb([])
                }
            }).catch(err => {
                this.$showErrorMessage(err)
                cb([])
            })
        },
        selectSuggession (item) {
            this.form.selectItem = item
            this.form.productID = item.productId + item.model + (item.description || '')
        }
    },
    components: {
        LeftMenu: () => import('~warehouse-common/comp/leftmenu.vue')
    }
}

</script>
<style>
    .invaild_row{
    }
    .invaild_row td{
        color: red;
    }
</style>
<style scoped>

    .search_box {
        background: #fff;
        padding-left: 10px;
        padding-bottom: 20px;
    }

    .search_box .search_box_tit {
        line-height: 45px;
        font-size: 18px;
        color: #424242;
        border-bottom: 1px solid #dbdbdb;
        height: 45px;
        font-weight: bold;
        margin-right: 20px;
    }

    .search_box .search {
        margin-left: 10px;
        margin-top: 10px;
    }

    .search .err_kwd {
        display: inline-block;
        color: red;
        font-size: 14px;
        margin-left: 5px;
    }

    .list_box {
        background: #fff;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 32px;
        position:relative;
    }

    .list_box::after {
        content: '';
        clear: both;
    }

    .list_box .imei_table {
        width: 100%;
        min-height: 200px;
    }

    .list_box .invalid_box{
        position:absolute;
        margin: 0px auto;
        overflow: hidden;
        bottom: 0px;
        left:15%;
        text-align: center;
        font-size: 16px;
    }
    .list_box .invalid_box em{
        color: red;
        font-style: normal;
    }

    .maintain_box {
        background: #fff;
        min-height: 250px;
        padding: 20px 20px 20px 20px;
    }

    .maintain_box .maintain_box_tit {
        line-height: 45px;
        width: 90%;
        font-size: 14px;
        color: #424242;
        height: 45px;
        font-weight: bold;
    }

    .maintain_box .maintain {
        margin-left: 10px;
        margin-top: 10px;
    }

    .maintain .err_info {
        display: inline-block;
        color: red;
        font-size: 14px;
        margin-left: 5px;
    }

    .maintain .tips {
        vertical-align: middle;
        margin-left: 15px;
        display: inline-block;
        width: 42%;
        font-size: 12px;
    }

    .maintain .tips b {
        color: teal;
    }

    .el-row {
        margin-top: 10px;
    }
</style>
