<template>
<!--  <web-view src="https://mp.weixin.qq.com/s/-sdnwUd5MMVd3_uftti5hg"></web-view>-->
  <web-view :src="companyInfo.client_app?(companyInfo.client_app.payment_page?companyInfo.client_app.payment_page:companyInfo.payment_page):companyInfo.payment_page"></web-view>
  <!-- <web-view src="https://txn.apac.paywithpoli.com/BankSelection?token=cITyxaV0Uo05EDi813H7cw6yenyadfMD"></web-view> -->
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'companyInfo'
    ])
  },
  onShareAppMessage: function () {
    return {
      title: '支付方式',
      path: 'pages/common/payments?uid=' + this.userProfile.uid,
      imageUrl: '/static/images/YUN_SQ.jpg'
    }
  }
}
</script>

<style lang="scss">
</style>
