<template>
  <div>
    <div class="form-field" >
      <p>{{title}}</p>
      <div>
        <div v-for="(item, index) in adds" :key="index">
          <view class="grace-box-shadow">
            <navigator :url="'/pages/common/addAddress?is_sender='+ isSender +'&id=' + item.id"  >
            <div class="weui-cell weui-cell_access weui-cell_link" @longpress="removeAddr" :data-index="item.id">
              
                <div class="weui-cell__bd">{{item.title?item.title+' ':''}}
                  <text class="grace-badge demo grace-bg-red" v-if="item.id==d_adds_id">默认</text>
                  <br>
                  
                  {{item.firstname}} {{item.lastname}}<br>
                  {{item.address}}, {{item.suburb}} <br> {{item.city}} {{item.postcode}}<br>
                  {{item.tel}}
                  
                </div>
                
                  <div class="weui-cell__ft weui-cell__ft_in-access"></div>
                
              </div>
              </navigator>
              <label class="weui-cell weui-check__label">
                    <div class="weui-cell__bd" style="font-size: 0.8em">设为默认</div>
                    <div class="weui-cell__ft weui-cell__ft_in-radio">
                      <switch :id="item.id" :checked="item.checked||item.id==d_adds_id" @change="addressRadioChange"/>
                    </div>
                </label>
                <label class="weui-cell weui-check__label" v-if="show==1">
                  <div class="weui-cell__bd" style="font-size: 0.8em">使用此地址</div>
                    <div class="weui-cell__ft weui-cell__ft_in-radio">
                      <switch :id="item.id" @change="checkedChange"/>
                    </div>
                </label>
            </view>
            <label class="weui-cell weui-check__label">
                    
                </label>
          
        </div>
        <navigator :url="'/pages/common/addAddress?is_sender=' + isSender">
          <button class="pcl-btn" >新增地址</button>
        </navigator>
      </div>
      <h4 style="margin-top: 5px">点击地址进行编辑，长按删除</h4>
    </div>
  </div>
</template>

<script>
import { apiHost, get, post, showFail, showSuccess, del, setAddress, setSenderAddress,setUserProfile } from '@/utils/index'
import { mapState } from 'vuex'
// import mpModal from 'mpvue-weui/src/modal'
import event from '@/utils/event'
import graceCheckBtn from "../../graceUI/components/graceCheckBtn.vue";
export default {
  computed: {
    ...mapState([
      'userProfile',
      'companyInfo',
      'address',
      'senderAddress'
    ])
  },
  components: {
    graceCheckBtn
  },
  data () {
    return {
      show: 0,
      d_adds_id: 0,
      adds: null,
      title: '收件人地址列表',
      isSender: false
    }
  },
  onShareAppMessage: function () {
    return {
      title: 'PackGo联系客服',
      path: 'pages/common/contact?uid=' + this.userProfile.uid,
      imageUrl: apiHost + this.companyInfo.logo
    }
  },
  mounted () {
    console.log('mounted')
    this.isSender = this.$root.$mp.query.is_sender === 'true'
    this.show = this.$root.$mp.query.show
    console.log('is_sendder: ' + this.isSender)
    if (this.isSender) {
      this.title = '发件人地址列表'
      this.d_adds_id = this.userProfile.customer.shipper_address
    }
    else{
      this.d_adds_id = this.userProfile.customer.address
    }
    this.getAddress()
    let self = this
    event.on('addressChanged', this, function (obj) {
      self.getAddress()
    })
    this.adds = this.address
    
  },
  methods: {
    checkedChange : function (e) {
			console.log(e.target.id);
      let userprofile = this.userProfile
      if (this.isSender) {
        userprofile.customer.c_shipper_address = e.target.id
      }
      else{
        userprofile.customer.c_address = e.target.id
      }
      setUserProfile(userprofile)
      event.emit('addressChanged', {})
      wx.navigateBack({ changed: true })
		},
    async addressRadioChange (e) {
      console.log(e.detail.value)
      this.adds.forEach(item => {
        item.checked = false
        if (item.id === parseInt(e.currentTarget.id)) {
          item.checked = true
          this.d_adds_id = item.id
          console.log("this.d_adds_id:"+this.d_adds_id)
        }
      })
      if(e.detail.value){
        //wx.showLoading({ title: '提交中...', mask: true })
        console.log("e.currentTarget.id:"+e.currentTarget.id)
        this.d_adds_id = e.currentTarget.id
        let data 
        if (this.isSender) {
          data = {
            shipper_address_id: this.d_adds_id
          }
        }
        else{
          data = {
            address_id: this.d_adds_id
          }
        }
        try {
          let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
          let resp = await post('packgo/profile/', data, header)
          console.log(resp.message)
          if (resp.code !== 0) {
            showFail(resp.message)
          } else {
            let userprofile = this.userProfile
            if (this.isSender) {
              userprofile.customer.shipper_address = this.d_adds_id
            }
            else{
              userprofile.customer.address = this.d_adds_id
            }
            setUserProfile(userprofile)
            console.log("this.userprofile.customer.shipper_address:"+userprofile.customer.shipper_address)
            console.log("this.userprofile.customer.address:"+userprofile.customer.address)
            event.emit('addressChanged', {})
            //showSuccess('默认地址修改成功')
          }
        } catch (e) {
          console.log(e)
          showFail('失败...')
        }
      }
    },
    removeAddr (e) {
      console.log(e)
      let addId = e.currentTarget.dataset.index
      let self = this
      wx.showModal({
        title: '提示',
        content: '确定要删除此地址吗？',
        success: async function (res) {
          if (res.confirm) {
            console.log('点击确定了 ' + addId)
            let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
            let resp = await del('freightcustomers/addresses/', { id: addId }, header)
            if (resp.code === 0) {
              self.getAddress()
              event.emit('addressChanged', {})
            }
          } else if (res.cancel) {
            console.log('点击取消了')
            return false
          }
        }
      })
    },
    addressAdded (e) {
      console.log(e)
      if (e.code === 0) {
        this.getAddress()
      }
    },
    async getAddress () {
      // console.log('get address')
      const resp = await get('freightcustomers/addresses/?is_sender=' + this.isSender)
      if (resp.code !== 0) {
        console.log('Error to get address:' + resp.message)
        return
      }
      let address = resp.object
      if (!address) {
        address = []
      }
      this.adds = []

      if (!this.isSender) {
        setAddress(address)
        this.adds = this.address
      } else {
        setSenderAddress(address)
        this.adds = this.senderAddress
      }

      console.log(this.adds)
    }
  }
}
</script>

<style scoped lang="scss">
  .pcl-btn{
    margin-top: 10px;
    background-color: $theme-color;
    color: white;
    width: 600rpx;
    &:hover {
      background-color: white;
      color: $theme-color;
    }
  }
  .bg-dark{
    background-color: #e64340;
  }
  .form-field {
    margin: 20px auto;
    background: white;
    padding: 15px;
    p {
      font-weight: bold;
      font-size: 1.1em;
      margin: 5px 0px;
      text-align: center;
      margin-bottom: 10px;
    }
    h4 {
      text-align: center;
      font-size: 0.8em;
    }
    .weui-cell__bd {
      font-size: 1em;
    }

  }
</style>
