<template>
    <div>
        <left-menu :urlPermiss.sync="urlPermissData"></left-menu>
        <div class="center_main">
            <div class="center_content">
                <div class="search_box">
                    <el-row>
                        <el-col :span="8" class="form_col">
                            <label class="first_col">
                                Status <i class="require_tips">*</i>
                            </label>
                            <el-select placeholder="Select">
                            </el-select>
                        </el-col>
                        <el-col :span="7" :offset="1" class="form_col">
                            <label class="second_col">Store Group</label>
                            <el-select placeholder="ALL"></el-select>
                        </el-col>
                        <el-col :span="7" :offset="1" class="form_col">
                            <label class="third_col">Store</label>
                            <el-select placeholder="Select"></el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" class="form_col">
                            <label class="first_col">Brand</label>
                            <el-autocomplete
                                    placeholder="请输入内容">
                            </el-autocomplete>
                        </el-col>
                        <el-col :span="7" :offset="1" class="form_col">
                            <label class="second_col">Model</label>
                            <el-autocomplete
                                    placeholder="请输入内容">
                            </el-autocomplete>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" class="form_col">
                            <label class="first_col">Date of sales</label>
                            <el-date-picker></el-date-picker>
                        </el-col>
                        <el-col :span="7" :offset="1" class="form_col">
                            <label class="second_col"> ---- </label>
                            <el-date-picker></el-date-picker>
                        </el-col>
                        <el-col :span="7" :offset="1" class="form_col">
                            <el-button type="primary">Search</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import leftMenu from '~warehouse-common/comp/leftmenu.vue'
    import Utils from '~utils/index'
    import wareHouseApi from '~api/warehouseapi'
    export default {
        data () {
            return {
                urlPermissData: '/warehouse_web/index.html#/IMEIManagerment',
            }
        },
        mounted() {

        },
        methods:{

        },
        components:{
            leftMenu
        }
    }
</script>
<style scoped>
    .center_main {
        overflow-y: auto;
        zoom: 1;
        width: 100%;
        transition: margin-right 0.3s ease-in-out;
        padding-left: 188px;
        min-height: 300px;
        padding-bottom: 80px;
    }

    .center_content {
        background: #fff;
        padding: 10px 10px 40px 10px;
    }
    .center_content:after {
        content: '';
        display: block;
        clear: both;
        visibility: hidden;
        height: 0px;
        font-size: 0px;
    }

    .center_content .search_box{
        overflow: hidden;
        padding: 5px;
    }
    .search_box .el-select,.search_box .el-autocomplete,.search_box .el-input{
        flex: 1;
    }

    .search_box .el-row{
        margin-top: 10px;
    }

    .search_box .require_tips{
        font-style: normal;
        color: red;
    }
    .search_box .form_col {
        display: flex;
        justify-content: left;
        align-items: center;
        align-content: center;
    }

    .form_col label{
        font-weight: normal;
        text-align: center;
        display: inline-block;
        padding-right: 5px;
    }

    .form_col label.first_col{
        width:100px;
    }
    .form_col label.second_col{
        width:90px;
    }
    .form_col label.third_col{
        width:50px;
    }


</style>