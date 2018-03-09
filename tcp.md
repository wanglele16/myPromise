### 了解 tcp/ip 协议
1. OSI 7层模型

![image.png](https://upload-images.jianshu.io/upload_images/2216842-9e1dd41282ed0c4a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

不同主机之间要进行通信，需要遵循共同的协议。这些协议非常复杂，一般我们把它抽象成7层，叫做OSI（open system interconnection） 7层模型。
从底向上依次是：
- 物理层：定义传输设备的电压与信号等，连接数据帧转换成比特流的编码方式，最后连接实际传输介质发送/接收比特信号
- 数据链路层 交换机：数据链路层又可分为两层，偏向硬件介质：MAC数据帧，media Access Control frame,网络接口所能处理的主要数据包裹，被物理层编码成比特流偏向软件层面：逻辑链路层(Logical Link Control)多任务处理来自上层的数据包数据并转换成MAC格式信息交换、流量可控制、数据问题处理
- 网络层 路由器：定义IP(Internet Protocol)和路由概念，计算机间的连接建立、终止和维持，数据包的传输路径选择
- 传输层：发送端和接收端连接技术，如TCP、UDP… 包括数据包格式、数据包发送、流程的控制、传输过程的帧检测与重新传送
- 会话层：提供包括访问验证和会话管理在内的建立和维护应用之间通信的机制
- 表示层：网络服务(或程序)之间的数据格式转换：将来自本地端应用程序的数据格式转换或重新编码成网络的标准格式、 加密解密技术
- 应用层：应用程序并不属于应用程序本身，用来同一管理调度数据对应其发送和接收的应用程序， 定义应用程序如何进入该层的沟通接口，以将数据接收或发送给应用程序，最终展示给用户

其中，数据在数据链路层叫帧(frame)，网络层叫包(package)，传输层叫段（segment）。
- 网络层： IP协议，ARP， RARP协议，ICMP协议，IGMP协议
- 传输层： TCP协议， UDP协议
- 应用层： http协议，https协议，ftp，tftp，smtp， snmp，dns
当数据经过每一层时，都会对其封装或解封装，发送方是从高层到低层封装数据，接收方是从底层往高层解封装分析数据。


2. TCP/IP参考

![image.png](https://upload-images.jianshu.io/upload_images/2216842-d6fef94236cb38ef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


早期的TCP/IP模型是一个四层结构，从下往上依次是网络接口层、互联网层、传输层和应用层。
后来在使用过程中，借鉴OSI七层参考模型，将网络接口层划分为了物理层和数据链路层，形成五层结构。
其中，传输层的协议分为TCP(Transimision Control Protocal)和UDP(User Datagram Protocal)。使用TCP还是UDP取决于对可靠性的要求。数据到达这层会加tcp/udp头,这层数据叫报文段(Segment)。
TCP为可靠的、面向连接的协议，但传输效率低；UDP为用户数据报协议，是不可靠的、无连接的服务，传输效率高，应用于QQ、视频软件、TFTP 简单文件传输协议(短信）

3. TCP3次握手和4次断开

![image.png](https://upload-images.jianshu.io/upload_images/2216842-df9f36217598da3d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

TCP是面向连接的协议，它在源点和终点之间建立虚拟连接，而不是物理连接。
在数据通信之前，发送端与接收端要先建立连接，等数据发送结束后，双方再断开连接，TCP连接的每一方都是由一个IP地址和一个端口组成。
- 三次握手
	第一次握手主机A通过一个标识为SYN标识位的数据段发送给主机B请求连接，通过该数据段告诉主机B希望建立连接，需要B应答，并告诉主机B传输的起始序列号
```
SYN:1     seq=x
```
第二次握手是主机B用一个确认应答ACK和同步序列号SYNC标志位的数据段来响应主机A，一是发送ACK告诉主机A收到了数据段，二是通知主机A从哪个序列号做标记。
```
SYN:1   seq=y   ACK=x+1
```
第三次握手是主机A确认收到了主机B的数据段并可以开始传输实际数据.

```
ACK=y+1
```

- 四次挥手

主机A发送FIN控制位发出断开连接的请求

主机B进行响应，确认收到断开连接请求

主机B提出反方向的关闭要求

主机A确认收到的主机B的关闭连接请求

tcp三次握手四次断开正好符合的是tcp可靠的特点（四次断开，有可能是某一方还未发送完数据所以需要四次断开）。




