<template>
  <view class="grace-news-list package-card " style="margin-top:10px;">
    <swiper v-if="reply.files.length>0" class="grace-swiper"
            autoplay="true" indicator-dots
            indicator-color="rgba(255, 255, 255, 1)"
            indicator-active-color="#3688FF"
            style="height:500upx;background-color: white"
            interval="3000">

      <swiper-item  v-for="(thumb, index) in pics" :key="index" class="lightbox__holder" @click="predivImage" :id="pics[index]">
        <image style="height:100%;width:100%" :src="thumb" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <view class="grace-news-item">
      <view class="grace-news-body body">
        <view v-if="reply.content" class="title">{{reply.content}}</view>
        <view class="desc">{{reply.user.first_name}}</view>
        <view class="info"> {{formatedTime}}</view>
      </view>
    </view>
  </view>
</template>

<script>
// 2018-10-18T18:31:44.648807+13:00
import { apiHost } from '@/utils/index'
import moment from 'moment'

export default {
  props: ['reply'],
  data () {
    return {
      host: apiHost,
      images: []
    }
  },
  async mounted () {
  },
  computed: {
    pics () {
      let files = this.reply.files.map((item) => {
        return item.url.startsWith('http') ? item.url : (this.host + '/media/' + item.url)
      })
      return files
    },
    formatedTime () {
      return moment(this.reply.create_date).local().format('DD/MM/YYYY HH:mm')
    }
  },
  methods: {
    predivImage (e) {
      console.log(e)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.pics// 需要预览的图片http链接列表
      })
    },
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
