<!-- <template>
<div>
 <div>
<el-row :gutter="20">

   <div>
    <el-card>
     <div slot="header" class="">
     <el-col :span="12">
         <el-breadcrumb separator="/">
           <el-breadcrumb-item :to="{ name: '/' }">Main</el-breadcrumb-item>
           <el-breadcrumb-item>Proxy Detail</el-breadcrumb-item>
         </el-breadcrumb>
      </el-col>
      <el-col :span="12">
          <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="proxyHost">
                  <span>{{proxyHost}}</span>
                </el-form-item>
                <el-form-item label="proxyPort">
                  <span>{{proxyPort}}</span>
                </el-form-item>
          </el-form>
      </el-col>
     </div>

    <iframe class="proxy_iframe" frameborder="0"  style="" src="/swagger-ui.html"></iframe>
   </el-card>
   </div>

 </el-row>
  </div>
 <div>
 </div>
</div>
</template>
<style>

.demo-table-expand {
    margin-top: -15px;
    font-size: 0;
 }
 .demo-table-expand label {
   width: 90px;
   color: #99a9bf;
 }
 .demo-table-expand .el-form-item {
   margin-right: 0;
   margin-bottom: 0;
   width: 50%;
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
    name: 'swaggerProxy',
    data () {
        return {
            proxyHost: '',
            proxyPort: ''
        }
    },
    async created () {
        this.proxyHost = this.$route.params.host
        this.proxyPort = this.$route.params.port
        this.$cookie.set('proxyHost', this.proxyHost)
        this.$cookie.set('proxyPort', this.proxyPort)
    },
    async mounted () {
    },
    methods: {
        handleItemChange (val) {
            console.log('active item:', val)
            setTimeout(() => {
                if (val.indexOf('江苏') > -1 && !this.options2[0].cities.length) {
                    this.options2[0].cities = [{
                        label: '南京'
                    }]
                } else if (val.indexOf('浙江') > -1 && !this.options2[1].cities.length) {
                    this.options2[1].cities = [{
                        label: '杭州'
                    }]
                }
            }, 300)
        }
    },
    watch: {
    },
    metaInfo: {
    }
}
</script> -->
