const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');
const rename = require('gulp-rename')

/* CSS */
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

/* JS */
const terser = require('gulp-terser-js')

const path = {
    img: 'src/img/**/*',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
}

function css() {
    return src(path.scss)
        .pipe( sourcemaps.init())
        .pipe( sass())
        .pipe( postcss([autoprefixer(), cssnano()]))
        .pipe(rename({suffix: '.min'}))
        .pipe( sourcemaps.write('.'))
        .pipe( dest('./build/css'))
}

function mincss() {
    return src(path.scss)
        .pipe( sass({
            outputStyle: 'compressed'
        }))
        .pipe( dest('./build/css'))
}

function js() {
    return src(path.js)
        .pipe(sourcemaps.init())
        .pipe( concat('bundle.js'))
        .pipe( terser())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('./build/js'))
}

function images() {
    return src(path.img)
        .pipe( imagemin())
        .pipe( dest( './build/img'))
        .pipe( notify({message: 'minified image'}))
}

function toWebp() {
    return src(path.img)
        .pipe(webp())
        .pipe(dest('./build/img'))
        .pipe(notify({message: 'webp image'}))
}

function watchFiles() {
    watch(path.scss, css);
    watch(path.js, js)
}


exports.css = css;
exports.mincss = mincss;
exports.js = js;
exports.images = images
exports.watchFiles = watchFiles;

exports.default = series(css, js, watchFiles)