import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

const strats = Object.create(null)

// 优先取val2，没有val2就取val1
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只取val2
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 对 val1 和 val2 进行深度合并
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
}

// 对于 url、params、data，指向策略2
const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 对于 headers 只像策略3
const stratKeysDeepMerge = ['headers', 'auth']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

/**
 * 将两个配置合并
 * @param config1 必须传的配置1
 * @param config2
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (let key in config2) {
    mergeFiled(key)
  }
  for (let key in config1) {
    if (!config2[key]) {
      mergeFiled(key)
    }
  }

  // 合并字段的函数
  function mergeFiled(key: string): void {
    // 拿到策略函数
    const strat = strats[key] || defaultStrat
    // config2用类型断言的方式设置为不空
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
