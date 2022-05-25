<template>
<!--  <web-view src="https://mp.weixin.qq.com/s/-sdnwUd5MMVd3_uftti5hg"></web-view>-->
  <web-view :src="companyInfo.client_app?(companyInfo.client_app.faq_page?companyInfo.client_app.faq_page:companyInfo.faq_page):companyInfo.faq_page"></web-view>
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
      title: '常见问题',
      path: 'pages/common/payments?uid=' + this.userProfile.uid,
      imageUrl: '/static/images/YUN_SQ.jpg'
    }
  }
}
</script>

<style lang="scss">
</style>
