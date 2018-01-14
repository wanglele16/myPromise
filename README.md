# myPromise

### 动手实现一个简单的 promise（一）

1. 背景：工作中经常会遇到多个异步请求存在依赖的情况，比如下面很常见的例子：
 
```
function getUserId() {
  return new Promise(function(resolve) {
    //异步请求
    http.get(url, function(results) {
      resolve(results.id);
    });
  });
}
getUserId().then(function(id) {
  //一些处理
});
```

2. ES6中的Promise

![Alt text](./粘贴图片.png)

可以看到 实例上有all、race、reject、resolve这方法，原型上有then、catch、finally等等方法。

3. 实现简单的Promise
   思路：
   ① then: 调用then方法，将想要在Promise异步操作成功时执行的回调放入callbacks队列，其实也就是注册回调函数。
   ② Resolve: 创建Promise实例时传入的函数会被赋予一个函数类型的参数，即resolve，它接收一个参数value，代表异步操作返回的结果，当一步操作执行成功后，用户会调用resolve方法，这时候其实真正执行的操作是将callbacks队列中的回调一一执行；
   ③ Reject同Resolve

4. 代码
```
// 把几个初始态定义为常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function Promise(executor) {

  let self = this; // 先缓存当前 promise 实例
  self.value = null; // 存放结果
  self.status = 'pending'; // 设置状态
  self.onResolvedCallbacks = []; // 定义存放成功的成功回调数组
  self.onRejectedCallbacks = []; // 定义存放失败回调的数组

  //当调用此方法的时候，如果 promise 状态为 pending 的话可以转成成功态,如果已经是成功态或者失败态了，则什么都不做
  function resolve(value) {
    if (self.status === PENDING) {
      self.status = FULFILLED; // 如果是初始态，则转成成功态
      self.value = value; // 成功后会得到一个值，这个值不能改
      self.onResolvedCallbacks.forEach((cb) => cb(self.value)); //调用所有成功的回调

    }
  }

  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED; //如果是初始态，则转成失败态
      self.value = reason; // 失败的原因给了value
      self.onRejectedCallbacks.forEach((cb) => cb(self.value));
    }
  }

  try {
    executor(resolve, reject);
  } catch(e) {
    reject(e);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  // 如果成功和失败的回调没有传，则表示这个then没有任何逻辑，只会把值往后抛
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};
  let self = this;
  if (self.status === FULFILLED) { // 如果当前promise状态已经是成功态， onFulfilled直接取值 (同步代码)
    let x = onFulfilled(self.value);
  }
  if (self.status === REJECTED) { // (同步代码)
    let x = onRejected(self.value);

  }
  if (self.status === PENDING) { // （异步代码）
    self.onResolvedCallbacks.push(function () {
      try {
        let x = onFulfilled(self.value);
      } catch (e) {
        reject(e);
      }
    });
    self.onRejectedCallbacks.push(function () {
      try {
        let x = onRejected(self.value);
      } catch (e) {
        reject(e);
      }

    });
  }

};

module.exports = Promise;
```

4. 待完善：then的链式调用及Promise.all，Promise.race等方法
