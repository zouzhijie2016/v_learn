import Option from '~components/select/src/option.vue';
import OptionGroup from '~components/select/src/option-group.vue';
import Select from '~components/select/src/select.vue';
// import Popoper from './popover'

let install = (Vue) => {
    Vue.component(OptionGroup.name, OptionGroup);
    Vue.component(Option.name, Option);
    Vue.component(Select.name, Select);
    // Vue.use(Popoper);

    Vue.component('g-header', () => import('~components/header/header.vue'))
    Vue.component('g-header-v2', () => import('~components/header/headerV2.vue'))
    Vue.component('g-footer', () => import('~components/header/footer.vue'))
    Vue.component('g-changepwddialog', () => import('~components/header/changepwddialog.vue'))
    Vue.component('g-serviceerror', () => import('~components/fault/serviceerror.vue'))
}



export default {
    install
}
