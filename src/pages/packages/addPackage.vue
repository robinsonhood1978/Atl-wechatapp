<template>
  <div>
    <h1>欢迎 {{userProfile.customer.first_name}} {{userProfile.customer.last_name}} ID {{userProfile.customer.id}}</h1>
  </div>
</template>

<script>
// import {get} from '@/utils/index'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      packageId: 0,
      packageData: {}
    }
  },
  computed: {
    ...mapState([
      'userProfile'
    ])
  },
  async mounted () {
  }
}
</script>
<style lang="scss">

</style>
