const fs = require('fs');

function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}

const VERSION = process.env.VERSION
//"appid_pcl": "wx0c158c213df1ffd8",
console.log(VERSION)

copyFile('./src/config/'+VERSION+'/info-grids.vue', './src/components/info-grids.vue')
copyFile('./src/config/'+VERSION+'/login.vue', './src/components/login.vue')

const manifest = require('./src/config/'+VERSION+'/manifest.json');
// console.log(data['mp-weixin'].appid)
const pages = require('./src/config/'+VERSION+'/pages.json');



fs.writeFile(
    `${__dirname}/src/manifest.json`,
    JSON.stringify(manifest),
    e => (e ? console.error(e) : console.log('manifest.json 配置文件更新成功'))
);

fs.writeFile(
    `${__dirname}/src/pages.json`,
    JSON.stringify(pages),
    e => (e ? console.error(e) : console.log('pages.json 配置文件更新成功'))
);