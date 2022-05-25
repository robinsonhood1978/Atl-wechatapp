<template>
<!--  <web-view src="https://mp.weixin.qq.com/s/-sdnwUd5MMVd3_uftti5hg"></web-view>-->
  <web-view :src="companyInfo.client_app?(companyInfo.client_app.about_page?companyInfo.client_app.about_page:companyInfo.about_page):companyInfo.about_page"></web-view>
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
      title: '关于我们',
      path: 'pages/common/about?uid=' + this.userProfile.uid,
      imageUrl: '/static/images/YUN_SQ.jpg'
    }
  }
}
</script>

<style lang="scss">
</style>
