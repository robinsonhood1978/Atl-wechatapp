<script>
import { get, setCompanyInfo, setAppOptions } from '@/utils/index'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //console.log('app created and cache logs by setStorageSync')
  },
  // mounted() {
  //   console.log('robin:',process.env.UNI_PLATFORM)
  //   if (process.env.MINI_PROGRAM_VERSION == "pcl") {
  //     console.log('pcl')
  //     //require('./config/pcl/uni.scss');
  //   }
  // },
  async onLaunch() {  
            //console.log('App Launch');  

        //     let apiUrl = 'parcels/?state=P&filed=0&unsent=1&count=10'
        // let tmpList = await get(apiUrl)
        //      let url = 'pages/order'
        //       wx.switchTab({ url })
        },  
  async onShow (options) {
    //console.log(options)
    setAppOptions(options)
//     let qr = `query {company{
//   id
//   taxRate
//   clientApp{
//     type
//     forwardLogo
//   }
// }}`;
    //qr = `query {hello(name:"Robin")}`;
    // 初始化对象
    // gql.query({
    //     query: qr,
    // variables: {
    //       secret: '427e24d3b7e289ae9469ab6724dc7ff0',
    //       clientId: '5a9fa26cf8635a000185528c'
    //     }
    // }).then(function(res) {
    //   //成功
    //   console.log(res);
    // }).catch(function(error) {
    //   //失败
    //   console.log(error);
    // });
    wx.getClipboardData({
      success (res) {
        console.log(res.data) // data
      }
    })
    let resp = await get('home/company/')
    console.log(resp)
    if (resp.code === 0) {
      setCompanyInfo(resp.object)
    }
    if (wx.getUpdateManager) {
      // wx.getUpdateManager 在 1.9.90 才可用，请注意兼容
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        //console.log('Update:' + res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否马上重启小程序？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      //console.log('app show')
    }
    // let option = this.$root.$mp.appOptions
    // store.commit('APP_OPTIONS', option)
    // console.log(option)
  }
}
</script>

<style lang="scss">
@import "static/css/weui.css";
@import "./graceUI/graceIcons.css";
@import "./graceUI/graceUI.css";
@import "./assets/iconfont.css";
page {
  background-color: #FAFAFA;
  color: #626262;
}
p{
  color: #626262;
}
/*.container {*/
/*  height: 100%;*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  align-items: center;*/
/*  justify-content: space-between;*/
/*  padding: 200rpx 0;*/
/*  box-sizing: border-box;*/
/*}*/
/*!* this rule will be remove *!*/
/** {*/
/*  transition: width 2s;*/
/*  -moz-transition: width 2s;*/
/*  -webkit-transition: width 2s;*/
/*  -o-transition: width 2s;*/
/*};*/
.grace-footer {
  .icon-btn {
    width: 25%;
    height: 100 upx;
  }
  .active-primary {
    color: $uni-color-primary !important;
  }
}
.grace-tab-title view{font-size: 1.2em;}
.grace-tab-current{border-bottom:4px solid $uni-color-primary !important; color:$uni-color-primary;}
.ucenter-line{width:100%; height:10px; background:#FAFAFA; margin:8px 0;}
.grace-select-menu-title > text {
  color: $theme-color
}
.grace-yun{color:$theme-color !important;}
.grace-bg-yun{background:$theme-color !important; color:#FFFFFF !important;}
</style>
