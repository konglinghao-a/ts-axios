# 介绍

使用 `typescript` 实现 `axios` 库的前端部分。

# 基础功能实现

## 1、请求url参数

#### 参数值为普通值

```javascript
axios({
    method: 'get',
    url: '/base/get',
    params: {
        a: 1,
        b: 2
    }
})
```

最终的请求`url`为：`/base/get?a=1&b=2`

#### 参数值为数组

```javascript
axios({
	method: 'get',
	url: '/base/get',
	params: {
		foo: ['bar', 'baz']
	}
})
```

最终请求的`url`是`/base/get?foo[]=bar&foo[]=baz`

#### 参数值为对象

```javascript
axios({
	method: 'get',
    url: '/base/get',
    params: {
        foo: {
            bar: 'baz'
        }
    }
})
```

最终请求的`url`是`/base/get?foo=%7B%22bar%22:%22baz%22%7D`，`foo`后面拼接的是`{"bar":"baz"}`encode后的结果。

#### 参数值为Date类型

```javascript
const date = new Date();
axios({
    method: 'get',
    url: '/base/get',
    params: {
        date
    }
})
```

最终请求的`url`是`/base/get?date=2019-04-01T05:55:38.030Z`，`date`后面拼接的是`date.toISOString()`的结果。

#### 特殊字符支持

对于字符`@`、`:`、`$`、`,`、` `、`[`、`]`，我们是允许出现在`url`中的，不希望被encode

```javascript
axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: '@:$, '
    }
})
```

最终请求的`url`是`/base/get?foo=@:$,+`，要注意的是，需要把空格换成`+`。

#### 空值忽略

对于值为`null`或者`undefined`的属性，我们是不会添加到url参数中的。

```javascript
axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: 'bar',
        baz: null
    }
})
```

最终请求的`url`是`/base/get?foo=bar`。

#### 丢弃url中的哈希标记

```javascript
axios({
    method: 'get',
    url: '/base/get#hash',
    params: {
        foo: 'bar'
    }
})
```

最终请求的`url`是`/base/get?foo=bar`

#### 保留url中已存在的参数

```javascript
axios({
    method: 'get',
    url: '/base/get?foo=bar',
    params: {
        foo: 'baz'
    }
})
```

最终请求的`url`是`/base/get?foo=bar&foo=baz`

## 2、请求body数据

```javascript
axios({
    method: 'post',
    url: '/base/post',
    data: {
        a: 1,
        b: 2
    }
})
```

## 3、请求header

支持发送请求的时候，可以支持配置`headers`属性：

```javascript
axios({
    method: 'post',
    url: '/base/post',
    headers: {
    	'content-type': 'application/json;charset=utf-8'
    }
    data: {
        a: 1,
        b: 2
    }
})
```

当我们传入`data`为普通对象的时候，`headers`如果没有配置`Content-Type`属性，需要自动设置请求`header`的`Content-Type`字段为：`application/json;charset=utf-8`

## 4、代码获取响应数据

```javascript
axios({
	method: 'post',
    url: '/base/post',
    data: {
        a: 1,
        b: 2
    }
}).then((res) => {
    console.log(res);
})
```

可以拿到`res`对象，并且我们希望对该对象包括：服务端返回的数据`data`，http状态码`status`，状态消息`statusText`，响应头`headers`，请求配置对象`config`以及请求的`XMLHttpRequest`对象实例`request`

## 5、响应header

```javascript
{
    data: 'Fri, 05 Apr 2020 12:12:12 GMT'
    etag: 'W/"d-Ssxx4sdafadsadsfsfd"'
    connection: 'keep-alive'
    x-powered-by: 'Express'
    content-length: '13'
    content-type: 'application/json; charset=utf-8'
}
```

## 6、响应data

为JSON格式：

```json
data: {
	a: 1,
	b: 2
}
```

# 异常情况



## 错误信息

错误文本信息包括了请求对象配置`config`，错误代码`code`，`XMLHttpRequest`对象实例`request`以及自定义响应对象`response`

```typescript
axios({
    method: 'get',
    url: '/error/timeout',
    timeout: 2000
}).then(res => {
    console.log(res)
}).catch((e: AxiosError) => {
    console.log(e.message)
    console.log(e.request)
    console.log(e.code)
})
```

# 接口扩展

## 1、扩展接口

为所有支持请求方法扩展一些接口：

- `axios.request(config)`
- `axios.get(url[, config])`
- `axios.delete(url[, config])`
- `axios.head(url[, config])`
- `axios.options(url[, config])`
- `axios.post(url[, data[, config]])`
- `axios.put(url[, data[, config]])`
- `axios.patch(url[, data[, config]])`

## 2、axios函数重载

支持传入1个参数：

```typescript
axios({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hi'
    }
})
```

也支持传入2个参数：

```typescript
axios('/extend/post', {
    method: 'post',
    data: {
        msg: 'hi'
    }
})
```

#  拦截器实现

## 1、拦截器设计

对请求的发送和响应做拦截，也就是在发送请求之前和接收到响应之后做一些额外的逻辑：

```typescript
// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前可以做一些事情
    return config;
}, function (error) {
    // 处理请求错误
    return Promise.reject(error);
})

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
    // 处理响应数据
    return response;
}, function (error) {
    // 处理响应错误
    return Promise.reject(error)
})
```

# 配置化实现

## 1、合并配置的设计

给`axios`对象添加一个`defaults`属性，表示默认配置，可以直接修改这些默认配置：

```typescript
axios.defaults.headers.common['test'] = 123
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 2000
```



## 2、请求和响应配置化

当值为数组的时候，数组的每个函数都是一个转换函数，数组中的函数就像管道一样以此执行，前者的输出作为后者的输入。

```typescript
axios({
  transformRequest: [
    function(data) {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }
  ],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(res => {
  console.log(res)
})

```



## 3、扩展axios.create静态接口

提供`axios.create`的静态接口允许我们创建一个新的`axios`实例，同时允许我们传入新的配置和默认配置合并，并作为新的默认配置。

```typescript
const instance = axios.create({
  transformRequest: [
    function(data) {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }
  ]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
})
```

# 取消功能

`axios`的取消接口设计层面：

```typescript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
    cancelToken: source.token
}),catch(function (e) {
    if (axios.isCancel(e)) {
        console.log('Request canceled', e.message);
    } else {
        // 处理错误
    }
})

// 取消请求（请求原因是可选的）
source.cancel('Operation canceled by the user')
```

给`axios`添加一个`CancelToken`的对象，他有一个`source`方法可以返回一个`source`对象，`source.token`是在每次请求的时候传给配置对象中的`cancelToken`属性，然后在请求发出去之后，我们可以通过`source.cancel`方法请求。

还支持另一种方式的调用：

```typescript
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
    cancelToken: new CancelToken(function executor(c) {
        cancel = c
    })
})

cancel();
```

# 更多功能

## 1、withCredentials

有些时候我们会发一些跨域请求，比如`http://domain-a.com`站点发送一个`http://api.domain-b.com/get`的请求。默认情况下，浏览器会根据同源策略限制这种跨域请求，但是可以通过CORS技术解决跨域问题。

在同域的情况下，我们发送请求会默认写代当前域下的`cookie`，但是在跨域的情况下，默认是不会携带请求域下的`cookie`的，比如`http://domain-a.com`站点发送一个`http://api.domain-b.com/get`的请求，默认是不会携带`api.domain-b.com`域下的cookie，如果我们想写代（很多情况下是需要的），只需要设置请求的`xhr`对象的`withCredentials`为true即可

## 2、XSRF防御

```typescript
axios.get('/more/get', {
    xsrfCookieName: 'XSRF-TOKEN', // default
    xsrfHeaderName: 'X-XSRF-TOKEN'
}).then(res => {
    console.log(res)
})
```

提供`xsrfCookieName`和`xsrfHeaderName`的默认值，当然用户也可以根据自己的需求在请求中去配置`xsrfCookieName`和`xsrfHeaderName`



## 3、上传和下载的进度监控

给`axios`的请求配置提供`onDownloadProgress`和`onUploadProgress`2个函数属性，用户可以通过者两个函数实时对下载进度和上传进度进行监控。

```typescript
axios.get('/more/get', {
    onDownloadProgress(progressEvent) {
        // 监听下载进度
    }
})

axios.post('/more/post', {
    onUploadProgress(progressEvent) {
        // 监听上传进度
    }
})
```

## 4、HTTP授权

允许你在请求配置中配置`auth`属性，`auth`是一个对象结构，包含`username`和`password`2个属性。一旦用户在请求的时候配置这俩属性，我们就会自动往http的请求header中添加`Authorization`属性，他的值为`Basic`加密串。这里得加密串是`username:password`base64加密后得结果。

```typescript
axios.post('/more/post', {
    a: 1
}, {
    auth: {
        username: 'KONG',
        password: '123123'
    }
}).then(res => {
    console.log(res)
})
```



## 5、自定义合法状态码

之前`ts-axios`在处理响应结果的时候，认为HTTP status 在 200 和 300 之间是一个合法值，在这个区间之外则创建一个错误。有些时候我们想自定义这个规则，比如认为304也是一个合法的状态码，所以我们希望`ts-axios`能提供一个配置，允许我们自定义合法状态码规则。如下：

```typescript
axios.get('/more/304', {
    validateStatus(status) {
        return status >= 200 && status < 400
    }
}).then(res => {
    console.log(res)
}).catch((e: AxiosError) => {
    console.log(e.message)
})
```

## 6、自定义参数序列化

我们对请求的url参数做了处理，我们会解析传入的params对象，根据一定的规则把他们解析为字符串，然后添加到url后面。在解析的过程中，我们会对字符串encode，但是对于一些特殊字符比如`@`、`+`等却不转义，这是axios库的默认解析规则。当然，我们也希望自己定义解析规则，于是我们希望`ts-axios`能在请求配置中允许我们配置一个`paramsSerializer`函数来自定义参数的解析规则，该函数接受`params`参数，返回值作为解析后的结果，如下：

```typescript
axios.get('/more/get', {
    params: {
        a: 1,
        b: 2,
        c: ['a', 'b', 'c']
    },
    paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'brackets'})
    }
}).then(res => {
    console.log(res)
})
```

## 7、baseURL

有些时候，我们会请求某个域名下的多个接口，我们不希望每次发送请求都填写完整的url，希望可以配置一个`baseURL`，之后都可以传相对路径，如：

```typescript
const instance = axios.create({
    baseURL: 'https://some-domain.com/api'
})
instance.get('/get')
instance.post('post')
```

## 8、静态方法扩展

用法如下：

```typescript
function getUserAccount() {
    return axios.get('/user/12345');
}

function getUserPermissions() {
    return axios.get('/user/12345/permissions')
}

axios.all([getUserAccount(), getUserPermissions()])
	.then(axios.spread(function (acct, perms) {
    	// Both requests are now complete
	}))
```
