<template>
<!--  <web-view src="https://mp.weixin.qq.com/s/-sdnwUd5MMVd3_uftti5hg"></web-view>-->
  <web-view :src="companyInfo.client_app?(companyInfo.client_app.forbidden_page?companyInfo.client_app.forbidden_page:companyInfo.forbidden_page):companyInfo.forbidden_page"></web-view>
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
      title: 'YUN一口价转运',
      path: 'pages/common/onePrice?uid=' + this.userProfile.uid,
      imageUrl: '/static/images/YUN_SQ.jpg'
    }
  }
}
</script>

<style lang="scss">
</style>
