<template>
  <div class="login-contrainer">
    <img :src="logoUrl" alt="packgo logo" mode="widthFix">
    <h2>您的一站式跨境物流集运伙伴</h2>
    <h4>您可以通过小程序来追踪货物状态，完善清关信息等</h4>
    <button   class="authbutton" v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindgetuserinfo">授权登陆</button>
    <h4>为了方便我们联系您通知货物信息，请授权后完善个人信息获取您的专属入库编号.如果您需要更多信息，您可以查看我们的运费规则和运费计算器</h4>
<!--        <button class="calcbutton" @click="openCalc" >运费说明</button>-->
    <div style="margin-top: 50px">
    <info-grids :terms="true"></info-grids>
      </div>
  </div>
</template>

<script>
import { login, showSuccess, apiHost, setUserInfo } from '@/utils/index'
import { mapState } from 'vuex'
import InfoGrids from '@/components/info-grids'
export default {
  components: {
    InfoGrids
  },
  data () {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }
  },
  computed: {
    ...mapState([
      'userInfo',
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
        console.log('authorised: ' + res.userInfo)
        self.userInfo = res.userInfo
        self.getUserInfo()
      }
    })
    console.log('can I use ' + this.canIUse)
    console.log('isLogedIn ' + this.isLogedIn)
  },
  onShow () {
    console.log('CID ' + this.CID)
  },
  methods: {
    bindgetuserinfo (e) {
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

    img {
      width: 400rpx;
      padding-top: 100rpx;
    }
    h1 {
      padding-top: 50rpx;
      font-size: 50rpx;
    }
    h2 {
      font-size: 1em;
      padding: 50rpx 30rpx;
    }
    h4 {
      font-size: 0.7em;
      padding: 10rpx 30rpx;
    }
    .authbutton{
      margin:20rpx 30rpx 40rpx;
      background: $theme-color;
      color: white;
      border-style: none;
      &:hover {
        background: $secondary-color;
      }
    }
    .calcbutton{
      width: 200rpx;
      margin: 20rpx auto;
      background: #b8c4d1;
      color: black;
      border-style: none;
      font-size: 0.7em;
      &:hover {
        background: $secondary-color;
      }
    }

  }

</style>
