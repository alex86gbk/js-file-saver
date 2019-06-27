# introduce
## 介绍

**js-file-saver** 是一个兼容多浏览器的下载、导出文件工具。

下载、导出的数据通过API接口返回，服务端需在对应接口需正确设置消息头 `response header`。

例如：

```
Content-Disposition: attachment; filename="filename.jpg"
```

`attachment` 意味着消息体应该被下载到本地；大多数浏览器会呈现一个“保存为”的对话框，将filename的值预填为下载后的文件名。

# 使用

## browser
（仅下载至本地后使用，不能直接作为 CDN 资源引用）

[unzipped](https://raw.githubusercontent.com/alex86gbk/js-file-saver/master/src/index.js)
 
[(~zipped)](https://raw.githubusercontent.com/alex86gbk/js-file-saver/master/dist/js-file-saver.js)

```html
<script src="js-file-saver.js"></script>
```

```js
var fileSaver = new JsFileSaver(options)
```

## npm
通过 npm

```bash
npm install --save js-file-saver
```

```js
import JsFileSaver from 'js-file-saver';

const fileSaver = new JsFileSaver(options);
```

# API 说明文档

* [构造函数 JsFileSaver()](README.md#JsFileSaver())
* [下载（保存）文件 saver()](README.md#saver())
* [异常处理/兼容下载（保存）文件 saverCompatible()](README.md#saverCompatible())


# 构造函数
# JsFileSaver()
### Arguments

 - options **{Object}** 下载设置
 
### Returns

 - **无**

### Example
```js
import JsFileSaver from 'js-file-saver';

// 生成实例（这里的参数设置主要是为了在用户环境不支持 Blob，Promise 等情况下的兼容下载）
const downloadBook = new JsFileSaver({
  // 下载接口地址：'/api/downloadBook' 或 'http://localhost:3001/downloadBook'
  action: '/api/downloadBook', 
  // 下载接口类型：'get' | 'post'。默认为：'post'
  method: 'post', 
  // 接口Content-Type设置，默认为：'application/x-www-form-urlencoded'。另可选：'multipart/form-data' | 'text/plain'
  contentType: 'application/x-www-form-urlencoded', 
  // 查询参数
  payload: {
    bookId: 1,
  },
});
```

# 下载（保存）文件
# saver()
### Arguments

 - httpResponse **{Object}** http 响应体
 - httpResponse.data {ArrayBuffer | ArrayBufferView | Blob | String} 文件数据
 - httpResponse.header {String} 文件信息
 
### Returns

 - **无**

### Example
```js
import axios from 'axios';
import DL from 'js-file-saver';

const downloadBook = new DL({
  action: '/api/downloadBook', 
  method: 'post', 
  payload: {
    bookId: 1,
  },
});

// 发出下载请求（可使用任意方式完成接口交互，这里使用 axios。也可使用 jQuery ajax，fetch 等）。
axios.request({
  url: '/api/downloadBook',
  method: 'POST',
  data: {
    bookId: 1,
  },
}).then((response) => {
  // 执行下载操作
  downloadBook.saver(response);
});
```

# 兼容下载（保存）文件

**js-file-saver** 默认已有对异常的处理：在浏览器不支持 `Blob` 或 `Promise` 时调用兼容下载方式下载。

为了保证兼容下载方式执行成功，需要在构造函数中设置相关参数！详见 [构造函数 参数说明](README.md#constructor())。

如果自己的业务代码中已经有了如 环境检测、异常捕获等逻辑。可以直接调用 saverCompatible() 方法下载文件。

# saverCompatible()
### Arguments

 - **无**
 
### Returns

 - **无**

### Example
```js
import DL from 'js-file-saver';

const downloadBook = new DL({
  action: '/api/downloadBook', 
  method: 'post', 
  payload: {
    bookId: 1,
  },
});

// 兼容下载无任务事件可触发，如需要可添加相关用户提示，缓解焦虑。如：'下载中!请稍后...'
downloadBook.saverCompatible();
```
