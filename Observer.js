let log = console.log.bind(console)
let isObject = (obj) => {
  let test =  Object.prototype.toString.call(obj)
  if (test === '[object Object]') return true
  return false
}

let def = (obj, key, val, enumerable) => {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

class Event {
  constructor() {
    this.events = {}
  }

  on(event, handler) {
    if (!(event in this.events)) {
      this.events[event] = []
    }
    this.events[event].push(handler)
  }

  emit(event) {
    var cbs = this.events
    let args = Array.prototype.slice.call(arguments, 1)
    if (cbs[event] && cbs[event]['length'] > 0) {
      cbs[event].forEach( item => {
        item.apply(this, args)
      })
    }
  }
}
let eventBus = new Event()
class Observer {
  constructor (data) {
    this.data = data
    // $watch监视数据变化的函数列表
    this.event = eventBus
    // 定义标识来判断该对象是否已经被动态化
    def(data, '__ob__', this, false)
    this.walk(data)
  }

  walk(value) {
    let array = Object.keys(value)
    for (let i = 0; i < array.length; i++) {
      defineReactive(value, array[i], value[array[i]], this.event)
    }
  }

  // 订阅函数
  $watch(key, cb) {
    this.event.on(key, cb)
  }
}

// helper

// 尝试创建observe实例，如果已经动态化则返回，没有则new一个
function observe (value) {
  if (!isObject(value)) return false
  let _ob = null
  if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
    _ob = value.__ob__
  } else {
    // 假使value为简单对象，而不是函数，正则之类
    _ob = new Observer(value)
  }
  return _ob
}

function defineReactive (obj, key, val, eventBus) {
  let ob = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      log('你访问了' + key)
      return val
    },
    set(newVal) {
      log('你设置了' + key + ', 新的值为' + newVal)
      val = newVal
      ob = observe(newVal)
      // 执行监视回调
      eventBus.emit(key, newVal)
    },
  })
}