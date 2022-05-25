<template>
  <div class="login-contrainer">
    <img src="/static/images/slashscreen.png" alt="packgo logo" mode="widthFix">
    <h1>运过来，Just That Easy！</h1>
    <h4>我们是运过来，新西兰本地跨境物流服务商。不论是海运，空运，普通货物，亦或是电池，家具，零食等特殊商品等，我们都有最合适的运输方式。还在等什么，万千好物，快来买买买，中国万千商品，尽在运过来。</h4>
    <button   class="authbutton" v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindgetuserinfo">开始 <view class="icon yunicon icon-yun logo" style="display: inline-block"/> | 运过来</button>
    <navigator open-type="switchTab" url="/pages/me"> <h4 style="text-align: center; padding-top: 0px">了解更多</h4> </navigator>
    <view class="grace-rows grace-space-between info-row">
      <navigator url="/pages/common/about">
        <view class="icon yunicon icon-yun-round"></view>
        <p>关于我们</p>
      </navigator>
      <navigator open-type="switchTab" url="/pages/fees/feesCalc">
        <view class="icon yunicon icon-dollar"></view>
        <p>运费计算</p>
      </navigator>
      <navigator url="/pages/common/contact">
        <view class="icon yunicon icon-support"></view>
        <p>客户支持</p>
      </navigator>
    </view>
  </div>
</template>

<script>
import { login, showSuccess, apiHost, setUserInfo } from '@/utils/index'
import { mapState } from 'vuex'
// import InfoGrids from '@/components/info-grids'
export default {
  components: {
    // InfoGrids
  },
  data () {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }
  },
  computed: {
    ...mapState([
      'isLogedIn',
      'userProfile',
      'CID',
      'companyInfo'
    ]),
    logoUrl () {
      return apiHost + (this.companyInfo.client_app ? (this.companyInfo.client_app.home_logo ? this.companyInfo.client_app.home_logo : this.companyInfo.logo) : this.companyInfo.logo)
    }
  },
  mounted: function () {
    // login({
    //   success: function () {
    //     wx.hideLoading()
    //     showSuccess('登陆成功')
    //   },
    //   fail: function () {
    //     wx.hideLoading()
    //   }
    // })

    const self = this
    wx.getUserInfo({
      success (res) {
        //console.log('authorised: ' + res.userInfo)
        self.userInfo = res.userInfo
        self.getUserInfo()
      }
    })
    //console.log('can I use ' + this.canIUse)
    //console.log('isLogedIn ' + this.isLogedIn)
    
  },
  onShow () {
    //console.log('CID ' + this.CID)
  },
  methods: {
    bindgetuserinfo (e) {
      //console.log('bindgetuserinfo')
      //console.log(e)
      // this.userInfo = e.mp.detail.userInfo
      setUserInfo(e.mp.detail.userInfo)
      this.getUserInfo()
    },
    openCalc () {
      let url = '/pages/fees/details'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      login({
        success: function () {
          wx.hideLoading()
          showSuccess('登陆成功')
          
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .login-contrainer {
    text-align:center;
    background-color: $theme-color;
    color: white;
    height: 100vh;

    img {
      width: 562upx;
      padding-top: 50upx;
    }
    h1 {
      padding-top: 4vh;
      font-size: 1.3em;
      color: white;
    }
    h4 {
      width: 70%;
      margin: auto;
      font-size: 0.9em;
      padding: 20upx 30rpx;
      color: white;
      text-align: justify;
    }
    .logo {
      color: $theme-color;
      font-size: 1.3em;
      margin-left: 0.3em;
      margin-right: 0.3em;
    }
    .authbutton{
      margin: 40upx auto;
      width: 350upx;
      padding: 3upx;
      background-color: white;
      color: $theme-color;
      border-style: none;
      font-size: 1em;
      box-shadow: 0px 4px 16px #455B6308;
      border-radius: 3px;
      &:hover {
        background: $secondary-color;
      }
    }
    .info-row {
      width: 60%;
      margin: 0px auto;
      .icon {
        font-size: 23px;
        color: white;
        margin: 0;
        margin-bottom: -8px;
      }
      p {
        color: white;
        font-size: 0.8em;
      }
    }

  }

</style>
