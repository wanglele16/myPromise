## Node中流的理解
### 1. 流的定义及类型

####1.1 简介
数据流（stream）是处理系统缓存的一种方式。操作系统采用数据块（chunk）的方式读取数据，每收到一次数据，就存入缓存。
在Node应用程序中，有两种缓存的处理方式：第一种是等到所有数据接收完毕，一次性从缓存读取，这就是传统的读取文件的方式*(遇上大文件很容易使内存爆仓)*；第二种是采用“数据流”的方式，收到一块数据，就读取一块，即在数据还没有接收完成时，就开始处理它(像流水一样)

```
var fs = require('fs')
// `fs.createReadStream`创建一个`Readable`对象以读取`bigFile`的内容，并输出到标准输出
// 如果使用`fs.readFile`则可能由于文件过大而失败
fs.createReadStream(bigFile).pipe(process.stdout)
```

####1.2 分类
从程序角度而言 “流” 是有方向的数据，按照流动方向可以分为三种流
	* 设备流向程序：readable
	* 程序流向设备：writable
	* 双向：duplex、transform

NodeJS 关于流的操作被封装到了 Stream 模块，这个模块也被多个核心模块所引用。在 NodeJS 中对文件的处理多数使用流来完成
	* 普通文件
	* 设备文件（stdin、stdout）
	* 网络文件（http、net）

###2.  readable

#### 2.1 模式
可读流有两种模式：
* 流动模式：数据由底层系统读出，并尽可能快地提供给应用程序
* 暂停模式：必须显示地调用 read() 方法来读取若干数据块

流在默认状态下是处于暂停模式的，也就是需要程序显式的调用 read() 方法。

流从默认的暂停模式切换到流动模式可以使用以下几种方式：
* 通过添加 data 事件监听器来启动数据监听
* 调用 resume() 方法启动数据流
* 调用 pipe() 方法将数据转接到另一个 可写流

从流动模式切换为暂停模式又两种方法：
* 在流没有 pipe() 时，调用 pause() 方法可以将流暂停
* pipe() 时，需要移除所有 data 事件的监听，再调用 unpipe() 方法

####2.2实现可读流
todo

###3. writeable
####3.1 使用
调用可写流实例的 write() 方法就可以把数据写入可写流
```
const fs = require('fs');
const rs = fs.createReadStream('./w.js');
const ws = fs.createWriteStream('./copy.js');

rs.setEncoding('utf-8');
rs.on('data', chunk => {
  ws.write(chunk);
});
```
write() 方法有三个参数
* chunk {String| Buffer}，表示要写入的数据
* encoding 当写入的数据是字符串的时候可以设置编码
* callback 数据被写入之后的回调函数

####3.2 实现可写流
todo

### 4. duplex、transform

#### 4.1 双工流
双工流就是同时实现了 Readable 和 Writable 的流，即可以作为上游生产数据，又可以作为下游消费数据，这样可以处于数据流动管道的中间部分，即 ` rs.pipe(rws1).pipe(rws2).pipe(rws3).pipe(ws);`
 NodeJS 中双工流常用的有两种: duplex、transform。


#### 4.2 duplex

 该方法继承了可写流和可读流，但相互之间没有关系，各自独立缓存区。常见的 Duplex 流有：Tcp Scoket、Zlib、Crypto

#### 4.3 Transform

ransform 同样是双工流，看起来和 Duplex 重复了，但两者有一个重要的区别：Duplex 虽然同事具备可读流和可写流，但两者是相对独立的；Transform 的可读流的数据会经过一定的处理过程自动进入可写流。
我们最常见的压缩、解压缩用的 zlib 即为 Transform 流，压缩、解压前后的数据量明显不同，儿流的作用就是输入一个 zip 包，输入一个解压文件或反过来。我们平时用的大部分双工流都是 Transform。
	在使用时，当一个流同时面向生产者和消费者服务的时候我们会选择 Duplex，当只是对数据做一些转换工作的时候我们便会选择使用 Tranform。