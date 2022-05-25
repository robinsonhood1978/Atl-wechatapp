<template>
  <navigator :url="detailUrl">
    <view class="grace-news-list package-card " style="margin-top:10px;">
      <view class="grace-news-item">
        <view class="grace-list-body grace-border-b">
            <view class="grace-list-title">
                <text class="grace-list-title-text">{{ticket.type.title }}</text>
                <text class="grace-list-title-desc"></text>
                <view v-if="ticket.status" class="grace-tags-large grace-tbr-large badge" style="margin-right:10px;">{{ticket.status.title}}</view>
            </view>
            <view class="grace-list-title">
                <text class="grace-list-title-desc">{{ticket.content ? ticket.content : ''}}</text>
                <text class="grace-list-title-desc">{{formatedTime}}</text>
            </view>
            <view v-if="ticket.dform" class="grace-list-body-desc">运单 {{ticket.dform.tracking_number}}</view>
            <view v-if="ticket.parcel" class="grace-list-body-desc">包裹 {{ticket.parcel.local_courier_number}}</view>
            <view class="grace-list-title" 
                  :key="Item.id"
                  v-for="(Item) in ticket.replys">
                <text class="grace-list-title-desc">{{Item.content ? Item.content : '' | textCut}}</text>
                <view class="grace-list-title-desc">{{Item.create_date | dateFormat}}</view>
            </view>
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
  props: ['ticket'],
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
      return '/pages/tickets/details?id=' + this.ticket.id
    },
    packState () {
      
    },
    formatedTime () {
      return moment(this.ticket.create_date).local().format('DD/MM/YYYY HH:mm')
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
