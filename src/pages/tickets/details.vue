<template>
  <Login v-if="!isLogedIn"> </Login>
  <view v-else class="page" style="padding-bottom: 100upx">
    <swiper v-if="images.length>0" class="grace-swiper"
            autoplay="true" indicator-dots
            indicator-color="rgba(255, 255, 255, 1)"
            indicator-active-color="#3688FF"
            style="height:500upx;background-color: white"
            interval="3000">

      <swiper-item  v-for="(thumb, index) in images" :key="index" class="lightbox__holder" @click="predivImage" :id="images[index]">
        <image style="height:100%;width:100%" :src="thumb" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <view class="detail-card">
      <view class="title">{{ ticket.type.title }}</view>
      <view style="margin: 20upx">
        <view class="grace-list-title">
                 <view v-if="ticket.dform" class="desc">运单 {{ ticket.dform.tracking_number }}</view>
        <view v-if="ticket.parcel" class="desc">包裹 {{ ticket.parcel.local_courier_number }}</view>
        <view v-if="ticket.status" class="grace-tags-large grace-tbr-large badge" style="margin-right:10px;text-align:right">{{ticket.status.title}}</view>
            </view>
       <view class="desc">{{ ticket.content }}</view>
        <view class="desc">{{ticket.user.first_name}}</view>
        <view class="tip light">{{formatedTime}}</view>
      </view>
    </view>
    <scroll-view scroll-y class="grace-list grace-margin-top" :style="{height:scrollHeight+'px'}">
      <ReplyCard
                  :key="Item.id"
                  :reply="Item"
                  v-for="(Item) in ticket.replys"
                ></ReplyCard>
    </scroll-view>

      <button class="submit inquire" hover-class="submithover" style="margin-top: 1em" @click="feedback(ticket.id)" :disabled="disabled">回复</button>
      <!--button class="submit inquire" hover-class="submithover" style="margin-top: 1em"
              v-if="companyInfo.show_customer_support"
            :send-message-title='"我要咨询包裹 "+ ticket.tracking_number'
            show-message-card="true"
            bindcontact='contactCallback'
            :session-from='session_str'
            open-type='contact' >咨询该包裹</button-->
    <graceDrawer ref="graceDrawerFeed" v-on:closeDrawer="closeFeed" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <view class="grace-margin-top">
            <text class="grace-title">备注</text>
          </view>
          <view class="grace-box-shadow" style="margin:0 30rpx;">
              <view class="grace-card-view">
                <view class="grace-card-body">
                  <view class="grace-card-desc">
                    <view class="grace-card-title">
                      <textarea v-model="ticketData.content" class="grace-textarea" value="" placeholder="请输入备注信息。" />
                    </view>
                  </view>
                </view>
              </view>
          </view>
          <div class="photos">
            <view class="grace-margin-top">
              <text class="grace-title">相关图片</text>
            </view>
            <div class="weui-uploader__bd">
              <div class="weui-uploader__files" id="uploaderFiles">
                <block v-for="(item, index) in files" :key="index">
                  <div class="weui-uploader__file" :id="item">
                    <image class="weui-uploader__img" :src="item" mode="aspectFill" @click="previewImage"  />
                    <div :id="index" class="weui-badge" style="position: absolute;top: 0;right: -.4em;z-index: 500;" @click="deleteimage">X</div>
                  </div>
                </block>
              </div>
              <div v-if="files.length < 5" class="weui-uploader__input-box">
                <div class="weui-uploader__input" @click="chooseImage"></div>
              </div>
            </div>
          </div>
          <view class="grace-box" style="margin:0 20rpx;" @click="submitFeedback">
              <view class="grace-card-view">
                <view style="margin:0 40rpx;" class="demo-wrap2">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white">提交</text>
                  </graceBorderRadius>
                </view>
              </view>
          </view>
          
          <view class="grace-box" style="margin:0 20rpx;" @click="closeFeed">
              <view class="grace-card-view">
                <view style="margin:0 40rpx;" class="demo-wrap2">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white">返回</text>
                  </graceBorderRadius>
                </view>
              </view>
          </view>
				</view>
		</graceDrawer>

    <graceDrawer ref="graceDrawerFeedback" v-on:closeDrawer="closeFeedback" direction="right">
				<view slot="links" style="padding:0 25rpx;">
          <view class="grace-relative" @tap.stop="">
            <view class="grace-accordion grace-margin-top">
              <!-- 项目0 -->
              <view :key="index" v-for="(ticket, index) in tickettypes" class="grace-box" style="margin:0 20rpx;" @click="feedback(ticket.id)">
                <view class="grace-card-view">
                  <view style="margin:0 40rpx;" class="demo-wrap2">
                    <graceBorderRadius background="#BE1416" :radius="['33rpx','33rpx','33rpx','33rpx']">
                      <text class="demo2 grace-white">{{ticket.title}}</text>
                    </graceBorderRadius>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="grace-box" style="margin:0 20rpx;" @click="closeFeedback">
              <view class="grace-card-view">
                <view style="margin:0 40rpx;" class="demo-wrap2">
                  <graceBorderRadius background="#f0ad4e" :radius="['33rpx','33rpx','33rpx','33rpx']">
                    <text class="demo2 grace-white">返回</text>
                  </graceBorderRadius>
                </view>
              </view>
          </view>
				</view>
		</graceDrawer>
  </view>
</template>

<script>
import { apiHost, get, showSuccess, showFail, post, asyncUploadFile } from '@/utils/index'
import graceSelectTags from '@/graceUI/components/graceSelectTags.vue';
import moment from 'moment'
import { mapState } from 'vuex'
import event from '@/utils/event'
import Login from '@/components/login'
import graceDrawer from '@/graceUI/components/graceDrawer.vue'
import graceBorderRadius from "@/graceUI/components/graceBorderRadius.vue"
import ReplyCard from '@/components/reply-card'
export default {
  components: {
    ReplyCard,
    graceDrawer,
    graceBorderRadius,
    graceSelectTags,
    Login
  },
  data () {
    return {
			select_freight_type: [
				{ name: '海运', value: 'S', checked: false },
				{ name: '空运', value: 'F', checked: false }
			],
      ticketData: {
        request_close:1,
        content: ''
      }, 
      files: [],
      hidden: 0,
      ticket_type: {},
      tickettypes: [],
      ticketId: 0,
      ticket: {},
      host: apiHost,
      images: [],
      name: '未知用户',
      volume: 0,
      formData: {
        id: '',
        title: '',
        customer_note: '',
        freight_type: 'S',
        titles: [],
        quantities: [],
        totals: [],
        materials: []
      },
      items: [],
      item: {
        reference: '',
        quantity: 0,
        title: '',
        subtotal: '',
        total: '',
        totalstr: 0.00
      },
      canBack: true,
      fobiden_list:"日用品/生活用品/食品/茶叶/三只松鼠"
    }
  },
  computed: {
    ...mapState([
      'isLogedIn',
      'userProfile',
      'CID',
      'userInfo',
      'appOptions',
      'companyInfo'
    ]),
    formatedTime () {
      return moment(this.ticket.create_date).local().format('DD/MM/YYYY HH:mm')
    }
  },
  watch: {
    isLogedIn: function () {
      if (this.isLogedIn) {
        this.loadData()
        this.ticketType()
      }
    }
  },
  onShow () {
    if (this.appOptions.scene === 1043) {
      this.canBack = false
    }
    console.log('canBack ' + this.canBack)
  },
  mounted () {
    this.ticketId = this.$root.$mp.query.id
    console.log('Package ID: ' + this.ticketId)
    if (this.isLogedIn) {
      this.loadData()
      this.ticketType()
    }
  },
  methods: {
    async submitFeedback () {
      wx.showLoading({ title: '提交中...', mask: true })
      var errid = 0
      try {
        console.log("this.ticketData:", this.ticketData)
        // wx upload file can upload only one file a time, so need to upload multiple times
        if (this.files.length === 0) {
          let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
          let resp = await post('freighttickets/'+this.ticketId+'/reply/', this.ticketData, header)
          console.log('upload resp:' + resp)
          wx.hideLoading()
          showSuccess('上传成功')
          this.resetData()
        } else {
          let files = this.files
          let ticketID = -1
          for (var i = 0; i < files.length; i++) {
            if (i === 0) {
              let resp = await asyncUploadFile('freighttickets/'+this.ticketId+'/reply/', this.files[i], this.ticketData)
              console.log('file 1 time upload resp:' + resp)
              if (ticketID === -1) {
                let ticket = JSON.parse(resp)
                ticketID = ticket.object.id
                console.log('Ticket ID: ' + ticketID)
              }
            } else {
              if (ticketID === -1) {
                throw Error('no ticketID from first request.')
              }
              let resp = await asyncUploadFile('freighttickets/'+this.ticketId+'/reply/', files[i], {
                id: ticketID
              })
              console.log('upload resp:' + resp)
            }
          }
          this.resetData()
          console.log('New record created Done!')
          wx.hideLoading()
          showSuccess('上传成功')
        }
        wx.navigateBack({ delta: 1 })
        // this.resetData()
      } catch (error) {
        console.log('Upload failed! error:' + error)
        wx.hideLoading()
        showFail('上传错误')
        throw error
      }
      return errid

      // this.resetData()
    },
    async chooseImage (e) {
      var _this = this
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this.files = _this.files.concat(res.tempFilePaths)
        },
        fail: function () {
          console.log('fail')
        }
      })
    },
    previewImage (e) {
      console.log(this.files)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.files // 需要预览的图片http链接列表
      })
    },
    deleteimage (e) {
      let id = e.currentTarget.id
      console.log('onDelete ID: ' + id)
      this.files.splice(id, 1)
    },
    feedback(id){
      console.log('id:', id)
      this.ticket_type = this.tickettypes.find(item => item.id == id)
      this.closeFeedback()
      this.showFeed()
    },
    closeFeedback : function(){
      this.hidden = 0;
      this.$refs.graceDrawerFeedback.hide();
    },
    showFeedback : function () {
      this.hidden = 1;
      this.$refs.graceDrawerFeedback.open();
    },
    closeFeed : function(){
      this.hidden = 0;
      this.$refs.graceDrawerFeed.hide();
    },
    showFeed : function () {
      this.hidden = 1;
      this.$refs.graceDrawerFeed.open();
    },
    changeFreightType : function(val){
      // console.log('robin:', val)
      this.formData.freight_type = val;
    },
    predivImage (e) {
      console.log(e)
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.images// 需要预览的图片http链接列表
      })
    },
    async ticketType() {
      let res = await get('freighttickets/types/?group=parcel')
      this.tickettypes = res.object
      console.log('this.tickettypes', this.tickettypes)
    },
    async loadData () {
      if (this.ticketId === 0) {
        return
      }
      console.log('Get Ticket Detail...')
      let resp = await get('freighttickets/' + this.ticketId + '/?type=all')

      this.ticket = resp
      
      wx.setNavigationBarTitle({
        title: this.ticket.title ? this.ticket.title : '无标题'
      })
      this.images = this.ticket.files.map((item) => {
        return item.url.startsWith('http') ? item.url : (this.host + '/media/' + item.url)
        // return item.url
      })
console.log('this.images:', this.images)
      
      this.formData.id = this.ticketId
    },
    resetData () {
      
    },
    async submit () {
      wx.showLoading({ title: '提交中...', mask: true })
      var errid = 0
      try {
        
      } catch (error) {
        
        throw error
      }
      return errid

      // this.resetData()
    },
    async submitBack () {
      try {
        let errid = await this.submit()
        console.log(errid)
        if (this.canBack) {
          wx.navigateBack({ delta: -1 })
        } else {
          wx.reLaunch({
            url: '/pages/home'
          })
        }
      } catch (error) {

      }
    },
    btnBack () {
      wx.reLaunch({
        url: '/pages/home'
      })
    }
  },
  onUnload () {
    this.resetData()
  }
}
</script>
<style scoped lang="scss">
  .ticket_type{line-height:80rpx; display:block; width:100%; text-align:center; font-size:35rpx;}
  .package{line-height:40rpx; display:block; width:100%; text-align:center; font-size:25rpx;}
  .photos{
    margin: 0 auto;
    padding: 0 2em;
    .weui-uploader__files{
      justify-content: center;
    }
  }
  .weui-uploader__file{
   position: relative;
  }
  .demo-wrap2{ width:85%; text-align:center; }
  .demo2{line-height:80rpx; display:block; width:100%; text-align:center; font-size:30rpx;}
  .detail-card {
    background-color: white;
    padding-top: 10upx;
    padding-bottom: 20upx;
    .title {
      font-size: 1.3em;
      font-weight: bold;
      margin: 20upx;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: #9b9b9b;
    }
    .desc {
      font-size: 0.9em;
      color: #626262;
    }
    .tip {
      text-align: left;
      color: #626262;
      font-size:0.9em;
    }
    .light {
      opacity: 0.56;
    }
   }
  .detail {
    margin: 20upx;
    align-items:center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #9b9b9b;
    padding-top: 10upx;
    padding-bottom: 20upx;

    h1 {
      width: 30%;
      font-size: 32upx;
      font-weight: bold;
    }
    p {
      width: 70%;
      margin-bottom: 0;
      font-size: 36upx;
    }
    .line-section {
      p{
        font-size: 1em;
        margin-bottom: 10upx;
      }
      .item-title {
        width: 30%;
      }

      .item-caizhi {
        width: 30%;
      }

      .item-pieces {
        width: 20%;
      }

      .item-price {
        width: 30%;
      }
    }
    .icon {
      color: $uni-color-primary;
    }
  }
  p {
    font-size: 36rpx;
  }
  .item-notice {
      font-size: 22rpx !important;
      color:$theme-color;
    }
  .detail-container{
    margin: 1em;
    overflow-x:hidden;
    white-space:nowrap;
  }

  .total-row {
    padding-top: 0 !important;
    margin-top: 10upx !important;
    justify-content: space-between;
    p {
      font-weight: bold;
      font-size: 1em;
    }
    .icon {
      font-size: 1.6em;
    }
  }
  .submit{
    margin-top: 30upx;
    background-color: $theme-color;
    color: white;
    width: 80%;
    box-shadow: 0px 4px 16px #455B6308;
    border-radius: 3px;
  }
  .submitBack {
    margin-bottom: 50upx;
  }
  textarea {
    background: white;
    width: 70%;
    font-size: 1em;
    line-height: 1em;
    height: 3em;
  }
  .input-title{
    background: #ececec;
  }
  .inquire {
    background-color: $uni-color-error;
  }

</style>
