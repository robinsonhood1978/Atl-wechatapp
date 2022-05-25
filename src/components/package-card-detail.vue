<template>
  <navigator :url="detailUrl">
    <view class="grace-news-list package-card " style="margin-top:10px;">
      <view class="grace-news-item">
        <view class="img grace-news-img-l">
          <image :src="thumbs[0]" mode="aspectFill" class="img-card"></image>
        </view>
        <view class="grace-news-body body">
          <view class="desc light">{{formatedTime}}</view>
          <view class="tip light">入库重量仅供参考,实际重量以打包后为准</view>
          <view class="title">{{packageData.title?packageData.title:packageData.local_courier_number }}</view>
          <view v-if="packageData.in_freight" class="desc">航次:  {{ packageData.in_freight.title }} </view>
          <view v-else class="desc">航次:  未指派 </view>
          <view v-if="packageData.local_courier_name" class="desc">{{packageData.local_courier_name}}:  {{packageData.local_courier_number }}</view>
          <view class="desc">物品件数:  {{packageData.pieces }}件</view>
          <view class="desc">重量:  {{packageData.weight.toFixed(2)}}KG</view>
          <view class="desc">体积:  {{ packageData.volume.toFixed(3) }}m3</view>
          <view v-if="packageData.need_details" class="info red"> 点击完善信息></view>
          <view v-if="!packageData.need_details" class="info"> 已完善></view>
        </view>
      </view>
    </view>
  </navigator>
</template>

<script>
// 2018-10-18T18:31:44.648807+13:00
import { apiHost } from '@/utils/index'
import moment from 'moment'

export default {
  props: ['packageData'],
  data () {
    return {
      host: apiHost,
      thumbs: []
    }
  },
  async mounted () {
    this.thumbs = this.packageData.images.map((item) => {
      return item.thumb.startsWith('http') ? item.thumb : (this.host + 'media/' + item.thumb)
    })
  },
  computed: {
    detailUrl () {
      return '/pages/packages/details?id=' + this.packageData.id
    },
    packState () {
      switch (this.packageData.state) {
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
      return moment(this.packageData.receive_time).local().format('DD/MM/YYYY')
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
      .title{
        text-align: left;
      }
      .tip {
        text-align: left;
        color: #626262;
        font-size:0.7em;
      }
      .desc {
        text-align: left;
        color: #626262;
      }
      .light {
        opacity: 0.56;
      }
    }
    .img-card {
      width: 240upx;
      height: 240upx;
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
