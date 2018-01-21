## JavaScript 执行机制
1. 关于JavaScript
	javascript是一门单线程语言。
	为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

2. JavaScript事件循环
	所有任务可以分成两种，一种是同步任务（synchronous），另一种是异步任务（asynchronous）。
	- 同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；
	- 异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）
	
![bg2014100802.png](http://upload-images.jianshu.io/upload_images/2216842-68e971538f33a5ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


3. 任务队列分类
- Macrotask 宏任务包括：
	 * setImmediate
	 * setTimeout
	 * setInterval
	
- Microtask 微任务包括
	* process.nextTick
	* Promise
	* Object.observe
	* MutaionObserver
		
宏观上讲, Macrotask 会进入 Macro Task Queue, Microtask 会进入 Micro Task Queue。
但从微观实现的角度讲, 引擎都会有三个 Task Queue:
- Macro Task Queue
- Micro Task Queue
- Tick Task Queue


```
setTimeout(function () {
  console.log(1);
}, 0);

let a = new Promise(function (resolve, reject) {
  resolve(2);
});

a.then(function (data) {
  console.log(data);
});

process.nextTick(function() {
  console.log(3);
});

// 结果
// 3
// 2
// 1
```

Macrotask 全部存放于 Macro Task Queue 中,而 Micro Task 被分到了两个队列中。
Micro Task Queue 存放 Promise 等 microtask，而 Tick Task Queue 专门用于存放 process.nextTick 的任务.
每个 Macro Task 结束后, 都要清空所有的 Micro Task。 引擎会遍历 Macro Task Queue, 对于每个 Macrotask 执行完毕后都要遍历执行 Tick Task Queue 的所有任务, 紧接着再遍历 Micro Task Queue 的所有任务。(这也解释了为什么 nextTick 会优于 Promise 执行)
