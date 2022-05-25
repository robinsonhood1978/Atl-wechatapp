process.env.VUE_APP_USE_HOST_API_LOCAL = process.env.USE_LOCAL_HOST_API
process.env.VUE_APP_USE_HOST_API_STAGING = process.env.USE_STAGING_API
process.env.VUE_APP_VERSION = process.env.MINI_PROGRAM_VERSION
if (process.env.VUE_APP_USE_HOST_API_LOCAL === 'true') {
  //console.log('Use LOCAL server ')
} else if (process.env.VUE_APP_USE_HOST_API_STAGING === 'true'){
  //console.log('Use STAGING server ')
}else {
  //console.log('Use PRODUCTION server ')
}

// process.env.UNI_OUTPUT_DIR = './dist/' + process.env.UNI_PLATFORM
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'
if (process.env.UNI_PLATFORM === 'mp-weixin') {
  const {
    getManifestJson
  } = require('@dcloudio/uni-cli-shared')
  // console.log(getManifestJson()['mp-weixin'].appid)
  process.env.VUE_APP_MP_WEIXIN_APPID = getManifestJson()['mp-weixin'].appid
  process.env.VUE_APP_VERSION_NAME = getManifestJson().name
}

// 引入
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

if (process.env.MINI_PROGRAM_VERSION == "pcl") {
  module.exports = {
    lintOnSave: 'error',
    css: {
      loaderOptions: {
        scss: {
          prependData: `@import "~@/config/pcl/uni.scss";`,
        },
      },
    },
    devServer: {
      overlay: {
        warnings: true,
        errors: true
      }
    },
    configureWebpack: {
      plugins: [new BundleAnalyzerPlugin()],
      resolve: {
        alias: {
          moment: "moment/src/moment"
        }
      },
      optimization: {
        minimizer: isProd ? [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                drop_console: true
              }
            }
          })
        ] : []
      }
    }
  }
} else if (process.env.MINI_PROGRAM_VERSION == "atl") {
  module.exports = {
    lintOnSave: 'error',
    css: {
      loaderOptions: {
        scss: {
          prependData: `@import "~@/config/atl/uni.scss";`,
        },
      },
    },
    devServer: {
      overlay: {
        warnings: true,
        errors: true
      }
    },
    configureWebpack: {
      plugins: [new BundleAnalyzerPlugin()],
      resolve: {
        alias: {
          moment: "moment/src/moment"
        }
      },
      optimization: {
        minimizer: isProd ? [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                drop_console: true
              }
            }
          })
        ] : []
      }
    }
  }  
}