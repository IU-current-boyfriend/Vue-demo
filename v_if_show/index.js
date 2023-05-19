import Vue from './Vue';


const vm = new Vue({
  el: '#app',
  data() {
    return {
      isIf: true,
      isShow: true
    }
  },
  template: `
    <div class="warpper">
      <div class="img-group">
        <img src="./img/1.jpg" v-if="isIf" />
        <img src="./img/2.jpg" v-show="isShow" />
      </div>
      <div class="btn-group">
        <button @click="toggleIF">ToggleIF</button>
        <button @click="toggleShow">ToggleShow</button>
      </div>
    </div>
  `,
  methods: {
    toggleIF() {
      this.isIf = !this.isIf;
    },
    toggleShow() {
      this.isShow = !this.isShow;
    }
  }
});

console.log('vm: =>', vm);