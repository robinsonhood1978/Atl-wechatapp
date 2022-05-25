<template>
<gracePage :customHeader="false">
  <view slot="gBody" class="grace-body">
  <view style="position: relative">
    <Login v-if="!isLogedIn"> </Login>
    <view v-else>
      <!-- <graceSpeaker :vertical="false" :interval="5000" iconClass="grace-icons icon-kf3 grace-yun" :msgs="speakerMsgs"></graceSpeaker> -->
      <!--    <scroll-view class="grace-tab-title" scroll-x="true" id="grace-tab-title" :scroll-into-view="titleShowId">-->
      <!--      <view v-for="(tab, index) in tabs" :key="index" :class="[tabCurrentIndex == index ? 'grace-tab-current' : '']" :id="'tabTag-'+index" @tap="tabChange">{{tab.name}}</view>-->
      <!--    </scroll-view>-->
      <!--    <swiper class="grace-tab-swiper-full" :current="swiperCurrentIndex" @change="swiperChange" :style="{height:tabHeight+'px'}">-->
      <!--      &lt;!&ndash; 循环新闻项目 &ndash;&gt;-->
      <!--      <swiper-item v-for="(tab, tabIndex) in tabs" :key="tabIndex">-->
      <!--        <div style="position: relative">-->
      <div style="">
        <view class="noPackage" v-if="!userProfile.is_customer">
          <h2>请注册会员获取转运地址</h2>
          <button class="button" @click="registerMember">注册会员</button>
          <view class="grace-accordion-items">
            <view class="grace-accordion-title grace-border-b" id="grace-accordion-1" @tap="changeAccordion" hover-stay-time="100" hover-class="grace-opacity">
              <text class="grace-icons icon-help3 grace-yun">用户指南 -- 使用步骤</text>
              <text class="grace-icons icon-arrow-up" v-if="accordionActive == 'grace-accordion-1'"></text>
              <text class="grace-icons icon-arrow-down" v-else></text>
            </view>
            <view :class="['grace-accordion-body', accordionActive == 'grace-accordion-1' ? 'grace-accordion-show' : 'grace-accordion-hide']" style="font-size:0;">
              <image :src="helpProcess" style="width:100%;" mode="widthFix"></image>
            </view>
          </view>
          <div style="margin-top: 50px; padding-bottom: 200upx">
          </div>
        </view>
        <view style="height: 100vh" v-else>

          <scroll-view scroll-y="true" :data-scindex="tabIndex" @scrolltolower="scrollend">
            <view style="padding-top: 5px;" />
            
            <view v-if="list.length == 0" >
              <div class="noPackage">没有运单</div>
              <addressCn></addressCn>
              <div style="margin-top: 30px">
                <InfoGrids></InfoGrids>
              </div>
              <view style="padding-bottom: 300upx"></view>
            </view>
            <view v-else>
              <OrderCardDetails
                :key="packageItem.id"
                :orderData="packageItem"
                v-for="(packageItem) in list"
              ></OrderCardDetails>
              <graceLoading :loadingType="tab.loadingType"></graceLoading>
              <view style="padding-bottom: 200upx;" />
            </view>
          </scroll-view>
        </view>
      </div>
      <!--      </swiper-item>-->
      <!--    </swiper>-->
      <div class="grace-footer fixed-bottom" v-if="userProfile.is_customer">
        <navigator url="/pages/freightorders/addOrder">
          <button class="button">新建运单</button>
        </navigator>
      </div>
    </view>
    
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
import store from '../store'
import gracePage from "@/graceUI/components/gracePage.vue";
import graceShade from "@/graceUI/components/graceShade.vue";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import { get, setCID, setUID, setSCENE, version } from '@/utils/index'
import { mapState } from 'vuex'
import Login from '@/components/login'
import addressCn from '@/components/addressCn'
import OrderCardDetails from '@/components/order-card-detail'
// import mpNavbar from 'mpvue-weui/src/navbar'
import event from '@/utils/event'
import graceLoading from '@/graceUI/components/graceLoading.vue'
import graceSpeaker from "@/graceUI/components/graceSpeaker.vue";

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
      speakerMsgs : [
				{ title: "[小白攻略] 第一步: 注册会员 (获取专属仓库地址)", url:"../index/index", opentype: "navigate"},
				{ title: "[小白攻略] 第二步: 买买买! (专属仓库地址收货)", url: "../index/index", opentype: "switchTab"},
        { title: "[小白攻略] 第三步: 完善包裹信息(填写包裹中物品明细)", url: "../index/index", opentype: "switchTab"},
        { title: "[小白攻略] 第四步: 新建运单并付款", url: "../index/index", opentype: "switchTab"},
        { title: "[小白攻略] 第五步: 运过来! (坐等收货)。", url: "../index/index", opentype: "switchTab"}
			],
      orderNeedPay: 0,
      packagesList: [],
      tempList: [],
      myparcels: [],
      companyParcels: [],
      hideHasInfo: false,
      navTab: ['待完善', '待出库', '处理中', '已出库'],
      tabCurrentIndex: 0,
      swiperCurrentIndex: 0,
      tabHeight: 300,
      tabs: [
        // 标签名称 , 分类 id , 加载更多, 加载的页码
        { name: '待完善', status: 'D', loadingType: 0, list: [], loadAll: false, needUpdate: true },
        { name: '待出库', status: 'P', loadingType: 0, list: [], loadAll: true, needUpdate: false },
        { name: '处理中', status: 'T', loadingType: 0, list: [], loadAll: true, needUpdate: false },
        { name: '已出库', status: 'H', loadingType: 0, list: [], loadAll: false, needUpdate: false }
      ],
      titleShowId: 'tabTag-0',
      needUpdate: true,

      activeIndex: 0,
      apiBase: 'freightorders/',
      menuOpen: false,
      currentApiBase: '',
      loadingType: 0,
      list: [],
      loadAll: false
    }
  },
  components: {
    gracePage,
    graceShade,
    graceDialog,
    OrderCardDetails,
    Login,
    // mpNavbar,
    addressCn,
    graceLoading,
    graceSpeaker
  },
  onLoad () {
    this.helpProcess = store.state.apiHost + '/static/packgo/wx/helpProcess.jpg' 
    _self = this
    // const scene = decodeURIComponent(this.$root.$mp.query.scene)
    setCID(this.appOptions.query.cid)
    setUID(this.appOptions.query.uid)
    setSCENE(decodeURIComponent(this.appOptions.query.scene))
    // console.log(
    //   'CID: ' +
    //     this.CID +
    //     ' UID:' +
    //     this.uid +
    //     ' Scene: ' +
    //     (this.scene !== 'undefined' ? '?' + this.scene : '')
    // )
    event.on('newOrder', this, async function (obj) {
      //console.log('new order')
      this.tabs.forEach(p => {
        p.needUpdate = true
      })
      
    })
    //console.log(this.isLogedIn)
    
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
  async onShow () {
    if (!this.userProfile.is_customer) {
      return
    }
    if (this.isLogedIn) {
      this.loadList()
    }
    let url = 'parcels/?state=P&unsent=1&count=0'
    let parcels = await get(url)
    //console.log('Order onShow:'+parcels.length)
    if(parcels.length>0){
        wx.setTabBarBadge({
          index: 0, 
          text: ''+parcels.length+'',
        })
        //console.log('Order onShow222:'+parcels.length)
      }
      else{
        wx.removeTabBarBadge({
          index: 0
        })
      }

      await this.loadUnpaidOrder();
      if(this.orderNeedPay>0){
        wx.setTabBarBadge({
          index: 1, 
          text: ''+this.orderNeedPay+'',
        })
      }
      else{
        wx.removeTabBarBadge({
          index: 1
        })
      }


    if (this.isLogedIn) {
      uni.showTabBar()
      // this.loadList()
    } else {
      uni.hideTabBar()
    }
  },
  onShareAppMessage: function () {
    return {
      title: '聚合跨境物流',
      path: 'pages/home?uid=' + this.userProfile.uid,
      imageUrl: '/static/images/YUN_SQ.jpg'
      // imageUrl:
      //   apiHost +
      //   (this.companyInfo.client_app
      //     ? this.companyInfo.client_app.forward_logo
      //       ? this.companyInfo.client_app.forward_logo
      //       : this.companyInfo.client_app.home_logo
      //         ? this.companyInfo.client_app.home_logo
      //         : this.companyInfo.logo
      //     : this.companyInfo.logo)
    }
  },
  watch: {
    userProfile () {
      //console.log('userProfile ready')
      if (this.userProfile.is_customer) {
        this.loadList()
        // this.updateInfo()
      }
    },
    isLogedIn () {
      if (this.isLogedIn) {
        uni.showTabBar()
      } else {
        uni.hideTabBar()
      }
    }
  },
  computed: {
    ...mapState([
      'isLogedIn',
      'userProfile',
      'CID',
      'uid',
      'scene',
      'companyInfo',
      'appOptions'
    ]),
    totalVolume () {
      let sum = 0
      this.list.forEach(p => {
        // let volume = (parseInt(p.volume * 100) / 100 !== p.volume) ? parseInt(p.volume * 100) / 100 + 0.01 : (p.volume * 100 / 100)
        sum = sum + p.volume
      })
      sum += 0.00099
      return sum.toFixed(3)
    },
    totalWeight () {
      let sum = 0
      this.list.forEach(p => {
        sum = sum + p.weight
      })
      return sum.toFixed(2)
    },
    totalVolumeWeight () {
      return (parseInt((this.totalVolume / 0.006) * 10) / 10 + 0.01).toFixed(1)
    },
    totalValue () {
      let sum = 0
      this.list.forEach(p => {
        sum = sum + p.total
      })
      return sum.toFixed(2)
    }
  },
  async onPullDownRefresh () {
    if (this.isLogedIn) {
      await this.loadList(true)
    }
    uni.stopPullDownRefresh()
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
    registerMember(e) {
      //console.log('userProfile:',this.userProfile)
      let p = null
      wx.showModal({
        title: '提示',
        confirmText: "注册",
        content: '微信用户昵称是会员的重要身份标识，客服据此为您提供后续一系列服务。',
        success: async function (res) {
          if (res.confirm) {
            //console.log('点击确定了 ')
            wx.getUserProfile({
              desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
              success: (res,post) => {
                //console.log('userProfile:',this.userProfile)
                store.commit('NEW_USER_INFO', res.userInfo)
                let url = '/pages/weblogin?tab=0'
                wx.navigateTo({ url })
              }
            })
            
          } else if (res.cancel) {
            //console.log('点击取消了')
            return false
          }
        }
      })
    },
    async scrollend (e) {
      // 获取是哪个选项滚动到底？
      // var index = e.currentTarget.dataset.scindex
      // console.log(index)
      // // 可以利用 tabs 携带的分类id 与服务器交互请求对应分类的数据
      // console.log(this.tabs[index].id)
      if (this.loadAll) {
        this.loadingType = 2
        return
      }
      // 加载更多的演示
      // 判断当前是否正在加载
      if (this.loadingType === 1) {
        return false
      }
      this.loadingType = 1
      var list
      if (this.list.length === 0) {
        let apiUrl = this.apiBase +
            (this.loadAll ? 'count=-1' : ('start=' + this.list.length))
        list = await get(apiUrl)
      }

      // 判断是否是最后一页
      if (list.length === 0) {
        this.loadingType = 2// 全部
        return
      }
      this.list.concat(list)
      this.loadingType = 0
    },
    tabChange: function (e) {
      var index = e.target.id.replace('tabTag-', '')
      this.swiperCurrentIndex = index
      this.tabCurrentIndex = index
      this.titleShowId = 'tabTag-' + index
      // this.loadList()
    },
    swiperChange: function (e) {
      var index = e.detail.current
      this.tabCurrentIndex = index
      this.titleShowId = 'tabTag-' + index
      // this.loadList()
    },
    async loadList (force = false) {
      if (!this.userProfile.is_customer) {
        return
      }
      wx.showLoading({ title: '加载中...' })
      if (this.needUpdate || force) {
        let apiUrl = this.apiBase + '?count=10'
        let tmpList = await get(apiUrl)
        // this.list = this.tabFilter(tmpList, this.tabCurrentIndex)
        this.list = tmpList
        if (this.list.length === 0 || this.loadAll) {
          this.loadingType = 2
        }
        this.needUpdate = false
      }
      wx.hideLoading()
    },
    async loadUnpaidOrder(){
      if (!this.userProfile.is_customer) {
        return
      }
      let url = 'freightorders/?count=0'
      let orders = await get(url)
      this.list = orders
      this.orderNeedPay = 0
      orders.forEach(p => {
        if(!p.paid){
          this.orderNeedPay++
        }
      })
    },
    tabFilter (list, tabIndex) {
      switch (tabIndex) {
        // case 0:
        //   return list.filter(p => p.total === 0)
        // case 1:
        //   return list.filter(
        //     p => p.total !== 0 && p.dform === null
        //   )
        // case 2:
        //   return list.filter(p => p.dform !== null)
        default:
          return list
      }
    },
    updateInfo () {
      let url = '/pages/weblogin?tab=0'
      uni.navigateTo({ url })
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/graceUI/animate.css";
.content1{padding:25rpx; font-size:26rpx; text-align:center; line-height:60rpx;background-color:#F8F8F8; display:block;}
.demo-msg{width:500rpx; font-size:0;}
.demo-msg-in{width:500rpx; height:800rpx;}
.close-btn{width:80rpx; height:80rpx; line-height:80rpx; text-align:center; font-size:40rpx; z-index:7;}

  .adminbar {
    margin: 5px 5px 0px;
    text-align: end;
    font-size: 0.7em;
    font-weight: bold;
  }
  .fixed-bottom {
    bottom: 60upx;
    width: 85%;
    background: #00000000;
    box-shadow: unset;
    height: 100px;
  }
  .noPackage {
    text-align: center;
    margin: 50upx;
  }
  .button {
    margin: auto;
    background-color: $theme-color;
    width: 80%;
    box-shadow: 0px 4px 16px #455B6308;
    border-radius: 3px;
    text-align: center;
    color: white;
    margin-top: 50upx;
  }
</style>
