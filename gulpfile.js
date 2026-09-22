const { src, dest, series, parallel, watch } = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

function html()
{
    return src('src/index.html')
        .pipe(fileInclude({
                prefix: '@@', 
                basepath: '@file'
            }))
            .pipe(dest('dist'));
}

function styles()
{
    return src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(dest('dist/css'));
}

function scripts()
{
    return src('src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'));   
}

async function images()
{
    const imagemin = (await import('gulp-imagemin')).default;

    return src('src/imgs/**/*')
        .pipe(imagemin())
        .pipe(dest("dist/imgs"));
}

function serve()
{
    browserSync.init({ server: { baseDir: 'dist' }});

    watch('src/index.html', html).on('change', browserSync.reload);
    watch('src/components/**/*.html', html).on('change', browserSync.reload);
    watch('src/scss/**/*.scss', styles).on('change', browserSync.reload);
    watch('src/js/**/*.js', scripts).on('change', browserSync.reload);
    watch('src/imgs/**/*', images).on('change', browserSync.reload);
}

const build = parallel(html, styles, scripts, images);

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.default = series(build, serve);