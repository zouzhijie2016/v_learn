<template>
    <div class="container">
        <div class="title">
            System Service Errors！
        </div>
        <div class="detail">
            {{error.message}}
        </div>
    </div>
</template>
<script>
export default {
    props: {
        error: {
            type: Object,
            default: {}
        }
    },
    data () {
        return {}
    },
    mounted () {
        console.log(this.error)
    }
}
</script>
<style scoped>
    .container{
        width:100%;
        height: 100vh;
        text-align: center;
        background: #d1e1e5;
        overflow: hidden;
    }

    .title{
        display: inline-block;
        width: 60%;
        margin-top: 20%;
        font-size: 35px;
        margin-left:auto;
        margin-right:0px;
    }

    .detail{
        display: inline-block;
        margin:20px auto 0px;
        width: 60%;
        font-size:12px;
        color:lightcoral;
    }
</style>