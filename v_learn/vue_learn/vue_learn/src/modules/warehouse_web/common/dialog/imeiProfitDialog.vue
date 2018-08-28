<template>
  <div>
    <el-dialog :title="title" custom-class="profitImeiDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false" :show-close="isClose">
        <div>
            <div v-if="scanType == 'branch'" >
                <p>Invntory profit :</p>
                <div class="profit_list">
                    <template v-for="item in imeiList">
                        <span>{{item}}</span>
                    </template>
                </div>
                <p>Please pick them out and seperate them with others.</p>
                <div style="text-align: right"><el-button type="primary" @click="dataCloseVisible = false">OK</el-button></div>
            </div>
            <div v-if="scanType == 'single'" style="margin-top: -30px;margin-bottom:-10px;">
                <p>Invntory profit :</p>
                <div class="profit_single_list">
                    <template v-for="item in imeiList">
                        <span>{{item}}</span>
                    </template>
                </div>
                <p>Please pick them out and seperate them with others.</p>
            </div>

        </div>
    </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
export default {
    props: ['dataVisible', 'imeiList','scanType'],
    data () {
        return {
            dataCloseVisible: true,
            title: '',
	        isClose: false,
        }
    },
    mounted () {
    	if(this.scanType == 'single'){
    		this.isClose = false;
    		this.title = '';
        }else{
		    this.isClose = true;
		    this.title = 'Message';
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
}
</script>
<style>
  .profitImeiDialog {
    width: 450px;
  }

</style>
<style scoped>
    .profit_list{
        padding: 0 60px;
        margin: 3px 0 20px;
        height: auto;
        overflow: hidden;
    }
    .profit_single_list{
        margin: 3px 0;
    }
    .profit_list span{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        float: left;
        margin-right: 20px;
        color: red;
    }
    .profit_single_list span{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: red;
    }

</style>
