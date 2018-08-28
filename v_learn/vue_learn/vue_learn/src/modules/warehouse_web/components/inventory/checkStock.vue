<template>
    <div>
        <left-menu></left-menu>
        <div class="check_main">
            <!--<div class="main_content">
                <div class="check_title">Check Stock</div>
                <hr class="check_hr"/>
                <div class="check_tab">-->
                    <el-tabs v-model="activeCheckName" type="border-card" @tab-click="tabClick">
                        <el-tab-pane label="Start IMEI" name="imei">
                            <div class="imei">
                                <el-row>
                                    <el-col :span="3" :offset="2" class="imei_target_name">Target Model</el-col>
                                    <el-col :span="6">
                                        <el-autocomplete v-show="!imei.hasProduct" style="width:300px;"
                                                         v-model="imei.product"
                                                         :trigger-on-focus="false"
                                                         :fetch-suggestions="queryProductListDebounce"
                                                         placeholder="Model / product id / EAN"
                                                         @select="selectProduct">
                                            <template slot-scope="scope">
                                                <div v-for="item in scope" :valueKey="item">
                                                    <div class="suggestionList">{{item.id}}:{{item.text}}</div>
                                                </div>
                                            </template>
                                        </el-autocomplete>
                                        <div class="" v-show="imei.hasProduct"><el-tag :closable="true" type="primary" @close="closeProduct">{{imei.productDescription}}</el-tag></div>
                                    </el-col>
                                    <el-col :span="11" :offset="1" v-show="!imei.hasProduct">
                                        <div class="imei_tips"><span>Tips:</span>&nbsp;Choose a model if you want to check this model seperately.</div>
                                    </el-col>
                                </el-row>
                                <div class="imei_list">
                                    <el-row>
                                        <el-col :span="2"><div class="list_group">NO.</div></el-col>
                                        <el-col :span="5"><div class="list_group">IMEI</div></el-col>
                                        <el-col :span="2"><div class="list_group">NO.</div></el-col>
                                        <el-col :span="5"><div class="list_group">IMEI</div></el-col>
                                        <el-col :span="2"><div class="list_group">NO.</div></el-col>
                                        <el-col :span="5"><div class="list_group">IMEI</div></el-col>
                                    </el-row>
                                    <el-row v-for="(item,index) in imei.imeiList" :key="index" v-if="(index+1) % 3 == 0">
                                            <el-col :span="2"><div class="list_group">{{imei.imeiList[index-2].no}}</div></el-col>
                                            <el-col :span="5"><div class="list_group"><input :ref="imeiRef(imei.imeiList[index-2].no)" v-on:input="changeImei(imei.imeiList[index-2].imei,index-2)" :colNum="imei.imeiList[index-2].no" v-model.trim="imei.imeiList[index-2].imei" class="imei_input"  @keyup.enter.stop="scanQRCode(imei.imeiList[index-2].imei,index-2,$event)" ></input></div></el-col>
                                            <el-col :span="2"><div class="list_group">{{imei.imeiList[index-1].no}}</div></el-col>
                                            <el-col :span="5"><div class="list_group"><input :ref="imeiRef(imei.imeiList[index-1].no)" v-on:input="changeImei(imei.imeiList[index-1].imei,index-1)" :colNum="imei.imeiList[index-1].no" v-model.trim="imei.imeiList[index-1].imei" class="imei_input"  @keyup.enter.stop="scanQRCode(imei.imeiList[index-1].imei,index-1,$event)" ></input></div></el-col>
                                            <el-col :span="2"><div class="list_group">{{imei.imeiList[index-0].no}}</div></el-col>
                                            <el-col :span="5"><div class="list_group"><input :ref="imeiRef(imei.imeiList[index-0].no)" v-on:input="changeImei(imei.imeiList[index-0].imei,index-0)" :colNum="imei.imeiList[index-0].no" v-model.trim="imei.imeiList[index-0].imei" class="imei_input"  @keyup.enter.stop="scanQRCode(imei.imeiList[index-0].imei,index-0,$event)" ></input></div></el-col>
                                    </el-row>
                                </div>
                                <div class="imei_btns">
                                    <el-button type="primary" :loading="imei.imeiLoading" :disabled="imei.isCheckDisabeld" @click="checkImei">Check</el-button>
                                    <el-button type="primary" :disabled="imei.imeiContinueDisable" @click="continueStartCheck('imei')">Continue</el-button>
                                </div>
                                <div class="btn_bar" v-if="imei.imeiLoading">
                                    <div class="bar">
									<span class="track-wrap"> <span class="track track1"></span>
									</span> <span class="track-wrap"> <span class="track track2"></span>
									</span>
                                    </div>
                                    <div class="newCheckStock_bar">
                                        <div class="newCheckStock_bar_tips">checking,please do not
                                            close the page</div>
                                    </div>
                                </div>
                                <div class="results"  v-if="imei.hasCheckData">
                                    <div class="results_title">
                                        <span>Result</span>
                                    </div>
                                    <div class="results_nums clearfix">
                                        <div class="results_nums_group"><span>Total input:</span>&nbsp;&nbsp;<span style="color:#1fbcd2">{{imei.resultsNums.total}}</span></div>
                                        <div class="results_nums_group"><span>Match:</span>&nbsp;&nbsp;<span style="color:#4DCB73">{{imei.resultsNums.match}}</span></div>
                                        <div class="results_nums_group"><span>Inventory profit:</span>&nbsp;&nbsp;<span style="color:#F2637B">{{imei.resultsNums.inventoryProfit}}</span></div>
                                        <div class="results_nums_group"><span>Inventory loss:</span>&nbsp;&nbsp;<span style="color:#F2637B">{{imei.resultsNums.inventoryLoss}}</span></div>
                                        <div class="results_nums_export"><el-button type="primary" :loading="imei.exportIMEILoading"  @click="exportStockList">export</el-button></div>
                                    </div>
                                    <div class='tips_content' v-show="isShowTips">
                                        <div>1.Inventory Loss: This IMEI is on the list of BIM system, but has not been scanned.</div>
                                        <div>2.Inventory Profit: This IMEI is not on the list of BIM system, but was scanned.</div>
                                        <span class='tips_arrow'></span>
                                    </div>
                                    <div class="results_tables">
                                        <el-table :data="imei.imeiResultlist" border style="width: 100%;" class="list_table"  v-loading="imei.imeiLoading" empty-text="Well done,the checked products perfectly match with those in the system.">
                                            <el-table-column label="NO." type="index" align="center" width="100" class-name="results_table_column"></el-table-column>
                                            <el-table-column prop="imei" label="IMEI"  class-name="results_table_column" align="center"></el-table-column>
                                            <el-table-column label="Description" class-name="results_table_column" align="center">
                                                <template  slot-scope="scope">
                                                    {{scope.row.model}}&nbsp;&nbsp;{{scope.row.description}}
                                                </template>
                                            </el-table-column>
                                            <el-table-column  :render-header="renderHeader" prop="reasonType" label="Reason" class-name="list_table_column" align="center"></el-table-column>
                                            <el-table-column prop="reason" label="status"  class-name="results_table_column" align="center"></el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                </div>
                        </el-tab-pane>
                        <el-tab-pane label="Start Non-serialized" name="ean">
                            <div class="ean">
                                <el-row>
                                    <el-col :span="6" :offset="2">
                                        <el-autocomplete style="width:300px;"
                                                         v-model="ean.eanProductText"
                                                         :trigger-on-focus="false"
                                                         :fetch-suggestions="queryProductListDebounce"
                                                         placeholder="Model / product id / EAN"
                                                         @select="selectProductEan">
                                            <template slot-scope="scope">
                                                <div v-for="item in scope" :valueKey="item">
                                                    <div class="suggestionList">{{item.id}}:{{item.text}}</div>
                                                </div>
                                            </template>
                                        </el-autocomplete>
                                    </el-col>
                                    <el-col :span="3" :offset="2"><el-button type="primary" @click="addProductTo">ADD</el-button></el-col>
                                </el-row>
                                <div class="ean_list clearfix">
                                    <div class="ean_list_title clearfix">
                                        <div class="operate_ean_group">
                                            <div class="ean_list_div ean_group_num" :span="1"><span>NO.</span></div>
                                            <div class="ean_list_div ean_group_product" :span="5"><span>Product</span></div>
                                            <div class="ean_list_div ean_group_quantity" :span="2"><span>Quantity</span></div>
                                        </div>
                                        <div class="operate_ean_group">
                                            <div class="ean_list_div ean_group_num" :span="1"><span>NO.</span></div>
                                            <div class="ean_list_div ean_group_product" :span="5"><span>Product</span></div>
                                            <div class="ean_list_div ean_group_quantity" :span="2"><span>Quantity</span></div>
                                        </div>
                                        <div class="operate_ean_group">
                                            <div class="ean_list_div ean_group_num" :span="1"><span>NO.</span></div>
                                            <div class="ean_list_div ean_group_product" :span="5"><span>Product</span></div>
                                            <div class="ean_list_div ean_group_quantity" :span="2"><span>Quantity</span></div>
                                        </div>
                                    </div>
                                    <div class="ean_list_group" v-for="(value,index) in ean.eanList" :key="index" >
                                        <div v-if="(index+1) % 3 == 0">
                                            <div  class="operate_ean_group">
                                                <div class="ean_list_div ean_group_num"><span>{{ean.eanList[index-2].no}}</span></div>
                                                <div class="ean_list_div ean_group_product"><input v-model.trim="ean.eanList[index-2].description"  v-on:mouseenter.stop="ean.eanList[index-2].active = true" v-on:mouseleave.stop="ean.eanList[index-2].active = false" class="imei_input"></input></div>
                                                <div class="ean_list_div ean_group_quantity"><input :ref="eanRef(ean.eanList[index-2].no)" v-model.trim="ean.eanList[index-2].quantity" class="imei_input"></input></div>
                                                <div class="ean_mask" v-on:click="delEan(ean.eanList[index-2].no,index-2)" v-on:mouseenter.stop="ean.eanList[index-2].active = true" v-on:mouseleave.stop="ean.eanList[index-2].active = false" v-show="ean.eanList[index-2].active"><span class="el-icon-mydel" href="javascript:void(0);"></span></div>
                                            </div>
                                            <div  class="operate_ean_group">
                                                <div class="ean_list_div ean_group_num"><span>{{ean.eanList[index-1].no}}</span></div>
                                                <div class="ean_list_div ean_group_product"><input v-model.trim="ean.eanList[index-1].description"  v-on:mouseenter.stop="ean.eanList[index-1].active = true" v-on:mouseleave.stop="ean.eanList[index-1].active = false" class="imei_input"></input></div>
                                                <div class="ean_list_div ean_group_quantity"><input :ref="eanRef(ean.eanList[index-1].no)" v-model.trim="ean.eanList[index-1].quantity" class="imei_input"></input></div>
                                                <div class="ean_mask" v-on:click="delEan(ean.eanList[index-1].no,index-1)" v-on:mouseenter.stop="ean.eanList[index-1].active = true" v-on:mouseleave.stop="ean.eanList[index-1].active = false" v-show="ean.eanList[index-1].active"><span class="el-icon-mydel" href="javascript:void(0);"></span></div>
                                            </div>
                                            <div  class="operate_ean_group">
                                               <div class="ean_list_div ean_group_num"><span>{{ean.eanList[index-0].no}}</span></div>
                                                <div class="ean_list_div ean_group_product"><input v-model.trim="ean.eanList[index-0].description" v-on:mouseenter.stop="ean.eanList[index-0].active = true" v-on:mouseleave.stop="ean.eanList[index-0].active = false" class="imei_input"></input></div>
                                                <div class="ean_list_div ean_group_quantity"><input :ref="eanRef(ean.eanList[index-0].no)" v-model.trim="ean.eanList[index-0].quantity" class="imei_input"></input></div>
                                                <div class="ean_mask" v-on:click="delEan(ean.eanList[index-0].no,index-0)" v-on:mouseenter.stop="ean.eanList[index-0].active = true" v-on:mouseleave.stop="ean.eanList[index-0].active = false" v-show="ean.eanList[index-0].active"><span class="el-icon-mydel" href="javascript:void(0);"></span></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="imei_btns">
                                    <el-button type="primary" :loading="ean.eanLoading" :disabled="ean.eanParamesList.length == 0" @click="checkEan">Check</el-button>
                                    <el-button type="primary" :disabled="ean.eanContinueDisable" @click="continueStartCheck('ean')">Continue</el-button>
                                </div>
                                <div class="btn_bar" v-if="ean.eanLoading">
                                    <div class="bar">
									<span class="track-wrap"> <span class="track track1"></span>
									</span> <span class="track-wrap"> <span class="track track2"></span>
									</span>
                                    </div>
                                    <div class="newCheckStock_bar">
                                        <div class="newCheckStock_bar_tips">checking,please do not
                                            close the page</div>
                                    </div>
                                </div>
                                <div class="results" v-if="ean.hasCheckData">
                                    <div class="results_title">
                                        <span>Result</span>
                                    </div>
                                    <div class="results_nums clearfix">
                                        <div class="results_nums_group"><span>Total input:</span>&nbsp;&nbsp;<span style="color:#1fbcd2">{{ean.resultsNums.total}}</span></div>
                                        <div class="results_nums_group"><span>Match:</span>&nbsp;&nbsp;<span style="color:#4DCB73">{{ean.resultsNums.match}}</span></div>
                                        <div class="results_nums_group"><span>Inventory profit:</span>&nbsp;&nbsp;<span style="color:#F2637B">{{ean.resultsNums.inventoryProfit}}</span></div>
                                        <div class="results_nums_group"><span>Inventory loss:</span>&nbsp;&nbsp;<span style="color:#F2637B">{{ean.resultsNums.inventoryLoss}}</span></div>
                                        <div class="results_nums_export"><el-button type="primary" :loading="ean.exportEANLoading"  @click="exportStockList">export</el-button></div>
                                    </div>
                                    <div class='tips_content_ean' v-show="isShowEanTips">
                                        <div>1.Inventory Loss: This IMEI is on the list of BIM system, but has not been scanned.</div>
                                        <div>2.Inventory Profit: This IMEI is not on the list of BIM system, but was scanned.</div>
                                        <span class='tips_arrow'></span>
                                    </div>
                                    <div class="results_tables">
                                        <el-table :data="ean.eanResultlist" border style="width: 100%;" class="list_table"  v-loading="ean.eanLoading" empty-text="Well done,the checked products perfectly match with those in the system.">
                                            <el-table-column label="NO." type="index" align="center" width="100" class-name="results_table_column"></el-table-column>
                                            <el-table-column prop="productId" label="Product ID"  class-name="results_table_column" align="center"></el-table-column>
                                            <el-table-column label="Description" class-name="results_table_column" align="center">
                                                <template  slot-scope="scope">
                                                    {{scope.row.model}}&nbsp;&nbsp;{{scope.row.description}}
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="inventoryQuantity" label="Inventory quantity"  class-name="results_table_column" align="center"></el-table-column>
                                            <el-table-column prop="difQuantity" label="Dif quantity"  class-name="results_table_column" align="center"></el-table-column>
                                            <el-table-column :render-header="renderHeader" prop="reasonType" label="Reason" class-name="list_table_column" align="center"></el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="Check Log" name="log">
                            <div class="log">
                                <div class="log_search">
                                    <el-row class="search_row">
                                        <el-col :span="7">
                                            <label class="log_form_label">Warehouse</label>
                                            <el-select v-model.trim="log.search.facilityId" size="small" filterable placeholder="Please select...">
                                                <el-option
                                                        v-for="item in log.facilityNamesOption"
                                                        :key="item.facilityId"
                                                        :label="item.facilityName"
                                                        :value="item.facilityId">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <label class="log_label_date">Date</label>
                                            <el-date-picker type="datetime"
                                                            :default-value="log.startDefaultTime"
                                                            :picker-options="log.search.fromPickerOptions"
                                                            v-model="log.search.fromTime"
                                                            format="dd/MM/yyyy HH:mm:ss"
                                                            placeholder="DD/MM/YYYY">
                                            </el-date-picker>
                                            <label>--</label>
                                            <el-date-picker type="datetime"
                                                            :default-value="log.startDefaultTime"
                                                            :picker-options="log.search.toPickerOptions"
                                                            v-model="log.search.toTime"
                                                            format="dd/MM/yyyy HH:mm:ss"
                                                            placeholder="DD/MM/YYYY">
                                            </el-date-picker>
                                        </el-col>
                                        <el-col :span="5">
                                            <label class="log_form_label">Results</label>
                                            <el-select v-model.trim="log.search.resultType" size="small" class="log_form_result" filterable placeholder="Please select...">
                                                <el-option value="" selected>All</el-option>
                                                <el-option value="Perfectly Match">Perfectly Match</el-option>
                                                <el-option value="Abnormal">Abnormal</el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                    <el-row class="search_row">
                                        <el-col :span="10">
                                            <label class="log_form_label">Target Model</label>
                                            <el-autocomplete style="width:300px;"
                                                             v-model="log.search.logProductText"
                                                             :trigger-on-focus="false"
                                                             @input="changeProductLogEvt"
                                                             :fetch-suggestions="queryProductListDebounce"
                                                             placeholder="Model / product id / EAN"
                                                             @select="selectProductLog">
                                                <template slot-scope="scope">
                                                    <div v-for="item in scope" :valueKey="item">
                                                        <div class="suggestionList">{{item.id}}:{{item.text}}</div>
                                                    </div>
                                                </template>
                                            </el-autocomplete>
                                        </el-col>
                                        <el-col :span="2">
                                            <el-button type="primary" @click="getLogData" :loading="log.logLoading">Search</el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div class="log_table" v-loading="log.logLoading" element-loading-text="Loading...">
                                    <el-table :data="log.logResultsList" border style="width: 100%;" class="list_table">
                                        <el-table-column label="Check Time"  class-name="results_table_column" align="center" width="150">
                                            <template  slot-scope="scope">
                                                {{scope.row.createTime | setTime}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="facilityName" label="Warehouse" class-name="results_table_column" align="center" width="150"></el-table-column>
                                        <el-table-column label="Product Type"  class-name="results_table_column" align="center" width="100">
                                            <template  slot-scope="scope">
                                                {{scope.row.isIMEI == 'Y' ? 'IMEI' : 'EAN'}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Target Model"  class-name="results_table_column" align="center" width="110">
                                            <template  slot-scope="scope">
                                                {{scope.row.description ? scope.row.description : '----'}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column  prop="operator" label="Operator" class-name="list_table_column" align="center"></el-table-column>
                                        <el-table-column  prop="result" label="Result" class-name="list_table_column" align="center"></el-table-column>
                                        <el-table-column  prop="totalInputQuantity" label="Input" class-name="list_table_column" align="center" width="60"></el-table-column>
                                        <el-table-column  prop="matchQuantity" label="Match" class-name="list_table_column" align="center" width="60"></el-table-column>
                                        <el-table-column  prop="inventoryProfitQuantity" label="Profit" class-name="list_table_column" align="center" width="60"></el-table-column>
                                        <el-table-column  prop="inventoryLossQuantity" label="Loss" class-name="list_table_column" align="center" width="60"></el-table-column>
                                        <el-table-column label="More Information" class-name="list_table_column" align="center">
                                            <template  slot-scope="scope">
                                                <a href="javascript:void(0);" @click="gotoLogDetail(scope.row.id)">Details</a>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="page_box" v-if="log.logResultsListPage && log.logResultsListPage.total>0">
                                        <el-pagination
                                                layout="prev, pager, next, jumper"
                                                :total="log.logResultsListPage.total"
                                                :page-size="log.logResultsListPage.pageSize"
                                                :current-page.sync="log.search.pageNum"
                                                @current-change="getPageLogData">
                                        </el-pagination>
                                    </div>
                                </div>

                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="Download Non-serialized Sample" name="download">
                            <div>
                                <p>1.This checklist is for non-serialized product checking.</p>
                                <p>2.If EAN code cannot be scanned, please input the EAN code manually.</p>
                                <el-button @click="downloadTemplate" :loading="downloadTemplateLoading" type="primary">Download</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                <!--</div>
            </div>-->

        </div>
        <imei-profit-dialog v-if="showCodeDialogVisible" :dataVisible.sync="showCodeDialogVisible"
                               :imeiList.sync="imei.showImeis" :scanType.sync="imei.scanType"></imei-profit-dialog>
    </div>
</template>
<script>

import Vue from 'vue'
import Utils from '~utils/index'
import {myInventoryMixin} from '~warehouse-common/comp/warehouseMixins'
import checkStockApi from '~api/warehouse/checkStockApi'
import leftMenu from '~warehouse-common/comp/leftmenu.vue'
import {mapState} from 'vuex'
import * as types from '~store/mutation-types'
import imeiProfitDialog from '~warehouse-common/dialog/imeiProfitDialog.vue'
import {download} from '~utils/custom/downloadHelper'
export default {
    data () {
	    var compareFormat = 'yyyy/MM/dd HH:mm:ss';
	    var _self = this;
        return {
            activeCheckName: 'imei',
	        testCsv:'',
            imei:{
	            isCheckDisabeld:true,
	            imeiLoading: false,
	            exportIMEILoading: false,
	            imeiContinueDisable: true,
	            scanType: '',
	            product: '',
	            productDescription: '',
	            imei: '',
	            hasProduct: false,
                hasCheckData: false,
	            imeiList: [{no: 1,imei: ''},{no: 2,imei: ''},{no: 3,imei: ''}],
	            imeiParamesList: [],
                resultsNums: {total: '',match: '',inventoryProfit: '',inventoryLoss: ''},
	            imeiResultlist: [],
	            showImeis: []
            },
            ean:{
	            eanLoading: false,
	            exportEANLoading: false,
	            eanContinueDisable: true,
	            hasCheckData: false,
	            eanProductText: '',
	            eanProductId: '',
	            eanValue: '',
	            eanList: [
		            {no: 1,description: '',quantity: '',ean: '',productId: '',active: false},
		            {no: 2,description: '',quantity: '',ean: '',productId: '',active: false},
		            {no: 3,description: '',quantity: '',ean: '',productId: '',active: false},],
	            eanParamesList: [],
	            eanResultlist: [],
	            resultsNums: {total: '',match: '',inventoryProfit: '',inventoryLoss: ''},
            },
	        takeStockId: '',
            downloadTemplateLoading: false,
            isShowTips: false,
            isShowEanTips: false,
	        showCodeDialogVisible: false,
            lastNum: 0,
            log:{
            	logLoading: false,
	            startDefaultTime: '',
            	search:{
		            facilityId: '',
		            checkTimeFrom: '',
		            checkTimeTo: '',
		            productId: '',
		            resultType: '',
		            fromTime: '',
		            toTime: '',
		            logProductText: '',
                    pageNum: 1,
		            fromPickerOptions: {
			            disabledDate: (time) => {
				            if (_self.log.search.toTime) {
					            return time > Utils.getPartialDate(_self.log.search.toTime, compareFormat)
				            }
				            return false
			            }
		            },
		            toPickerOptions: {
			            disabledDate: (time) => {
				            if (_self.log.search.fromTime) {
					            return time < Utils.getPartialDate(_self.log.search.fromTime)
				            }
				            return false
			            }
		            },
                },
	            isManual: false,
                logResultsList: [],
	            facilityNamesOption: [],
	            logResultsListPage: {
		            pageNum: 1,
		            pageSize: 20,
		            pages: 1,
		            total: 0,
		            size: 0
	            },
            }
        }
    },
    mixins: [myInventoryMixin],
    methods: {},
    components: {
        leftMenu,
	    imeiProfitDialog
    },
	watch: {
		'log.search.fromTime': function (newVal) {
			this.log.search.checkTimeFrom = newVal ? Utils.getServerTimestamp(newVal) || '' : ''
		},
		'log.search.toTime': function (newVal) {
			if (newVal) {
				var d = Utils.parseDate(newVal)
				var newD = new Date(d.setDate(d.getDate() + 1))
				this.log.search.checkTimeTo = Utils.getServerTimestamp(newD) - 1 || ''
			} else {
				this.log.search.checkTimeTo = ''
			}
		}
	},
	filters: {
		setTime: function (value) {
			return value ? Utils.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss') : '----'
		}
	},
    mounted () {
	    var serverNow = this.dateParse(this.currentTime)
	    if(!isNaN(serverNow)) {
		    this.log.startDefaultTime = serverNow
	    }
    },
    created () {
        var _self = this;
	    this.queryProductListDebounce = Utils.debounce(this.queryProductList, 500);
	    this.scanQRCode = Utils.debounce(this.scanIMEI, 1000);
    },
	methods: {
		imeiRef(key){
			return key+'imei';
        },
		eanRef(key){
			return key+'ean';
        },
		continueStartCheck(type){
			switch(type){
				case"imei":
					if(checkStockApi.checkIMEIInventory.getInstance()!=null){
						checkStockApi.checkIMEIInventory.getInstance().abort();
					}
					this.imei.imeiLoading = false;
					this.imei.imeiContinueDisable = true;
					break;
				case"ean":
					if(checkStockApi.checkEANInventory.getInstance()!=null){
						checkStockApi.checkEANInventory.getInstance().abort();
					}
					this.ean.eanLoading = false;
					this.ean.eanContinueDisable = true;
					break;
			}

        },
		renderHeader(h){
			let str;
			if(this.activeCheckName == 'imei'){
				str =(<span class='check-ask-icon'  on-mouseenter={ ($event) =>this.isShowTips = true} on-mouseleave={ ($event) =>this.isShowTips = false}></span>);
            }else{
				str =(<span class='check-ask-icon'  on-mouseenter={ ($event) =>this.isShowEanTips = true} on-mouseleave={ ($event) =>this.isShowEanTips = false}></span>);
            }
			return (
				<div style='position:relative;'>
				<span>Reason</span>
                {str}
                </div>
		    )
        },
		queryProductList(queryString, cb){
			if (!queryString) {
				cb([])
				return false
			}
			checkStockApi.getProductLists({
				start: '0',
				limit: '16',
				filterCol: 'text',
				sort: 'productId',
				dir: 'ASC',
				query: queryString.trim()
			}).then(d => {
				if (d.responseMessage == 'success') {
					if (d.items && d.items.length) {
						cb(d.items)
					} else {
						cb([])
					}
				} else {
					this.$showErrorMessage(d.successMessage)
					cb([])
				}
			}).catch(err => {
				this.$showErrorMessage(err)
				this.ean.eanProductText = '';
				cb([])
			})
        },
		selectProduct(item){
			this.imei.hasProduct = true;
			this.imei.product = item.id;
			this.imei.productDescription = item.text;
        },
		selectProductEan(item){
			this.ean.eanProductText = item.text;
			this.ean.eanValue = item.eanValue;
			this.ean.eanProductId = item.id;
        },
		addProductTo(){
			var _self = this;
			if(!_self.ean.eanProductId){
				_self.$message({message: 'Please choose the correct product information', type: 'warning'});
				return false;
            }
			let obj = {};let isHasVal = true;let num;let lastnum;
			let arrHas = _self.ean.eanList.filter(e=>{return e.productId == _self.ean.eanProductId});
			if(arrHas && arrHas.length>0){
				_self.$message({message: 'This code has already been in the list', type: 'warning'});
				_self.ean.eanProductText = '';
				_self.ean.eanValue = '';
				_self.ean.eanProductId = '';
				return false;
            }

			_self.ean.eanList.some(function(item,index){
				if(!item.description){
					item.description = _self.ean.eanProductText;
					item.ean = _self.ean.eanValue;
					item.productId = _self.ean.eanProductId;
					obj.NO = item.no;
					return true;
                }
                if(_self.ean.eanList.length == index+1){
                	num = item.no;
	                lastnum = item.no;
	                isHasVal = false;
                }
            })
            if(!isHasVal){
	            _self.ean.eanList.push(
	            	{no: ++num,description: _self.ean.eanProductText,quantity: '',ean:_self.ean.eanValue,productId:_self.ean.eanProductId,active: false},
                    {no: ++num,description: '',quantity: '',ean:_self.ean.eanValue,productId:_self.ean.eanProductId,active: false},
                    {no: ++num,description: '',quantity: '',ean:_self.ean.eanValue,productId:_self.ean.eanProductId,active: false})
                _self.$nextTick(function(){
	                _self.$refs[(lastnum+1)+'ean'][0].focus();
                })
            }else{
	            _self.$refs[obj.NO+'ean'][0].focus();
            }
			let obj1 = Object.assign({},{no: lastnum,description: _self.ean.eanProductText,quantity: '',ean:_self.ean.eanValue,productId:_self.ean.eanProductId})
			_self.ean.eanParamesList.push(obj1);
			_self.ean.eanProductText = '';
			_self.ean.eanValue = '';
			_self.ean.eanProductId = '';
        },
		delEan(num,index){
			var _self = this;
			_self.ean.eanList.splice(index,1);
			_self.ean.eanParamesList.splice(index,1);
			_self.ean.eanList.push({no: _self.ean.eanList.length+1,product: '',quantity: '',active: false})
            _self.ean.eanList.forEach(function(item,index){
	            item.no = index+1;
            })
        },
		checkImei(){
			this.imei.imeiLoading = true;
			this.imei.imeiContinueDisable = false;
			checkStockApi.checkIMEIInventory.getInstance().execute(this.setImeiParams()).then(d=>{
				this.imei.imeiLoading = false;
				this.imei.imeiContinueDisable = true;
				this.imei.imeiResultlist.splice(0);
				if(d.success && d.data){
					this.imei.hasCheckData = true;
                    this.takeStockId = d.data.takeStockId;
					this.imei.resultsNums.total = d.data.totalInputQuantity;
					this.imei.resultsNums.match = d.data.matchQuantity;
					this.imei.resultsNums.inventoryProfit = d.data.inventoryProfitQuantity;
					this.imei.resultsNums.inventoryLoss = d.data.inventoryLossQuantity;
					if(d.data.result){
						this.imei.imeiResultlist = d.data.result;
                    }
                }else{
					this.$showErrorMessage(d)
                }
            }).catch(e=>{
				this.imei.imeiContinueDisable = true;
				this.$showErrorMessage(e)
				this.imei.imeiLoading = false;
            })
        },
		checkEan(){
			var _self = this;
            let lists = _self.setEanParams();
			let flag = lists.some(function(item){
				if(!item.quantity||item.quantity==0){
					return true;
				}
            })
            if(flag){
	            _self.$message({message: 'Please enter a positive integer for the quantity.', type: 'warning'});
	            return false;
            }
			this.ean.eanLoading = true;
			this.ean.eanContinueDisable = false;
			checkStockApi.checkEANInventory.getInstance().execute(lists).then(d=>{
				this.ean.eanLoading = false;
				this.ean.eanContinueDisable = true;
				this.ean.eanResultlist.splice(0);
				if(d.success && d.data){
					this.ean.hasCheckData = true;
					this.takeStockId = d.data.takeStockId;
					this.ean.resultsNums.total = d.data.totalInputQuantity;
					this.ean.resultsNums.match = d.data.matchQuantity;
					this.ean.resultsNums.inventoryProfit = d.data.inventoryProfitQuantity;
					this.ean.resultsNums.inventoryLoss = d.data.inventoryLossQuantity;
					if(d.data.result){
						this.ean.eanResultlist = d.data.result;
                    }
				}else{
					this.$showErrorMessage(d)
				}
			}).catch(e=>{
				this.ean.eanContinueDisable = true;
				this.ean.eanLoading = false;
				this.$showErrorMessage(e)
			})
        },
		changeImei(imei,index){
			if(!imei){
				//this.imei.imeiParamesList.splice(index,1,'');
				this.imei.imeiList.splice(index,1,{imei:'',no:index+1});
			}
        },
		scanIMEI(value,index,target){
			console.dir(index);
			var _self = this;
			_self.imei.isCheckDisabeld = false;
			target.target.blur();
			let arrImeis = [];
			var curImei = value;
			if (!curImei) {
				_self.$message({message: 'Please enter correct IMEI code', type: 'warning'});
				target.target.focus();
				return false;
			}
			if (curImei.indexOf('|') != -1) {
				curImei = curImei.replace(/[|]/g, '');
			}
			if (curImei.length > 15 && curImei.length % 15 == 0) {
				let reg = new RegExp('^[0-9]*$');
				if (!reg.test(curImei)) {
					_self.$message({message: 'Please enter correct IMEI code', type: 'warning'});
					_self.imei.imeiList.splice(index,1,{imei:'',no:index+1});
					target.target.focus();
					return false;
				}
				// 去重复
				let str = '';
				let arr = [];
				for (let i = 0, len = curImei.length; i < len; i++) {
					str += curImei[i]
					if ((i + 1) % 15 == 0) {
						arr.push(str);
						str = ''
					}
				};
				if(_self.isRepeat(arr)){
					_self.$message({message: 'This code has already been in the list', type: 'warning'});
					_self.imei.imeiList.splice(index,1,{imei:'',no:index+1});
					target.target.focus();
					return false;
                }
				let hasReapeat = arr.filter(function(item){
					let arrs = _self.imei.imeiList.filter(e=>{return e.imei == item})
					if(arrs && arrs.length>0){
						return true;
					}
				})
				if(hasReapeat && hasReapeat.length > 0){
					_self.$message({message: 'This code has already been in the list', type: 'warning'});
					_self.imei.imeiList.splice(index,1,{imei:'',no:index+1});
					target.target.focus();
					return false;
				}

				//_self.imei.imeiParamesList = _self.imei.imeiParamesList.concat(arr);
				arrImeis = arrImeis.concat(arr);
				let num = 1;let lastNum = 0;let flag = false;
				_self.imei.imeiList.forEach(function(item,index){
					if(item.imei.length>15){
						item.imei = arr[0]
					}
					if(!item.imei){
						item.imei = arr[num];
						num++;
					}
				})
				arr.splice(0,num);
				arr && arr.forEach(function(item,index){
					_self.imei.imeiList.push({no:'',imei:item});
					if(index+1 % 3 != 0 && arr.length == index+1){
						for(let i=0;i < 3-((index+1)%3);i++){
							_self.imei.imeiList.push({no:'',imei:''});
						}
					}
				})
				if(_self.imei.imeiList.length % 3 ==0 && _self.imei.imeiList[_self.imei.imeiList.length-1].imei){
					_self.imei.imeiList.push({no:'',imei:''},{no:'',imei:''},{no:'',imei:''});
				}
				_self.imei.imeiList.forEach(function(item,index){
					item.no = index+1;
					if(!item.imei && !flag){
						lastNum = index;
						flag = true;
					}
				})
				_self.generateProfixImei(arrImeis);
			} else if(curImei.length == 15){
				// 单个imei输入
				let reg = new RegExp('^([0-9]{15})$')
				if (!reg.test(curImei)) {
					_self.$message({message: 'Please enter correct IMEI code', type: 'warning'});
					_self.imei.imeiList.splice(index,1,{imei:'',no:index+1});
					target.target.focus();
					return false;
				}
				if (curImei.indexOf('012345678912456') > -1) {
					_self.imei.imeiList.splice(index,1,{imei:'',no:index+1});
					target.target.focus();
					return false;
				};
				if(_self.hasRepeatImei(curImei)){
					_self.$message({message: 'This code has already been in the list', type: 'warning'});
					_self.imei.imeiList.splice(index,1,{imei:'',no:index+1});
					target.target.focus();
					return false;
				}
				//_self.imei.imeiParamesList.push(curImei);
				arrImeis.push(curImei)
				let colnum = parseInt(target.target.attributes.colnum.value);

				_self.generateProfixImei(arrImeis,colnum);
				if(colnum%3 == 0 && _self.imei.imeiList[_self.imei.imeiList.length-1].imei){
					_self.imei.imeiList.push({no: colnum+1,imei: ''},{no: colnum+2,imei: ''},{no: colnum+3,imei: ''});
				}
			}else{
				_self.imei.imeiList.splice(index,1,{imei:'',no:index+1});
				_self.$message({message: 'Please enter correct IMEI code', type: 'warning'});
				target.target.focus();
            }
		},
		isRepeat(arr){
			var hash = {};
			for(var i in arr) {
				if(hash[arr[i]])
				{
					return true;
				}
				hash[arr[i]] = true;
			}
			return false;
        },
		generateProfixImei(imeis,colnum){
			var _self = this;
			let type = imeis.length>1 ? 'batch' : 'single';
			checkStockApi.findProfixImei({"imei":imeis}).then(d=>{
				this.imei.showImeis.splice(0);
				if(d.success){
					if(!d.data){
						if(type == 'single'){
							let key = (colnum+1)+'imei';
							_self.$refs[''+key][0].focus();
                        }
						return;
					}
					this.showCodeDialogVisible = true;
					this.imei.showImeis = d.data;
					if(type == 'single'){
						this.imei.scanType = 'single';
						clearTimeout(times)
						let times = setTimeout(function(){
							_self.showCodeDialogVisible = false;
								let key = (colnum+1)+'imei';
								_self.$refs[''+key][0].focus();
                        },3000)
                    }else{
						this.imei.scanType = 'branch';
                    }
                }else{
					_self.$showErrorMessage(d)
                }
            }).catch(e=>{
				_self.$showErrorMessage(e)
            })

        },
        setImeiToEmpty(target){
			var _self = this;
	        let colnum = parseInt(target.target.attributes.colnum.value);
            _self.imei.imeiList.forEach(function(item){
	            if(item.no == colnum){
		            item.imei = '';
		            return true;
	            }
            })
        },
        hasRepeatImei(curImei){//判断是否存在重复的IMEI
	        let hasArrs = this.imei.imeiList.filter(function(item){
	        	return item.imei == curImei;
            })
            return hasArrs && hasArrs.length > 1;
        },
		exportStockList(){
        	if(this.activeCheckName == 'imei'){
		        this.imei.exportIMEILoading = true
            }else{
		        this.ean.exportEANLoading = true;
            }
			checkStockApi.exportStockData(this.getExportParams(), {
				progress: (progressEvent) => {}
			}).then(res => {
				if(this.activeCheckName == 'imei'){
					this.imei.exportIMEILoading = false
				}else{
					this.ean.exportEANLoading = false;
				}
				download(res.data, res.headers['x-filename'] || 'TakeStock.csv')
			}).catch(err => {
				if(this.activeCheckName == 'imei'){
					this.imei.exportIMEILoading = false
				}else{
					this.ean.exportEANLoading = false;
				}
				this.$showErrorMessage(err)
			})
        },
		selectProductLog(item){
			this.log.search.logProductText = item.text;
			this.log.search.productId = item.id;
        },
		changeProductLogEvt(data){
			if(!data){
				this.log.search.productId = '';
            }
        },
        getFacility(){
	        this.log.search.facilityId = '';
	        this.log.facilityNamesOption.splice(0);
	        checkStockApi.queryFacility().then(d => {
	        	if(d.success){
	        		if(d.data && d.data.defaultFacilityId && d.data.inventoryFacilitys){
	        			this.log.search.facilityId = d.data.defaultFacilityId;
	        			this.log.facilityNamesOption = this.log.facilityNamesOption.concat(d.data.inventoryFacilitys);
                    }
                    this.getLogData();
                }else{
			        this.$showErrorMessage(d)
                }
	        }).catch(err => {
		        this.$showErrorMessage(err)
	        })
        },
		getPageLogData () {
			if (!this.log.isManual) {
				this.selectLogDataItem(true)
			} else {
				this.log.isManual = false
			}
		},
		getLogData(){
			this.selectLogDataItem(false, 1)
        },
        selectLogDataItem(isOnlyList = false, pageIndex){
	        var _self = this
	        _self.log.logLoading = true
            let obj = Object.assign(_self.setLogParams(),{isOnlyList: isOnlyList,pageNum: pageIndex || _self.log.search.pageNum})
	        _self.$getCommonPageListApi(checkStockApi.getStockLogByCondition, obj, d => {
	        	if(d.data && d.data.list){
			        _self.log.logResultsList.splice(0)
			        _self.log.logResultsList = _self.log.logResultsList.concat(d.data.list);
                }else{
			        _self.log.logResultsList.splice(0)
                }
		        if (_self.search.pageNum != d.data.pageNum) {
			        _self.log.isManual = true
			        _self.search.pageNum = d.data.pageNum
		        }
	        }).then((results) => {
		        _self.log.logLoading = false
		        if (results.length > 1) {
			        if (results[1].success) {
				        _self.log.logResultsListPage.total = results[1].data.total
				        _self.log.logResultsListPage.pageSize = results[1].data.pageSize
			        } else {
				        _self.log.logResultsListPage.total = _self.log.logResultsListPage.pageSize * (_self.log.search.pageNum + 1)
			        }
		        }
	        })
        },
		gotoLogDetail (id) {
			window.open('/warehouse_web/index.html#/stockLogDetail/stockId:' + id)
		},
		downloadTemplate(){
			this.downloadTemplateLoading = true;
			checkStockApi.downloadTemplate({
				progress: (progressEvent) => {}
			}).then(res => {
				this.downloadTemplateLoading = false;
				download(res.data, res.headers['x-filename'] || 'template.csv')
			}).catch(err => {
				this.downloadTemplateLoading = false;
				this.$showErrorMessage(err)
			})
        },
        setImeiParams(){
			var _self=this;
	        let imeiLists = [];
	        let nums = [];
	        _self.imei.imeiList.forEach(function(e,index){
	        	if(e.imei){
	        		if(imeiLists.indexOf(e.imei) == -1){
				        imeiLists.push(e.imei)
                        return;
                    }
			        nums.push(index);
                }
            })
	        for(let i =0 ;i < nums.length; i++){
		        _self.imei.imeiList.splice(nums[i],1,{imei:'',no:nums[i]+1})
            }
	        return {
		        description : this.imei.productDescription,
		        imei : imeiLists,
		        productId : this.imei.product
	        }
        },
		setEanParams(){
			return this.ean.eanList.filter(function(item){
				return item.description && item.productId
            })
        },
        setLogParams(){
			return {
				checkTimeFrom: this.log.search.checkTimeFrom,
				checkTimeTo: this.log.search.checkTimeTo,
				facilityId: this.log.search.facilityId,
				productId: this.log.search.productId,
				resultType: this.log.search.resultType,
				pageSize:10
            }
        },
		getExportParams(){
			return {
				takeStockId : this.takeStockId,
				isImei : this.activeCheckName == 'imei' ? 'Y' : 'N'
			}
        },
		closeProduct(){
			this.imei.hasProduct = false;
			this.imei.productDescription = '';
			this.imei.product = '';
        },
		tabClick (tab, event) {
			var _self = this;
			switch(this.activeCheckName){
				case"imei":
					_self.imei.imeiContinueDisable = true;
					_self.imei.product = '';
					_self.imei.isCheckDisabeld = true;
					_self.imei.productDescription = '';
					_self.imei.hasProduct = false;
					_self.imei.hasCheckData = false;
					_self.imei.imeiList = [{no: 1,imei: ''},{no: 2,imei: ''},{no: 3,imei: ''}];
					_self.imei.imeiParamesList.splice(0);
					_self.imei.resultsNums = {total: '',match: '',inventoryProfit: '',inventoryLoss: ''};
					_self.imei.imeiResultlist.splice(0);
					_self.imei.showImeis.splice(0);
					break;
				case"ean":
					_self.ean.eanContinueDisable = true;
					_self.ean.hasCheckData = false;
					_self.ean.eanProductText = '';
					_self.ean.eanProductId = '';
					_self.ean.eanValue = '';
					_self.ean.eanList = [
						{no: 1,description: '',quantity: '',ean: '',productId: '',active: false},
						{no: 2,description: '',quantity: '',ean: '',productId: '',active: false},
						{no: 3,description: '',quantity: '',ean: '',productId: '',active: false},];
					_self.ean.eanParamesList.splice(0);
					_self.ean.resultsNums = {total: '',match: '',inventoryProfit: '',inventoryLoss: ''};
					_self.ean.eanResultlist.splice(0);
					break;
				case"log":
					_self.log.search.productId = '';
					_self.log.search.fromTime = '';
					_self.log.search.toTime = '';
					_self.log.search.resultType = '';
					_self.getFacility();
					break;
			}
		},
		dateParse(str){
			if (!str) {
				return false
			}
			if (Object.prototype.toString.call(str) === "[object Date]") {
				return str
			}else if (typeof str === "number") {
				return new Date(str)
			} else if (typeof str === "string") {
				return this.formatToDate(str, 'DD/MM/YYYY hh:mm:ss')
			}
			return false
        },
        formatToDate(inputDateStr, inputFormat){
	        var cur = new Date(0)
	        var obj = {
		        Y: cur.getFullYear(),
		        M: cur.getMonth()+1,
		        D: cur.getDate(),
		        h: cur.getHours(),
		        m: cur.getMinutes(),
		        s: cur.getSeconds(),
	        }
	        var str = ""
	        var format = ""
	        for (var i=0; i<inputFormat.length; ++i) {
		        if ("YMDhms".indexOf(inputFormat.charAt(i))>=0) {
			        str += inputDateStr[i]
			        format += inputFormat[i]
		        }
	        }

	        var startIdx=0, endIdx
	        while (startIdx < format.length) {
		        var startChar = format.charAt(startIdx)
		        endIdx = startIdx+1
		        while (endIdx < format.length && format.charAt(endIdx) == startChar)
			        ++endIdx
		        obj[startChar] = parseInt(str.substring(startIdx, endIdx))
		        startIdx = endIdx
	        }
	        return new Date(obj.Y, obj.M - 1, obj.D, obj.h, obj.m, obj.s)
        }
    },
	computed: {
		...mapState([
			'currentTime','timeNow'
		])
	}
}
</script>
<style>
    .tips_content{
        position:absolute;
        top: -15px;
        right: 270px;
        width:280px;
        font-weight: 100;
        padding:5px;
        height:auto;
        font-size:12px;
        background-color: #D3D3D3;
        border-radius:4px;
        transform-origin:center bottom 0px;
        z-index:999;
    }
    .tips_content_ean{
        position:absolute;
        top: -15px;
        right: 12px;
        width:280px;
        font-weight: 100;
        padding:5px;
        height:auto;
        font-size:12px;
        background-color: #D3D3D3;
        border-radius:4px;
        transform-origin:center bottom 0px;
        z-index:999;
    }
    .tips_arrow{
        position:absolute;
        right:57px;
        bottom:-10px;;
        display:block;
        width:0;
        height:0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 10px solid #D7D7D7;
    }
    .singleImeiTip .el-message__group{
        height:auto;
    }
    .singleImeiTip .el-message__img{
        top:19px;
    }
    .list_table .results_table_column > div,.list_table .list_table_column > div {
        padding-right: 5px;
        padding-left: 5px;
        word-break: break-word;
    }
    .el-picker-panel__link-btn{
        display:none;
    }
</style>
<style scoped>
    .tab_box{
        background: #fff;
    }
    .check_main {
        overflow-y: auto;
        zoom: 1;
        width: 100%;
        transition: margin-right 0.3s ease-in-out;
        padding-left: 188px;
        padding-bottom: 80px;
    }

    .main_content{
        background-color: #fff;
        padding:10px 24px 24px;
    }
    .imei_target_name{
        text-align: center;
        line-height: 30px;
        font-weight:bold;
    }
    .imei_tips{
        line-height: 30px;
    }
    .imei_tips>span{
        color:#1FBCD2;
    }
    .imei_input{
        width:100%;
        height:28px;
        border:none;
        text-align: center;
    }
    .results{
        position:relative;
    }
    .check_title{
        line-height: 40px;
        font-weight: 700;
        font-size: 14px;
    }
    .check_hr{
        background-color: #c9c9c9;
        height: 1px;
        border: none;
    }
    .check_tab{
        margin-top:10px;
    }
    .imei_list,.ean_list{
        margin:20px 0px;
    }
    .results_nums{
        width: 720px;
        margin-left: 314px;
        margin-bottom:10px;
    }
    .results_nums_group{
        float:left;
        margin-right: 10px;
    }
    .results_nums_export{
        float:right;
    }
    .list_group{
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-top:1px #dbdbdb solid;
        border-left:1px #dbdbdb solid;
        font-size:12px;
    }
    .list_table{
        font-size:12px;
    }
    .own-icon-reason:before{
        content:"\E614"
    }
    .imei_list .el-col:nth-of-type(6n+0) .list_group{
        border-right:1px #dbdbdb solid;
    }
    .imei_list .el-row:nth-last-of-type(1) .list_group{
        border-bottom: 1px #dbdbdb solid;
    }

    .ean_list_title{
        border-top: 1px solid #dbdbdb;
    }
    .operate_ean_group{
        position: relative;
        float: left;
        font-size: 12px;
        border-bottom: 1px solid #dbdbdb;
    }
    .operate_ean_group>div{
        float: left;
        height: 32px;
        border-right: 1px solid #dbdbdb;
        text-align: center;
    }
    .ean_group_num{
        width: 50px;
    }
    .ean_group_product{
        width: 206px;
    }
    .ean_group_quantity{
        width: 97px;
    }
    .operate_ean_group>div>span{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .operate_ean_group:nth-of-type(3n+1){
        border-left: 1px solid rgb(238, 238, 238);
    }

    .imei_btns{
        text-align: center;
    }
    .results_title{
        margin-bottom: 10px;
    }
    .results_title>span{
        font-weight:bold;
    }
    .bar{
        width:400px;
        border-radius:8px;
        height:20px;
        background:#1FBCD2;
        overflow: hidden;
        margin:10px auto 0px;
        text-align:left;
    }
    .track-wrap {
        position:relative;top:0px;
    }
    .track {
        height:17px;
        display:inline-block;
        background:#fff;
        width:10px;
        border-radius:3px;
        position:relative;
        top:0.5px;
        left:-12px;
        -webkit-animation:progressbar1 2s infinite;
        animation:progressbar1 2s infinite;
        animation-timing-function:linear;
    }
    .track1{
        animation-delay:0s;
    }
    .track2 {
        left:-30px;
        animation-delay:1s;
    }
    .newCheckStock_bar_tips{
        text-align: center;
    }
    @-webkit-keyframes progressbar1 {
        from {left: 0;}
        to  {left: 400px;}
    }
    .ean_mask{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-color: #E5E6E6;
        opacity: 0.9;
    }
    .ean_mask>span{
        margin:0 auto;
    }
    .search_row{
        margin-bottom: 15px;
    }
    .log_form_label{
        font-size: 12px;
        min-width: 55px;
        text-align: right;
        margin-bottom: 0;
    }
    .log_form_result{
        width:160px;
    }
    .log_label_date{
        font-size: 12px;
        min-width: 40px;
        text-align: right;
        margin-bottom: 0;
    }
    .page_box {
        text-align: right;
        margin-top: 10px;
    }
    .suggestionList{
        text-overflow: ellipsis;
        overflow: hidden;
        width:100%;
    }




</style>
