<template>
    <div class="shippingDetail">
        <div class="shippingDetailTitle">Shipping Details of Order#{{ orderId }}</div>
        <div class="shippingDetailContent" v-if="cardData.length">
            <el-tabs v-model="activeName" type="card" class="cardList" v-for="(item, index) in cardData" :key="item.id">
                <el-tab-pane :label="'Package' + (index + 1)" name="first">
                    <el-row :gutter="30">
                        <el-col :span="12">
                            <div class="shipContent">
                                <el-row :gutter="5">
                                    <el-col :span="12"><div class="labelHead"><span class="labelTitle">Package ID:</span> <span>{{ item.packageVO.packageId }}</span></div></el-col>
                                    <el-col :span="12"><div class="labelHead"><span class="labelTitle">Shipment ID:</span> <span>{{ item.packageVO.shipmentId }}</span></div></el-col>
                                </el-row>
                            </div>
                            <el-table :data="item.packageVO.packageItemList">
                                <el-table-column type="index" width="50" label="No."></el-table-column>
                                <el-table-column label="Product" align="left" width="280">
                                    <template slot-scope="scope">
                                      <div v-if="scope.row.productFeature">{{ scope.row.productId }} - {{ scope.row.productName }} {{ scope.row.productFeature }}</div>
                                      <div v-else>{{ scope.row.productId }} - {{ scope.row.productName }} {{ scope.row.productFeature }}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="IMEI" align="center">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.imeiList && scope.row.imeiList.length">
                                            <div v-for="list in scope.row.imeiList" :key="list" style="width:100%">{{ list }}</div>
                                        </div>
                                        <div v-else>----</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="quantity" label="Quantity" align="right"></el-table-column>
                            </el-table>
                        </el-col>
                        <el-col :span="12">
                            <div class="shipContent">
                              <el-row :gutter="5">
                                  <el-col :span="24"><div class="labelHead"><span class="labelTitle">History</span></div></el-col>
                                  <el-col :span="24">
                                      <div class="historyList" v-if="item.shipHistoryVO">
                                          <div v-if="item.shipHistoryVO.packedTime"><span class="">{{ item.shipHistoryVO.packedTime | formatDate }}</span> <span class="">Items Packed</span></div>
                                          <div v-if="item.shipHistoryVO.shippedTime"><span class="">{{ item.shipHistoryVO.shippedTime | formatDate }}</span> <span class="">Shipped (Driver: {{item.shipHistoryVO.driverName}}, Tel: {{item.shipHistoryVO.telephone}}, License No: {{item.shipHistoryVO.licenseNo}}, Note: {{item.shipHistoryVO.note}})</span></div>
                                          <div v-if="item.shipHistoryVO.completeTime"><span class="">{{ item.shipHistoryVO.completeTime | formatDate }}</span> <span class="">Shipment Complete</span></div>
                                      </div>
                                  </el-col>
                              </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>
      <div class="shippingDetailContent" v-else><span class="noDataTips"><i class="el-icon-warning"></i> No detail information for the shipment so far.</span></div>
    </div>
</template>
<script>
import orderApi from '~api/orderapi'
import Utils from '~utils/index'
export default {
    data () {
        return {
            orderId: '',
            activeName: 'first',
            cardData: []
        }
    },
    created () {
        this.orderId = this.$route.params.orderId || this.$route.query.orderId

        orderApi.queryShippingDetailOrder({
            orderId: this.orderId
        }).then(d => {
            if (d.success == true) {
                if (d.data && d.data.length) {
                    this.cardData.splice(0)
                    this.cardData = this.cardData.concat(d.data)
                } else {
                    this.cardData.splice(0)
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })
    },
    filters: {
        formatDate (val) {
            if (!val) {
                return val
            }

            return Utils.getServerDateStrByLocal(val, 'dd/MM/yyyy hh:mm:ss')
        }
    }
}
</script>
<style>
    .shippingDetail{
        background: #ffffff;
        padding: 0 10px 10px 10px;
    }
    .shippingDetailContent{
      padding: 10px 0;
    }
    .shippingDetailContent .noDataTips{
    }
    .shippingDetailTitle{
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #dbdbdb;
    }
    .cardList{
        margin-bottom: 25px;
    }
    .labelHead{
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
    }
    .labelTitle{
        display: inline-block;
        font-size: 12px;
        font-weight: bold;
        height: 30px;
        line-height: 30px;
    }
    .historyList{
        line-height: 25px;
        width: 100%;
    }
    .historyList span{
        width: 50%;
        float: left;
        display: block;
        text-align: left;
    }
</style>
