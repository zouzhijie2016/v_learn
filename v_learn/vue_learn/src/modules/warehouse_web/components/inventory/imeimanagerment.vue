<template>
    <div>
        <left-menu :urlPermiss.sync="urlPermissData"></left-menu>
        <div class="center_main">
            <div class="center_content">
                <div class="search_box search_comomn_region">
                    <el-row>
                        <el-col :span="9">
                            <label>
                                Status <i class="require_tips">*</i>
                            </label>
                            <el-select multiple
                                       clearable
                                       size="small"
                                        v-model="search.selectStoreStatus"
                                        placeholder="Select">
                                <el-option v-for="item in storeStatusList"
                                           :key="item.value"
                                           :label="item.name"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
                            <label>Store Group</label>
                            <el-select multiple
                                       collapse-tags
                                       clearable
                                       @change="changeStoreGroup"
                                       size="small"
                                       v-model="search.selectStoreGroupIdArr" placeholder="ALL">
                                <el-option
                                        v-for="item in storeGroupList"
                                        :key="item.storeGroupId"
                                        :label="item.storeGroupName"
                                        :value="item.storeGroupId">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            <div class="label_field">Store</div>
                            <el-select
                                    multiple
                                    collapse-tags
                                    clearable
                                    size="small"
                                    placeholder="Select"
                                    v-model="search.selectStoreIdArr">
                                <template v-if="!!allStoreList && !!allStoreList.length">
                                    <el-option
                                            v-for="item in allStoreList"
                                            :key="item.storeId"
                                            :label="item.storeName"
                                            :value="item.storeId">
                                    </el-option>
                                </template>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="9">
                            <label>Brand</label>
                            <el-select multiple
                                       filterable
                                       remote
                                       reserve-keyword
                                       collapse-tags
                                       size="small"
                                       placeholder="Select"
                                       :remote-method="querySearchBrand"
                                       v-model="search.selectBrandId">
                                    <el-option
                                            v-for="item in allBrandList"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="15">
                            <label>Model</label>
                            <el-select multiple
                                       filterable
                                       remote
                                       reserve-keyword
                                       collapse-tags
                                       size="small"
                                       placeholder="Select"
                                       :remote-method="querySearchModel"
                                       v-model="search.selectModelId">
                                <el-option
                                        v-for="item in allModelList"
                                        :key="item.productId"
                                        :label="item.description"
                                        :value="item.productId">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <label>Date of sales
                                <!--content='For "in stock" and "transfer", you can find the IMEI in the status only at the present moment.-->
                                <!--For "be sold", you can search the IMEI for certain period in which they are sold.'-->
                                <el-tooltip class="item" effect="light"
                                placement="bottom">
                                    <i class="el-icon-warning"></i>
                                    <template slot="content">
                                        <span>For "in stock" and "transfer", you can find the IMEI in the status only at the present moment.</span>
                                        <br>
                                        <span>For "be sold", you can search the IMEI for certain period in which they are sold.</span>
                                    </template>
                                </el-tooltip>
                            </label>
                            <div class="stretch_field">
                                <el-date-picker  type="date"
                                                 :disabled="isDisabledDate"
                                                size="small"
                                                :picker-options="search.fromPickerOptions"
                                                v-model="search.fromTime"
                                                placeholder="DD/MM/YYYY"
                                                format="dd/MM/yyyy"></el-date-picker>
                                <div> ----</div>
                                <el-date-picker type="date"
                                                :disabled="isDisabledDate"
                                                size="small"
                                                format="dd/MM/yyyy"
                                                :picker-options="search.toPickerOptions"
                                                v-model="search.toTime"
                                                placeholder="DD/MM/YYYY"></el-date-picker>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="primary" :loading="search.loading"  @click="searchImeiList"
                                       style="margin-left: 25px;">Search
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="tool_box">
                    <el-button type="primary" @click="exportIMEIList" :loading="exportLoading"  v-security='{permission:"imeiManagermentExport"}' class="rgt_btn">
                        Export</el-button>
                </div>
                <div class="table_box" v-loading="search.loading">
                    <el-table :data="list" max-height="800" :row-class-name="tableRowClassName" empty-text="There is no IMEI data.">
                        <el-table-column type="index" label="No." width="70"></el-table-column>
                        <el-table-column prop="time" label="Date" width="120"></el-table-column>
                        <el-table-column prop="storeGroupName" label="Store Group" width="170"></el-table-column>
                        <el-table-column prop="storeName" label="Store" width="170"></el-table-column>
                        <el-table-column prop="brand" label="Brand" width="120"></el-table-column>
                        <el-table-column prop="model" label="Model" width="170"></el-table-column>
                        <el-table-column prop="description" label="Description" min-width="140"></el-table-column>
                        <el-table-column prop="imei" label="IMEI" width="170"></el-table-column>
                        <el-table-column prop="status" label="Status" width="120"></el-table-column>
                    </el-table>
                    <div class="page_box" v-if="imeiListInfo.total && imeiListInfo.total>0">
                        <el-pagination layout="prev, pager, next, jumper"
                                       :total="imeiListInfo.total"
                                       :page-size="imeiListInfo.pageSize"
                                       :current-page.sync="search.curpage"
                                       @current-change="getPageLogs">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import leftMenu from '~warehouse-common/comp/leftmenu.vue'
    import Utils from '~utils/index'
    import wareHouseApi from '~api/warehouseapi'
    import reportApi from '~api/reportapi'
    import {download} from '~utils/custom/downloadHelper'

    export default {
        data () {
            var _this = this
            var compareFormat = 'yyyy/MM/dd'
            return {
                urlPermissData: '/warehouse_web/index.html#/IMEIManagerment',
                search: {
                    curpage: 1,
                    loading: false,
                    fromTime: '',
                    toTime: '',
                    selectStoreStatus: [],
                    selectStoreGroupIdArr: [],
                    selectStoreIdArr: [],
                    selectBrandId: [],
                    selectModelId: [],
                    selectModelText: '',
                    fromPickerOptions: {
                        disabledDate: (time) => {
                            if (_this.search.toTime) {
                                return time > Utils.getPartialDate(_this.search.toTime, compareFormat)
                            }
                            return false
                        }
                    },
                    toPickerOptions: {
                        disabledDate: (time) => {
                            if (_this.search.fromTime) {
                                return time < Utils.getPartialDate(_this.search.fromTime)
                            }
                            return false
                        }
                    },
                },
                exportLoading:false,
                allStoreList: [],
                list: [],
                imeiListInfo:{
                    pageNum: 1,
                    pageSize: 15,
                    pages: 1,
                    total: 0,
                    size: 0
                },
                storeStatusList: [
                    {value: 'transfer', name: 'Transfer'},
                    {value: 'inStock', name: 'In Stock'},
                    {value: 'beSold', name: 'Be Sold'},
                ],
                storeGroupList: [],
                allBrandList:[],
                allModelList:[]
            }
        },
        computed:{
            isDisabledDate(){
                var isBeSold = this.search.selectStoreStatus.indexOf(this.storeStatusList[2].value)>-1;
                if(!isBeSold) {
                    this.search.fromTime='';
                    this.search.toTime = '';
                }
                return !isBeSold;
            }
        },
        watch: {},
        mounted () {
            this.getStoreGroupListApi();
        },
        methods: {
            searchImeiList () {
                this.getImeiProductByConditions(false, 1)
            },
            getPageLogs () {
                this.getImeiProductByConditions(true)
            },
            exportIMEIList() {
                this.$showInfoMessage('Export information success！！');
                if(!(this.search.selectStoreStatus && this.search.selectStoreStatus.length)) {
                    this.$showInfoMessage('The search area status field must be required.')
                    return;
                }
                let fromDateStamp = this.getDateStamp(this.search.fromTime) || '';
                let toDateStamp =this.getDateStamp(this.search.toTime, 1) || '';

                this.exportLoading = true
                wareHouseApi.exportImeiProductByConditions.getInstance().execute({
                    brandList: this.search.selectBrandId,
                    modelList: this.search.selectModelId,
                    statusList: this.search.selectStoreStatus,
                    storeGroupId: this.search.selectStoreGroupIdArr,
                    storeId: this.search.selectStoreIdArr,
                    fromDate:fromDateStamp,
                    toDate:toDateStamp?(toDateStamp-1):''
                }).then((res)=>{
                    this.exportLoading = false
                    download(res.data, res.headers['x-filename'] || 'IMEIProduct.zip')
                }).catch(err=>{
                    this.exportLoading = false
                    this.$showErrorMessage(err);
                })
            },
            changeStoreGroup () {
                this.search.selectStoreIdArr.splice(0)
                let groups = this.storeGroupList.filter((item) => {
                    return this.search.selectStoreGroupIdArr.indexOf(item.storeGroupId)>-1;
                })
                if (groups && groups.length) {
                    this.allStoreList.splice(0);
                    groups.forEach((item)=>{
                        if(item.storeList && item.storeList.length) {
                            this.allStoreList = this.allStoreList.concat(item.storeList);
                        }
                    });
                } else {
                    this.allStoreList.splice(0);
                }
            },
            querySearchBrand (queryString) {
                if (queryString) {
                    this.getBrandListApi(queryString)
                } else {
                    this.allBrandList.splice(0);
                }
            },
            querySearchModel (queryString) {
                if (queryString) {
                    this.getAllModel(queryString)
                } else {
                    this.allModelList.splice(0);
                }
            },
            getStoreGroupListApi () {
                reportApi.queryStoreGroupList({}).then((d) => {
                    console.log(d)
                    this.storeGroupList = d.data
                }).catch(err => {
                    this.$showErrorMessage(err)
                })
            },
            getBrandListApi (id) {
                wareHouseApi.findBrandList.getInstance().execute({
                    brandName: id
                }).then((d) => {
                    if (d.success) {
                        this.allBrandList.splice(0);
                        this.allBrandList = this.allBrandList.concat(d.data);
                    } else {
                        this.allBrandList.splice(0);
                    }
                }).catch(err => {
                    this.allBrandList.splice(0);
                    this.$showErrorMessage(err)
                })
            },
            getAllModel (id) {
                wareHouseApi.queryAllModel.getInstance().execute({
                    model: id
                }).then((d) => {
                    if (d.success) {
                        this.allModelList.splice(0);
                        this.allModelList = this.allModelList.concat(d.data)
                    } else {
                        this.allModelList.splice(0);
                    }
                }).catch(err => {
                    this.allModelList.splice(0);
                    this.$showErrorMessage(err)
                })
            },
            getDateStamp(date, addDays=0) {
                if (date) {
                    var d = Utils.parseDate(date)
                    var newD = new Date(d.setDate(d.getDate() + addDays))
                    return  Utils.getServerTimestamp(newD) || ''
                }
                return '';
            },
            getImeiProductByConditions (isOnlyList = false, pageIndex) {
                if(!(this.search.selectStoreStatus && this.search.selectStoreStatus.length)) {
                    this.$showInfoMessage('The search area status field must be required.')
                    return;
                }
                let fromDateStamp = this.getDateStamp(this.search.fromTime) || '';
                let toDateStamp =this.getDateStamp(this.search.toTime, 1) || '';
                this.search.loading = true
                this.$getCommonPageListApi(wareHouseApi.findImeiProductByConditions, {
                    brandList: this.search.selectBrandId,
                    modelList: this.search.selectModelId,
                    statusList: this.search.selectStoreStatus,
                    storeGroupId: this.search.selectStoreGroupIdArr,
                    storeId: this.search.selectStoreIdArr,
                    fromDate:fromDateStamp,
                    toDate:toDateStamp?(toDateStamp-1):'',
                    isOnlyList: isOnlyList,
                    pageSize: this.imeiListInfo.pageSize,
                    pageNum: pageIndex || this.search.curpage,
                },d =>{
                    this.list = d.data.list
                    if (this.search.curpage != d.data.pageNum) {
                        this.search.curpage = d.data.pageNum
                    }
                }).then((results) => {
                    this.search.loading = false
                    // 处理分页信息-****
                    if (results.length > 1) {
                        if (results[1].success) {
                            this.imeiListInfo.total = results[1].data.total
                        } else {
                            this.imeiListInfo.total = this.imeiListInfo.pageSize * (this.search.curpage)
                        }
                    }
                })
            },
            tableRowClassName (index) {
                if (index % 2 === 1) {
                    return 'info-row'
                }
                return ''
            }
        },
        components: {
            leftMenu
        }
    }
</script>
<style>

</style>
<style scoped>
    .center_main {
        overflow-y: auto;
        zoom: 1;
        width: 100%;
        transition: margin-right 0.3s ease-in-out;
        padding-left: 188px;
        min-height: 300px;
        padding-bottom: 80px;
    }

    .center_content {
        background: #fff;
        padding: 10px 10px 40px 10px;
    }

    .center_content:after {
        content: '';
        display: block;
        clear: both;
        visibility: hidden;
        height: 0px;
        font-size: 0px;
    }

    .center_content .search_box {
        overflow: hidden;
        padding: 5px;
    }

    .search_comomn_region {
        overflow: hidden;
    }

    .search_comomn_region > .el-row {
        margin-top: 10px;
    }

    .search_comomn_region > .el-row:nth-of-type(1) {
        margin-top: 0px;
    }

    .search_comomn_region > .el-row > .el-col {
        display: flex;
        justify-content: left;
        align-items: center;
        align-content: center;
    }

    .search_comomn_region > .el-row > .el-col > label,
    .search_comomn_region > .el-row > .el-col .label_field {
        font-weight: normal;
        text-align: right;
        display: inline-block;
        min-width: 55px;
    }

    .search_comomn_region > .el-row > .el-col .el-select,
    .search_comomn_region > .el-row > .el-col .el-autocomplete,
    .search_comomn_region > .el-row > .el-col .el-textarea,
    .search_comomn_region > .el-row > .el-col .el-input,
    .search_comomn_region > .el-row > .el-col .stretch_field {
        overflow: hidden;
        display: flex;
        align-items: center;
        align-content: center;
        flex: 1;
        margin-left: 5px;
        margin-right: 10px;
    }

    .search_comomn_region > .el-row > .el-col .stretch_field {
        margin: 0px;
    }

    .search_comomn_region .el-col:nth-of-type(1) > label {
        width: 105px;
    }

    .search_comomn_region .el-col:nth-of-type(2) > label {
        width: 85px;
    }

    .search_box .require_tips {
        font-style: normal;
        color: red;
    }

    .tool_box {
        overflow: hidden;
        margin: 10px 0px;
    }

    .tool_box .rgt_btn {
        float: right;
    }

    .info-row {
        background: #fafafa !important;
    }

    .table_box {
        overflow: hidden;
    }

    .page_box {
        margin-top: 15px;
        float: right;
        margin-right: -5px;
    }
</style>