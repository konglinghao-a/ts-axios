//所有文件的工共类型定义文件
import InterceptorManager from '../core/interceptorManager'

export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'options'
  | 'OPTIONS'
  | 'head'
  | 'HEAD'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
export interface AxiosRequestConfig {
  // 用字面量的形式定义类型直接把类型的字符串内容固定住
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string
  // 字符串索引签名
  [propName: string]: any
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

// 请求的时候允许传入具体的类型
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
  }
  // 也就是说请求了什么类型，就可以拿到什么类型
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  getUri(config?: AxiosRequestConfig): string
}

// 这样就说明它既有函数类型又有属性方法（混合类型）
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  // 函数重载的类型定义
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

// Axios类的静态属性和方法的类型定义
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean

  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}

export interface AxiosInterceptorManager<T> {
  // 创建拦截器的时候返回一个拦截器id，这样eject就可以根据id删除拦截器
  use(resolve: ResolvedFn<T>, reject?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  // 如果返回的是T，那就说明是个同步逻辑
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

// transformRequest和transformResponse需要用到的类型定义
export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}
export interface Canceler {
  (message?: string): void
}
export interface CancelExecutor {
  (cancel: Canceler): void
}

// 为canceltoken实现静态方法而定义的接口类型
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}
// 这是一个类类型 (包括构造函数定义和静态方法定义) (CancelToken是实例类型，这个是类类型，要搞清楚)
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

// 下面是要实现cancel类的类型定义
export interface Cancel {
  message?: string
}
export interface CancelStatic {
  new (message?: string): Cancel
}

// 实现HTTP授权的类型定义
export interface AxiosBasicCredentials {
  username: string
  password: string
}
