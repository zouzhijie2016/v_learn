<template>
    <div class="content-box">
        <div class="content_list">
            <div class="content_form_list">
                <form class="form-horizontal form-content">
                    <div class="group">
                        <input type="text" v-model="username" tabindex="1" maxlength="30" name="username"
                               placeholder="Username">
                        <!--<el-input v-model="username" placeholder="Username"></el-input>-->
                    </div>
                    <div class="group password-group">
                        <input type="password" tabindex="2" v-model="password" @keydown.enter="login2" maxlength="30" name="password" placeholder="Password">
                    </div>
                    <div class="error-group" >
                        <p v-show="!!errMsg">{{errMsg}}</p>
                    </div>
                    <div class="group login-group">
                        <!--<a href="javascript:void(0);" class="login-btn">Login</a>-->
                        <el-button type="primary" tabindex="3" :loading="login_loading" @keydown.enter="login2"
                                   @click="login2"
                                   class="login-btn">Login
                        </el-button>
                    </div>
                </form>
            </div>
        </div>
        <div class="yiwill_footer">
            <div class="copyright_content">
                <!--<a href="#" class="time_zones">-->
                    <!--<span>{{currentTime}}</span> - -->
                    <!--<span>{{timeZone}}</span>-->
                <!--</a>-->
                <p>All Rights Reserved(c) {{rangeYears}} YIWILL - www.yiwill.com</p>
            </div>
        </div>
    </div>
</template>
<script>
import loginApi from '~api/userapi'
import Cookies from 'js-cookie'
import util from '~utils/index'

let LOGIN_DOMAIN_ENUM = {
    '^http(s)?://bim.yiwill.com':'UGX',
    '^http(s)?://gh.bim.yiwill.com':'GHS',
    '^http(s)?://rw.bim.yiwill.com':'RWF',
    '^http(s)?://et.bim.yiwill.com':'ETB',
    '^http(s)?://uat.bim.yiwill.cn':'UGX',
    '^http(s)?://uat.gh.bim.yiwill.cn':'GHS',
    '^http(s)?://uat.rw.bim.yiwill.cn':'RWF',
    '^http(s)?://uat.et.bim.yiwill.cn':'ETB',
    '^http(s)?://10.250.160.70':'UGX',
    '^http(s)?://10.250.160.72':'GHS',
    '^http(s)?://10.250.160.103':'ETB',
    '^http(s)?://10.250.160.95':'UGX',
    '^http(s)?://10.250.160.97':'UGX',
    '^http(s)?://10.250.160.112':'GHS',
    '^http(s)?://10.250.160.113':'ETB',
    '^http(s)?://10.250.160.114':'RWF',
    '^http(s)?://localhost':'UGX',
    '^http(s)?://127.0.0.1':'UGX',
};

export default {
    data () {
        return {
            username: '',
            password: '',
            errMsg: '',
            login_loading: false,
            scopeName:'',
            currentYear:'',
            currentTime:'',
            timeZone: ''
        }
    },
    mounted () {
        Cookies.remove('U_TOKEN')
        if(!this.checkScope()) {
            return ;
        }
        this.getEnviromentInfo();
        if (process.env.NODE_ENV === 'development') {
            this.username = 'admin'
            this.password = 'opentaps'
        }
    },
    computed:{
        rangeYears() {
            if(!this.currentYear)return '';
            return `${this.currentYear-1}-${this.currentYear}`
        }
    },
    methods: {
        login2 () {
            if(!this.checkScope()) {
                return;
            }
            if (!this.username) {
                this.errMsg = 'Please enter user name!'
                return false
            }
            if (!this.password) {
                this.errMsg = 'Please enter your password!'
                return false
            }
            this.login_loading = true

            loginApi.userLoginModelV1.getInstance().execute({
                scope:this.scopeName,
                userName: this.username,
                userPassword: this.password
            }).then(d => {
                this.login_loading = false
                if (d.success) {
                    Cookies.set('U_TOKEN', d.data.token)
                    this.jumpPage()
                } else {
                    this.errMsg = d.message
                }
            }).catch(err => {
                this.login_loading = false
                this.$showErrorMessage(err)
            })
        },
        jumpPage () {
            let from = this.$route.query.from
            if (from) {
                location.href = from
            } else {
                if(process.env.NODE_ENV === 'development') {
                    location.href = '/warehouse_web/index.html#/'
                }else{
                    location.href = '/control/main'
                }
            }
        },
        getEnviromentInfo() {
            loginApi.getLoginVueInfo(this.scopeName, {}).then(d=>{
                if (d.success) {
                    console.log(d.data);
//                    d.data.
                    var serverDate = this.getSeverDate(d.data.timeNow, d.data.rawOffset);
                    this.currentYear = serverDate.getFullYear();
                    this.currentTime = d.data.currentTime;
                    this.timeZone = d.data.timeZone;
                    util.LoadPiwikScript(d.data.vueConfig)
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err=>{
                this.$showErrorMessage(err)
            })
        },
        checkScope() {
            let currentScope = this.scopeName || this.getEnvironmentScope();
            if(!currentScope) {
                this.$showErrorMessage('The scope name used does not match.');
                return;
            }
            this.scopeName = currentScope;
            return currentScope;
        },
        getEnvironmentScope() {
            let origin = location.origin;
            let originRegArr = Object.keys(LOGIN_DOMAIN_ENUM);
            let matchItems = originRegArr.filter(x=>{
                return new RegExp(x).test(origin);
            });
            if(matchItems && matchItems.length) {
                return LOGIN_DOMAIN_ENUM[matchItems];
            }
            return null;
        },
        getSeverDate( timeNow, rawOffset) {
            let currentTime =  new Date().getTimezoneOffset() * 60 * 1000;
            return new Date(timeNow + currentTime + rawOffset);
        }
    },
    destoryed () {
        console.log('execute destoryed!!!')
        loginApi.userLoginModel.getInstance().abort()
    },
    deactivated () {
        console.log('execute deactivated!!!')
        loginApi.userLoginModel.getInstance().abort()
    }
}
</script>
<style scoped>
    .content_list {
        margin: 0 auto;
        width: 1280px;
        height: 720px;
        background: url(./images/landing1_min.png) no-repeat center left;
    }

    .content_form_list {
        width: 360px;
        height: 350px;
        border-radius: 10px;
        float: right;
        margin: 180px 140px 0 0;
        background: #ffffff;
        -webkit-box-shadow: 0 0 20px rgba(117, 127, 132, 0.3);
        -moz-box-shadow: 0 0 20px rgba(117, 127, 132, 0.3);
        box-shadow: 0 0 20px rgba(117, 127, 132, 0.3);
    }

    .content_form_list .form-content {
        width: 280px;
        height: 270px;
        margin: 40px;
    }

    .content_form_list .group {
        width: 100%;
        height: 40px;
        margin-bottom: 25px;
    }

    .group input{
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border: none;
        border-bottom: 1px solid #dbdbdb;
        width: 100%;
        padding-left: 15px;
        font-size: 14px;
        color: #9e9e9e !important;
    }

    .content_form_list .password-group {
        margin-bottom: 0;
        word-break: break-all;
    }

    .group input {
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border: none;
        border-bottom: 1px solid #dbdbdb;
        width: 100%;
        padding-left: 15px;
        font-size: 14px;
        color: #9e9e9e !important;
    }

    .group input:focus {
        border-bottom: 1px solid #1fbcd2;
    }

    .error-group {
        width: 100%;
        height: 20px;
        margin: 15px 0;
    }

    .error-group p {
        width: 100%;
        height: 20px;
        line-height: 20px;
        margin: 0;
        color: #fc5d7b;
        font-size: 14px;
    }

    .content_form_list .login-group {
        height: 50px;
    }

    .login-group a,.login-group .login-btn {
        width: 100%;
        height: 50px;
        display: block;
        color: #ffffff;
        background: #1fbcd2;
        font-size: 16px;
        text-align: center;
        outline: none;
    }

    .yiwill_footer {
        width: 100%;
        position: absolute;
        bottom: 0;
    }

    .yiwill_footer .copyright_content {
        width: 1280px;
        margin: 0 auto;
        text-align: center;
    }

    .yiwill_footer .copyright_content p, .yiwill_footer .copyright_content a {
        width: 100%;
        height: 25px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        color: #424242;
        margin: 0;
    }

    .yiwill_footer .copyright_content p, .yiwill_footer .copyright_content a {
        width: 100%;
        height: 25px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        color: #424242;
        margin: 0;
    }

    .yiwill_footer .copyright_content span:nth-of-type(2) {
        color: #110099;
    }
</style>
