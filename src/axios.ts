import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

// 混合类型
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 类中会用到this.request，因此上下文需要绑定
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
// 增加axios的静态方法create
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}
// 增添一些Cancel的静态属性和方法
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
axios.all = function all(promises) {
  return Promise.all(promises)
}
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios
export default axios
