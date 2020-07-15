const toString = Object.prototype.toString

/**
 * 此函数用来判断传入的参数是否是Date类型
 * @param {any}val - 需要传入的判断是否是日期的值
 * @return {boolean} - true为是Date类型
 */
export function isDate(val: any): val is Date {
  return toString.call(val) === `[object Date]`
}

/**
 * 此函数用来判断传入的参数是否是普通的object类型
 * @param val
 * @return {boolean}  - true为是普通的object类型
 */
export function isPlainObject(val: any): val is object {
  return toString.call(val) === '[object Object]'
}

/**
 * 判断是不是 form-data 类型
 * @param val
 */
export function isFormData(val: any): val is FormData {
  // 是一个formdata实例
  return typeof val !== 'undefined' && val instanceof FormData
}

/**
 * 判断参数类型是否是URLSearchParams类型
 * @param val
 */
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

/**
 * 将属性从from拷贝到to
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * 深拷贝函数
 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
