import Vue from 'vue'
import App from './App'
import store from './store'
import moment from 'moment'

Vue.filter('dateStr', function (value, format = 'DD/MM/YYYY') {
  // eslint-disable-next-line no-undef
  return moment(value).format(format)
})

Vue.filter('dateFormat', function (value, format = 'DD/MM/YYYY HH:mm') {
  // eslint-disable-next-line no-undef
  return moment(value).format(format)
})

Vue.filter('textCut', function (value, len = 10) {
  // eslint-disable-next-line no-undef
  return value.substr(0,len)
})

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()

Date.prototype.format = function(fmt) { 
  var o = { 
     "M+" : this.getMonth()+1,                 //月份 
     "d+" : this.getDate(),                    //日 
     "h+" : this.getHours(),                   //小时 
     "m+" : this.getMinutes(),                 //分 
     "s+" : this.getSeconds(),                 //秒 
     "q+" : Math.floor((this.getMonth()+3)/3), //季度 
     "S"  : this.getMilliseconds()             //毫秒 
 }; 
 if(/(y+)/.test(fmt)) {
         fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
 }
  for(var k in o) {
     if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
 return fmt; 
}  

var fundebug = require('fundebug-wxjs')
fundebug.init(
  {
    apikey: '597c2fbc33649214aebe70dc8f301e106465d16f782dc1898e0ae835eb7b94e1',
    monitorHttpData: true,
    setUserInfo: true,
    setSystemInfo: true,
    monitorMethodCall: true,
    monitorMethodArguments: true,
    releaseStage: 'production'
  }
)

export default {
  // 这个字段走 app.json
  config: {
  }
}
