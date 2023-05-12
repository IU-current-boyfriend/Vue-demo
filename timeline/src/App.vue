<template>
  <div>
    <div class="time-line-container">
      <el-timeline>
        <el-timeline-item v-for="time of timelineData"
                          :key="time.id"
                          :color="time.color"
                          :size="time.size">
          <div class="title-container">
            <span class="title">{{ time.content }}</span>
            <div :class="['icon', { 'allow-bottom': time.isExpand , 'allow-top': time.isExpand}]"
                 v-if="time.pid === 0"
                 :data-index="time.id"
                 @click="toggleShowTimeSon($event)">^</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // this.createTimelineData(); // 创建数据
    // console.log('this.data: =>', this.timelineData);
  },
  data () {
    return {
      isShowTimeSon: true,
      copyTimelineData: [],
      timelineData: [{
          id: 10001,
          pid: 0,
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46:46',
          size: 'large',
          // type: 'primary',
          color: 'blue',
          isExpand: true,
        }, {
          id: 10002,
          pid: 10001,
          content: '支持使用图标-子节点1',
          timestamp: '2018-04-03 20:46:37',
          size: 'normal',
          color: 'purple'
        }, {
          id: 10003,
          pid: 10001,
          content: '支持使用图标-子节点2',
          timestamp: '2018-04-03 20:46:28',
          size: 'normal',
          color: 'purple'
        }, 
        {
          id: 10004,
          pid: 10001,
          content: '支持使用图标-子节点3',
          timestamp: '2018-04-03 20:46:28',
          size: 'normal',
          color: 'purple'
        }, 
        {
          id: 10005,
          pid: 0,
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46:32',
          size: 'large',
          color: 'blue',
          isExpand: true
        },
        {
          id: 10006,
          pid: 10005,
          content: '默认样式的节点-子节点1',
          timestamp: '2018-04-03 20:46:32',
          size: 'normal',
          color: 'purple',
        },
        {
          id: 10007,
          pid: 10005,
          content: '默认样式的节点-子节点2',
          timestamp: '2018-04-03 20:46:32',
          size: 'normal',
          color: 'purple',
        },
        {
          id: 10008,
          pid: 0,
          content: '自定义颜色节点',
          timestamp: '2018-04-03 20:46:32',
          size: 'large',
          color: 'blue',
          isExpand: true
        },
        {
          id: 10009,
          pid: 10008,
          content: '自定义颜色节点-子节点1',
          timestamp: '2018-04-03 20:46:32',
          size: 'normal',
          color: 'purple',
        },
        {
          id: 10010,
          pid: 10008,
          content: '自定义颜色节点-子节点2',
          timestamp: '2018-04-03 20:46:32',
          size: 'normal',
          color: 'purple',
        },
        {
          id: 10011,
          pid: 10008,
          content: '自定义颜色节点-子节点3',
          timestamp: '2018-04-03 20:46:32',
          size: 'normal',
          color: 'purple',
        },
        ]
    }
  },
  methods: {
    addActiveClassName(event) {
      const tar = event.target,
            tagName = tar.className;
      if (tagName.indexOf('icon') !== -1) {
        
      }
    },
    toggleShowTimeSon(event) {
      const tar = event.target,
            tagName = tar.className,
            isExpand = this.timelineData.find(item => item.id === Number(tar.getAttribute('data-index'))).isExpand;
      if (isExpand) {
        console.log('合并');
        // true => false  => 展开要转为合并
        // 是true，就要删除数据
       
        if (tagName.indexOf('icon') !== -1) {
          const index = tar.getAttribute('data-index');
          // 通过index去组装我们需要的数据结构, 
          this.timelineData = this.createCloseData(index);
        };
      
      } else {
        console.log('展开');
        // 是fale，不需要删除数据
        // 实际上，只需要把数组进行展开，但是呢，每个环节顺序是会乱掉的，所以我们还需要记录之前数组的索引
        if (tagName.indexOf('icon') !== -1) {
          const index = tar.getAttribute('data-index');
          this.timelineData = this.createExpandData(index);
        }
      }

      if (tagName.indexOf('icon') !== -1) {
        const index = tar.getAttribute('data-index');
        this.timelineData = this.timelineData.map(item => {
          if (item.id === Number(index)) {
            item.isExpand = !item.isExpand;
          };
          return item;
        });
      }
      // 如果isShowTimeSon是true的话，那么就要把类设置为allow-bottom
      // 如果isShowTimeSon是false的话，那么就要把类设置为allow-top

    },
    createExpandData(currentIndex) {
      // 转换为数字形式
      const currentIdx = Number(currentIndex);
      // 只要把对应children按照之前的索引值进行重新构建即可
      return this.timelineData.reduce((prev, current, index, origin) => {
        if (currentIdx === current.id) {
          if (current.children && current.children.length > 0) {
            prev.push(current);
            current.children.forEach(elem => {
              // 可能会有bug
              prev.splice(elem.lastIndex, 0, elem);
            });
            // children属性重置为[]
            current.children = [];
          };
        } else {
          prev.push(current);
        };
        return prev;
      }, []);
    },
    createCloseData(currentIndex) {
      // 转换为数字形式
      const currentIdx = Number(currentIndex);
      // 从数组中的pid中找到对应的对象，然后存放到currentIndex == item.id的children数组中
      return this.timelineData.reduce((prev, current, index, origin) => {
        if (current.id === currentIdx) {
          // 说明是大环节
          if (!current.children) current.children = [];
          // 遍历循环
          origin.forEach((item, idx) => {
            if (item.pid === currentIdx) {
              item.lastIndex = idx;
              current.children.push(item);
            };
          });
          // 保存大环节的索引值
          current.lastIndex = index;
          // 保存在prev中
          prev.push(current);
        } else if (current.pid !== currentIdx){
          // 存在其他大环节和所有的小环节
          current.lastIndex = index;
          prev.push(current);
        }
        // 返回需要的数组
        return prev;
      }, []);
    },
  }
}
</script>

<style>
  .title-container {
    display: flex;
    justify-content: space-between;
    /* justify-content: center; */
    align-items: center;
  }
  .icon {
    width: 20px;
    height: 20px;
    text-align: center;
    color: #ccc;
    font-size: 20px;
    font-weight: bold;
    transition: all .5s;
    transform: rotate(0);
    cursor: pointer;
  }
  .icon.allow-top {
    transform: rotate(180deg);
  }
  .icon.allow-bottom {
    transform: rotate(-180deg);
  }
</style>