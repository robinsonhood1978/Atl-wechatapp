<template>
<!--  <web-view src="https://mp.weixin.qq.com/s/-sdnwUd5MMVd3_uftti5hg"></web-view>-->
  <web-view :src="companyInfo.client_app?(companyInfo.client_app.contact_link?companyInfo.client_app.contact_link:companyInfo.contact_page):companyInfo.contact_page"></web-view>
</template>

<script>
import { apiHost } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'companyInfo'
    ])
  },
  onShareAppMessage: function () {
    return {
      title: 'PackGo联系客服',
      path: 'pages/common/contact?uid=' + this.userProfile.uid,
      imageUrl: apiHost + this.companyInfo.logo
    }
  }
}
</script>

<style lang="scss">
</style>
