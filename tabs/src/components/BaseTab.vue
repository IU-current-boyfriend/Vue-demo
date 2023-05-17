<template>
  <div class="tab-container">
    <!-- 公共标签组件begin -->
    <common-tab :tabs="tabs"
                @deleteTab="deleteTab"
                @openTab="openTab"></common-tab>
    <!-- 公共标签组件end -->

    <!-- 标签弹窗组件begin -->
    <tab-notification v-if="isOpen"
                      :searchResult="searchResult"
                      @addTab="addTab"
                      @selectClick="selectClick"
                      @closeTabnotification="closeTabnotification"></tab-notification>
    <!-- 标签弹窗组件end -->
  </div>
</template>

<script>
import CommonTab from './CommonTab';
import TabNotification from './TabNotification';
export default {
  name: 'BaseTab',
  components: {
    CommonTab,
    TabNotification,
  },
  data() {
    return {
    // 标签数组
      tabs: [
      {
        id: 0,
        title: '问题专家管理系统'
      },
      {
        id: 1,
        title: '优客会系统'
      },
      {
        id: 2,
        title: '外勤助手系统'
      },
      {
        id: 3,
        title: 'OMS/WMS'
      },
      {
        id: 4,
        title: 'EPR'
      },
      {
        id: 5,
        title: '钉钉'
      }
    ],
    // 弹框状态
    isOpen: false,
    // 搜索框内容
    searchResult: [
      {
        id: 0,
        title: '后台系统'
      },
      {
        id: 1,
        title: '色彩规范'
      },
      {
        id: 2,
        title: '常规样式'
      },
      {
        id: 3,
        title: '网页'
      },
      {
        id: 4,
        title: '选中样式'
      },
      {
        id: 5,
        title: '悬浮'
      },
      {
        id: 6,
        title: 'OA'
      },
      {
        id: 7,
        title: '配色教程'
      }
    ],
    idx: 0
    }
  },
  methods: {
    deleteTab(id) {
      // console.log('id: =>', id);
      // 不仅仅要删除tabs里面的标签，还要把对应searchResult中标签也删除
      const item = this.tabs.find(item => item.id === id);
      // 要删除对应的search中标签
      this.searchResult = this.searchResult.map(tab => {
        if (tab.title === item.title) tab.active = !tab.active;
        return tab;
      });
      this.tabs = this.tabs.filter(tab => tab.id !== id);
      // console.log('this.searchResult: =>', this.searchResult);
      console.log('删除标签成功！');
    },
    openTab(boolean) {
      console.log('打开弹窗页面啊');
      this.isOpen = boolean;
    },
    addTab(tabinfo) {
      console.log('增加新的标签', tabinfo);
    },
    closeTabnotification(boolean) {
      this.isOpen = boolean;
    },
    selectClick(id) {
      this.searchResult = this.searchResult.map(item => {
        if (item.id === id) {
          item.active = !item.active;
        };
        return item;
      });
      // 当选中搜索框中的某项标签，外部的标签也要增加而且状态是true，否则就要取消
      const tab = this.searchResult.find(item => item.id === id);
      // 这样获取的id值将会有bug
      // console.log('len: =>', len);
      let len = this.idx; //this.tabs.length是动态的，会有bug
      console.log('len: =>', len);
      // 添加进外部框框
      if (tab && tab.active) {
        const obj = {
          id: len,
          title: tab.title
        }
        this.tabs.push(obj);
      } else {
        const index = this.tabs.findIndex(item => item.title === tab.title);
        index !== -1 && this.tabs.splice(index, 1);
      };
      // 虽然能够解决，但是感觉有点不太好
      this.idx ++;
    },
  },
  mounted() {
    this.idx = this.tabs.length;
    console.log('===组件挂载====');
  },
  beforeDestroy() {
    console.log('===组件销毁之前执行===');
  },
  // 页面刷新并不会走组件销毁，而是走组件挂载。
  destroyed() {
    console.log('===组件销毁===');
  }
}
</script>

<style>
</style>