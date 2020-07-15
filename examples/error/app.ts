import axios, { AxiosError } from '../../src/index'

// url写错了就是404结果
axios({
  method: 'get',
  url: '/error/get1'
})
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })

// 服务端的设置，有一定几率是500
axios({
  method: 'get',
  url: '/error/get'
})
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e.message)
  })

// 模拟网络错误(给出时间来让我们打开offline)
setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get'
  })
    .then(res => {
      console.log(res)
    })
    .catch(e => {
      console.log(e)
    })
}, 5000)

// 模拟超时
axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000
})
  .then(res => {
    console.log(res)
  })
  .catch((e: AxiosError) => {
    console.log(e.message)
    console.log(e.config)
    console.log(e.code)
    console.log(e.request)
    console.log(e.isAxiosError)
  })
