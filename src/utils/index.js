import store from '../store'

export let apiHost
console.log('process.env.VUE_APP_VERSION', process.env.VUE_APP_VERSION)
if (process.env.VUE_APP_USE_HOST_API_LOCAL === 'true') {
  //apiHost = 'https://packns.natappvip.cc'
  apiHost = 'http://127.0.0.1:8098'
  // apiHost = 'https://packgo.test.yun.co.nz'
  // apiHost = 'https://dev.packns.edisonwang.cn'
} else if (process.env.VUE_APP_USE_HOST_API_STAGING === 'true'){
  apiHost = 'https://packgo.test.yun.co.nz'
}else {
  apiHost = 'https://packns.wisdomin.com'
  // apiHost = 'https://packns.edisonwang.cn'
}
setApiHost(apiHost)
// let apiHost = 'https://packns.natappvip.cc'
// export let apiHost = 'http://10.0.100.112:8098/'
// export let apiHost = 'https://packgo-staging.dev.retech.co.nz/'
let apiPath = store.state.apiHost + '/api/'
// let qlPath = apiHost + '/ql'

// var gqlwx = require('wxapp-graphql');
// var GraphQL = gqlwx.GraphQL;


// export const appid = 'wx89a5c6db8aa01037'
export const appid = process.env.VUE_APP_MP_WEIXIN_APPID

export const version = process.env.VUE_APP_VERSION

export const versionName = process.env.VUE_APP_VERSION_NAME

export const atl = (process.env.VUE_APP_VERSION == 'atl') ? true : false

export const primaryColor = (process.env.VUE_APP_VERSION == 'atl') ? '#BE1416' : '#40C5D1'

console.log('util version', version)

const appidHeader = {
  'appid': appid
}

// export var gql = GraphQL({
//     //设置全局 url
//     url: qlPath, // url 必填

//     //设置全居动态 header
//     header: function () {
//         return {
//             // something....
//             'X-Test-Header': 'test header content',
//             'appid': appid
//         }
//     },

//     //设置全居错误拦截
//     errorHandler: function (res) {
//         //do something
//     }
//   }, true
// );





let isLogingIn = false
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

function isUndefined (v) {
  return v === undefined
}

export async function getUserProfile () {
  let userinfo = store.state.userInfo
  let resp = await get('packgo/profile/')
  if(userinfo.nickName=='微信用户' && resp.customer.nickname && resp.customer.logo){
    userinfo.nickName = resp.customer.nickname
    userinfo.avatarUrl = apiHost + resp.customer.logo
    store.commit('USER_INFO', userinfo)
  }
  store.commit('USER_PROFILE', resp)
  let comresp = await get(
    'home/company/'
  )
  //console.log(comresp)
  if (comresp.code === 0) {
    setCompanyInfo(comresp.object)
  }
}

export function login (cid, settings) {
  if (isLogingIn === true) {
    return
  }
  store.commit('LOGIN_STATUS', false)
  // 调用登录接口
  wx.login({
    success: (res) => {
      let sdata = {
        'code': res.code
      }
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.showLoading({ title: '登录中...' })
            wx.getUserInfo({
              success: res => {
                //console.log('userInfo:',res.userInfo)
                store.commit('USER_INFO', res.userInfo)
                sdata['data'] = res.encryptedData
                sdata['iv'] = res.iv
                sdata['appid'] = appid
                if (store.state.CID) {
                  sdata['cid'] = store.state.CID
                }
                if (store.state.uid) {
                  sdata['uid'] = store.state.uid
                }
                //console.log(sdata)
                // wx.hideLoading({ title: '登录中...' })
                // setTimeout(function(){
                //   showSuccess('success!!')
                // },2000);
                
                request({
                  url: apiHost + '/api-token-auth-wechatapp/' + ((store.state.scene !== 'undefined') ? ('?' + store.state.scene) : ''),
                  data: sdata,
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'appid': appid
                  },
                  method: 'POST',
                  success: res => {
                    //console.log(res)
                    if (res.statusCode === 200) {
                      //console.log('token:' + res.data.token)
                      store.commit('AUTH_TOKEN', res.data.token)
                      store.commit('LOGIN_STATUS', true)
                      getUserProfile()
                      showSuccess('登录成功！')
                      isLogingIn = false
                      //console.log('set isLogingIn ' + isLogingIn)
                      if (settings !== undefined && settings.success !== undefined) {
                        //console.log('Re-execute success function')
                        settings.success()
                      }
                    } else {
                      //console.log('Login Error!')
                      showFail('服务器错误...请稍后再试')
                      isLogingIn = false
                      //console.log('set isLogingIn ' + isLogingIn)
                      if (settings !== undefined && settings.fail !== undefined) {
                        //console.log('Execute failed function')
                        settings.fail()
                      }
                    }
                  },
                  fail: res => {
                    // setTimeout(function(){
                    //   showFail(res)
                    // },2000);
                    console.log(res)
                    showFail('登录失败')
                    // wx.hideLoading({ title: '登录中...' })
                    isLogingIn = false
                    //console.log('set isLogingIn ' + isLogingIn)
                  }
                })
              }
            })
          } else {
            isLogingIn = false
            //console.log('set isLogingIn ' + isLogingIn)
          }
        }
      })
    }
  })

  isLogingIn = true
  //console.log('set isLogingIn ' + isLogingIn)
}
export function request (setting) {
  let header = { ...setting.header, ...appidHeader }
  wx.request({
    method: setting.method,
    header: header,
    url: setting.url,
    data: setting.data,
    success: setting.success,
    fail: setting.fail
  })
}

export async function get (url) {
  return asyncequest(url, 'GET')
}
export async function post (url, data, header) {
  return asyncequest(url, 'POST', data, header)
}
export async function del (url, data, header) {
  return asyncequest(url, 'DELETE', data, header)
}
export async function put (url, data, header) {
  return asyncequest(url, 'PUT', data, header)
}
export function asyncequest (url, method, data, header, retry) {
  return new Promise((resolve, reject) => {
    if (store.state.authToken !== '') {
      let toklenHeaer = {
        Authorization: 'JWT ' + store.state.authToken
      }
      header = { ...header, ...toklenHeaer }
    }
    header = { ...header, ...appidHeader }
    uni.request({
      method,
      data,
      url: url.startsWith('http') ? url : apiPath + url,
      header: header,
      success: function (res) {
        //console.log(res)
        if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 202) {
          resolve(res.data)
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          // Login again
          console.log('Token expired re-login now')
          if (store.state.islogedin) {
            store.commit('LOGIN_STATUS', false)
          }
          if (retry === undefined) { retry = 0 }
          if (retry < 3) {
            retry++
            console.log('retry: ' + retry)
            login(store.state.CID, {
              success: function () {
                asyncequest(url, method, data, header, retry)
              }
            })
          }
          reject(res.data)
        } else {
          // store.commit('LOGIN_STATUS', false)
          showFail('请求错误请稍后再试')
          reject(res.data)
        }
      }
    })
  })
}

export function asyncUploadCommonFile (url, filename, filePath, data, header) {
  return new Promise((resolve, reject) => {
    let toklenHeaer = {
      Authorization: 'JWT ' + store.state.authToken
    }
    header = { ...header, ...toklenHeaer, ...appidHeader }
    wx.uploadFile({
      formData: data,
      url: url.startsWith('http') ? url : apiPath + url,
      header: header,
      filePath,
      name: filename,
      success: function (res) {
        console.log(res)
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          // Login again
          console.log('Token expired re-login now')
          if (store.state.islogedin) {
            store.commit('LOGIN_STATUS', false)
          }
        } else {
          reject(res.data)
        }
      }
    })
  })
}

export function asyncUploadFile (url, filePath, data, header) {
  return new Promise((resolve, reject) => {
    let toklenHeaer = {
      Authorization: 'JWT ' + store.state.authToken
    }
    header = { ...header, ...toklenHeaer, ...appidHeader }
    wx.uploadFile({
      formData: data,
      url: url.startsWith('http') ? url : apiPath + url,
      header: header,
      filePath,
      name: 'file',
      success: function (res) {
        console.log(res)
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          // Login again
          console.log('Token expired re-login now')
          if (store.state.islogedin) {
            store.commit('LOGIN_STATUS', false)
          }
        } else {
          reject(res.data)
        }
      }
    })
  })
}

export function authRequest (setting, retry) {
  console.log(setting)
  console.log(store.state.authToken)
  // if (isUndefined(store.state.authToken)) {
  //   if (isUndefined(retry)) retry = 0
  //   console.log(retry)
  //   retry++
  //   if (retry > 20) {
  //     console.log('AuthRequest timeout')
  //     return
  //   }
  //   setTimeout(function () { authRequest(setting, retry) }, 500)
  //   return
  // }
  if (isUndefined(setting) || isUndefined(setting.header)) { setting.header = {} }
  setting.header['Authorization'] = 'JWT ' + store.state.authToken
  console.log(setting)
  let header = { ...setting.header, ...appidHeader }
  request({
    method: setting.method,
    header: header,
    // url: setting.url.startWith('http') ? setting.url : apiPath + setting.url,
    url: apiPath + setting.url,
    data: setting.data,
    success: function (res) {
      // Check whether the token has expired
      if (res.statusCode === 401 || res.statusCode === 403) {
        // Login again
        console.log('Token expired re-login now')
        login({
          success: function () {
            authRequest(setting)
          },
          fail: function () {
            setting.fail()
          }
        })
      } else {
        setting.success(res)
      }
    },
    fail: setting.fail
  })
}
export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}
export function showSuccess (text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}
export function showFail (text) {
  wx.showToast({
    title: text,
    icon: 'none'
  })
}
export function setCID (cid) {
  store.commit('COMPANY_ID', cid)
}
export function setUID (uid) {
  store.commit('ORG_USER_ID', uid)
}
export function setSCENE (uid) {
  store.commit('SCENE', uid)
}
export function setCompanyInfo (companyInfo) {
  store.commit('COMPANY_INFO', companyInfo)
}
export function setChargeTypes (chargeTypes) {
  store.commit('CHARGE_TYPES', chargeTypes)
}
export function setAppOptions (options) {
  store.commit('APP_OPTIONS', options)
}
export function setAddress (address) {
  store.commit('ADDRESS', address)
}
export function setUserInfo (userinfo) {
  store.commit('USER_INFO', userinfo)
}
export function setSenderAddress (address) {
  store.commit('SENDER_ADDRESS', address)
}
export function setUserProfile (profile) {
  store.commit('USER_PROFILE', profile)
}
export function setNeedFill (obj) {
  store.commit('NEED_FILL', obj)
}
export function setApiHost (obj) {
  store.commit('API_HOST', obj)
}
