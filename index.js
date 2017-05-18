/**
 * Created by Administrator on 2017/5/18.
 */
const xls = require('node-xlsx');
const fs = require('fs');
const path = require('path');
const PromiseA = require('bluebird');

// 获取目录下的所有文件名字
function getFileName() {
    const dir = __dirname + '/files/';
    return PromiseA.fromCallback(cb => fs.readdir(dir, cb)).then(files => {
        return files.map(function (file) {
            return dir + file;
        });
    });
}
PromiseA.mapSeries(getFileName(), file => {
    const datas = xls.parse(fs.readFileSync(file));
    return PromiseA.mapSeries(datas, data => {
        let json = {};
        data.data.forEach((item, index) => {
            if (index > 0) {
                json[item[0]] = item[3];
            }
        });
        return PromiseA.fromCallback(cb => fs.writeFile('./files/'+path.basename(file, path.extname(file)) + '.json', JSON.stringify(json), cb));
    });
});

