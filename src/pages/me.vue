<template>
<gracePage :customHeader="false">
		<!-- 页面主体 -->
  <view slot="gBody" class="grace-body">
<!--    <Login v-if="!isLogedIn"> </Login>-->
<!--    <view v-else class="grace-margin">-->
      <!-- <graceSpeaker :vertical="false" :interval="5000" iconClass="grace-icons icon-kf3 grace-yun" :msgs="speakerMsgs"></graceSpeaker> -->
      <view class="grace-margin" style="margin-top: 15px">
<!--      <view class="grace-h3" style="margin-top:15px;">-->
<!--        个人中心-->
<!--      </view>-->
      <view class="grace-list" style="margin-top:3px;">
        <view class="grace-list-items">
<!--          <view class="icons ucenter-face">-->
<!--            <image  class="ucenter-face-image" :src="userInfo.avatarUrl"  mode="widthFix"></image>-->
<!--          </view>-->
          <view class="grace-list-image ucenter-face grace-relative">
            <image class="grace-list-image ucenter-face-image" :src="userInfo.avatarUrl" mode="widthFix"></image>
          </view>
          <view class="grace-list-body">
            
            <view class="title"><span>{{userInfo.nickName?userInfo.nickName:"未注册"}} 
              <view v-if="userInfo.nickName=='微信用户' && userProfile.is_customer" class="grace-tags-large grace-tbr-large badge" @click="getAvatar">完善信息</view>
              <view v-if="userInfo.nickName && userProfile.is_customer" class="grace-tags-large grace-tbr-large badge" @tap="showMenu">钱包金额: ${{ wallet }}</view>
              <view v-if="userProfile.is_staff" class="admin">ADMIN</view> </span></view>
            <view class="grace-relative">
                <gracePopupMenu @hideMenu="hideMenu" ref="gracePopupMenu">
                  <view>
                      <graceBorderRadius style="margin:10rpx" background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                        <text class="demo2 grace-white">联系客服充值</text>
                      </graceBorderRadius>
                      <button class="grace-grids-items items no-style"
                              v-if="companyInfo.show_customer_support"
                              send-message-title="常见问题"
                              show-message-card="true"
                              bindcontact='contactCallback'
                              :session-from='session_str'
                              open-type='contact'>
                        <view class="grace-grids-icon">
                          <text class="yunicon icon-support yunicon-large"></text>
                        </view>
                        <view class="text">联系客服</view>
                      </button>
                      <navigator v-else class="grace-grids-items items" url="/pages/common/contact">
                        <view class="grace-grids-icon">
                          <text class="yunicon icon-support yunicon-large"></text>
                        </view>
                        <view class="text">联系客服</view>
                      </navigator>
                  </view>
                </gracePopupMenu>
              </view>
            
            <view v-if="userProfile.is_customer" class="desc">  会员号: {{ userProfile.customer.applicant_number?userProfile.customer.applicant_number:"请注册会员获取"}} </view>
            <view v-else class="grace-tags-large grace-tbr-large badge" @click="registerMember">请完善信息完成注册</view>
            <!-- <view v-if="userInfo.nickName && userProfile.is_customer" class="demo-wrap2">
              <graceBorderRadius background="#AB0009" :radius="['0','33rpx','0','33rpx']">
                <text class="demo2 grace-white">钱包金额: ${{ wallet }}</text>
              </graceBorderRadius>
            </view> -->
          </view>
        </view>
      </view>
      <InfoLinks v-if="version == 'pcl'"/>
      <view v-if="version == 'atl'" class="grace-grids demoForIcon  grids-border-wrap grace-margin-top">
        <navigator class="grace-grids-items items" url="/pages/common/about">
          <view class="grace-grids-icon">
            <text class="yunicon icon-yun yun-icon-logo"></text>
          </view>
          <view class="grace-grids-text">关于我们</view>
        </navigator>
        <navigator class="grace-grids-items items"  url="/pages/fees/details">
          <view class="grace-grids-icon">
            <text class="yunicon icon-dollar yunicon-large"></text>
          </view>
          <view class="text">运费说明</view>
        </navigator>
        <navigator class="grace-grids-items items" url="/pages/common/faq">
          <view class="grace-grids-icon">
            <text class="yunicon icon-faq yunicon-large"></text>
          </view>
          <view class="text">常见问题</view>
        </navigator>
        <navigator class="grace-grids-items items" url="/pages/common/keyWords">
          <view class="grace-grids-icon">
            <text class="yunicon icon-terms-round yunicon-large"></text>
          </view>
          <view class="text">常用名词</view>
        </navigator>
<!--        <navigator class="grace-grids-items items" url="/pages/common/onePrice">-->
        <navigator class="grace-grids-items items" url="/pages/common/vouchers">
          <view class="grace-grids-icon">
            <text class="grace-icons icon-wallet  yunicon-large"></text>
          </view>
          <view class="text">卡券</view>
        </navigator>
        <navigator class="grace-grids-items items"  url="/pages/common/payments">
          <view class="grace-grids-icon">
            <text class="yunicon icon-pay yunicon-large"></text>
          </view>
          <view class="text">支付方式</view>
        </navigator>
        <navigator class="grace-grids-items items" open-type="switchTab" url="/pages/fees/feesCalc">
          <view class="grace-grids-icon">
            <text class="yunicon icon-calc yunicon-large"></text>
          </view>
          <view class="text">运费计算</view>
        </navigator>
        <button class="grace-grids-items items no-style"
                v-if="companyInfo.show_customer_support"
                send-message-title="常见问题"
                show-message-card="true"
                bindcontact='contactCallback'
                :session-from='session_str'
                open-type='contact'>
          <view class="grace-grids-icon">
            <text class="yunicon icon-support yunicon-large"></text>
          </view>
          <view class="text">联系客服</view>
        </button>
        <navigator v-else class="grace-grids-items items" url="/pages/common/contact">
          <view class="grace-grids-icon">
            <text class="yunicon icon-support yunicon-large"></text>
          </view>
          <view class="text">联系客服</view>
        </navigator>
      </view>
      <!-- <view style="margin-top: 15px">
        <view class="grace-list"  v-if="!userProfile.is_web_account">
          <navigator v-if="isLogedIn" class="grace-list-items" url="/pages/weblogin?tab=1" >
            <view class="grace-list-icon grace-icons icon-friend grace-blue"></view>
            <view class="grace-list-body">
              <view class="title">绑定网站账户</view>
            </view>
            <view class="grace-list-arrow-right grace-icons icon-arrow-right"></view>
          </navigator>
        </view>
        <view class="grace-list"  v-else>
          <navigator v-if="isLogedIn" class="grace-list-items" @click='weblogout' >
            <view class="grace-list-icon grace-icons icon-friend grace-blue"></view>
            <view class="grace-list-body">
              <view class="title">退出网站账户</view>
            </view>
            <view class="grace-list-arrow-right grace-icons icon-arrow-right"></view>
          </navigator>
        </view>
      </view> -->
      <view style="margin-top: 15px">
        <view class="grace-list"  v-if="!userProfile.is_customer">
          <div v-if="isLogedIn" class="grace-list-items">
            <view class="grace-list-icon grace-icons icon-friend grace-yun"></view>
            <view class="grace-list-body" @click="registerMember">
              <view class="title">完善信息完成注册 获取集运地址</view>
            </view>
            <view class="grace-list-arrow-right grace-icons icon-arrow-right"></view>
          </div>
          <navigator v-if="!isLogedIn" class="grace-list-items" >
            <button   class="authbutton" open-type="getUserInfo" @getuserinfo="bindgetuserinfo">开始 <view class="icon yunicon icon-yun logo" style="display: inline-block"/></button>
          </navigator>
        </view>
        <view class="grace-list"  v-else>
<!--          <view @click="shomessage">-->
<!--            <view class="icons grace-icons icon-user grace-red"></view>-->
<!--            <view class="body">-->
<!--              <view class="title">个人信息管理</view>-->
<!--            </view>-->
<!--            <view class="arrow-right"></view>-->
<!--          </view>-->
          <view class="grace-list-items">
            <text class="grace-list-icon grace-icons icon-user main-color"></text>
            <view class="grace-list-body">
              <view class="grace-list-title" @click="updatePersonalInfo">个人信息管理</view>
            </view>
            <view class="grace-list-arrow-right grace-icons icon-arrow-right" @click="updatePersonalInfo"></view>
          </view>
          <view class="ucenter-line"></view>
          <navigator class="grace-list-items"  url="/pages/tickets">
            <view class="grace-list-icon grace-icons icon-tel main-color"></view>
            <view class="grace-list-body">
              <view class="title">问题追踪</view>
            </view>
            <view class="grace-list-arrow-right grace-icons icon-arrow-right"></view>
          </navigator>
          <view class="ucenter-line"></view>
          <navigator class="grace-list-items"  url="/pages/common/address">
            <view class="grace-list-icon grace-icons icon-address main-color"></view>
            <view class="grace-list-body">
              <view class="title">收件人地址管理</view>
            </view>
            <view class="grace-list-arrow-right grace-icons icon-arrow-right"></view>
          </navigator>
          <view class="ucenter-line"></view>
          <!--          <navigator class="items"  url="/pages/common/senderAddress">-->
          <navigator class="grace-list-items"  url="/pages/common/address?is_sender=true">
            <view class="grace-list-icon grace-icons icon-address main-color"></view>
            <view class="grace-list-body">
              <view class="title">发件人地址管理</view>
            </view>
            <view class="grace-list-arrow-right grace-icons icon-arrow-right"></view>
          </navigator>
          <view class="ucenter-line"></view>
        </view>
      </view>
      <view class="grace-margin-top" style="background: white; padding-top: 20upx; padding-bottom: 20upx">
        <addressCn></addressCn>
        <navigator class="terms" url="/pages/common/terms">《客户服务条款》</navigator>
      </view>

    <mp-modal ref="mpModal" title="解除绑定" content="是否确认解绑网站用户？" :showCancel="true" @confirm="confirm" @cancel="cancel"></mp-modal>

    </view>
    <graceShade @closeShade="closeShade" ref="graceShade">
				<view class="demo-msg grace-relative" @tap.stop="">
					<view class="demo-msg-in">
            <image :src="picHelpProcess" style="width:100%;" mode="widthFix"></image>
					</view>
					<view class="close-btn grace-icons icon-close3 grace-white grace-absolute-rt" @tap.stop="closeShade"></view>
				</view>
			</graceShade>
      <graceDialog ref="graceDialogVersion" title="版本号" :isBtns="false" v-on:closeDialog="closeVersion">
        <view class="content1" slot="content">
          <text>1.0.0</text>
        </view>
      </graceDialog>
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
        <text class="grace-pop-item grace-bg-red" style="font-size:28rpx;" @tap="helpProcess">流程</text>
				<text class="grace-pop-item grace-bg-blue-sky" style="font-size:28rpx;" @tap="help('register')">注册</text>
				<text class="grace-pop-item grace-bg-yellow" style="font-size:28rpx;" @tap="help('parcel')">包裹</text>
				<text class="grace-pop-item grace-bg-light-blue" style="font-size:28rpx;" @tap="help('order')">运单</text>
        <text class="grace-pop-item grace-bg-green" style="font-size:28rpx;" @tap="help('pay')">付款</text>
        <text class="grace-pop-item grace-bg-yun" style="font-size:28rpx;" @tap="showVersion">版本</text>
			</view>
			<!-- 主按钮 -->
			<text class="grace-pop-item grace-icons icon-help2 grace-bg-yun" @tap="switchMenu"></text>
		</view>
    
	</gracePage>
</template>

<script>
import gracePopupMenu from "@/graceUI/components/gracePopupMenu.vue";
import gracePage from "@/graceUI/components/gracePage.vue";
import graceBorderRadius from "@/graceUI/components/graceBorderRadius.vue";
import graceShade from "@/graceUI/components/graceShade.vue";
import store from '../store'
import { mapState } from 'vuex'
// import Login from '@/components/login'
import mpModal from 'mpvue-weui/src/modal'
import { get, appid, login, showSuccess, post, getUserProfile, version, versionName} from '@/utils/index'
import addressCn from '@/components/addressCn'
import graceSpeaker from "@/graceUI/components/graceSpeaker.vue";
import graceImg from "@/graceUI/components/graceImg.vue";
import graceDialog from '@/graceUI/components/graceDialog.vue';
import InfoLinks from '@/components/info-links'

export default {
  components: {
    // Login,
    gracePopupMenu,
    graceBorderRadius,
    graceDialog,
    mpModal,
    addressCn,
    graceSpeaker,
    gracePage,
    graceShade,
    graceImg,
    InfoLinks
  },
  data() {
		return {
      version: version,
      helpTitle: null,
      items: [],
      menuShow : false,
      picHelpProcess : null,
			speakerMsgs : [
				{ title: "[小白攻略] 第一步: 注册会员 (获取专属仓库地址)", url:"", opentype: "switchTab"},
				{ title: "[小白攻略] 第二步: 买买买! (专属仓库地址收货)", url: "", opentype: "switchTab"},
        { title: "[小白攻略] 第三步: 完善包裹信息 (填写包裹中物品明细)", url: "/pages/home", opentype: "navigate"},
        { title: "[小白攻略] 第四步: 新建运单并付款", url: "/pages/order", opentype: "navigate"},
        { title: "[小白攻略] 第五步: 运过来! (坐等收货)。", url: "", opentype: "switchTab"}
			]
		}
	},
  computed: {
    ...mapState([
      'userInfo',
      'isLogedIn',
      'userProfile',
      'CID',
      'companyInfo'
    ]),
    wallet() {
      return (this.userProfile.customer.gold + this.userProfile.customer.silver).toFixed(2)
    },
    data () {
      return {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        gridData: [
          { src: '/static/icons/home.png', name: 'Home', url: '/pages/button/main' },
          { src: '/static/icons/calc.png', name: 'Button', url: '/pages/button/main' },
          { src: '/static/icons/calc.png', name: 'Calc', url: '/pages/button/main' }
        ],
        icons: [
          'wifi', 'face', 'address', 'tel', 'voice', 'photograph', 'microphone', 'keyboard',
          'share', 'share2', 'share3', 'share', 'shoppingcard', 'position', 'safe', 'eye',
          'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'time', 'time2', 'home', 'back',
          'star', 'zan', 'comments', 'write', 'weibo', 'weixin', 'qq', 'remove',
          'search', 'close', 'close2', 'close3', 'refresh', 'loading', 'shoucang', 'boy', 'girl'
        ]
      }
    },
    session_str () {
      if (this.isLogedIn && this.userProfile && this.userProfile.is_customer) {
        return '{"nickName":"' + this.userInfo?.nickName + '-' + this.userProfile.customer.applicant_number + '","avatarUrl":"' + this.userInfo?.avatarUrl + '"}'
      } else {
        return '{"nickName":"' + this.userInfo?.nickName + '","avatarUrl":"' + this.userInfo?.avatarUrl + '"}'
      }
    },
    display_address () {
      if (this.userProfile.customer && this.userProfile.customer.address_cn) {
        return this.userProfile.customer.address_cn.split('，')
      }
      return []
    }
  },
  watch: {
    async userInfo(newValue, oldValue) {
      //console.log('new:',newValue)
      let data = {}
      data.nick_name = newValue.nickName
      data.avatar = newValue.avatarUrl
      let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
      let resp = await post('packgo/profile/',data,header)
      if (resp.code !== 0) {
        showFail(resp.message)
      } else {
        showSuccess('您的用户信息已完善')
      }
    },
  },
  onShow () {
    console.log('versionName', versionName)
    uni.showTabBar()
    this.picHelpProcess = store.state.apiHost + '/static/packgo/wx/helpProcess.jpg' 
    getUserProfile()
    // if (this.isLogedIn) {
    //   uni.showTabBar()
    // } else {
    //   uni.hideTabBar()
    // }
  },
  methods: {
    showMenu : function(){
			this.$refs.gracePopupMenu.open();
		},
		hideMenu : function(){
			this.$refs.gracePopupMenu.hide();
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
      console.log('type:',e)
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
          this.items = [{icon: 'icon-wallet',url: '/pages/fees/details',text: '运费说明'},
                        {icon: 'icon-keyboard',url:'/pages/fees/feesCalc',text: '运费计算'}]
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
          console.log(111)
      }
        
      this.showDialog1();
				// uni.showModal({
				// 	title: '运过来宝典',
				// 	content: `您选中了`,
				// 	success: function(res) {
				// 		if (res.confirm) {
				// 			console.log('用户点击确定')
				// 		} else if (res.cancel) {
				// 			console.log('用户点击取消')
				// 		}
				// 	}
				// })
        
			},
    updatePersonalInfo(e) {
      //console.log('userInfo:',this.userInfo)
      if(this.userInfo.nickName=='微信用户' && this.userProfile.is_customer){
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
                  let url = '/pages/weblogin?tab=0&update=true'
                  wx.navigateTo({ url })
                }
              })
              
            } else if (res.cancel) {
              //console.log('点击取消了')
              return false
            }
          }
        })
      }
      else{
        store.commit('NEW_USER_INFO', this.userInfo)
        let url = '/pages/weblogin?tab=0&update=true'
        wx.navigateTo({ url })
      }
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
    getAvatar(e) {
      //console.log('userProfile:',this.userProfile)
      let p = null
      wx.showModal({
        title: '提示',
        confirmText: "继续",
        content: '微信用户昵称是会员的重要身份标识，便于客服为您提供后续一系列服务。这部分信息缺失会为您带来不必要的困扰。',
        success: async function (res) {
          if (res.confirm) {
            //console.log('点击确定了 ')
            wx.getUserProfile({
              desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
              success: (res,post) => {
                //console.log('userProfile:',this.userProfile)
                store.commit('USER_INFO', res.userInfo)
                //console.log('state.userInfo:',store.state.userInfo)
              }
            })
            
          } else if (res.cancel) {
            //console.log('点击取消了')
            return false
          }
        }
      })
    },
    bindgetuserinfo (e) {
      //console.log(e)
      this.userInfo = e.mp.detail.userInfo
      this.getUserInfo()
    },
    
    getUserInfo () {
      var self = this
      login({
        success: function () {
          wx.hideLoading()
          showSuccess('登陆成功')
          self.updateInfo()
        },
        fail: function () {
          wx.hideLoading()
        }
      })
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          //console.log(res.userInfo)
        }
      })
    },
    openContact () {
      let url = '/pages/common/contact'
      wx.navigateTo({ url })
    },
    copyAddress () {
      this.$refs.copyModal.show()
    },
    confirmCopy () {
      wx.setClipboardData({
        data: this.userProfile.customer.address_cn,
        success (res) {
          wx.getClipboardData({
            success (res) {
              //console.log(res.data) // data
              showSuccess('复制成功')
            }
          })
        }
      })
    },
    terms () {
      let url = '/pages/common/terms'
      wx.navigateTo({ url })
    },
    weblogin () {
      let url = '/pages/weblogin?tab=1'
      wx.navigateTo({ url })
    },
    updateInfo () {
      let url = '/pages/weblogin?tab=0'
      wx.navigateTo({ url })
    },
    weblogout () {
      this.$refs.mpModal.show()
    },
    gotoSchedulePage () {
      let url = '/pages/schedules/schedules'
      wx.navigateTo({ url })
    },
    async wechatpay () {
      var data = {
        amount: '0.01',
        product_name: 'Ticket'
      }
      let header = { 'Content-Type': 'application/json' }
      let resp = post('store/pay/latipay/12/', data, header)
      //console.log(resp)
      wx.requestPayment({
        ...resp,
        success: function (res) {
          //console.log(res)
        }
      })
    },
    async confirm () {
      wx.showLoading({ title: '正在解绑...', mask: true })
      let res = get('freightcustomers/logout/?appid=' + appid)
      //console.log(res)
      res.then(v => {
        if (v.code === 0) {
          login({
            success: function () {
              wx.hideLoading()
              showSuccess('解绑成功')
              wx.navigateBack()
            },
            fail: function () {
              wx.hideLoading()
            }
          })
        }
      })
    },
    shomessage () {
      uni.requestSubscribeMessage({
        tmplIds: ['GPtAQk0USqPs5-r6uU9tGPHJcFfsw2yNA0yVRyqsxTY'],
        success: (res) => {
          //console.log('订阅消息 成功 ' + res)
        },
        fail: (errCode, errMessage) => {
          //console.log(errCode)
        },
        complete: (errMsg) => {
          //console.log(errMsg)
        }

      })
    },
    helpProcess : function () {
			this.$refs.graceShade.showIt();
		},
		closeShade : function () {
			this.$refs.graceShade.hideIt();
		},
    showVersion : function () {
			this.$refs.graceDialogVersion.open();
		},
		closeVersion : function () {
			this.$refs.graceDialogVersion.hide();
		}
  }
}
</script>

<style scoped lang="scss">
.main-color{color: $theme-color;}
.content1{padding:25rpx; font-size:26rpx; text-align:center; line-height:60rpx;background-color:#F8F8F8; display:block;}
.demo-msg{width:500rpx; font-size:0;}
.demo-msg-in{width:500rpx; height:800rpx;}
.close-btn{width:80rpx; height:80rpx; line-height:80rpx; text-align:center; font-size:40rpx; z-index:7;}
.popmenu{ width:85%; text-align:center; }
.demo-wrap2{width:200rpx;}
.demo2{line-height:66rpx; display:block; width:100%; text-align:center; font-size:28rpx;}
	.word-btn {
		width: 250px;
	}
  .badge{
      margin:10rpx;
      background-color: $theme-color;
      color: white;
    }
  .ucenter-face{width:120upx !important; height:120upx !important;}
  .ucenter-face image{width:120upx !important; height:120upx !important;}
  .admin {
    display: inline-block;
    font-size: 0.7em;
    color:#AB0009;
    font-weight: bold;
  }
  .userinfo-avatar {
    border-radius: 50%;
  }
  .login-name{
    font-size:1em;
  }
  .authbutton{
    margin:50px 30px 20px;
  }
  .setting-group {
    margin-top: 50px;
  }
  .contact-panel{
    margin-top: 60px;
  }
  .help-panel{
    margin-top: 30px;
  }
  .contact {
    margin-top: 100rpx;
    background: $theme-color;
    color: white;
    width: 70%;
    &:hover {
      background: $secondary-color;
    }
  }
  .address {
    margin: 20px 5px;
    padding: 5px 20px;
    background: #f9f9f9f9;
    span{
      font-size: 0.6em;
    }
    p {
      font-size: 0.8em;
      font-weight: bold;
    }
  }
  .address-hover {
    background: #999999;
  }
  .terms{
    text-align: center;
    margin: 20px auto;
    font-size: 0.8em;
    font-weight: bold;
    color: $theme-color;
  }
  
  .ucenter-line{height:12rpx; background-color:#F4F5F6; margin:16rpx 0;}
  .yunicon-large {
    font-size: 30px;
  }
  .five > .items{width:20%;}
  
  .yun-icon-logo {font-size: 40upx !important;}
  .no-style {
    background-color: white;
    border-width: 0;
    line-height: unset;
    color: unset;
    &:after {
      border-width: 0;
      border-radius: unset;
    }

  }
  .logo {
    color: white;
    font-size: 1.3em;
    margin-left: 0.3em;
    margin-right: 0.3em;
  }
  .authbutton{
    margin: 40upx auto;
    width: 350upx;
    padding: 3upx;
    background-color: $theme-color;
    color: white;
    border-style: none;
    font-size: 1em;
    box-shadow: 0px 4px 16px #455B6308;
    border-radius: 3px;
    &:hover {
      background: $secondary-color;
    }
  }
</style>
