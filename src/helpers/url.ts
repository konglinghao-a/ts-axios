import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

/**
 * 将url中的特殊字符进行编码，但是不需要编码的字符需要保留
 * @param {string}val - 需要进行编码的字符串
 * @return {string} - 返回编码后的字符串
 */
function encode(val: string): string {
  //利用正则来保留不需要编码的字符串
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 此函数通过传入url和参数params来生成新的url
 * @param {string}url - 传入的url
 * @param {any}params - 传入的url的参数，可以选择不传
 * @return {string} - 返回一个新的url
 */
export function buildURL(
  url: string,
  params?: any,
  paramSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }

  let serializedParams
  if (paramSerializer) {
    // 若定义了自定义url参数序列化的函数
    serializedParams = paramSerializer(params)
  } else if (isURLSearchParams(params)) {
    // 判断是不是URLSearchParams类型，如果是则返回params的toString就好了
    serializedParams = params.toString()
  } else {
    // 若没有定义则执行之前的逻辑
    const parts: string[] = []
    Object.keys(params).forEach(key => {
      const val = params[key]

      // 判断为空的情况，若为空则跳出当前的循环（用return）
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    // 省略哈希后的值
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    // 判断url本身是否已经带有参数
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

// 判断url是不是绝对地址
export function isAbsoluteURL(url: string): boolean {
  // 用正则表达式来判断开头的格式
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

// 将baseURL和相对地址做拼接
export function combineURL(baseURL: string, relativeURL?: string): string {
  // 若相对地址存在，需要用正则把baseURL末尾的斜线去掉
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

// 判断是否是同域
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}
// 生成a标签
const urlParsingNode = document.createElement('a')
//解析出当前页面的域
const currentOrigin = resolveURL(window.location.href)
// 通过a标签分析出协议和host
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
