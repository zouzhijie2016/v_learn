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
           <el-breadcrumb-item>Server List</el-breadcrumb-item>
         </el-breadcrumb>
     </div>

    <el-tree
      :data="regions"
      :load="loadNode"
      :highlight-current=true
      :render-content="renderContent"
      lazy
      @check-change="handleCheckChange">
    </el-tree>


   </el-card>
   </div>
   </el-col>
 </el-row>
  </div>
 <div>
 </div>
</div>
</template>
<style>
    .serverList_form {
      font-size: 0;
      margin-top: -36px;
    }
    .serverList_form label {
      color: #99a9bf;
    }
    .serverList_form .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
    }
</style>

<script lang="babel">
import nodeApi from '~api/nodeApi'
export default {
    name: 'serviceList',
    data () {
        return {
            regions: [],
            count: 1
        }
    },
    async created () {
    },
    async mounted () {
    },
    methods: {
        handleCheckChange (data, checked, indeterminate) {
            console.log(data, checked, indeterminate)
        },
        handleNodeClick (data) {
            console.log(data)
        },
        renderContent (createElement, { node, data }) {
            if (node.level === 1) {
                return <span>
                    {data}
                </span>
            }
            if (node.level === 2) {
                return <span>
                    {data.ServiceID}
                </span>
            }
            if (node.level === 3) {
                node.isLeaf = true
                console.log(node)
                console.log(data)
                return <el-form label-position="left" class="serverList_form">
                    <el-form-item label="Address">
                        <span>{data.Address}</span>
                    </el-form-item>
                    <el-form-item label="ServicePort">
                        <span>{data.ServicePort}</span>
                    </el-form-item>
                    <el-form-item label="ServiceName">
                        <span>{data.ServiceName}</span>
                    </el-form-item>
                    <el-form-item label="ServiceID">
                        <span>{data.ServiceID}</span>
                    </el-form-item>
                    <el-form-item label="Node">
                        <span>{data.Node}</span>
                    </el-form-item>
                    <el-form-item label="Datacenter">
                        <span>{data.Datacenter}</span>
                    </el-form-item>
                    <el-form-item label="ID">
                        <span>{data.ID}</span>
                    </el-form-item>
                    <el-form-item label="Action">
                        <el-button onClick={() => this.$router.push({ name: 'druidProxy', params: { host: data.Address, port: data.ServicePort }})} type="primary">druidProxy</el-button>
                        <el-button onClick={() => window.open('http://' + data.Address + ':' + data.ServicePort + '/swagger-ui.html')} type="primary">swaggerProxy</el-button>
                    </el-form-item>
                </el-form>
            }
        },
        async loadNode (node, resolve) {
            if (node.level === 0) {
                const data = await nodeApi.getServices()
                const dataArr = []
                for (const dataKey in data) {
                    dataArr.push(dataKey)
                }
                return resolve(dataArr)
            }
            if (node.level === 1) {
                const data = await nodeApi.getService(node.data)
                const servicesArr = [].slice.call(data)
                resolve(servicesArr)
            }
            if (node.level === 2) {
                resolve([node.data])
            }
            if (node.level > 2) {
                resolve([])
            }
        }
    },
    watch: {
    },
    metaInfo: {

    }
}
</script>
