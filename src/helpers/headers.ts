import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

// 对headers进行规范化
function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 用于生成headers
 * @param headers
 * @param data
 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  // 没有Content-Type则加入Content-Type
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

/**
 * 将headers字符串解析成headers对象
 * @param {string}headers - 需要用来解析的headers字符串
 * @return {object} - 解析完的headers
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)

  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    const val = vals.join(':').trim()
    parsed[key] = val
  })
  return parsed
}

/**
 * 将请求头进行扁平化
 * @param headers
 * @param method
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method], headers)
  // 需要好在headers中删除的属性
  const methodsToDelete = ['delete', 'options', 'get', 'head', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
