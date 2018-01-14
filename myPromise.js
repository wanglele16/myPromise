
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
