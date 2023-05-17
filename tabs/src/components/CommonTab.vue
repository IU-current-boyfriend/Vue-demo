<template>
  <div class="common-tab-wrapper"
       @click="openTab">
    <!-- tabs-infos begin -->
    <div class="tabs-infos">
      <span class="tab"
            v-for="tab of tabs"
            :key="tab.id">
        <span class="tab-info">
          <span class="tab-title">{{ tab.title }}</span>
          <span class="del-tab"
                @click.stop="deleteTab(tab.id)">x</span>
        </span>
      </span>
    </div>
    <!-- tabs-infos end -->
  </div>
</template>

<script>
export default {
  name: 'CommonTab',
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
  },
  emits: ['deleteTab', 'openTab'],
  methods: {
    // 打开弹窗页面
    openTab() {
      this.$emit('openTab', true);
    },
    // 删除标签方法
    deleteTab(id) {
      console.log('删除标签');
      this.$emit('deleteTab', id);
    }
  }
}
</script>

<style scoped>
/* 最大外盒子标签 */
  .common-tab-wrapper {
    width: 295px;
    min-height: 80px;
    border-radius: 2px;
    border: 1px solid rgba(0,0,0,0.1);
    padding: 5px;
    cursor: pointer;
  }
  .tabs-infos {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    /* justify-content: space-around; */
    /* align-content: center; */
    /* flex-wrap: wrap; */
  }
  .tab {
    margin: 5px;
  }
  .tab .tab-info {
    display: inline-block;
    height: 24px;
    padding: 0 8px;
    text-align: center;
    background-color: #F7F7F7;
    border-radius: 3px;
    box-sizing: border-box;
  }
  .tab-title { 
    color: #5B5B5B;
    font-size: 12px;
  }
  .del-tab {
    display: inline-block;
    width: 16px;
    height: 16px;
    text-align: center;
    font-size: 12px;
    line-height: 18px;
    transform: scale(.83);
    cursor: pointer;
  }
</style>