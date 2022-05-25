<template>
  <div class="grids-contrainer">
    <view class="grace-rows grace-space-between info-row">
      <navigator url="/pages/common/about">
        <view class="icon yunicon icon-yun-round"></view>
        <p>关于我们</p>
      </navigator>
      <navigator url="/pages/fees/details">
        <view class="icon yunicon icon-dollar"></view>
        <p>运费详情</p>
      </navigator>
      <navigator url="/pages/common/faq">
        <view class="icon yunicon icon-faq"></view>
        <p>常见问题</p>
      </navigator>
      <!-- <navigator url="/pages/common/onePrice">
        <view class="icon yunicon icon-info-round"></view>
        <p>一口价</p>
      </navigator> -->

    </view>
    <navigator v-if="terms" class="terms" url="/pages/common/terms">《客户服务条款》</navigator>
  </div>
</template>

<script>
export default {
  props: ['terms'],
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

    img {
      width: 562upx;
      padding-top: 50upx;
    }
    h1 {
      padding-top: 4vh;
      font-size: 1.3em;
      color: $theme-color;
    }
    h4 {
      width: 70%;
      margin: auto;
      font-size: 0.9em;
      padding: 20upx 30rpx;
      color: $theme-color;
      text-align: justify;
    }
    .logo {
      color: $theme-color;
      font-size: 1.3em;
      margin-left: 0.3em;
      margin-right: 0.3em;
    }
    .authbutton{
      margin: 40upx auto;
      width: 350upx;
      padding: 3upx;
      background-color: white;
      color: $theme-color;
      border-style: none;
      font-size: 1em;
      box-shadow: 0px 4px 16px #455B6308;
      border-radius: 3px;
      &:hover {
        background: $secondary-color;
      }
    }
    .info-row {
      width: 100%;
      margin: 0px auto;
      .icon {
        font-size: 28px;
        color: $theme-color;
        margin: 0;
        margin-bottom: -8px;
      }
      p {
        color: $theme-color;
        font-size: 0.8em;
      }
    }
  }
  .terms{
    text-align: center;
    margin: 20px auto;
    font-size: 0.8em;
    font-weight: bold;
    color: $theme-color;
  }
</style>
