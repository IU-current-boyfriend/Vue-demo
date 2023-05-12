import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// console.log('ElementUI: =>', ElementUI);
import { Button, Timeline, TimelineItem } from 'element-ui';
// Vue.component(Button.name, Button);

Vue.component(Timeline.name, Timeline);
Vue.component(TimelineItem.name, TimelineItem);
new Vue({
  render: h => h(App),
}).$mount('#app')
