<template>
  <div>
    <el-dialog :title="title" custom-class="userSettingDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <div class="user_setting_dialog">
          <el-steps :space="300" :active="active" :center="true" :align-center="true" class="user_steps">
            <el-step title="Base Information"></el-step>
            <el-step title="Interrelated Information"></el-step>
            <el-step title="Finish"></el-step>
          </el-steps>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" class="user_collapse_item">
                <template slot="title">
                    Base Information
                </template>
                <template v-loading="loading" element-loading-text="Loading...">
                    <el-form :model="baseForm" :rules="baseRules" ref="baseForm" label-width="100px"
                             style="width:460px;margin:10px auto;" class="demo-ruleForm base_form">
                        <el-form-item label="User ID" prop="userLoginId" class="store_setting_item">
                            <el-input v-model="baseForm.userLoginId" placeholder="Input user ID"
                                      :disabled="baseFormDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="Password" prop="passWord" class="store_setting_item">
                            <template v-if="dataType != 'edit'">
                                <el-input v-model.trim="baseForm.passWord" placeholder="Input password"
                                          :disabled="baseFormDisabled" type="password"></el-input>
                            </template>
                            <template v-if="dataType == 'edit'">
                                <el-col :span="11">
                                    <el-input v-model.trim="baseForm.passWord" placeholder="Input password"
                                              :disabled="baseFormDisabled || pwdDisable" type="password" ></el-input>
                                </el-col>
                                <el-col :span="12" :offset="1">
                                    <div class="user_pwd">
                                        <el-button type="primary" :disabled="isResetPwd" @click="resetPwd">Reset</el-button>
                                        <div v-if="isResetPwd" class="el-icon-circle-check user_pwd_tips">reset password '123456'.</div>
                                    </div>
                                </el-col>
                            </template>
                        </el-form-item>
                        <el-form-item label="Company" prop="company" class="store_setting_item">
                            <el-select v-model="baseForm.companyId" @change="changeCompany" placeholder="select company" style="width:300px;" v-if="!baseFormDisabled">
                                <el-option v-for="item in companyOptions" :key="item.id" :value="item.id" :label="item.companyName"></el-option>
                            </el-select>
                            <el-input v-model="baseForm.companyId" v-if="baseFormDisabled" :disabled="baseFormDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="Name" prop="userName" class="store_setting_item">
                            <el-col :span="10">
                                <el-input v-model.trim="baseForm.userName" placeholder="Input name"
                                          :disabled="baseFormDisabled"></el-input>
                            </el-col>
                            <el-col :span="12" :offset="1">
                                <el-radio class="radio" v-model="baseForm.gender" label="1" :disabled="baseFormDisabled">Female</el-radio>
                                <el-radio class="radio" v-model="baseForm.gender" label="2" :disabled="baseFormDisabled">Male</el-radio>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="Birthday" prop="birthday" class="store_setting_item">
                            <el-date-picker type="date" placeholder="Select birthday date"  v-model.trim="baseForm.birthday" format="dd/MM/yyyy" :disabled="baseFormDisabled" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="Card ID" prop="cardId" class="store_setting_item">
                            <el-input v-model.trim="baseForm.cardId" placeholder="Input card ID"
                                      :disabled="baseFormDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="Open/Close" class="store_setting_item">
                            <el-switch v-model="baseForm.isEnabled" active-color="#1FBCD2" inactive-color="#ff4949" :width="80" active-text="open" inactive-text="close" active-value="Y" inactive-value="N"></el-switch>
                        </el-form-item>
                    </el-form>
                    <div class="store_setting_interrelateBtn">
                        <el-button type="primary" @click="saveUserBaseInfo('baseForm')" :loading="saveLoading"
                                   class="operate_button">Next
                        </el-button>
                    </div>
                </template>
            </el-collapse-item>
            <el-collapse-item name="2" class="user_collapse_item">
                <template slot="title">
                    Interrelated Information
                </template>
                <template v-loading="loading" element-loading-text="Loading...">
                    <el-form :model="interrelationsForm1"
                             label-width="100px" style="width:460px;margin:10px auto;"
                             class="demo-ruleForm base_form" >
                        <template v-for="(val,index) in interrelations">
                            <el-form-item label="Role" prop="ywRoleId"   class="store_setting_item error_icon">
                                <el-col :span="22">
                                    <el-select v-model="val.ywRoleId"  @change="validateRole(index,val.ywRoleId)" placeholder="select role" style="width:300px;display: inline-block">
                                        <el-option v-for="item in roleOptions" :disabled="roleFilter(item.id)"  :key="item.id" :value="item.id" :label="item.roleName"></el-option>
                                    </el-select>
                                    <div class="error_msg" v-show="errorField[index].isValidateRole">{{errorMsg.role}}</div>
                                </el-col>
                                <el-col :span="2">
                                    <el-button class="user_btns_del" v-if="interrelations.length >1" @click="delUserRole(index)">Delete</el-button>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="Store" prop="stores"  class="store_setting_item">
                                <el-select v-model="val.stores" @change="validateStore(index,val.stores)"  multiple placeholder="select store"
                                           style="width:300px;">
                                    <el-option v-for="item in storeOptions"  :disabled="storeFilter(item.id)" :key="item.id" :value="item.id" :label="item.storeName"></el-option>
                                </el-select>
                                <div class="form_select_tags">
                                    <el-tag v-for="(item,no) in val.stores" class="user_tag_select" size="small" @close="delStore(item,index)" :key="item" :closable="true" v-bind:style="{backgroundColor: getBackColor(item)}">{{getStoreValue(item)}}</el-tag></div>
                            </el-form-item>
                            <el-form-item label="Warehouse" prop="facilitys" class="store_setting_item">
                                <el-select v-model="val.facilitys" @change="validateFacilitys(index,val.facilitys)" multiple placeholder="select warehouse"
                                           style="width:300px;">
                                    <el-option v-for="item in warehouseOptions"  :disabled="facilitysFilter(item.facilityId)" :key="item.facilityId" :value="item.facilityId" :label="item.facilityName"></el-option>
                                </el-select>
                                <div class="form_select_tags">
                                    <el-tag v-for="item in val.facilitys"  size="small" class="user_tag_select" @close="delWarehouse(item,index)" :key="item" :closable="true"  v-bind:style="{backgroundColor: getBackWarehouseColor(item)}">
                                        {{getWarehouseValue(item)}}
                                    </el-tag>
                                </div>
                            </el-form-item>
                        </template>
                    </el-form>
                    <a v-if="interrelations.length < 3" href="javascript:void(0)" class="user_btns_add" @click="addNewUserRole">continue to add new role</a>
                    <div class="store_setting_interrelateBtn">
                        <el-button type="primary" @click="backToUserBaseInfo('interrelations')" :loading="saveLoading"
                                   class="operate_button" icon="el-icon-arrow-left">Last Step
                        </el-button>
                        <el-button type="primary" :disabled="userId!='' && !isUpdateData" @click="saveUserInterrelateInfo('interrelationsForm1')" :loading="saveLoading"
                                   class="operate_button">Submit
                        </el-button>
                    </div>
                </template>
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
    props: ['dataVisible', 'dataUserId', 'refreshUser', 'dataType'],
    data () {
        var roleFilter = function (val) {
            if (this.interrelations.length > 0 && this.interrelations[0].ywRoleId) {
                let hasRoles = _.filter(this.interrelations, function (item) {
                    return item.ywRoleId == val
                })
                if (hasRoles && hasRoles.length > 0) {
                    return true
                } else {
                    return false
                }
            }
            return false
        }
        var storeFilter = function (val) {
            if (this.interrelations.length > 0 && this.interrelations[0].stores.length > 0) {
                let hasStores = _.filter(this.interrelations, function (item) {
                    return item.stores.indexOf(val) > -1
                })
                if (hasStores && hasStores.length > 0) {
                    return true
                } else {
                    return false
                }
            }
            return false
        }
        var facilitysFilter = function (val) {
            if (this.interrelations.length > 0 && this.interrelations[0].facilitys.length > 0) {
                let hasFacilitys = _.filter(this.interrelations, function (item) {
                    return item.facilitys.indexOf(val) > -1
                })
                if (hasFacilitys && hasFacilitys.length > 0) {
                    return true
                } else {
                    return false
                }
            }
            return false
        }
        var getBackColor = function (val) {
            let store = _.filter(this.storeOptions, (o) => { return o.id === val })
            if (!store[0]) {
                return '#13ce66'
            }
            let storeGroup = _.filter(this.storeGroups, (o) => { return o.storeGroupID === store[0].productStoreGroupId })
            return storeGroup[0] && storeGroup[0].color ? storeGroup[0].color : '#13ce66'
        }
        var getBackWarehouseColor = function(val){
	        let warehouse = _.filter(this.warehouseOptions, (o) => { return o.facilityId === val })
	        if (!warehouse[0]) {
		        return '#13ce66'
	        }
	        if(warehouse[0].facilityName.indexOf('Egatee')>-1 || warehouse[0].facilityName.indexOf('MBA')>-1){
	        	return '#6DB773'
            }
            if(warehouse[0].facilityName.indexOf('RC')>-1 || warehouse[0].facilityName.indexOf('MDL')>-1 || warehouse[0].facilityName.indexOf('TI')>-1){
	            return '#f1453d'
            }
	        let warehouseGroup = _.filter(this.storeGroups, (o) => {
	        	let groupId = o.storeGroupID;
		        groupId = groupId.toLowerCase().replace("_s","")
	        	return warehouse[0].facilityName.toLowerCase().indexOf(groupId) > -1
	        })
	        return warehouseGroup[0] && warehouseGroup[0].color ? warehouseGroup[0].color : '#13ce66'
        }
        var isValidateRole = function (index) {
            let name = 'isValidateRole' + index
            return name
        }
        return {
            title: 'user setting',
            dataCloseVisible: true,
            active: 1,
            activeNames: ['1'],
            loading: false,
            saveLoading: false,
            isShowBase: true,
            baseFormDisabled: false,
            pwdDisable: true,
            isResetPwd: false,
            isModifyUser: false,
            userId: '',
            interrelateShow: 'el-icon-arrow-up',
            baseShow: 'el-icon-arrow-up',
            companyOptions: [{companyId: 'company', companyName: 'company'}],
            roleOptions: [],
            storeOptions: [],
            storeGroups: [],
            warehouseOptions: [],
            baseForm: {userLoginId: '', passWord: '123456', companyId: '', userName: '', gender: '0', birthday: '', cardId: '', isEnabled: 'Y'},
            fieldDatas: {},
            baseRules: {
                userLoginId: [{required: true, message: 'Please select user ID!', trigger: 'blur'}],
                passWord: [{required: true, message: 'Please select password!', trigger: 'blur'}]
            },
            stores: [],
            interrelations: [{ywRoleId: '', stores: [], facilitys: [] }],
            interrelationsForm1: {ywRoleId: '', stores: [], facilitys: [] },
            errorMsg: {role: 'Please select role!'},
            errorField: [{isValidateRole: false}],
            isValidateRole0: false,
            isUpdateData: false,
            getBackColor: getBackColor,
	        getBackWarehouseColor: getBackWarehouseColor,
            roleFilter: roleFilter,
            storeFilter: storeFilter,
            facilitysFilter: facilitysFilter
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
            if (!this.dataCloseVisible) {
                this.$emit('update:dataUserId', '')
            }
        },
        'baseForm': {
            handler: function (curVal) {
                var _self = this
                for (let name in this.baseForm) {
                    if (_self.fieldDatas[name] != curVal[name]) {
                        _self.isUpdateData = true
                        break
                    }
                }
            },
            deep: true
        }
    },
    mounted () {
        this.userId = this.dataUserId
        this.initTitle()
        this.getInitUserInfo()
        if (this.dataType == 'create') {
            this.active = 1
        }
    },
    methods: {
        getStoreValue (val) {
            let store = _.filter(this.storeOptions, (o) => { return o.id === val })
            return store[0].storeName
        },
        getWarehouseValue (val) {
            let warehouse = _.filter(this.warehouseOptions, (o) => { return o.facilityId === val })
            return warehouse[0].facilityName
        },
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
        getInitUserInfo () {
            var _self = this
            _self.loading = true
            var getAllStorePromise = new Promise(function (resolve) {
                userSettingApi.findAllStoreMsg().then(d => {
                    if (d.success) {
                        _self.storeOptions = d.data
                    }
                    resolve()
                })
            })
            var getAllFacilityPromise = new Promise(function (resolve) {
                userSettingApi.findAllFacilityMsg().then(d => {
                    if (d.success) {
                        _self.warehouseOptions = d.data
                    }
                    resolve()
                })
            })
            var getAllCompanyPromise = new Promise(function (resolve) {
                userSettingApi.findAllCompany().then(d => {
                    if (d.success) {
                        _self.companyOptions = d.data
                    }
                    resolve()
                })
            })
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
            Promise.all([getAllStorePromise, getAllFacilityPromise, getAllCompanyPromise, getAllGroupsPromise]).then(function (arr) {
                if (_self.userId) {
                    _self.getUserInfoByID()
                } else {
                    _self.loading = false
                }
            }, function () {
                _self.loading = false
            })
        },
        getUserInfoByID () {
            userSettingApi.findUserByUserId({
                userId: this.userId
            }).then(d => {
                this.loading = false
                if (d.success && d.data) {
	                this.setParmarsData(d.data)
                	this.getRoleByCompany()
	                this.$nextTick(function(){
		                let srcElem = document.querySelectorAll('.el-select__tags')
		                srcElem.forEach(function (item) {
			                if (item.style.display != 'none') {
				                item.style.display = 'none'
			                }
		                })
	                })
                } else {
                    this.$showErrorMessage(d.message)
                }
                this.$nextTick(() => {
                    this.isModifyUser = true
                })
            }).catch(e => {
                this.loading = false
                this.$showErrorMessage(e.message)
            })
        },
        changeCompany () {
            this.getRoleByCompany()
        },
        getRoleByCompany () {
            userSettingApi.findAllRole({
                companyId: this.baseForm.companyId
            }).then(d => {
                if (d.success) {
                    this.roleOptions = d.data
                }
            })
        },
        resetPwd () {
            this.baseForm.passWord = '123456'
            this.isResetPwd = true
            this.isUpdateData = true
        },
        delStore (val, index) {
            let no = _.findIndex(this.interrelations[index].stores, (o) => { return o === val })
            this.interrelations[index].stores.splice(no, 1)
        },
        delWarehouse (val, index) {
            let no = _.findIndex(this.interrelations[index].facilitys, (o)  => { return o === val })
            this.interrelations[index].facilitys.splice(no, 1)
        },
        saveUserBaseInfo (formName) {
            var _self = this
            _self.$refs[formName].validate((valid) => {
                if (valid) {
                    _self.active = 2
                    _self.activeNames.splice(0)
                    _self.activeNames = _self.activeNames.concat(['2'])
                    _self.showBaseForm()
                    _self.baseFormDisabled = true
                }
            })
        },
        backToUserBaseInfo () {
            this.active = 1
            this.activeNames = ['1']
            this.baseFormDisabled = false
        },
        saveUserInterrelateInfo () {
            var _self = this
            let datas = _self.setParmarsDataTo()
            let isValidated = true
            if (!_self.baseFormDisabled) {
                _self.$refs['baseForm'].validate((valid) => {
                    if (!valid) {
                        isValidated = false
                    }
                })
            }
            _self.interrelations.forEach(function (item, index) {
                if (!item.ywRoleId) {
                    isValidated = false
                    _self.$set(_self.errorField[index], 'isValidateRole', true)
                }
            })
            if (!isValidated) {
                return
            }
            if ((!_self.userId && _self.dataType != 'edit') || (_self.dataType == 'copy')) {
                userSettingApi.createUser(datas).then(d => {
                    _self.saveLoading = false
                    if (d.success) {
                        _self.active = 3
                        clearTimeout(t)
                        var t = setTimeout(function () {
                            _self.$showSuccessMessage('Save user setting success!')
                            _self.$emit('update:dataVisible', false)
                            _self.$emit('refreshUser')
                        }, 200)
                    } else {
                        this.$showErrorMessage(d)
                    }
                }).catch(e => {
                    this.saveLoading = false
                    this.$showErrorMessage(e)
                })
            } else {
                userSettingApi.createUser(datas).then(d => {
                    this.saveLoading = false
                    if (d.success) {
                        _self.active = 3
                        clearTimeout(t)
                        var t = setTimeout(function () {
                            _self.$showSuccessMessage('Update user setting success!')
                            _self.$emit('update:dataVisible', false)
                            _self.$emit('refreshUser')
                        }, 200)
                    } else {
                        this.$showErrorMessage(d)
                    }
                }).catch(e => {
                    this.saveLoading = false
                    this.$showErrorMessage(e)
                })
            }
        },
        setParmarsDataTo () {
            var _self = this
            let obj = {craterOrUpdateUserRoleVO: {userRoles: []}};

	        obj.userLoginId = _self.baseForm.userLoginId
            /* obj.userId = _self.baseForm.userId; */
	        obj.userName = _self.baseForm.userName
            if (_self.dataType == 'create') {
	            obj.passWord = _self.baseForm.passWord
            }
            if (_self.isResetPwd && _self.dataType == 'edit') {
	            obj.passWord = _self.baseForm.passWord
            }
	        obj.isEnabled = _self.baseForm.isEnabled
	        obj.gender = _self.baseForm.gender ? _self.baseForm.gender : '0'
	        obj.companyId = _self.baseForm.companyId
	        obj.birthday = _self.baseForm.birthday ? Utils.getServerTimestamp(_self.baseForm.birthday) : ''
	        obj.userId = _self.userId
	        obj.cardId = _self.baseForm.cardId
	        obj.craterOrUpdateUserRoleVO.userRoles.splice(0)
	        _self.interrelations.forEach(function (val) {
                let ywRoleName = ''; let objArr = []; let obj2Arr = []
                if (val.ywRoleId) {
                    let roleInfo = _.filter(_self.roleOptions, (o) => { return val.ywRoleId === o.id })
                    ywRoleName = roleInfo.length > 0 && roleInfo[0].roleName ? roleInfo[0].roleName : ''
                }
		        val.stores && val.stores.forEach(function (item) {
                    objArr.push((_.filter(_self.storeOptions, (o) => {
                        return item === o.id
                    }))[0])
                })
                val.facilitys && val.facilitys.forEach(function (item) {
                    obj2Arr.push((_.filter(_self.warehouseOptions, (o) => { return item === o.facilityId }))[0])
                })
                obj.craterOrUpdateUserRoleVO.userRoles.push({userId: _self.userId, ywRoleId: val.ywRoleId, ywRoleName: ywRoleName, stores: objArr, facilitys: obj2Arr})

            })
	        return Object.assign({}, obj);
        },
        addNewUserRole () {
            this.interrelations.push({ywRoleId: '', stores: [], facilitys: []})
            this.errorField.push({isValidateRole: false, isValidateStore: false, isValidateFacilitys: false })
            this.isUpdateData = true
        },
        delUserRole (index) {
            this.interrelations.splice(index, 1)
            this.isUpdateData = true
        },
        setParmarsData (data) {
            var _self = this
            _self.baseForm.companyId = data.companyId
            if (_self.dataType == 'edit') {
                _self.baseForm.userLoginId = data.userLoginId
                _self.baseForm.userName = data.userName
                // _self.baseForm.passWord = data.passWord;
                _self.baseForm.gender = data.gender+"";
                _self.baseForm.birthday = data.birthday
                _self.baseForm.cardId = data.cardId
            }
            _self.fieldDatas = Object.assign({}, _self.baseForm)
            if (data.findUserRoleVO && data.findUserRoleVO.resultUserRoles) {
                _self.interrelations.splice(0)
                data.findUserRoleVO.resultUserRoles.forEach(function (val, index) {
                    let obj = []; let obj2 = []; let objs = {}
                    val.facilitys && val.facilitys.forEach(function (item) {
                        obj.push(item.facilityId)
                    })
                    val.stores && val.stores.forEach(function (item) {
                        obj2.push(item.id)
                    })

                    if (_self.dataType == 'copy') {
                        objs = {ywRoleId: val.ywRoleId, stores: [], facilitys: []}
                    }
                    if (_self.dataType == 'edit') {
                        objs = {stores: obj2, facilitys: obj, ywRoleId: val.ywRoleId}
                    }
                    _self.interrelations.push(objs)
                    if (index > 0) {
                        _self.errorField.push({isValidateRole: false, isValidateStore: false, isValidateFacilitys: false })
                    }
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
        validateRole (index, val) {
            if (this.isModifyUser) {
                this.isUpdateData = true
            }
	        let srcElem = document.querySelectorAll('.el-select__tags')
	        srcElem.forEach(function (item) {
		        if (item.style.display != 'none') {
			        item.style.display = 'none'
		        }
	        })
            if (!this.isUpdateData && this.dataType != 'create') {
                return
            }
            if (!val) {
                this.errorField[index].isValidateRole = true
            } else {
                this.errorField[index].isValidateRole = false
            }
        },
        validateStore (index, val) {
            if (this.isModifyUser) {
                this.isUpdateData = true
            }
	        let srcElem = document.querySelectorAll('.el-select__tags')
	        srcElem.forEach(function (item) {
		        if (item.style.display != 'none') {
			        item.style.display = 'none'
		        }
	        })
            if (!this.isUpdateData && this.dataType != 'create') {
                return
            }
            if (!val || val.length == 0) {
                this.errorField[index].isValidateStore = true
            } else {
                this.errorField[index].isValidateStore = false
            }
        },
        validateFacilitys (index, val) {
            if (this.isModifyUser) {
                this.isUpdateData = true
            }
            if (!this.isUpdateData && this.dataType != 'create') {
                return
            }
            if (!val || val.length == 0) {
                this.errorField[index].isValidateFacilitys = true
            } else {
                this.errorField[index].isValidateFacilitys = false
            }
        }
    }
}
</script>
<style>
  .userSettingDialog {
    width: 800px;
    min-height: 600px;
    padding-right: 20px;
  }

  .user_setting_dialog .el-collapse {
    border: none;
  }

  .user_setting_dialog .el-collapse-item__header {
      background-color: rgb(228, 228, 228);
      border: none;
      padding-left:15px;
  }
  .user_setting_dialog .el-collapse-item__arrow{
      margin-right: 8px;
      transition: transform .3s;
      float: right;
      line-height: 36px;
      font-weight: 300;
  }

  .user_setting_dialog .el-collapse-item__header__arrow {
    display: none;
  }

  .user_setting_dialog .el-collapse-item__wrap {
    border-bottom: none;
    background-color: #fff;
  }
  .user_setting_dialog .el-tag{
      color:#fff;
  }
  .user_setting_dialog .el-tag .el-icon-close{
      color:#fff;
  }
  .user_setting_dialog .el-tag .el-icon-close:hover{
      color:#9e9e9e;
      background-color: #fff;
  }
  .el-form-item__error{
    padding-top:0px;
  }
  .error_icon .el-form-item__label:before{
    content: "*";
    color: #ff4949;
    margin-right: 4px;
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
  .user_btns_add{
    width:400px;
    margin:0 auto;
    text-align:right;
    display: block;
    margin-bottom:10px;
  }
  .user_btns_del{
    margin-left:50px;
    display: inline-block;
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
  .error_msg{
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
  }
  .user_pwd{
    height:50px;
    position:relative;
    color: #1FBCD2;
  }
  .user_pwd_tips{
    display:inline;
    font-size:12px;
    position:absolute;
    top:12px;
    right:-27px;
  }
</style>
