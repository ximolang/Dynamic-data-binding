# Dynamic-data-binding
动态数据绑定的JavaScript实现

## 原理
获取和设置对象数据的操作要实现动态绑定的效果，一般可以通过`proxy`和`Object.defineProperty`两种方式实现，`Object.defineProperty`可行性更强。参照vue的数据动态绑定，
通过`get`和`set`使得引用和设置对象属性的值时，能够实现对数据的干预操作。
