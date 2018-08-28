<template>
    <el-dialog title="Edit password" :close-on-press-escape="false" :close-on-click-modal="false"
               :visible.sync="dialogFormVisible">
        <el-form  v-loading="form.loading">
            <el-form-item label="Username" :label-width="formLabelWidth">
                <span>{{userName}}</span>
            </el-form-item>
            <el-form-item label="Original password" :label-width="formLabelWidth">
                <input class="common_theme" type="password" v-model.trim="form.originalpwd" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="New password" :label-width="formLabelWidth">
                <input class="common_theme" type="password" v-model.trim="form.newpwd" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="Repeat password" :label-width="formLabelWidth">
                <input class="common_theme" type="password" v-model.trim="form.repeatpwd" auto-complete="off"/>
            </el-form-item>
            <div class="tips">
                {{form.error_tips}}
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" :loading="form.loading" @click="modifyPwd">Save</el-button>
        </div>
    </el-dialog>
</template>
<script>
import CommonApi from '~api/commonapi'
import Utils from '~utils/index'
import {mapState} from 'vuex'

export default {
    props: {
        visible: Boolean
    },
    data () {
        return {
            formLabelWidth: '180px',
            dialogFormVisible: false,
            form: {
                originalpwd: '',
                newpwd: '',
                repeatpwd: '',
                loading: false,
                error_tips: ''
            }
        }
    },
    computed: {
        ...mapState([
            'userName'
        ])
    },
    watch: {
        visible: {
            handler: function (val, oldval) {
                if (oldval === val) return
                this.dialogFormVisible = val
            },
            immediate: true
        },
        dialogFormVisible (val, oldval) {
            if (oldval === val) return
            this.$emit('update:visible', val)
        }
    },
    methods: {
        modifyPwd () {
            if (!this.form.originalpwd) {
                this.form.error_tips = 'Please enter original password!'
                return false
            }
            if (!this.form.newpwd) {
                this.form.error_tips = 'Please enter new password!'
                return false
            }
            if (this.form.newpwd != this.form.repeatpwd) {
                this.form.error_tips = 'Repeat password incorrect!'
                return false
            }
            this.form.error_tips = ''
            this.form.loading = true
            CommonApi.updateNewPassword({
                userLoginId: this.$store.state.commonInfo.userLogin.userLoginId,
                partyId: this.$store.state.commonInfo.userLogin.partyId,
                currentPassword: this.form.originalpwd,
                newPassword: this.form.newpwd,
                newPasswordVerify: this.form.repeatpwd,
                passwordHint: null
            }).then(d => {
                this.form.loading = false
                if (d.responseMessage == 'success') {
                    this.dialogFormVisible = false
                } else {
                    this.form.error_tips = d.errorMessage
                }
            }).catch(err => {
                this.form.loading = false
                this.$message({
                    showClose: true,
                    message: err.message || 'Service exceptions！',
                    type: 'error'
                })
            })
        }
    }
}
</script>
<style scoped>
    .tips{
        width: 100%;
        display: inline-block;
        color: #e50038;
        font-size: 12px;
        text-align: center;
    }
</style>