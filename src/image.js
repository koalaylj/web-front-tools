const globby = require('globby');
const asyn = require('async');
const pngquant = require('imagemin-pngquant');
const path = require('path');
const fs = require('fs');
const makeDir = require('make-dir');
const chalk = require('chalk');
const log = require('fancy-log');



/**
 * 压缩png图片。
 * @param {String | Array} src 图片路径，globby风格。
 *        参考 https://www.npmjs.com/package/globby patterns
 * @param {String} dest 最终生成的路劲
 * @param {Object} options 压缩级别  可不填使用默认
 *        参考 https://github.com/imagemin/imagemin-pngquant options
 *        example {quality:80}
 */
async function min(src, dest, options) {

    const files = await globby(src);

    asyn.each(files, async file => {
        const src_resolved = path.resolve(file);
        const src_parsed = path.parse(file);

        const buf = fs.readFileSync(src_resolved);

        const data = await pngquant(options)(buf);

        log(`${chalk.green('✔ ')}  ${chalk.yellow(src_parsed.base)} ` + chalk.magenta(`${(buf.length/1024).toFixed()}KB -> ${(data.length/1024).toFixed()}KB`) + ` 压缩了${((buf.length - data.length ) * 100 / buf.length).toFixed()}%`);

        const dest_file = path.resolve(path.join(dest, src_parsed.base));
        await makeDir(dest);
        fs.writeFile(dest_file, data, err => {
            if (err) {
                log.error(chalk.red(`保存图片错误:${dest_file}, 错误信息: ${err}`));
            }
        });

    }, err => {
        if (err) {
            log.error(chalk.red(`发生错误 ${err}`));
        } else {
            log(chalk.green('图片压缩完成!'));
        }
    });
}

module.exports.min = min;