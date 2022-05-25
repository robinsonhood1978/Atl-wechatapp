<template>
    <view class="grace-news-list package-card" :class="isActive?'active':''" style="margin-top:10px;">
      <view class="grace-news-item item">
        <view class="grace-news-img-l img">
          <image :src="logoUrl" mode="aspectFit"></image>
        </view>
        <view class="grace-news-body body info">
          <view class="title">{{chargeType.charge_type.title}}</view>
          <view class="desc">{{chargeType.charge_type.subtitle}}</view>
        </view>

        <view class="grace-news-body price">
          <view class="title " >NZD ${{chargeType.total.toFixed(2)}}</view>
        </view>

      </view>
    </view>
</template>

<script>
// 2018-10-18T18:31:44.648807+13:00
import { apiHost } from '@/utils/index'
export default {
  props: ['chargeType', 'isActive'],
  data () {
    return {
      host: apiHost,
      thumbs: []
    }
  },
  async mounted () {
    //console.log(this.chargeType)
    //console.log(this.logoUrl)
  },
  computed: {
    logoUrl () {
      if (this.chargeType.charge_type.company.logo) {
        return (apiHost + (this.chargeType.charge_type.logo ? this.chargeType.charge_type.logo : this.chargeType.charge_type.company.logo))
      } else {
        return '#'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .active {
    border-style: solid;
    border-width: 1px;
    border-color: $theme-color;
  }
  .package-card {
    padding: 5upx 20upx;
    margin: 0px 10px;
    background-color: white;
    box-shadow: 0px 4px 16px #455B6308;
    border-radius: 3px;
    .item {
      .img {
        //width: 25%;
        //height: 100%;
        //margin: auto;
        image {
          //margin: auto;
          height: 150upx;
          align-self: left;
          margin-left: 0;
          max-width: 150upx;
        }
      }
      .info {
        width: 50%;
        height: 100%;
        margin: auto;

        .title {
          text-align: center;
          font-size: 1em;
          padding-bottom: 20upx;
          font-weight: bold;
        }
        .desc {
          text-align: center;
          font-size: 0.8em;
          //line-height: 1em;
        }
      }

      .price {
        margin: auto;
        .title {
          color: $uni-color-primary;
          font-weight: 600;
          text-align: center;
        }

        width: 25%;
        height: 100%;
      }
    }
  }
</style>
