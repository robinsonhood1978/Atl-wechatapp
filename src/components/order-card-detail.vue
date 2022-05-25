<template>
  <navigator :url="detailUrl">
    <view class="grace-news-list package-card " style="margin-top:10px;">
      <view class="grace-news-item">
        <view class="img grace-news-img-l">
          <image :src="orderData.charge_type.logo" mode="aspectFit" class="img-card"></image>
        </view>
        <view class="grace-news-body body">
<!--          <view class="desc light">{{formatedTime}}</view>-->
          <view class="title">{{orderData.tracking_number }}</view>
          <view v-if="orderData.freight" class="desc">航次:  {{ orderData.freight.title }} </view>
          <view v-else class="desc">航次:  未指派 </view>
          <view class="desc">收费类型:  {{ orderData.charge_type.title }} </view>
          <view class="desc">包裹件数:  {{orderData.pieces }}件</view>
          <view class="desc">重量:  {{orderData.weight.toFixed(2)}}KG</view>
          <view class="desc">体积:  {{orderData.volume}}m3</view>
          <view class="desc">物品:  <view class="details" v-for="(item, index) in orderData.details" :key="index">{{ item.title}} </view></view>
          <view v-if="!orderData.paid" class="info red"> 未付款</view>
          <view v-else class="info"> 已付款</view>
        </view>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </view>
    </view>
  </navigator>
</template>

<script>
// 2018-10-18T18:31:44.648807+13:00
import { apiHost } from '@/utils/index'
import moment from 'moment'

export default {
  props: ['orderData'],
  data () {
    return {
      host: apiHost,
      thumbs: []
    }
  },
  async mounted () {
  },
  computed: {
    detailUrl () {
      return '/pages/freightorders/details?id=' + this.orderData.id
    },
    packState () {
      switch (this.orderData.state) {
        case 'P':
          // this.state = '处理中'
          return '处理中'
        case 'T':
          // this.state = '运输中'
          return '运输中'
        case 'H':
          // this.state = '已送达'
          return '已送达'
        default:
          return ''
      }
    },
    formatedTime () {
      return moment(this.orderData.receive_time).local().format('DD/MM/YYYY')
    }
  }
}
</script>

<style scoped lang="scss">
  .package-card {
    padding: 5upx 20upx;
    margin: 0px 10px;
    background-color: white;
    box-shadow: 0px 4px 16px #455B6308;
    border-radius: 3px;
    justify-content: space-between;

    .body {
      position: relative;
      margin-left: 20upx;
      .info{
        position: absolute;
        width: 100%;
        text-align: end;
        top: 0px;
        font-size: 0.7em;
      }
      .red {
        color: $uni-color-primary;
        font-weight: bold;
      }
      .desc {
        overflow-x: hidden;
        color: #626262;
        .details {
          display: inline-block;
          padding-right: 0.7em;
          font-size: inherit;
          color: inherit;
        }
      }
      .light {
        opacity: 0.56;
      }
    }
    .img-card {
      width: 160upx;
      height: 160upx;
    }
    .card-title {
      font-size: 1em;
      .title{
        width:60%;
        overflow-x:hidden;
        white-space:nowrap;
      }
      .info, .info-b {
        width: 25%;
        font-size:0.6em;
        text-align: right;
      }
      .info-b {
        font-weight: bold;
        color: red;
      }
      /*.date {*/
      /*width: 10%;*/
      /*font-size:0.6em;*/
      /*}*/
      .state {
        width: 15%;
        font-size:0.6em;
        text-align: right;
      }

    }
    .cardDesc {
      p {
        margin-right: 5px;
        font-size: 0.6em;
      }

      .card-tracking {
        width: 60%;
        font-size: 0.7em;
        overflow-x:hidden;
        white-space:nowrap;
      }
      .pieces {
        width: 10%;
        font-size:0.6em;
        text-align: right;
      }
      .freight {
        width: 30%;
        font-size:0.6em;
        text-align: right;
      }

    }

  }
</style>
