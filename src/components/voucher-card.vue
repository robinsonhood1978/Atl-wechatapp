<template>
  <view class="grace-news-list package-card" :class="isActive?'active':''" style="margin-top:10px;">
<!--    <view class="grace-news-item item">-->
<!--      <view class="grace-news-img-l img">-->
<!--        <image :src="logoUrl" mode="aspectFit"></image>-->
<!--      </view>-->
<!--      <view class="grace-news-body body info">-->
<!--        <view class="title">{{voucher.title}}</view>-->
<!--        <view class="desc">{{voucher.description}}</view>-->
<!--      </view>-->
<!--    </view>-->
    <view  :key="voucher.id" :data-number="item.number" :data-btn="item.btn" style="margin:15px 0;" @tap="showDialog1">
      <graceCoupons :coupon="item"></graceCoupons>
    </view>
    <graceDialog ref="graceDialog1" :title="voucher.promotion.title" :isBtns="false" v-on:closeDialog="closeDialog1">
					<view class="content1" slot="content">
						<!-- <text>{{voucher.promotion.description}}</text> -->
            <rich-text  :nodes="voucher.promotion.description">       </rich-text >  
					</view>
				</graceDialog>
  </view>
</template>

<script>
// 2018-10-18T18:31:44.648807+13:00
import { apiHost } from '@/utils/index'
// import vouchers from '../pages/common/vouchers'
import graceCoupons from '@/graceUI/components/graceCoupons.vue'
import graceDialog from '@/graceUI/components/graceDialog.vue'
import moment from 'moment'
export default {
  props: ['voucher', 'isActive'],
  data () {
    return {
      host: apiHost,
      thumbs: []
    }
  },
  components: {
    graceCoupons,
    graceDialog
  },
  async mounted () {
    //console.log(this.voucher)
    //console.log(this.logoUrl)
  },
  computed: {
    logoUrl () {
      if (this.voucher.icon) {
        return (apiHost + (this.voucher.icon ? this.chargeType.charge_type.logo : this.chargeType.charge_type.company.logo))
      } else {
        return '/static/images/YUN_SQ.jpg'
      }
    },
    item () {
      return {
        color: '#BE1416',
        ltBg: '#FFFFFF',
        height: '100rpx',
        unit: '$',
        number: this.voucher.promotion.price,
        txt: this.voucher.promotion.title,
        title: this.voucher.promotion.title,
        // desc: this.voucher.promotion.description,
        desc: '有效期至 '+this.formatedTime,
        btn: '已领取'+this.voucher.available_count+"张",
        // drawed : this.voucher.available_count+"张" 
      }
    },
    formatedTime () {
      return moment(this.voucher.expire_time).local().format('DD/MM/YYYY')
    },
  },
  methods: {
    showDetails(){
      //console.log(this.voucher.promotion.title)
    },
    showDialog1  : function(){this.$refs.graceDialog1.open();},
		closeDialog1 : function(){this.$refs.graceDialog1.hide();},
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
  .grace-dialog-buttons{width:700rpx; line-height:88rpx; height:88rpx; display:block; overflow:hidden; text-align:center; font-size:26rpx; color:#999999;}
  .content1 {
    padding: 40rpx;
    padding-top: 10rpx;
  }
}
</style>
