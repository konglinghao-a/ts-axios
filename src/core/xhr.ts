import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resovle, reject) => {
    const {
      cancelToken,
      data = null,
      url,
      method,
      headers = {},
      responseType,
      timeout,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    const request = new XMLHttpRequest()

    //方法名称要传大写，第三个参数是异步的意思。
    request.open(method!.toUpperCase(), url!, true)

    configureRequest()
    addEvents()
    processHeaders()
    processCancel()

    request.send(data)

    // 将配置request对象的内容封装一下
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      // 跨域请求写代cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    // 将给request对象添加事件的内容封装一下
    function addEvents(): void {
      // 处理接收到的数据
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }

        // 网络错误或超时错误的状态码为0
        if (request.status === 0) {
          return
        }

        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 处理请求错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, 'ECONNABORTED', request))
      }

      // 处理请求的超时错误
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, null, request))
      }

      // 下载
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      // 上传
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 将headers相关的代码封装一下
    function processHeaders(): void {
      // 判断，若是form-data则删除请求头中的content-type
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // 读取cookie的逻辑
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      // HTTP授权（Authorization）的逻辑
      if (auth) {
        /**
         * 如果用户定义了auth，则设置请求头; 请求头后面加一个Basic是规范，可以看mdn，
         * 规范是：Authorization: <typs> <credentials>
         */
        headers['Authorization'] = 'Basic ' + btoa(`${auth.username}:${auth.password}`)
      }

      // 设置headers的逻辑
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    // 封装跟cancel有关的逻辑
    function processCancel(): void {
      /**
       * 在send函数之前进行canceltoken的判断,
       * 如果用户传了canceltoken，它实际上是CancelToken类的实例，它实例化的时候就会执行
       * constructor，这样就会定义一个pending状态的promise；一旦执行了cancel方法就会将
       * pending状态转换到resolved状态，近而执行到这里
       */
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(
            /* istanbul ignore next */
            () => {
              // do nothing
            }
          )
      }
    }

    // 处理响应的状态码
    function handleResponse(response: AxiosResponse): void {
      // 没有定义这个函数（就正常执行），或者status在合法区间
      if (!validateStatus || validateStatus(response.status)) {
        resovle(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
