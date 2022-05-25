<template>
<!--  <web-view src="https://mp.weixin.qq.com/s/-sdnwUd5MMVd3_uftti5hg"></web-view>-->
  <web-view src="https://mp.weixin.qq.com/s/p_NQQBNHWvEwE6ov-EQaEQ"></web-view>
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
      title: '物流关键词',
      path: 'pages/common/keyWords?uid=' + this.userProfile.uid,
      imageUrl: '/static/images/YUN_SQ.jpg'
    }
  }
}
</script>

<style lang="scss">
</style>
