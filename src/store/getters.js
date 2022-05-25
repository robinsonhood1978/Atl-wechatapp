export default {
  user: state => {
    return state.userInfo
  },
  authToken: state => {
    return state.authToken
  },
  isLogedIn: state => {
    return state.isLogedIn
  },
  userProfile: state => {
    return state.userProfile
  },
  CID: state => {
    return state.CID
  },
  appOptions: state => {
    return state.appOptions
  },
  uid: state => {
    return state.uid
  },
  companyInfo: state => {
    return state.companyInfo
  },
  chargeTypes: state => {
    return state.chargeTypes
  },
  address: state => {
    return state.address
  },
  senderAddress: state => {
    return state.senderAddress
  },
  apiHost: state => {
    return state.apiHost
  },
  helpProcess: state => {
    return state.apiHost + '/static/packgo/wx/helpProcess.jpg'
  }
}
