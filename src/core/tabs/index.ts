import TabModal from './tab-modal.vue'
import TabScroll from './tab-scroll.vue'
const Tab:any = {}
console.info(TabScroll.name)
Tab.install = function(Vue:any, options:any){
  Vue.component(TabModal.name, TabModal);
  Vue.component('tab-scroll', TabScroll);
}

export default Tab
