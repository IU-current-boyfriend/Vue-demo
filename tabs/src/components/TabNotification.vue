<template>
  <div class="tabnotification-wrapper">
    <!-- 标签头部开始 -->
    <div class="tabnotification-title">
      <h2 class="title">标签</h2>
      <span class="close-tabnotification"
            @click="closeTabnotification">x</span>
    </div>
    <!-- 标签头部结束 -->
    <!-- 弹框主体部分开始 -->
    <div class="tabnotification-body">
      <!-- 搜索框开始 -->
      <div :class="['tab-input', {'focus': isFocus}]">
        <input type="text"
               v-model="searchText"
               placeholder="新增或搜索标签"
               @focus="handleFocus"
               @blur="handleBlur"
               class="search-input" />
      </div>
      <!-- 搜素框结束 -->
      <!-- 搜索结果or新增标签名标签开始 -->
      <div class="search-result">
        <template v-if="computedSearchLen">
          <div v-for="result of searchResult"
               :key="result.id"
               :class="['result', {'active': result.active}]"
               @click="selectClick(result.id)">{{ result.title }}</div>
        </template>
        <template v-else>
          <div class="add-tab-btn"
               @click="addTab">
            {{ computedSearchText }}
          </div>
        </template>
      </div>
    </div>
    <!-- 弹框主体部分结束 -->
  </div>
</template>

<script>
export default {
  name: "TabNotification",
  props: {
    searchResult: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchText: '',
      isFocus: false,
    }
  },
  emits: ['closeTabnotification', 'selectClick', 'addTodo', 'changeSearchText'],
  methods: {
    closeTabnotification() {
      this.$emit('closeTabnotification', false);
    },
    selectClick(id) {
      // 向外触发添加标签事件
      this.$emit('selectClick', id);
    }, 
    addTab() {
      console.log('新增标签');
    },
    handleFocus() {
      // console.log('获取焦点');
      this.isFocus = true;
    },
    handleBlur(){
      this.isFocus = false;
    }
  },
  computed: {
    computedSearchText() {
      return this.searchText === '' ? '新增标签' : '新增"' + this.searchText + '"标签';
    },
    computedSearchLen() {
      return this.searchResult.length > 0 ? true : false;
    }
  },
}
</script>

<style>
  .tabnotification-wrapper {
    margin: 0 auto;
    width: 300px;
    height: 400px;
    background: #FFFFFF;
    box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.2);
    border-radius: 5px;
    overflow: hidden;

  }
  .tabnotification-title {
    display: flex;
    width: 100%;
    padding: 6px 16px;
    height: 32px;
    justify-content: space-between;
    align-content: center;
    box-sizing: border-box;
    background-color: #F1F2F3;
  }
  .title {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    color: #5B5B5B;
  }
  .close-tabnotification {
    display: inline-block;
    width: 16px;
    height: 16px;
    text-align: center;
    /* line-height: 16px; */
    font-size: 12px;
    transform: scale(.83);
    cursor: pointer;
  }
  .tabnotification-body {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }
  .tab-input {
    height: 28px;
    padding-left: 12px;
    border-radius: 2px;
    border: 1px solid #979797;
    margin-bottom: 16px;
  }
  .search-input {
    width: 100%;
    height: 100%;
    padding: 0;
    outline: none;
    border: none;
  }
  .search-result {
    display: flex;
    flex-wrap: wrap;
  }
  .result {
    height: 16px;
    padding: 4px 8px;
    font-size: 12px;
    color: #5B5B5B;
    background: rgba(163,163,163,0.1);
    border-radius: 2px;
    /* box-sizing: border-box; */
    margin: 8px 8px 8px 0;
    cursor: pointer;
  }
  .result.active {
    color: #FFFFFF;
    background: #4990F4;
    border-radius: 2px;
  }
  .add-tab-btn {
    height: 24px;
    padding: 0px 8px;
    text-align: center;
    line-height: 24px;
    background-color: #D8D8D8;
    /* box-sizing: border-box; */
    font-size: 12px;
    color: #5B5B5B;
    border-radius: 2px;
    border: 1px solid #A3A3A3;
    cursor: pointer;
  }
  .focus {
    border: 1px solid #4990F4;
  }
</style>