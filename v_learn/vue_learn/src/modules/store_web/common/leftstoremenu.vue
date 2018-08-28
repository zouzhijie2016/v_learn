<template>
  <div>
    <div class="left_content_column" v-if="" style="left: 10px;">
      <div class="left_section">
        <div class="left_section_titlebar">
          <div class="titlebar_name">Shortcuts</div>
        </div>
        <div class="left_section_catalog">
          <ul>
            <li :class="{menu_active:!!item.selected}" v-for="item in storeThirdMenu">
              <a @click="handle(item,$event)" :href="item.url">{{item.text}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    props: ['productStoreId'],
    data () {
        return {
            storeThirdMenu: [
                {text: 'Store', url: '/Store/control/EditProductStore?productStoreId=', selected: false},
                {text: 'Store Address', url: '/Store/control/EditStoreAddress?productStoreId=', selected: false},
                {text: 'Store Logo', url: '/Store/control/EditStoreLogo?productStoreId=', selected: false},
                {text: 'Shipment Warehouse', url: '/store_web/index.html#/shipmentWarehouse?productStoreId=', selected: true}
            ]
        }
    },
    mounted () {
        var _self = this
        _self.storeThirdMenu.forEach(function (item) {
            item.url = item.url + '' + _self.productStoreId
        })
    },
    methods: {
        handle (item, e) {
            if (/\/store_web\/[^#]*#\/?/.test(item.url)) {
                e.preventDefault()
                e.stopImmediatePropagation()
                window.location.href = item.url
                window.location.reload()
                //                    location.href=item.url+'?'+(+new Date)
                return true
            }
            return false
        }
    }
}
</script>
<style scoped>
  .left_content_column {
    position: absolute;
    left: 10px;
    width: 168px;
  }

  .left_content_column .left_section {
    width: 100%;
    background-color: #fff;
    padding-bottom: 20px;
  }

  .left_content_column .titlebar_name {
    text-align: left;
    height: 45px;
    padding-left: 10px;
    line-height: 45px;
    font-weight: bold;
    font-size: 18px;
  }

  .left_content_column .left_section_catalog {
    background-color: #fff;
  }

  .left_content_column .left_section_catalog li {
    height: 30px;
    line-height: 30px;
    margin: 3px;
    font-size: 12px;
    text-align: left;
    padding-left: 10px;
  }

  .menu_active {
    background: #F7F7F7;
    border-left: 3px solid #1FBCD2;
  }

  .left_content_column .left_section_catalog li a {
    color: #333;
    display: block;
    width: 100%;
  }

</style>
