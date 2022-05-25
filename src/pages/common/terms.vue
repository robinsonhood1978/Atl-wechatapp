<template>
    <div class="body">
      <rich-text :nodes="terms"  />
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import {get} from '@/utils/index'
// import wxParse from 'mpvue-wxparse'
export default {
  components: {
    // wxParse
  },
  computed: {
    ...mapState([
      'companyInfo'
    ])
  },
  data () {
    return {
      terms: '加载中...'
    }
  },
  async mounted () {
    // let res = await get('home/company/')
    // console.log(res)
    // if (res.code === 0) {
    this.terms = this.companyInfo.terms
    // }
  }

}
</script>

<style scoped>
  /* @import url("~mpvue-wxparse/src/wxParse.css"); */
  .body {
    padding: 5px;
  }
</style>
