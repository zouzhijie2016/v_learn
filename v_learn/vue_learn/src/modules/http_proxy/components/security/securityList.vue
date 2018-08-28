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
           <el-breadcrumb-item>Security List</el-breadcrumb-item>
         </el-breadcrumb>
     </div>


    <el-tabs type="border-card">
        <el-tab-pane v-for="item in permissionList" :key="item.module" :label="item.module">

            <div style="margin-top: 20px">
                需要添加的 列表
                <el-button @click="_handlerNeedAdd">获取需要添加的sql</el-button>
            </div>
            <el-table
              ref="multipleTable1"
              :data="item.needAddAccessCheck"
              style="width: 100%"
              max-height="250"
              @selection-change="_handlerNeedaddSelectionChange"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="applicationName"
                label="applicationName"
                >
              </el-table-column>
              <el-table-column
                prop="permissionName"
                label="permissionName"
                >
              </el-table-column>
            </el-table>


            <!-- <div style="margin-top: 20px">
                需要修改的 列表
                <el-button @click="_handlerNeedUpdate">获取需要 修改 的sql</el-button>
              </div>
            <el-table
              ref="multipleTable22"
              :data="item.needUpdateAccessCheck"
              style="width: 100%"
              max-height="250"
              @selection-change="_handlerNeedUpdateSelectionChange"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="applicationName"
                label="applicationName"
                >
              </el-table-column>
              <el-table-column
                prop="permissionName"
                label="permissionName"
                >
              </el-table-column>
            </el-table> -->

            <!-- <div style="margin-top: 20px">
                需要 删除 的 列表
                <el-button @click="_handlerNeedDel">获取需要 删除 的sql</el-button>
            </div>
            <el-table
              ref="multipleTable3"
              :data="item.needDelAccessCheck"
              style="width: 100%"
              max-height="250"
              @selection-change="_handlerNeedDelSelectionChange"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="applicationName"
                label="applicationName"
                >
              </el-table-column>
              <el-table-column
                prop="permissionName"
                label="permissionName"
                >
              </el-table-column>
            </el-table> -->

        </el-tab-pane>

    </el-tabs>


   </el-card>
   </div>
   </el-col>
 </el-row>
  </div>
 <div>
 </div>

 <el-dialog
   title="请复制下面的sql 交由开发执行"
   :visible.sync="needAddSelectedDialog"
   >
     <span class="devSelectedDialog" v-for="needAddSelected of needAddSelectedArr">
       INSERT INTO `YW_VUE_CHECK`
       (
       `APPLICATION_NAME`,
       `PERMISSION_NAME`,
       `ENABLE`,
       `CREATED_TIME`,
       `CREATED_USER`
       )VALUES(
       '{{needAddSelected.applicationName}}',
       '{{needAddSelected.permissionName}}',
       1,
       '{{new Date().getTime()}}',
       'admin'
       );
     </span>
 </el-dialog>


 <!-- <el-dialog
   title="请复制下面的sql 交由开发执行"
   :visible.sync="needUpdateSelectedDialog"
   >
     <span class="devSelectedDialog" v-for="needUpdateSelected of needUpdateSelectedArr">
       UPDATE `YW_VUE_CHECK`
       SET
       `ID` = '{{needUpdateSelected.id}}',
       `APPLICATION_NAME` = '{{needUpdateSelected.applicationName}}',
       `PERMISSION_NAME` = '{{needUpdateSelected.permissionName}}',
       `ENABLE` =1,
       `UPDATED_TIME` = '{{new Date().getTime()}}',
       `UPDATED_USER` = 'admin'
       WHERE `ID` ='{{needUpdateSelected.id}}';

     </span>
 </el-dialog> -->

 <!-- <el-dialog
   title="请复制下面的sql 交由开发执行"
   :visible.sync="needDelSelectedDialog"
   >
     <span class="devSelectedDialog" v-for="needDelSelected of needDelSelectedArr">
       DELETE FROM `YW_VUE_CHECK`
       WHERE `ID` ='{{needDelSelected.id}}';
     </span>
 </el-dialog> -->


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
import _ from 'lodash'
export default {
    name: 'serviceList',
    data () {
        return {
            permissionList: [],

            needAddVueCheck: [],
            needAddSelectedArr: [],
            needAddSelectedDialog: false,

            needDelVueCheck: [],
            needDelSelectedArr: [],
            needDelSelectedDialog: false,

            needUpdateVueCheck: [],
            needUpdateSelectedArr: [],
            needUpdateSelectedDialog: false
        }
    },
    async created () {
        let securityListRes = await nodeApi.handleSecurityList()
        let vueCheckListRes = await nodeApi.handleVueCheckList({})
        this.buildPermissionList(securityListRes.permissionList, vueCheckListRes.data)

        // if (data.success) {
        //   // this.permissionList = data.permissionList;
        //   this.buildPermissionList(data.permissionList);
        // }
    },
    async mounted () {
    },
    methods: {
        async getDBVueCheckList () {
            let obj = {}
            const {data} = await _devApi.handleVueCheckList(obj)
            return data
        },
        buildPermissionList (permissionList, vueCheckList) {
            let needAddVueCheck = []
            let needDelVueCheck = []
            let needUpdateVueCheck = []

            _.forEach(permissionList, (x) => {
                var applicationName = x.module
                var permissionList = x.permission

                let needAddAccessCheckArr = []

                _.forEach(permissionList, (z) => {
                    var permissionObj = {}
                    permissionObj.applicationName = applicationName
                    permissionObj.permissionName = z
                    let needAdd = _.find(vueCheckList, (y) => {
                        return applicationName == y.applicationName && z == y.permissionName
                    })
                    if (_.isEmpty(needAdd)) {
                        needAddAccessCheckArr.push(permissionObj)
                    }
                })
                x.needAddAccessCheck = needAddAccessCheckArr

                // let needUpdateAccessCheckArr = [];
                // _.forEach(permissionList, (z)=>{
                //   var permissionObj = {};
                //   permissionObj.applicationName = applicationName;
                //   permissionObj.permissionName = z;
                //     let needAdd = _.find(vueCheckList, (y)=>{
                //       return  applicationName == y.applicationName  && z == y.permissionName ;
                //     })
                //     needAdd = needAdd || {};
                //     if(!_.isEmpty(needAdd) && (z != needAdd.permissionName || applicationName != needAdd.applicationName)){
                //       needUpdateAccessCheckArr.push(permissionObj);
                //     }
                // });
                // x.needUpdateAccessCheck = needUpdateAccessCheckArr;

                // let needDelAccessCheckArr = [];
                // _.forEach(permissionList, (z)=>{
                //   var permissionObj = {};
                //       permissionObj.applicationName = applicationName;
                //       permissionObj.permissionName = z;
                //     let needAdd = _.find(vueCheckList, (y)=>{
                //         return  applicationName == y.applicationName  && z == y.permissionName ;
                //     })
                //     if(_.isEmpty(needAdd)){
                //       needDelAccessCheckArr.push(permissionObj);
                //     }
                // });
                // x.needDelAccessCheck = needDelAccessCheckArr;

            })
            this.permissionList = permissionList
        },
        _handlerNeedAdd () {
            this.needAddSelectedArr = this.needAddSelectedArr || []
            if (this.needAddSelectedArr.length == 0) {
                return
            }
            this.needAddSelectedDialog = true
        },
        _handlerNeedUpdate () {
            this.needUpdateSelectedArr = this.needUpdateSelectedArr || []
            if (this.needUpdateSelectedArr.length == 0) {
                return
            }
            this.needUpdateSelectedDialog = true
        },
        _handlerNeedDel () {
            this.needDelSelectedArr = this.needDelSelectedArr || []
            if (this.needDelSelectedArr.length == 0) {
                return
            }
            this.needDelSelectedDialog = true
        },
        _handlerNeedaddSelectionChange (obj) {
            this.needAddSelectedArr = obj
        },
        _handlerNeedUpdateSelectionChange (obj) {
            this.needUpdateSelectedArr = obj
        },
        _handlerNeedDelSelectionChange (obj) {
            this.needDelSelectedArr = obj
        }
    },
    watch: {
    },
    metaInfo: {

    }
}
</script>
