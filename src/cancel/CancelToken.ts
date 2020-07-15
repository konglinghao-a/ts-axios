import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

// 类既可以为值也可以为类型（比较神奇）, 这里既要把它当作值运用也要当成类型来运用
import Cancel from './Cancel'
interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    // executor里面实际上是一个取消函数c
    executor(message => {
      // 阻止其多次调用
      if (this.reason) {
        return
      }
      // 调用了这个cancel方法的时候实际上就调用了resolvePromise，这样就把pending状态变为resolve状态。
      this.reason = new Cancel(message)
      // 调用了promise，把pending状态转换到resolved状态
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    /**
     * 怎样判断一个token有没有被使用过？看cancel方法有没有被执行过，cancel方法被执行过
     * 之后reason就有值
     */
    if (this.reason) {
      // 抛出异常之后就可以去实现请求的逻辑
      throw this.reason
    }
  }

  // 添加静态方法（这个source方法很类似于一个工厂方法）
  static source(): CancelTokenSource {
    /**
     * cancel一定是有值的，因为构造函数里面执行函数，肯定会
     * 传入一个取消函数。
     */
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
