<template>
  <div>
    <view v-if="userProfile.customer && userProfile.customer.address_cn "  class="address_holder">
      <h4>请将如下地址作为您的淘宝，京东等购物平台收货地址，我们会根据您的收货人姓名和会员编号来区分您的货物并更新您的货物状态，您可以随时使用小程序来查看货物状态和更新报关信息。</h4>
      <!--<span>{{userProfile.customer.address_cn}}</span>-->
      <div class="address" hover-class="address-hover" v-if="companyInfo.show_sea_freight_warehouse" @click="copyAddressSea" style="margin-bottom: 10px">
        <h4>海运仓库地址</h4>
        <p v-for="(txt, index) in display_sea_address" :key="index"> {{txt}}</p> </div>
      <div class="address" hover-class="address-hover" v-if="companyInfo.show_flight_freight_warehouse"  @click="copyAddressFlight" >
        <h4>空运仓库地址</h4>
        <p v-for="(txt,index) in display_flight_address" :key="index"> {{txt}}</p> </div>
      <span>点击复制收货地址</span>
    </view>
    <mp-modal ref="copyModalSea" title="确认复制" content="是否确认复制海运地址？当前剪贴板内容将被覆盖。" :showCancel="true" @confirm="confirmCopySea" ></mp-modal>
    <mp-modal ref="copyModalFlight" title="确认复制" content="是否确认复制空运地址？当前剪贴板内容将被覆盖。" :showCancel="true" @confirm="confirmCopyFlight" ></mp-modal>
  </div>
</template>

<script>
import { showSuccess } from '@/utils/index'
import { mapState } from 'vuex'
import mpModal from 'mpvue-weui/src/modal'
export default {
  computed: {
    ...mapState([
      'isLogedIn',
      'userProfile',
      'CID',
      'companyInfo'
    ]),
    display_sea_address () {
      if (this.userProfile.customer && this.userProfile.customer.sea_freight_warehouse_cn) {
        return this.userProfile.customer.sea_freight_warehouse_cn.split('，')
      }
      return []
    },
    display_flight_address () {
      if (this.userProfile.customer && this.userProfile.customer.flight_freight_warehouse_cn) {
        return this.userProfile.customer.flight_freight_warehouse_cn.split('，')
      }
      return []
    }
  },
  components: {
    mpModal
  },
  methods: {
    // onSwitchChange (e) {
    //   console.log(e)
    //   this.hideHasInfo = e.target.value
    //   if (this.activeIndex === 1 && this.hideHasInfo) {
    //     this.tempList = this.packagesList
    //     this.packagesList = this.tempList.filter(pack => pack.need_details === true)
    //   } else if (this.activeIndex === 1 && !this.hideHasInfo) {
    //     this.packagesList = this.tempList
    //   }
    // },
    updateInfo () {
      let url = '/pages/weblogin?tab=0'
      wx.navigateTo({ url })
    },
    copyAddressSea () {
      this.$refs.copyModalSea.show()
    },
    copyAddressFlight () {
      this.$refs.copyModalFlight.show()
    },
    confirmCopySea () {
      wx.setClipboardData({
        data: this.userProfile.customer.sea_freight_warehouse_cn,
        success (res) {
          wx.getClipboardData({
            success (res) {
              //console.log(res.data) // data
              showSuccess('海运地址复制成功')
            }
          })
        }
      })
    },
    confirmCopyFlight () {
      wx.setClipboardData({
        data: this.userProfile.customer.flight_freight_warehouse_cn,
        success (res) {
          wx.getClipboardData({
            success (res) {
              //console.log(res.data) // data
              showSuccess('空运地址复制成功')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .address_holder {
    margin: 10px 20px;
    padding: 5px 20px;
    font-size: 0.7em;
    margin-bottom: 10px;
    span{
      margin-top: 5px;
      font-size: 0.7em;
    }
  }
  .address {
    /*padding: 5px;*/
    margin: 10px 0px;
    /*padding: 5px 20px;*/
    /*border-radius: 20px;*/
    /*background: #f9f9f9f9;*/
    h4 {
      text-align: center;
    }
    p {
      font-size: 0.8em;
    }

  }
  .address-hover {
    background: #999999;
  }
</style>
