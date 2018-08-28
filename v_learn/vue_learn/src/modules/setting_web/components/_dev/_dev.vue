<template>
  <div>
    <el-row>
      <el-col :span="4">
        <setting-menu :urlPermiss="currentRouteUrl"></setting-menu>
      </el-col>
      <el-col :span="20">
        <div class="center_main">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Cloud Instances</span>
            </div>
            <el-tabs>
                <el-tab-pane v-for="item in loadCloudInstancesData" :key="item.key" :label="item.key" :name="item.key">

                  <el-card v-for="obj in item.children" :key="obj.Service.ID" class="box-card">
                    <div slot="header" class="clearfix">
                      <span>{{obj.Service.ID}}</span>
                      <el-button @click="goToDetil(obj)" style="float: right; padding: 3px 0" type="text">Operation</el-button>
                    </div>
<el-form class="dev_form">
  <el-form-item v-for="check in obj.Checks" :key="check.CheckID" :label="check.Name">
    <span :class="check.Status=='passing' ? 'bg-success' : 'bg-danger' " >{{check.Status}}</span>
  </el-form-item>

  <el-form-item label="Node Name">
    <span >{{obj.Node.Node}}</span>
  </el-form-item>

  <el-form-item label="Node Address">
    <span>{{obj.Node.Address}}</span>
  </el-form-item>

  <el-form-item label="Service Name">
    <span>{{obj.Service.Service}}</span>
  </el-form-item>

  <el-form-item label="Service ID">
    <span>{{obj.Service.ID}}</span>
  </el-form-item>

  <el-form-item label="Service Address">
    <span>{{obj.Service.Address}}</span>
  </el-form-item>

  <el-form-item label="Service Port">
    <span>{{obj.Service.Port}}</span>
  </el-form-item>

  <el-form-item label="Service Port">
    <span>{{obj.Service.Port}}</span>
  </el-form-item>

</el-form>
                  </el-card>

                </el-tab-pane>
            </el-tabs>

          </el-card>


        </div>
      </el-col>

    </el-row>

  </div>
</template>
<script>
import settingMenu from '~setting-common/comp/settingMenu.vue'
import Utils from '~utils/index'
import _devApi from '~api/setting/_dev'
export default {
    data () {
        return {
        // activeName2:'0',
            currentRouteUrl: '',
            // activeNames: ['1'],
            loadCloudInstancesData: [],
            items: []
        }
    },
    mounted () {
        this.currentRouteUrl = '_dev'
        this.loading()
    },
    filters: {
    },
    components: {
        settingMenu
    },
    methods: {
        async loading () {
            const {data} = await _devApi.loadCloudInstances()
            this.loadCloudInstancesData = this.buildTree(data)
        },
        buildTree (datas) {
            let cloudArr = []
            for (var data in datas) {
                let obj = {}
                obj.key = data
                obj.children = datas[data]
                cloudArr.push(obj)
            }
            return cloudArr
        },
        goToDetil (date) {
            console.log(date)

            if (date.Service.Address) {
                this.$router.push({ name: '_devDetil', params: { host: date.Service.Address, port: date.Service.Port }})
            } else {
                this.$showErrorMessage('这个 Service 无效！！')
            }

        }

    }
}
</script>
<style scoped>
  .center_main{
    margin-left:20px;
  }

  .dev_form .bg-danger {
   background: #F56C6C;
 }

 .dev_form .bg-success {
   background: #67C23A;
 }

</style>
