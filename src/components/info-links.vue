<template>
  <div>
  <div class="grids-contrainer">
    <div class="grid-cell">
      <navigator url="/pages/fees/details">
      <img src="/static/icons_pcl/money-active.png" alt="">
      <p>运费说明</p>
      </navigator>
    </div>
    <div class="grid-cell">
      <navigator url="/pages/fees/feesCalc" @click="openCalc">
        <img src="/static/icons_pcl/calc-active.png" alt="">
        <p>运费计算</p>
      </navigator>
    </div>
    <div class="grid-cell">

      <button class="no-style"
              v-if="companyInfo.show_customer_support"
              send-message-title="常见问题"
              show-message-card="true"
              bindcontact='contactCallback'
              :session-from='session_str'
              open-type='contact'>
        <img src="/static/icons_pcl/contact-active.png" alt="chat-active">
        <p>联系客服</p>
      </button>
      <navigator url="/pages/common/contact" v-else >
        <img src="/static/icons_pcl/contact-active.png" alt="chat-active">
        <p>联系客服</p>
      </navigator>
    </div>
  </div>
    <navigator v-if="terms" class="terms" url="/pages/common/terms">《客户服务条款》</navigator>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['terms'],
  computed: {
    ...mapState([
      'userInfo',
      'isLogedIn',
      'userProfile',
      'CID',
      'companyInfo'
    ]),
    session_str () {
      if (this.isLogedIn && this.userProfile && this.userProfile?.is_customer) {
        return '{"nickName":"' + this.userInfo?.nickName + '-' + this.userProfile?.customer?.applicant_number + '","avatarUrl":"' + this.userInfo?.avatarUrl + '"}'
      } else {
        return '{"nickName":"' + this.userInfo?.nickName + '","avatarUrl":"' + this.userInfo?.avatarUrl + '"}'
      }
    }
  },
  onLoad () {
      
    this.version = version
  },
  methods: {
    openCalc () {
      let url = '/pages/fees/feesCalc'
      wx.switchTab({ url })
    }
  }
}
</script>

<style scoped lang="scss">
  .grids-contrainer {
    width: 60%;
    text-align:center;
    display: flex;
    flex-direction: row;
    margin: auto;
    justify-content: space-between;
    p{
      font-size: 0.6em;
      font-weight: bold;
    }

    img {
      width: 80rpx;
      height: 80rpx;
    }
  }
  .terms{
    text-align: center;
    margin: 20px auto;
    font-size: 0.8em;
    font-weight: bold;
    color: $theme-color;
  }
  .no-style {
    line-height: unset;
    font-size: unset;
    padding: unset;
    background-color: unset;
    &:after {
      border-width: 0;
    }
    &:hover {
      background-color: unset;
    }
  }
  .button-hover {
    background-color: unset;
  }
</style>
