<template>
<div>
 <div>
<el-row :gutter="20">

   <el-col :span="24">
   <div>
    <el-card class="box-card">
     <div slot="header" class="clearfix">
         <el-breadcrumb separator="/">
           <el-breadcrumb-item :to="{ name: '/' }">Main</el-breadcrumb-item>
           <el-breadcrumb-item>Consul Proxy</el-breadcrumb-item>
         </el-breadcrumb>
         <!-- <span @click="handleShowDcCenterChange"  class="dc_span">dcCenter : {{dcCenter.choiceDc}}</span> -->
     </div>



     <iframe class="proxy_iframe" frameborder="0"  style="" src="/ui"></iframe>


   </el-card>
   </div>
   </el-col>
 </el-row>
  </div>
 <div>
 </div>


 <!-- <el-dialog title="请选择数据中心"  :close-on-click-modal='false' :close-on-press-escape='false' :visible.sync="dialogFormVisible">
  <el-form :model="dcCenter">
    <el-form-item label="dc" >
      <el-select v-model="dcCenter.choiceDc" placeholder="dc">
        <el-option v-for="sBAdminList in dcCenter.springBootAdminList" :label="sBAdminList.name" :key="sBAdminList.name" :value="sBAdminList.name"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="handleDcCenterChange">确 定</el-button>
  </div>
</el-dialog> -->

</div>
</template>
<style>
.dc_span{
    float: right;
    margin-top: -15px;
}

.proxy_iframe  {
    min-height: 500px;
    border:0px;
    height: 100%;
    width: 100%;
}
</style>

<script lang="babel">
import nodeApi from '~api/nodeApi'

export default {
    name: 'consulProxy',
    data () {
        return {
            // dialogFormVisible: false,
            // dcCenter: {
            //     springBootAdminList: [],
            //     choiceDc: ''
            // },
            regions: {},
            count: 1
        }
    },
    async created () {
        this.$Progress.start()
        // const data = await nodeApi.verifyDcCenter()
        // console.log(data)
        // if (data.success) {
        //     this.dcCenter.choiceDc = data.choiceDc
        //     this.dcCenter.springBootAdminList = data.springBootAdminList
        //     if (!this.dcCenter.choiceDc) {
        //         this.dialogFormVisible = true
        //     }
        // }
    },
    async mounted () {

    },
    methods: {
        // async handleDcCenterChange () {
        //     const choiceDcObj = {}
        //     choiceDcObj.choiceDc = this.dcCenter.choiceDc
        //     const data = await nodeApi.handleDcCenterChange(choiceDcObj)
        //     console.log(data)
        //     if (data.success) {
        //         location.reload()
        //     }
        // },
        // handleShowDcCenterChange () {
        //     this.dialogFormVisible = true
        // }
    },
    watch: {
    },
    metaInfo: {

    }
}
</script>
