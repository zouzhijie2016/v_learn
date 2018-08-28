<template>
    <div class="leftMenu">
        <ul>
            <li :class="{selected:!!item.selected}"  v-for="item in reportList"><a :href="item.url"><i class="el-icon-document"></i>{{ item.name }}</a></li>
        </ul>
    </div>
</template>
<script>
import ReportApi from '~api/reportapi'
export default {
    props: {
        extendOptions: {
            type: Object
        }
    },
    data () {
        return {
            reportList: [{
                name: 'Sales Report',
                url: '/report_web/index.html#/salesReport'
            }]
        }
    },
    mounted () {
        let t = this
        let flag = false
        let routePathReg = new RegExp('/report_web/[^#]*' + '#/?' + this.$route.path.substr(1))

        ReportApi.whoseHavingRole().then(d => {
            if (d.success == true) {
                if (d.data) {
                    if (d.data.length == 1) {
                        if (d.data.indexOf('Auditor') > -1) {
                            this.reportList = this.reportList.concat([{
                                name: 'Audit Income Deposit',
                                url: '/report_web/index.html#/auditIncomeDeposit'
                            }, {
                                name: 'Deposit Summary',
                                url: '/report_web/index.html#/depositSummary'
                            }])
                        } else if (d.data.indexOf('StoreManager') > -1) {
                            this.reportList = this.reportList.concat([{
                                name: 'Income Deposit',
                                url: '/report_web/index.html#/incomeDeposit'
                            }, {
                                name: 'Deposit Summary',
                                url: '/report_web/index.html#/depositSummary'
                            }])
                        }
                    } else if (d.data.length == 2) {
                        this.reportList = this.reportList.concat([{
                            name: 'Income Deposit',
                            url: '/report_web/index.html#/incomeDeposit'
                        }, {
                            name: 'Audit Income Deposit',
                            url: '/report_web/index.html#/auditIncomeDeposit'
                        }, {
                            name: 'Deposit Summary',
                            url: '/report_web/index.html#/depositSummary'
                        }])
                      }
                }
            } else {
                this.$showErrorMessage(d.message)
            }
            this.reportList.forEach(function (item) {
                if ((item.url).indexOf(t.$route.path.substr(1)) > -1) {
                    flag = true
                }
            })
            if (!flag) {
                this.$message({
                    showClose: true,
                    message: 'There is no access',
                    type: 'error',
                    onClose: () => {
                        location.href = '/user_web/index.html#/login'
                    }
                })
                return false
            }
            this.reportList.some((item) => {
                if (routePathReg.test(item.url)) {
                    item.selected = true
                    return true
                }
                return false
            })
        }).catch(err => {
            this.$showErrorMessage(err)
        })
    },
    methods: {
    }
}
</script>
<style scoped>
  .leftMenu{
      background-color: #fff;
  }
  .leftMenu li{
      height: 45px;
      line-height: 45px;
      width: 100%;
  }
  .leftMenu li a{
      display: block;
      color: #48616A;
      padding: 0 0 0 10px;
      font-size: 12px;
  }
  .leftMenu li a i{
      margin-right: 10px;
  }
  .leftMenu li.selected a{
      background: #DFEAEC;
      color: #50bfff;
  }
</style>
