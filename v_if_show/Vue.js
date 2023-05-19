/**
 * 实现v-if/v-show需要我们做哪些事情呢？
 * 1. 首先肯定是响应式数据
 * 2. 其次是模版解析处理
 * 3. 事件处理函数的绑定
 * 4. methods方法中的this指向
 * 5. 视图挂载与重新渲染
 * 6. 模块化开发
 * 
 */

/**
 * 构造函数的创建
 * 
 */

function Vue({
  el,
  data,
  template,
  methods
}) {
  // 首先获取el元素，因为vue根组件实例对象上也能够获取到相应的元素
  // $符号表示vue中自有的属性
  this.$el = document.querySelector(el);
  /** 暴露$data，因为vue中也是可以通过vm.$data.xx访问属性
   * 也可以直接通过vm.xx访问属性，所以需要代理处理
   * 1. 先设置$data属性，然后再进行代理 
   */
  this.$data = data();
  // 执行初始化函数
  this.init(this, this.$data, template, methods);
};

/**
 * 视图需要重新渲染
 * @param {*} key 
 */
Vue.prototype.updateRenderView = function (key, directivePool, newValue) {
  directivePool.forEach(item => {
    if (item.data === key) {
      switch (item.type) {
        case 'v-if':
          this.updateIf(item, newValue, directivePool);
          break;
        case 'v-show':
          console.log('需要更新: => updateshow');
          this.updateShow(item, newValue);
          break;
        default:
          break;
      }
    }
  })
}

Vue.prototype.updateIf = function (item, newValue) {
  // updateIf思路是不对的, 从false转为true
  if (newValue) {
    // 从false转为true
    item.parentNode.replaceChild(item.lastNode, item.commentNode);
  } else {
    // 从true转为false
    var oAppNodes = this.$el.querySelectorAll('*');
    oAppNodes.forEach(node => {
      if (item.mark === parseInt(node.getAttribute('data-mark'))) {
        var parentNode = node.parentNode,
            commentNode = document.createComment('v-if');
            parentNode.replaceChild(commentNode, node);
            item.lastNode = node;
            item.commentNode = commentNode,
            item.parentNode = parentNode;
      };
    });
  }
};

Vue.prototype.updateShow = function (item, newValue) {
  var oAppNodes = this.$el.querySelectorAll('*');
  oAppNodes.forEach(node => {
    if (item.mark === parseInt(node.getAttribute('data-mark'))) {
      // 从false => true
      newValue === true ? node.style.display = '' : node.style.display = 'none';
    };
  });
}


Vue.prototype.init = function (vm, data, template, methods) {
  // v-if/v-show指令缓存池
  var directivePool = [],
    // event事件处理函数缓存池
    eventPool = [];
  // 创建响应式数据
  this.reactiveData(vm, data, directivePool);
  // 解析字符串template模版，并且需要收集依赖。
  /**
   * 这个收集依赖是什么意思呢？
   *   主要的收集v-if、v-show指令绑定的元素，
   *   当v-if、v-show指令表达式发生变化的时候，
   *   对应的元素就要重新渲染，表达式===依赖。
   */
  var compilerTemplate = this.compiler(template, directivePool, eventPool);

  // 执行渲染函数
  this.render(vm, compilerTemplate, directivePool);

  // 处理事件函数的绑定
  this.bindEvent(eventPool, methods);
}

/**
 * eventPool: 事件处理函数缓存池
 * methods: methods属性
 * @param {*} eventPool 
 * @param {*} methods 
 */
Vue.prototype.bindEvent = function (eventPool, methods) {
  // console.log('事件处理函数的绑定')，如何绑定事件处理函数呢？
  var el = this.$el,
    oAppNodes = null;
  oAppNodes = el.querySelectorAll('*');

  eventPool.forEach(item => {
    oAppNodes.forEach(node => {
      const mark = parseInt(node.getAttribute('data-mark'));
      if (mark === item.mark) {
        this.addEvent(node, item, methods);
      };
    })
  });
};

Vue.prototype.addEvent = function (node, item, methods) {
  var methodKeys = Object.keys(methods),
    isExist = methodKeys.includes(item.method);
  // 给对应的元素添加事件处理函数
  if (isExist) {
    node.addEventListener(item.type, () => {
      /**
       * 模版解析事件处理函数的时候，应该解析参数的,
       * 这样就可以使用apply传递参数，参数应该是数组的形式
       */
      methods[item.method].call(this);
    }, false);
  } else {
    console.log('绑定的事件处理函数不在methods属性中');
  }
};

/**
 * 初次组件挂载渲染函数
 * @param {*} vm 
 * @param {*} template 
 * @param {*} directiveInfo 
 */
Vue.prototype.render = function (vm, template, directiveInfo) {
  var el = this.$el,
    oAppNodes = null;
  /**
   * 初次渲染挂载需要考虑以下事情
   *   1. 首先根据指令的类型、指令的表达式结果渲染元素 
   */
  // 视图初次渲染挂载
  el.innerHTML = template;

  oAppNodes = el.querySelectorAll('*');
  // 根据指令缓存池去设置标签的初次挂载
  directiveInfo.forEach(item => {
    oAppNodes.forEach(node => {
      const mark = parseInt(node.getAttribute('data-mark'));
      if (mark === item.mark) {
        switch (item.type) {
          case 'v-if':
            this.setIfStyle(vm, node, item);
            break;
          case 'v-show':
            this.setShowStyle(vm, node, item);
            break;
          default:
            break;
        }
      }
    })
  });
}

Vue.prototype.setIfStyle = function (vm, node, property) {
  var data = vm.$data,
      keys = Object.keys(data);
  var isExistProperty = keys.includes(property.data);
  if (isExistProperty) {
    // 说明指令表达式存在于data属性中
    var dataValue = data[property.data];
    if (!dataValue) {
      // 指令表达式是false的话，需要创建注释节点
      var commentNode = document.createComment('v-if'),
          parentNode = node.parentNode;
          parentNode.replaceChild(commentNode, node);
      // 把当前注释节点引用存到指令缓存池中，不然updateRenderView中v-if无法更新
          property['commentNode'] = commentNode;
          property['lastNode'] = node;
          property['parentNode'] = parentNode;
    }
  } else {
    console.log('指令绑定的表达式不存在于data属性中...');
  }
};

Vue.prototype.setShowStyle = function (vm, node, property) {
  var data = vm.$data,
      keys = Object.keys(data);
  var isExistProperty = keys.includes(property.data);
  if (isExistProperty) {
    // 说明指令表达式存在于data属性中
    var dataValue = data[property.data];
    if (!dataValue) node.style.display = 'none';
  } else {
    console.log('指令绑定的表达式不存在于data属性中...');
  }
};

/**
 * 模版编译方法
 * @param {*} template 
 * @returns 
 */
Vue.prototype.compiler = function (template, directivePool, eventPool) {
  var compilerTemplate = '';
  /**
   * 模版编译需要两个步骤处理，
   * 1. 模版编译，依赖收集
   * 2. 模版编译，事件处理函数绑定
   */
  compilerTemplate = this.compilerIFAndShow(template, directivePool);
  compilerTemplate = this.compilerEvent(compilerTemplate, eventPool);
  // 返回编译后的模版
  return compilerTemplate;
}

/**
 * 函数主要收集v-if、v-show指令的依赖
 * @param {*} vm 
 * @param {*} template 
 * @param {*} directivePool 
 */
Vue.prototype.compilerIFAndShow = function (template, directivePool) {
  // 去除模版中的空格，换行等影响之后操作的字符,不能去除属性之间的空格，不然显示不出来元素
  var formatterTemplateRegExp = /[\r|\t|\f|\n]+/g,
    // 正则匹配v-if、v-show指令,我要的是带有v-if、v-show指令的整体标签
      matchVIFAndShowRegExp = /((v-if\=\"(.+?)\")|(v-show\=\"(.+?)\"))/g;
  /**
   * 我想做什么？我想给绑定v-if、v-show指令绑定的元素设置标识符号，因为浏览器是不认识
   * v-if、v-show指令的。这个标识符号，我准备用随机号来代替
   * 
   * 指令缓存池directivePool的数据结构是什么呢？
   * [
   *    {
   *      type: if,
   *      mark: 121312837767,
   *      data: isIf
   *    },
   *    {
   *      type: show,
   *      mark: 121767216313,
   *      data: isShow
   *    }
   * ]
   * 
   */
  // 如果我没有记错，要解析模版的话，我们需要将模版字符串中的空格，换行去掉，不然影响之后的操作
  template = template.replace(formatterTemplateRegExp, '');
  // 替换掉v-if、和v-show指令，将这些指令替换成随机码
  template = template.replace(matchVIFAndShowRegExp, function (node, key) {
    // 生成标记的mark, random => [0, 1) , 感觉还是有bug
    var mark = Date.now() + parseInt(Math.random() * 100);
    // 保存依赖信息
    var directiveInfo = node.split('='),
        type = directiveInfo[0],
        value = directiveInfo[1].replace(/(\'|\")/g, '');
    // 依赖进行收集
    directivePool.push({
      type,
      mark,
      data: value
    });
    return 'data-mark="' + mark + '"';
  });
  // 返回编译后的字符串
  return template;
};

/**
 * 收集事件处理函数的依赖，并且处理模版
 * @param {*} vm 
 * @param {*} methods 
 * @param {*} template 
 * @param {*} eventPool 
 */
Vue.prototype.compilerEvent = function (template, eventPool) {
  // 获取当前事件处理函数类型
  var formatterEventRegExp = /\@click\=\"(.+?)\"/g,
      typeRegExp = /(?<=\@)(.+?)(?=\=)/g;
  // 替换模版中事件处理函数@click，因为浏览器不认识
  template = template.replace(formatterEventRegExp, function (node, key) {
    // 设置mark,随机还是有bug
    var mark = Date.now() + parseInt(Math.random() * 10);
    // 保存依赖信息
    var type = node.match(typeRegExp)[0].trim(),
        method = key;
    // 保存事件依赖信息
    eventPool.push({
      mark,
      type,
      method
    });
    return 'data-mark="' + mark + '"';
  });
  // 返回编译后模版
  return template;
};



/**
 * 
 * @param {*} vm 组件实例对象
 * @param {*} data data属性
 */
Vue.prototype.reactiveData = function (vm, data, directivePool) {
  for (let key in data) {
    (function (key) {
      /** get、set、iife都是闭包函数，本应该iife立即执行并销毁，
       * 但是正是因为get/set函数捆绑外界词法作用域，所以并不会iife并不
       * 会被销毁～
       */
      Object.defineProperty(vm, key, {
        get() {
          console.log('响应式数据获取');
          return data[key];
        },
        set(newValue) {
          console.log('响应式数据设置');
          // 需要updateRenderView函数,视图重新渲染
          this.updateRenderView(key, directivePool, newValue);
          data[key] = newValue;
        }
      })
    })(key);
  };
};


export default Vue;