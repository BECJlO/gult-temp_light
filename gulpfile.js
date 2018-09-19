var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require("gulp.spritesmith"),
    csso = require('gulp-csso'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('sprite', function () {
    var spriteData =
        gulp.src('app/img/sprite/*.*')
            .pipe(spritesmith({
                imgName: '../img/sprite.png',
                cssName: 'sprite.min.css',
                padding: 4,
            }));

    spriteData.img.pipe(gulp.dest('app/img/'));
    spriteData.css
        .pipe(sourcemaps.init())
        .pipe(csso())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'));
});


gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '>1%' /*, 'ie 8', 'ie 7'*/ ], { cascade: true }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/css'));
});

gulp.task('scripts', function() {
    return gulp.src([
            // set libs
            //'app/libs/vue/dist/vue.min.js'
            //'app/libs/react/*.min.is'
            //'app/libs/angular/angular.min.js'
            'app/libs/jquery/dist/jquery.min.js',
            //'app/libs/star-rating-svg/dist/jquery.star-rating-svg.js',
            //'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js', 		
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});


gulp.task('watch', ['browser-sync', 'css-libs'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload)
});


gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
    var builCss = gulp.src([
            'app/css/main.css',
            'app/css/libs.min.css',
        ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browser-sync', 'watch']);