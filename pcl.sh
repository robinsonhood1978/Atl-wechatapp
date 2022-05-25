#!/bin/bash
#cp -Rf ~/bitbucket/atl-wechatapp ~/bitbucket/pcl
cp -f ~/bitbucket/general_wxapp_uniapp/src/uni.scss ~/bitbucket/pcl/src/uni.scss
cp -f ~/bitbucket/general_wxapp_uniapp/src/manifest.json ~/bitbucket/pcl/src/manifest.json
sed -e 's/#BE1416/#40C5D1/g' -e 's/运过来/PackGo/g' -e 's/icons/icons_pcl/g' -e 's/yun.png/package.png/g' -e 's/yun-active.png/package-active.png/g' -e 's/order.png/reg.png/g' -e 's/order-active.png/reg-active.png/g' -e 's/calc-small-active.png/calc-active.png/g' ~/bitbucket/atl-wechatapp/src/pages.json > ~/bitbucket/pcl/src/pages.json
sed -e 's/#BE1416/#40C5D1/g' ~/bitbucket/atl-wechatapp/src/graceUI/graceUI.css > ~/bitbucket/pcl/src/graceUI/graceUI.css
echo "Finished!"