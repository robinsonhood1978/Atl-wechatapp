import {
  AUTH_TOKEN,
  USER_INFO,
  NEW_USER_INFO,
  CLIPBOARD_INFO,
  LOGIN_STATUS,
  USER_PROFILE,
  COMPANY_USERS,
  WRAPPING_TYPES,
  COMPANY_ID,
  APP_OPTIONS,
  ORG_USER_ID,
  SCENE,
  COMPANY_INFO,
  CHARGE_TYPES,
  ADDRESS,
  SENDER_ADDRESS,
  API_HOST
} from './mutation-types'

export default {
  [USER_INFO] (state, v) {
    state.userInfo = v
  },
  [NEW_USER_INFO] (state, v) {
    state.newUserInfo = v
  },
  [CLIPBOARD_INFO] (state, v) {
    state.clipboardInfo = v
  },
  [AUTH_TOKEN] (state, v) {
    state.authToken = v
  },
  [LOGIN_STATUS] (state, v) {
    state.isLogedIn = v
    //console.log('set logedin status to ' + v)
  },
  [USER_PROFILE] (state, v) {
    state.userProfile = v
  },
  [COMPANY_USERS] (state, v) {
    state.companyUsersList = v
  },
  [WRAPPING_TYPES] (state, v) {
    state.wrappingtypes = v
  },
  [COMPANY_ID] (state, v) {
    state.CID = v
  },
  [APP_OPTIONS] (state, v) {
    state.appOptions = v
  },
  [ORG_USER_ID] (state, v) {
    state.uid = v
  },
  [SCENE] (state, v) {
    state.scene = v
  },
  [COMPANY_INFO] (state, v) {
    state.companyInfo = v
  },
  [ADDRESS] (state, v) {
    state.address = v
  },
  [SENDER_ADDRESS] (state, v) {
    state.senderAddress = v
  },
  [CHARGE_TYPES] (state, v) {
    state.chargeTypes = v
  },
  [API_HOST] (state, v) {
    state.apiHost = v
  }
}
