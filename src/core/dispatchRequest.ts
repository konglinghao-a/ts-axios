import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(
    res => {
      return transformResponseData(res)
    },
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      return Promise.reject(e)
    }
  )
}

// 处理axios的config都放这里
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 都定义好了之后可以对headers进行扁平化操作了
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 转换url
export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  // 如果配置了baseURL, 并且不是绝对地址的情况下
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

// 转换响应返回的data
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

// 如果请求携带的cancelToken已经被使用过，那么就不发请求
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    // 如果存在canceltoken则看reason有没有被使用过
    config.cancelToken.throwIfRequested()
  }
}
