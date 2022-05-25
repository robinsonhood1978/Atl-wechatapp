<template>
  <div>
    <div class="form-fields">
      <div class="form-item">
        <h1 class="title grace-text-center">{{addressId?"编辑":"添加"}}{{isSender?"发":"收"}}件人英文地址</h1>
      </div>
      <div class="form-row">
        <div class="form-item" style="width: 50%">
          <p>名字*：</p>
          <input type="text" class="" v-model="newAddress.firstname" placeholder="英文名字" />
        </div>
        <div class="form-item">
          <p>姓氏*：</p>
          <input type="text" class="" v-model="newAddress.lastname" placeholder="英文姓氏" />
        </div>
      </div>
      <div class="form-item">
        <p>联系电话*：</p>
        <input type="number" class="" v-model="newAddress.tel" placeholder="联系电话" />
      </div>
      <div class="form-item">
        <p>街道地址*：</p>
        <input type="text" class="" v-model="newAddress.address" placeholder="门牌号，街道 请填写英文" />
      </div>
      <div class="form-row">
        <div class="form-item" style="width: 70%">
          <p>地区*：</p>
          <input type="text" class="" v-model="newAddress.suburb" placeholder="地区 请填写英文" />
        </div>
        <div class="form-item">
          <p>城市*：</p>
          <input type="text" class="" v-model="newAddress.city" placeholder="城市 请填写英文" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-item" style="width: 70%">
          <p>国家*：</p>
          <input type="text" class="" v-model="newAddress.country" placeholder="国家" />
        </div>
        <div class="form-item">
          <p>邮政编码*：</p>
          <input type="number" class="" v-model="newAddress.postcode" placeholder="邮政编码" />
        </div>
      </div>
      <div v-if="newAddress.is_sender != true">
        <div class="form-row" style="align-content: end">
          <div class="form-item">
            <p>国内退货地址：</p>
          </div>
          <div class="form-item">
            <view class="other"><switch name="switch" :checked="isReturnAddress" @change="switchReturn"/></view>
          </div>
        </div>
        <div class="form-row" style="align-content: end">
          <div class="form-item">
            <p>商业清关信息：</p>
          </div>
          <div class="form-item">
            <view class="other"><switch name="switch" :checked="showBusiness" @change="switchChange"/></view>
          </div>
        </div>
        <div class="form-row" v-if="showBusiness">
          <div class="form-item" style="width: 80%">
            <p>公司名称：</p>
            <input type="text" class="" v-model="newAddress.business_name" placeholder="公司名称" />
          </div>
          <div class="form-item">
            <p>海关编码：</p>
            <input type="text" class="" v-model="newAddress.custom_code" placeholder="海关编码" />
          </div>
        </div>
      </div>
      <button class="pcl-btn" @click="submit">保存</button>
    </div>
  </div>
</template>

<script>
import { post, showFail } from '@/utils/index'
import event from '@/utils/event'
import { mapState } from 'vuex'

function data () {
  return {
    addressId: 0,
    isSender: false,
    showBusiness: false,
    isReturnAddress: false,
    newAddress: {
      title: '',
      firstname: '',
      lastname: '',
      tel: '',
      address: '',
      suburb: '',
      city: 'Auckland',
      country: 'New Zealand',
      postcode: '',
      custom_code: '',
      business_name: ''
    }
  }
}
export default {
  computed: {
    ...mapState([
      'companyInfo',
      'address',
      'senderAddress'
    ])
  },
  mounted () {
    Object.assign(this, data())
    this.addressId = this.$root.$mp.query.id
    this.isSender = this.$root.$mp.query.is_sender === 'true'
    console.log('address ID: ' + this.addressId + ' is_sender: ' + this.isSender)
    //console.log(this.address)
    if (this.isSender) {
      this.newAddress.country = 'China'
      this.newAddress.city = ''
      this.newAddress.title = '发件人中国地址'
    }
    if (this.addressId) {
      let add
      if (this.isSender) {
         add = this.senderAddress
      }
      else{
         add = this.address
      }
      
      // eslint-disable-next-line eqeqeq
      let currentAdd = add.find(item => item.id == this.addressId)
      console.log(currentAdd)
      if (currentAdd) {
        this.newAddress = currentAdd
      }
    }
    if (this.isSender) {
      this.newAddress.is_sender = true
    } else {
      if (this.newAddress.business_name !== '' || this.newAddress.custom_code !== '') {
        this.$set(this, 'showBusiness', true)
      }
    }
  },
  data,
  methods: {
    trim(str){
      return str.replace(/(^\s*)|(\s*$)/g,"");
    },
    hasChinese: function (str) { 
      return (str.length != str.replace(/[^\x00-\xff]/g,"**").length); 
    },
    async submit () {
      if (this.trim(this.newAddress.firstname) === '') {
        showFail('请填写名字')
        return
      } else if (this.trim(this.newAddress.lastname) === '') {
        showFail('请填写姓氏')
        return
      } else if (this.trim(this.newAddress.address) === '') {
        showFail('请填写门牌号，街道')
        return
      } else if (this.trim(this.newAddress.suburb) === '') {
        showFail('请填写地区')
        return
      }else if (this.trim(this.newAddress.city) === '') {
        showFail('请填写城市')
        return
      } else if (this.trim(this.newAddress.country) === '') {
        showFail('请填写国家')
        return
      }else if (this.trim(this.newAddress.postcode) === '') {
        showFail('请填写邮编')
        return
      } else if (this.trim(this.newAddress.tel) === '') {
        showFail('请填写联系电话')
        return
      }
      if (this.hasChinese(this.newAddress.firstname)) {
        showFail('请填写英文名字')
        return
      } 
      else if (this.hasChinese(this.newAddress.lastname)) {
        showFail('请填写英文姓氏')
        return
      } else if (this.hasChinese(this.newAddress.address)) {
        showFail('请填写英文门牌号，街道')
        return
      } else if (this.hasChinese(this.newAddress.suburb )) {
        showFail('请填写英文地区')
        return
      } else if (this.hasChinese(this.newAddress.city )) {
        showFail('请填写英文城市')
        return
      } 
       else if (this.hasChinese(this.newAddress.country )) {
        showFail('请填写英文国家')
        return
      } 
      let header = { 'Content-Type': 'application/x-www-form-urlencoded' }
      this.newAddress.title = this.newAddress.address
      if (!this.isSender && !this.isReturnAddress) {
          let verify = await post('freightcustomers/verify_address/', this.newAddress, header)
          if (verify.code === 0) {
            
          }
          else{
            showFail('请填写正确的地址')
            return
          }
      } 
      let resp = await post('freightcustomers/addresses/', this.newAddress, header)
      if (resp.code === 0) {
        event.emit('addressChanged', {})
        wx.navigateBack({ changed: true })
      }
    },
    closeModal () {
      this.show = false
      this.$emit('show', this.show)
      console.log(this.show)
    },
    switchReturn (e) {
      this.isReturnAddress = e.target.value
      // this.$set(this, 'isReturnAddress', v) 
      // console.log(this.isReturnAddress)
    },
    switchChange (e) {
      let value = e.target.value
      this.$set(this, 'showBusiness', value) // 将点击改变的状态赋给treatmentStatu.checked
    }
  }
}
</script>

<style scoped lang="scss">
  .pcl-btn{
    margin-top: 30px;
    background-color: $theme-color;
    color: white;
    width: 600rpx;
    &:hover {
      background-color: white;
      color: $theme-color;
    }
  }

    .form-fields {
      margin: 20px auto;
      width: 80%;
      height: 70%;
      background: white;
      margin-top: 10%;
      padding: 15px;
      font-size: 0.8em;
      position: relative;
      p {
        font-weight: bold;
        font-size: 1.1em;
        margin: 5px 0px;
      }

      input {
        border-width: 0px;
        border-bottom-width: 1px;
        border-color: gray;
        border-style: solid;
        margin-bottom: 5px;
      }

      .form-row {
        display: flex;
      }

      .form-item {
        margin: 5px 7px;
      }
      h1 {
        font-size: 1.1em;
        font-weight: bold;
        padding-bottom: 20rpx;
      }
    }
</style>
