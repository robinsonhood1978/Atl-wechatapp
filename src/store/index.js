import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: null,
  newUserInfo: null,
  userProfile: {},
  authToken: '',
  isLogedIn: false,
  companyUsersList: [],
  wrappingtypes: [],
  CID: 0,
  appOptions: {},
  uid: 0,
  scene: '',
  companyInfo: {},
  chargeTypes: null,
  address: null,
  senderAddress: null,
  apiHost: '',
  clipboardInfo: ''
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => wx.clearStorage()
      }
    })
  ]
})
