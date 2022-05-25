<template>
<gracePage :customHeader="false">
  <view slot="gBody" class="grace-body">
  <view>
    <Login v-if="!isLogedIn"> </Login>
    <view v-else>
      <!-- <graceSpeaker :vertical="false" :interval="5000" iconClass="grace-icons icon-kf3 grace-yun" :msgs="speakerMsgs"></graceSpeaker> -->
<!--      <scroll-view class="grace-tab-title" scroll-x="true" id="grace-tab-title" :scroll-into-view="titleShowId">-->
<!--        <view v-for="(tab, index) in tabs" :key="index" :class="[tabCurrentIndex == index ? 'grace-tab-current' : '']" :id="'tabTag-'+index" @tap="tabChange">{{tab.name}}</view>-->
<!--      </scroll-view>-->
<!--    <graceNavBar :items="navTab" :currentIndex="tabCurrentIndex" @change="tabChange"></graceNavBar>-->
      <view v-if="false" style="padding:25rpx 50rpx; background:#F5F6F7">
				<graceSearch @inputting="inputting" @confirm="confirm" @focus="focus" placeholder="包裹快递单号" :kwd="searchKey"></graceSearch>
			</view>
      <graceNavBar :items="navTab"
                   lineHeight="100rpx" :isCenter="true"
                   :currentIndex="tabCurrentIndex" :size="120" padding="20rpx"
                   :activeLineBg="primaryColor" textAlign="center"
                   :activeColor="primaryColor" activeLineWidth="100%" activeLineHeight="3px"
                   @change="tabChange"></graceNavBar>
      <swiper class="grace-tab-swiper-full has-fix-top" :current="swiperCurrentIndex" @change="swiperChange" :style="{height:tabHeight+'px'}">
          <!-- 循环新闻项目 -->
        <swiper-item v-for="(tab, tabIndex) in tabs" :key="tabIndex">
          <div style="position: relative;text-align:center;">
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
                <InfoGrids></InfoGrids>
              </div>

              
              
            </view>
            
            <!-- <view style="height: 100vh" v-else> -->

              <scroll-view scroll-y="true" :data-scindex="tabIndex" @scrolltolower="scrollend" v-else style="height: 100vh">
                <view style="padding-top: 5px;" />
                <view v-if="tab.list.length == 0" >
                  <div class="noPackage">没有包裹!</div>
                  <addressCn></addressCn>
                  <div style="margin-top: 30px">
                    <InfoGrids></InfoGrids>
                  </div>
                  <view style="padding-bottom: 300upx"></view>
                </view>
                <view v-else>
                  <PackageCardDetails
                    :key="packageItem.id"
                    :packageData="packageItem"
                    v-for="(packageItem) in tab.list"
                  ></PackageCardDetails>
                  <graceLoading :loadingType="tab.loadingType"></graceLoading>
                </view>
              </scroll-view>
            <!-- </view> -->
          </div>
        </swiper-item>
      </swiper>
      <div class="grace-footer fixed-bottom" v-if="userProfile.is_customer && tabCurrentIndex == 1">
        <navigator url="/pages/freightorders/addOrder">
          <button class="button">新建运单,申请出库</button>
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

    <mp-modal ref="clipboardModal" title="确认复制剪切板信息" content="是否粘贴剪切板内容?" :showCancel="true" @confirm="confirmPaste" ></mp-modal>

    
	</gracePage>
</template>

<script>
import store from '../store'
import gracePage from "@/graceUI/components/gracePage.vue";
import graceSearch from "@/graceUI/components/graceSearch.vue";
import graceShade from "@/graceUI/components/graceShade.vue";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import { get, setCID, showSuccess, setUID, setSCENE, primaryColor, version } from '@/utils/index'
import { mapState } from 'vuex'
import Login from '@/components/login'
import addressCn from '@/components/addressCn'
import PackageCardDetails from '@/components/package-card-detail'
import graceNavBar from '@/graceUI/components/graceNavBar.vue'
// import mpNavbar from 'mpvue-weui/src/navbar'
import InfoGrids from '@/components/info-grids'
import event from '@/utils/event'
import graceLoading from '@/graceUI/components/graceLoading.vue'
import graceSpeaker from "@/graceUI/components/graceSpeaker.vue";
import graceImg from "@/graceUI/components/graceImg.vue";
import mpModal from 'mpvue-weui/src/modal'
var _self
export default {
  data () {
    return {
      version: version,
      primaryColor: '#BE1416',
      searchKey: '',
      loadingType : 0,
	    //您可以通过属性修改修改加载过程的文本
      loadingText:['加载更多...','Loading ......','已加载全部 （:', ''],
      helpTitle: null,
      items: [],
      menuShow : false,
      accordionActive: "grace-accordion-1",
      speakerMsgs : [
				{ title: "[小白攻略] 第一步: 注册会员 (获取专属仓库地址)", url:"../index/index", opentype: "navigate"},
				{ title: "[小白攻略] 第二步: 买买买! (专属仓库地址收货)", url: "../index/index", opentype: "switchTab"},
        { title: "[小白攻略] 第三步: 完善包裹信息 (填写包裹物品明细)", url: "../index/index", opentype: "switchTab"},
        { title: "[小白攻略] 第四步: 新建运单并付款", url: "../index/index", opentype: "switchTab"},
        { title: "[小白攻略] 第五步: 运过来! (坐等收货)。", url: "../index/index", opentype: "switchTab"}
			],
      parcelNeedDeal: 0,
      orderNeedPay: 0,
      packagesList: [],
      tempList: [],
      myparcels: [],
      companyParcels: [],
      hideHasInfo: false,
      navTab: ['待完善', '待出库', '处理中', '已出库'],
      tabCurrentIndex: 0,
      swiperCurrentIndex: 0,
      tabHeight: 798,
      tabs: [
        // 标签名称 , 分类 id , 加载更多, 加载的页码
        { title: '待完善', status: 'P&filed=0&unsent=1', loadingType: 0, list: [], loadAll: false, needUpdate: true },
        { title: '待出库', status: 'P&filed=1&unsent=1', loadingType: 0, list: [], loadAll: false, needUpdate: true },
        { title: '处理中', status: 'P&unsent=0', loadingType: 0, list: [], loadAll: false, needUpdate: true },
        { title: '运输中', status: 'T', loadingType: 0, list: [], loadAll: false, needUpdate: true }
      ],
      titleShowId: 'tabTag-0',
      needUpdate: false,

      activeIndex: 0,
      apiBase: 'parcels/',
      menuOpen: false,
      currentApiBase: '',
      helpProcess: null
    }
  },
  components: {
    mpModal,
    gracePage,
    graceSearch,
    graceShade,
    graceDialog,
    PackageCardDetails,
    Login,
    // mpNavbar,
    addressCn,
    InfoGrids,
    graceLoading,
    graceNavBar,
    graceSpeaker,
    graceImg
  },
  onReady(){
    
  },
  onLoad () {
    this.primaryColor = primaryColor
    //console.log(primaryColor)
     this.helpProcess = store.state.apiHost + '/static/packgo/wx/helpProcess.jpg' 
    _self = this
    // const scene = decodeURIComponent(this.$root.$mp.query.scene)
    setCID(this.appOptions.query.cid)
    setUID(this.appOptions.query.uid)
    setSCENE(decodeURIComponent(this.appOptions.query.scene))
    
    event.on('totalChanged', this, function (obj) {
      this.tabs.forEach(p => { p.needUpdate = true })
      this.loadList()
    })
    event.on('newOrder', this, function (obj) {
      this.tabs.forEach(p => {
        p.needUpdate = true
        this.loadList()
      })
    })
    if (this.isLogedIn) {
      this.loadList()
    }
  },

  async onShow () {
    wx.getClipboardData({
      success (res) {
        // console.log('robin:', res.data) // data
        store.commit('CLIPBOARD_INFO', res.data)
        // showSuccess("内容已粘贴")
      }
    })
    this.loadUnpaidOrder();
      if(this.parcelNeedDeal>0){
        wx.setTabBarBadge({
          index: 0, 
          text: ''+this.parcelNeedDeal+'',
        })
      }
      else{
        wx.removeTabBarBadge({
          index: 0
        })
      }

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
    userProfile: function () {
      if (this.userProfile.is_customer) {
        this.loadList()
        // this.updateInfo()
      }
    },
    parcelNeedDeal: function(){
      if(this.parcelNeedDeal>0){
        wx.setTabBarBadge({
          index: 0, 
          text: ''+this.parcelNeedDeal+'',
        })
      }
      else{
        wx.removeTabBarBadge({
          index: 0
        })
      }
    },
    orderNeedPay: function(){
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
    },
    tabs: {
        async handler(newVal,oldVal){
            if(this.tabs[1].needUpdate){
              await this.loadList(false,1)
            }
            //console.log('this.tabs[0].list.length:'+this.tabs[0].list.length)
            if(this.tabs[0].list.length===0 && !this.tabs[0].needUpdate){
                if(this.tabs[1].list.length===0){
                  wx.switchTab({ url:'order' })
                }
                else if(this.swiperCurrentIndex==0){
                  this.swiperCurrentIndex = 1
                  this.tabCurrentIndex = 1
                  this.titleShowId = 'tabTag-' + 1
                }
            }
            this.parcelNeedDeal = this.tabs[0].list.length + this.tabs[1].list.length; 
        },
        deep:true
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
      'clipboardInfo',
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
      this.tabs[this.tabCurrentIndex].list.forEach(p => {
        // let volume = (parseInt(p.volume * 100) / 100 !== p.volume) ? parseInt(p.volume * 100) / 100 + 0.01 : (p.volume * 100 / 100)
        sum = sum + p.volume
      })
      sum += 0.00099
      return sum.toFixed(3)
    },
    totalWeight () {
      let sum = 0
      this.tabs[this.tabCurrentIndex].list.forEach(p => {
        sum = sum + p.weight
      })
      return sum.toFixed(2)
    },
    totalVolumeWeight () {
      return (parseInt((this.totalVolume / 0.006) * 10) / 10 + 0.01).toFixed(1)
    },
    totalValue () {
      let sum = 0
      this.tabs[this.tabCurrentIndex].list.forEach(p => {
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
    confirmPaste(){
      this.searchKey = this.clipboardInfo
    },
    focus : function(e){
			console.log('focus:',e)
      console.log('clipboard:',this.clipboardInfo.trim())
      if(e=='' && this.clipboardInfo.trim()!=''){
        this.$refs.clipboardModal.show()
      }
		},
    inputting : function(e){
			console.log('input:',e);
		},
		confirm : function (e) {
			console.log('confirm:',e);
      if(e!=''){
        let url = '/pages/packages/searchParcel?key='+e
        uni.navigateTo({ url })
      }
      else{
        showSuccess("请输入快递单号")
      }

		},
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
      var index = e.currentTarget.dataset.scindex
      //console.log(index)
      // 可以利用 tabs 携带的分类id 与服务器交互请求对应分类的数据
      // console.log(this.tabs[index].name)
      if (this.tabs[index].loadAll) {
        this.tabs[index].loadingType = 2
        return
      }
      // 加载更多的演示
      // 判断当前是否正在加载
      if (this.tabs[index].loadingType === 1 || this.tabs[index].loadingType === 2) {
        return false
      }
      this.tabs[index].loadingType = 1
      // if (this.tabs[index].list.length === 0) {
      let apiUrl = 'parcels/?state=' + this.tabs[index].status +
        (this.tabs[this.tabCurrentIndex].loadAll ? '&count=-1' : ('&start=' + this.tabs[index].list.length))
      let list = await get(apiUrl)
      // } else {
      //   let apiUrl = 'parcels/?state=' + this.tabs[index].status +
      //     (this.tabs[this.tabCurrentIndex].loadAll ? '&count=10' : ('&start=' + this.tabs[index].list.length))
      //   list = await get(apiUrl)
      // }

      // 判断是否是最后一页
      if (list.length === 0) {
        this.tabs[index].loadingType = 2// 全部
        return
      }
      this.tabs[index].list = this.tabs[index].list.concat(list)
      //console.log(this.tabs[index].list)
      this.tabs[index].loadingType = 0
    },
    tabChange: function (index) {
      //console.log('tabChange')
      this.swiperCurrentIndex = index
      this.tabCurrentIndex = index
      this.titleShowId = 'tabTag-' + index
      // this.loadList()
    },
    swiperChange: function (e) {
      //console.log('swiperChange')
      var index = e.detail.current
      this.tabCurrentIndex = index
      this.titleShowId = 'tabTag-' + index
      this.loadList()
    },
    async loadList (force = false, tab = this.tabCurrentIndex) {
      if (!this.userProfile.is_customer) {
        return
      }
      //jumpFlag(tab,this.tabs[tab].list)
      wx.showLoading({ title: '加载中...', mask: true })
      // if (this.tabs[this.tabCurrentIndex].list.length === 0 || this.tabs[this.tabCurrentIndex].needUpdate || force) {
      if (this.tabs[tab].needUpdate || force) {
        let apiUrl = 'parcels/?state=' + this.tabs[tab].status +
          (this.tabs[tab].loadAll ? '&count=-1' : '&count=10')
        let tmpList = await get(apiUrl)
        this.tabs[tab].loadingType = 0
        // this.tabs[this.tabCurrentIndex].list = this.tabFilter(tmpList, this.tabCurrentIndex)
        this.tabs[tab].list = tmpList
        if (this.tabs[tab].list.length === 0 || this.tabs[tab].loadAll) {
          this.tabs[tab].loadingType = 2
        }
        this.tabs[tab].needUpdate = false
      }
      this.loadUnpaidOrder();
      
      
      wx.hideLoading()
      
    },
    async loadUnpaidOrder(){
      if(this.userProfile?.is_customer){
        let url = 'freightorders/?count=0'
        let orders = await get(url)
        this.orderNeedPay = 0
        orders.forEach(p => {
          if(!p.paid){
            this.orderNeedPay++
          }
        })
      }
    },
    tabFilter (list, tabIndex) {
      switch (tabIndex) {
        case 0:
          return list.filter(p => p.total === 0 && p.dform === null)
        case 1:
          return list.filter(
            p => p.total !== 0 && p.dform === null
          )
        case 2:
          return list.filter(p => p.dform !== null)
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
  .has-fix-top {
    margin-top: 100upx;
  }
</style>
