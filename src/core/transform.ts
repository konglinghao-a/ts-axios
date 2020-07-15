import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  // 没有传fn的情况
  if (!fns) {
    return data
  }
  // 如果不是数组就让它变成数组
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  // fn 是每一个转化函数, 最后遍历完的data就是最终处理完的结果
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
