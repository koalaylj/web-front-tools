var Fontmin = require('fontmin');
var rename = require('gulp-rename');

/**
 * 从给定的ttf字体文件中抽取出给定文本，并生成新字体。
 * @param {string} src ttf路径
 * @param {string} text 需要抽取的文字
 * @param {string} dest 最终生成的路劲
 * @param {string} fontName 字体名字
 * @param {function} done 完成回调
 */
function extract(src, text, dest, fontName, done) {

    var fontmin = new Fontmin();

    fontmin.src(src)
        .use(Fontmin.glyph({
            text: text
        }))
        .use(Fontmin.ttf2eot({
            clone: true
        }))
        .use(Fontmin.ttf2woff({
            clone: true
        }))
        .use(rename(
            path => {
                path.basename = fontName;
            }
        )).use(Fontmin.css({
            fontFamily: fontName,
            asFileName: true
        }))
        .dest(dest);

    fontmin.run(done);
}

module.exports.extract = extract;