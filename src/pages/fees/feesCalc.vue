<template>
<gracePage :customHeader="false">
  <view slot="gBody" class="grace-body">
  <view class="page">
        <scroll-view scroll-y="true" :data-scindex="tabIndex"  >
          <view class="text-input-area grace-wrap">
            <view class=" input-group grace-rows ">
              <label class="">长:</label>
              <input
                type="digit"
                class=""
                v-model.number="calcData.length"
                placeholder="厘米"
                @change="volumeCalc"
              /><span>厘米</span>
            </view>
            <view class=" input-group grace-rows ">
              <label class="">宽:</label>
              <input
                type="digit"
                class=""
                v-model.number="calcData.width"
                placeholder="厘米"
                @change="volumeCalc"
              /><span>厘米</span>
            </view>
            <view class=" input-group grace-rows ">
              <label class="">高:</label>
              <input
                type="digit"
                class=""
                v-model.number="calcData.height"
                placeholder="厘米"
                @change="volumeCalc"
              /><span>厘米</span>
            </view>
            <view class="input-group grace-rows ">
              <label class="">体积:</label>
              <input
                type="digit"
                class=""
                v-model.number="calcData.volume"
                placeholder="立方米"
                @change="volumeChange"
              /><span>立方米</span>
            </view>

            <view class=" input-group grace-rows">
              <label class="">重量</label>
              <input
                type="digit"
                class=""
                v-model.number="calcData.weight"
                placeholder="公斤"
              /><span>公斤</span>
            </view>
            <p class="disclaimer">**费用仅供参考，实际以仓库收货数据为准</p>
          </view>
          <button class="button" style="width: 80%; margin-top: 30upx" @click="getQuote">计算运费</button>
          <view style="margin-top: 30upx"></view>
          <view v-for="(charge, index) in chargeTypes" :key="index">
          <FeesCard
            v-if="charge.total"
            :chargeType="charge"
          />
          </view>
          <view class="grace-margin-top">
          <InfoGrids></InfoGrids>
          </view>
          <view style="padding-bottom: 200upx"></view>
        </scroll-view>
<!--      </swiper-item>-->
<!--      <swiper-item>-->
<!--        <scroll-view-->
<!--          scroll-y="true"-->
<!--          :data-scindex="tabIndex"-->
<!--          @scrolltolower="scrollend"-->
<!--          style="padding-bottom:50upx"-->
<!--        >-->
<!--        </scroll-view>-->
<!--      </swiper-item>-->
<!--    </swiper>-->
<!--    <view class="fixed-bottom" v-if="!userProfile.is_customer">-->
<!--      <navigator url="/pages/weblogin?tab=0">-->
<!--        <button class="button">完善信息获取集运地址</button>-->
<!--      </navigator>-->
<!--    </view>-->
  </view>
        <graceShade @closeShade="closeShade" ref="graceShade">
				<view class="demo-msg grace-relative" @tap.stop="">
					<view class="demo-msg-in">
            <image :src="helpProcess" style="width:100%;" mode="widthFix"></image>
					</view>
					<view class="close-btn grace-icons icon-close3 grace-white grace-absolute-rt" @tap.stop="closeShade"></view>
				</view>
			</graceShade>
      <graceDialog ref="graceDialog1" :title="helpTitle" :isBtns="false" v-on:closeDialog="closeDialog1">
					<view class="content1" slot="content">
						<view class="grace-list">
              <div v-for="(item,index) in items" :key="index">
              <navigator :url="item.url" class="grace-list-items">
                <text class="grace-list-icon grace-icons grace-yun" :class="item.icon"></text>
                <view class="grace-list-body grace-border-b">
                  <view class="grace-list-title">
                    <text class="grace-list-title-text">{{item.text}}</text>
                  </view>
                </view>
                <text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
              </navigator>
              </div>
            </view>
					</view>
				</graceDialog>
  </view>

  		<!-- 右侧挂件实现菜单 -->
		<view v-if="version == 'atl'" slot="gRTArea">
			<view class="grace-pop-menu" v-if="menuShow" @tap="menuHide">
        <text class="grace-pop-item grace-bg-red" style="font-size:28rpx;" @tap="helpProcessFunc">流程</text>
				<text class="grace-pop-item grace-bg-blue-sky" style="font-size:28rpx;" @tap="help('register')">注册</text>
				<text class="grace-pop-item grace-bg-yellow" style="font-size:28rpx;" @tap="help('parcel')">包裹</text>
				<text class="grace-pop-item grace-bg-light-blue" style="font-size:28rpx;" @tap="help('order')">运单</text>
        <text class="grace-pop-item grace-bg-green" style="font-size:28rpx;" @tap="help('pay')">付款</text>
			</view>
			<!-- 主按钮 -->
			<text class="grace-pop-item grace-icons icon-help2 grace-bg-yun" @tap="switchMenu"></text>
		</view>
    
	</gracePage>
</template>

<script>
import store from '../../store'
import gracePage from "@/graceUI/components/gracePage.vue";
import graceShade from "@/graceUI/components/graceShade.vue";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import { mapState } from 'vuex'
import { setCID, setUID, post, version } from '@/utils/index'
import FeesCard from '@/components/fees-card'
import InfoGrids from '@/components/info-grids'
var _self
export default {
  data () {
    return {
      version: version,
      helpTitle: null,
      items: [],
      menuShow : false,
      helpProcess: null,
      accordionActive: "grace-accordion-1",
      tabCurrentIndex: 0,
      swiperCurrentIndex: 0,
      tabHeight: 300,
      tabs: [
        { name: '运费计算' },
        { name: '运价说明' }
      ],
      titleShowId: 'tabTag-0',
      calcData: {
        length: 0,
        width: 0,
        height: 0,
        volume: 0,
        weight: 0
      },
      chargeTypes: []
    }
  },
  components: {
    gracePage,
    graceShade,
    graceDialog,
    FeesCard,
    InfoGrids
  },
  onLoad () {
    this.helpProcess = store.state.apiHost + '/static/packgo/wx/helpProcess.jpg' 
    _self = this
    setCID(this.$root.$mp.query.cid)
    setUID(this.$root.$mp.query.uid)
    console.log('CID: ' + this.CID + ' UID:' + this.uid)
  },
  onShareAppMessage: function () {
    return {
      title: '费用计算器',
      path: 'pages/fees/feesCalc?uid=' + this.userProfile.uid,
      imageUrl: '/static/images/YUN_SQ.jpg'
    }
  },
  onReady: function () {
    // 获取屏幕高度及比例
    uni.getSystemInfo({
      success: function (res) {
        var windowHeight = res.windowHeight
        // 获取头部标题高度
        var dom = uni.createSelectorQuery().select('#grace-tab-title')
        dom.fields({ size: true }, res2 => {
          if (!res2) { return }
          // 计算得出滚动区域的高度
          _self.tabHeight = windowHeight - res2.height
        }).exec()
      }
    })
  },
  onShow () {
    uni.showTabBar()
  },
  methods: {
    helpProcessFunc : function () {
			this.$refs.graceShade.showIt();
		},
		closeShade : function () {
			this.$refs.graceShade.hideIt();
		},
    showDialog1  : function(){this.$refs.graceDialog1.open();},
		closeDialog1 : function(){this.$refs.graceDialog1.hide();},
    switchMenu : function () {
			this.menuShow = !this.menuShow;
		},
		menuHide : function () {
			this.menuShow = false;
		},
    help(e) {
      switch (e){
        case 'register':
          this.helpTitle = '【小运宝典】—— 注册'
          this.items = [{icon: 'icon-friend',url: '/pages/common/about',text: '关于我们'},
                        {icon: 'icon-comments',url:'/pages/common/keyWords',text: '常用名词'},
                        {icon: 'icon-help1',url:'/pages/common/faq',text: '常见问题'},
                        {icon: 'icon-wallet',url: '/pages/fees/details',text: '运费说明'},
                        {icon: 'icon-keyboard',url:'/pages/fees/feesCalc',text: '运费计算'}]
          break
        case 'parcel':
          this.helpTitle = '【小运宝典】—— 包裹'
          this.items = [{icon: 'icon-wallet',url: '/pages/fees/details',text: '运费说明'},{icon: 'icon-keyboard',url:'/pages/fees/feesCalc',text: '运费计算'}]
          break
        case 'order':
          this.helpTitle = '【小运宝典】—— 运单'
          this.items = [{icon: 'icon-help1',url:'/pages/common/faq',text: '常见问题'},
                        {icon: 'icon-star',url:'/pages/common/keyWords',text: '常用名词'},
                        {icon: 'icon-wallet',url: '/pages/fees/details',text: '运费说明'},
                        {icon: 'icon-keyboard',url:'/pages/fees/feesCalc',text: '运费计算'}]
          break
        case 'pay':
          this.helpTitle = '【小运宝典】—— 付款'
          this.items = [{icon: 'icon-safe',url:'/pages/common/payments',text: '支付方式'},
                        {icon: 'icon-kf3',url:'/pages/common/contact',text: '联系客服'},
                        {icon: 'icon-wallet',url: '/pages/fees/details',text: '运费说明'},
                        {icon: 'icon-keyboard',url:'/pages/fees/feesCalc',text: '运费计算'}]
          break
        default:
      }
        
      this.showDialog1();
        
			},
    changeAccordion : function(e){
			var accordionIndex = e.currentTarget.id;
			if (this.accordionActive == accordionIndex){accordionIndex = '';}
			this.accordionActive = accordionIndex;
		},
    async getQuote () {
      let header = { 'Content-Type': 'application/json' }
      this.chargeTypes = null
      let resp = await post('freightorders/quote/', this.calcData, header)
      if (resp.code === 0) {
        this.chargeTypes = resp.object
      }
      console.log(this.chargeTypes)
    },
    tabChange: function (e) {
      var index = e.target.id.replace('tabTag-', '')
      this.swiperCurrentIndex = index
      this.tabCurrentIndex = index
      this.titleShowId = 'tabTag-' + index
    },
    swiperChange: function (e) {
      var index = e.detail.current
      this.tabCurrentIndex = index
      this.titleShowId = 'tabTag-' + index
    },
    volumeChange (e) {
      this.calcData.length = 0
      this.calcData.width = 0
      this.calcData.height = 0
    },
    volumeCalc (e) {
      this.calcData.volume = this.calcData.length / 100 * this.calcData.width / 100 * this.calcData.height / 100
      this.calcData.volume = parseFloat(this.calcData.volume.toFixed(3))
    }
  },
  computed: {
    ...mapState([
      'userProfile',
      'CID',
      'uid',
      'companyInfo'
    ]),
    customFile: function () {
      var tmp
      if (this.shippingMethod === 0) {
        tmp = ''
      } else if (this.shippingMethod === 1) {
        tmp = '另需单独报关费用 ' + this.prices.custom + 'NZD + ' + this.prices.custom_fees + 'NZD 海关费用'
      }

      return tmp
    },
    volWeight: function () {
      return ((this.calcData.width * this.calcData.height * this.calcData.length) / 6000).toFixed(2)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/graceUI/animate.css";
.content1{padding:25rpx; font-size:26rpx; text-align:center; line-height:60rpx;background-color:#F8F8F8; display:block;}
.demo-msg{width:500rpx; font-size:0;}
.demo-msg-in{width:500rpx; height:800rpx;}
.close-btn{width:80rpx; height:80rpx; line-height:80rpx; text-align:center; font-size:40rpx; z-index:7;}


.page {
  width: 100%;
  overflow: hidden;
  .text-input-area {
    background-color: white;
    width: 100%;
    padding: 20upx 80upx;
    flex-direction: row;
    .input-group {
      margin: 20upx 0upx;
      width: 45%;
      label {
        margin-right: 20upx;
        font-size: 1em;
      }
      input {
        width: 20%;
      }
    }
  }
}
.calc_page_header {
  padding: 20px;
  display: flex;
  align-items: center;
  img {
    height: 100rpx;
    width: 100rpx;
    display: inline-block;
  }
  h1 {
    /*display: inline-block;*/
    margin: 0;
    /*position: absolute;*/
    /*top: 50%;*/
    /*left: 220rpx;*/
  }
}
.input-area {
  margin: 0 20px;
  padding: 0;
  width: 100%;
  .ship-method-radio {
    /*float: left;*/
    width: 20%;
  }
  h1,
  label {
    font-size: 0.8em;
  }
  .volume-notice {
    font-size: 0.5em;
  }
  .text-input-area {
    /*margin-left: 150rpx;*/
    padding: 0 20px;
    width: 60%;
    border-width: 0;
    border-left-width: 1px;
    border-style: solid;
    border-left-color: #999999;
    padding-bottom: 40px;
    .flex-group {
      position: relative;
      margin: 5px 5px;
      label {
        margin: 0 5px;
        padding: 0;
        display: inline-block;
      }
      input {
        margin: 0 5px;
        padding: 2px;
        display: inline-block;
        position: absolute;
        top: 37%;
        transform: translate(-50%, -50%);
        left: 200upx;
        width: 80upx;
        border-style: dotted;
        border-width: 0;
        border-bottom-width: 1px;
      }
      p {
        display: inline-block;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 300rpx;
      }
    }
  }
  radio-group {
    width: 150rpx;
  }
  .active {
    color: $theme-color;
  }
  .spacer {
    padding: 10px;
  }
}
.result {
  padding: 20px;
  font-size: 0.8em;
  .price {
    /*font-size: 1.2em;*/
    font-weight: bold;
  }
  .disclaimer {
    font-size: 0.8em;
    font-weight: bold;
    padding-top: 10px;
  }
}
.fees-details {
  width: 100%;
  /*position: absolute;*/
  bottom: 30px;
  .links {
    text-align: center;
    color: $theme-color;
  }
}
.weui-check__label {
  font-size: 0.8em;
}
.button {
  margin: auto;
  background-color: $theme-color;
  width: 60%;
  box-shadow: 0px 4px 16px #455B6308;
  border-radius: 3px;
  text-align: center;
  color: white;
}
.fixed-bottom {
  position: absolute;
  bottom: 70upx;
  width: 100%;
}
</style>
