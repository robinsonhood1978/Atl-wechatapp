<template>
  <!--  <web-view src="https://mp.weixin.qq.com/s/QXdVH4V5KWcDpF2qyMXGhQ"></web-view>-->
  <web-view :src="companyInfo.client_app?(companyInfo.client_app.quote_link?companyInfo.client_app.quote_link:companyInfo.quote_page):companyInfo.quote_page"></web-view>
</template>

<script>
// import { apiHost } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'companyInfo',
      'userProfile',
      'CID',
      'uid'
    ])
  },
  onShareAppMessage: function () {
    return {
      title: 'YUN运费详情',
      path: 'pages/fees/details?uid=' + this.userProfile.uid,
      imageUrl: '/static/images/YUN_SQ.jpg'
    }
  },
  methods: {
    backToCalc () {
      console.log('clicked!!!!')
      wx.reLaunch({
        url: 'feesCalc'
      })
    }
  }
}
</script>

<style lang="scss">
.details{
  padding: 20px;

  h3{
    font-size:1em;
    margin: 20px 0 5px;
    font-weight: bold;
  }
  p {
    margin: 5px 0;
    font-size: 0.8em;
  }
  .desclaimer{
    margin: 30px 0;
    font-weight: bold;
  }
  .fees-details {
    width:100%;
    /*position: absolute;*/
    margin-bottom: 100rpx;
    a {
      text-align: center;
      color: $theme-color;
    }
  }
}

</style>
