<template>
  <div>
    <el-dialog title="User setting info" custom-class="userInfoDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <div class="user_setting_dialog">
          <el-steps :space="300" :active="active" :center="true" :align-center="true" class="user_steps">
            <el-step title="Base Information"></el-step>
            <el-step title="Interrelated Information"></el-step>
            <el-step title="Finish"></el-step>
          </el-steps>
          <el-collapse v-model="activeNames" >
            <el-collapse-item name="1" class="user_collapse_item">
                <template slot="title">
                    Base Information
                </template>
              <el-form label-width="100px" style="overflow: hidden;margin:0 auto;" class="demo-ruleForm base_form" v-loading="loading" element-loading-text="Loading...">
                <el-form-item label="User ID : " class="store_setting_item">
                  {{baseForm.userLoginId}}
                </el-form-item>
                <el-form-item label="Password : " prop="password" class="store_setting_item">
                  {{baseForm.password}}
                </el-form-item>
                <el-form-item label="Company : " prop="company" class="store_setting_item">
                  {{baseForm.companyName}}
                </el-form-item>
                <el-form-item label="Name : " prop="userName" class="store_setting_item">
                  <el-col :span="12">
                    {{baseForm.userName}}
                  </el-col>
                  <el-col :span="12">
                    <el-radio class="radio" v-model="baseForm.gender" label="1" :disabled="true">Female</el-radio>
                    <el-radio class="radio" v-model="baseForm.gender" label="2" :disabled="true">Male</el-radio>
                  </el-col>
                </el-form-item>
                <el-form-item label="Birthday : " prop="birthday" class="store_setting_item">
                  {{baseForm.birthday}}
                </el-form-item>
                <el-form-item label="Card ID : " prop="cardId" class="store_setting_item">
                  {{baseForm.cardId}}
                </el-form-item>
              </el-form>
            </el-collapse-item>
            <el-collapse-item name="2" class="user_collapse_item">
                <template slot="title">
                    Interrelated Information
                </template>
              <template v-for="(val,index) in interrelations">
                <el-form ref="interrelateForm" label-width="100px" style="margin:0 auto;" class="demo-ruleForm base_form" v-loading="loading" element-loading-text="Loading...">
                  <el-form-item label="Role : " prop="role" class="store_setting_item">
                      {{val.ywRoleName}}
                  </el-form-item>
                  <el-form-item label="Store : " prop="store" class="store_setting_item">
                    <div class="form_select_tags">
                      <el-tag v-for="item in val.stores" class="user_tag_select" size="small" :key="item.id"  v-bind:style="{backgroundColor: getBackColor(item)}">{{item.storeName}}</el-tag></div>
                  </el-form-item>
                  <el-form-item label="Warehouse : " prop="warehouse" class="store_setting_item">
                    <div class="form_select_tags">
                      <el-tag v-for="item in val.facilitys"  class="user_tag_select" size="small" :key="item.facilityId"  v-bind:style="{backgroundColor: getBackWarehouseColor(item)}">
                        {{item.facilityName}}
                      </el-tag>
                    </div>
                  </el-form-item>
                </el-form>
              </template>
              <div class="store_setting_interrelateBtn">
                <el-button type="primary" @click="dataCloseVisible = false" class="operate_button">Close</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import userSettingApi from '~api/setting/userSettingApi'
import _ from 'lodash'
export default {
    props: ['dataVisible', 'dataUserId'],
    data () {
        var getBackColor = function (val) {
            let storeGroup = _.filter(this.storeGroups, (o) => { return o.storeGroupID === val.productStoreGroupId })
            return storeGroup && storeGroup[0].color ? storeGroup[0].color : '#13ce66'
        }
	    var getBackWarehouseColor = function(val){
		    if(val.facilityName.indexOf('Egatee')>-1 || val.facilityName.indexOf('MBA')>-1){
			    return '#6DB773'
		    }
		    if(val.facilityName.indexOf('RC')>-1 || val.facilityName.indexOf('MDL')>-1 || val.facilityName.indexOf('TI')>-1){
			    return '#f1453d'
		    }
		    let warehouseGroup = _.filter(this.storeGroups, (o) => {
			    let groupId = o.storeGroupID;
			    groupId = groupId.toLowerCase().replace("_s","")
			    return val.facilityName.toLowerCase().indexOf(groupId) > -1
		    })
		    return warehouseGroup && warehouseGroup[0].color ? warehouseGroup[0].color : '#13ce66'
	    }
        return {
            dataCloseVisible: true,
            loading: false,
            title: 'user setting',
            active: 3,
            userId: '',
            storeGroups: [],
            activeNames: ['1', '2'],
            interrelateShow: 'el-icon-arrow-up',
            baseShow: 'el-icon-arrow-up',
            baseForm: {userLoginId: '', password: '', companyName: '', userName: '', gender: '', birthday: '', cardId: ''},
            interrelations: [{ywRoleName: '', stores: [], facilitys: [] }],
            getBackColor: getBackColor,
	        getBackWarehouseColor: getBackWarehouseColor
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
            if (!this.dataCloseVisible) {
                this.$emit('update:dataUserId', '')
            }
        }
    },
    created () {
        this.initTitle()
        this.userId = this.dataUserId
        this.initData()
    },
    methods: {
        initTitle () {
            var _self = this
            switch (_self.dataType) {
                case 'edit':
                    _self.title = 'Edit ' + _self.title
                    break
                case 'copy':
                    _self.title = 'Copy ' + _self.title
                    break
                default:
                    _self.title = 'New ' + _self.title
                    break
            }
        },
        initData () {
            var _self = this
            _self.loading = true
            var getAllGroupsPromise = new Promise(function (resolve) {
                userSettingApi.searchAllGroups().then(d => {
                    if (d.success && d.data && d.data.STORE_GROUP) {
                        _self.storeGroups = d.data.STORE_GROUP
                        _self.storeGroups.forEach(function (val) {
                            val.color = _self.getColor(val.storeGroupID)
                        })
                    }
                    resolve()
                })
            })
            Promise.all([getAllGroupsPromise]).then(function (arr) {
                _self.getUserInfoByID()
            }, function () {
                _self.loading = false
            })
        },
        showBaseForm () {
            this.baseShow = this.baseShow == 'el-icon-arrow-down' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
        },
        showInterrelateForm () {
            this.interrelateShow = this.interrelateShow == 'el-icon-arrow-down' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
        },
        getStoreValue (val) {
            let store = _.filter(this.storeOptions, (o) => { return o.id === val })
            return store[0].storeName
        },
        getUserInfoByID () {
            userSettingApi.findUserByUserId({
                userId: this.userId
            }).then(d => {
                this.loading = false
                if (d.success && d.data) {
                    this.setParmarsData(d.data)
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(e => {
                this.loading = false
                this.$showErrorMessage(e.message)
            })
        },
        setParmarsData (data) {
            var _self = this
            _self.baseForm.userId = data.userId
            _self.baseForm.userLoginId = data.userLoginId
            _self.baseForm.userName = data.userName
            _self.baseForm.password = data.passWord
            _self.baseForm.companyId = data.companyId
            _self.baseForm.gender = data.gender+"";
            _self.baseForm.birthday = data.birthday ? Utils.getServerDateStrByLocal(parseInt(data.birthday), 'dd/MM/yyyy hh:mm:ss') : ''
            _self.baseForm.cardId = data.cardId
            if (data.findUserRoleVO && data.findUserRoleVO.resultUserRoles) {
                _self.interrelations.splice(0)
                data.findUserRoleVO.resultUserRoles.forEach(function (val, index) {
                    let obj = []; let obj2 = []
                    val.facilitys && val.facilitys.forEach(function (item) {
                        obj.push(item)
                    })
                    val.stores && val.stores.forEach(function (item) {
                        obj2.push(item)
                    })
                    let objs = {stores: obj2, facilitys: obj, ywRoleName: val.ywRoleName}
                    _self.interrelations.push(objs)
                })
            }
        },
	    getColor (groupId) {
		    let color = "";
		    switch(groupId){
			    case"BANANA_S":
				    color = '#6DB773';
				    break;
			    case"AIRTEL_S":
				    color = '#990000';
				    break;
			    case"MTN_S":
				    color = '#199ED8';
				    break;
			    case"SUPPLIER_TI":
				    color = '#f1453d';
				    break;
			    case"TEST":
				    color = '#1fbcd2';
				    break;
			    case"UTL_S":
				    color = '#fec93e';
				    break;
		    }
		    return color
	    },
    }
}
</script>
<style>
  .userInfoDialog {
    width: 800px;
    min-height: 600px;
    padding-right: 20px;
  }
  .userInfoDialog .el-collapse {
    border: none;
  }

  .userInfoDialog .el-collapse-item__header {
      background-color: rgb(228, 228, 228);
      border: none;
      padding-left:15px;
  }
  .userInfoDialog .el-collapse-item__arrow{
      margin-right: 8px;
      transition: transform .3s;
      float: right;
      line-height: 36px;
      font-weight: 300;
  }

  .userInfoDialog .el-collapse-item__header__arrow {
    display: none;
  }

  .userInfoDialog .el-collapse-item__wrap {
    border-bottom: none;
    background-color: #fff;
  }
</style>
<style scoped>
  .user_steps {
    margin-bottom: 10px;
  }
  .base_form{
    width:500px;
  }

  .user_collapse_item {
    margin-bottom: 5px;
  }
  .user_bar_icon {
    float: right;
    display: block;
    line-height: 30px;
    padding-right: 10px;
  }
  .user_tag_select{
    margin-right:5px;
  }
  .store_setting_interrelateBtn{
    text-align:center;
  }
  .store_setting_item{
    margin-bottom:15px;
  }

</style>
