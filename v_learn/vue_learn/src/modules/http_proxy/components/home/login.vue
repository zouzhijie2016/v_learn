<template>
<div>
 <div>
<el-row :gutter="20">
   <div>

   <el-card class="box-card">
     <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">Main</el-breadcrumb-item>
          <el-breadcrumb-item>Login</el-breadcrumb-item>
        </el-breadcrumb>
     </div>


    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="token" prop="token">
          <el-input v-model="form.token"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">Login</el-button>
          <el-button @click="resetForm('form')">Reset</el-button>
        </el-form-item>
    </el-form>


   </el-card>
   </div>
   </el-col>
 </el-row>
  </div>
 <div>
 </div>
</div>


</template>


<script lang="babel">
import nodeApi from '~api/nodeApi'
export default {
    name: 'login-app',
    data () {
        return {
            form: {
                token: ''
            },
            rules: {
                token: [
                    { required: true, message: 'token empty' }
                ]
            }
        }
    },
    async mounted () {
    },
    methods: {
        submitForm (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    nodeApi.getAuthenticatorLogin(this.form).then(data => {
                        if (data.data.success) {
                            this.$router.push({name: 'serviceList'})
                        }
                    })
                } else {
                    return false
                }
            })
        },
        resetForm (formName) {
            this.$refs[formName].resetFields()
        }
    },
    watch: {
    },
    metaInfo: {

    }
}
</script>
