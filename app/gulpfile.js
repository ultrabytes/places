var gulp = require('gulp'),
uglify = require('gulp-uglify'),
concat = require('gulp-concat'),
sourcemap = require('gulp-sourcemaps'),
    connect = require('gulp-connect');
    watch = require('gulp-watch');
batch = require('gulp-batch');


gulp.task('script', function () {
    gulp.src(["node_modules/angular/angular.js","node_modules/angular-route/angular-route.js","./src/js/module.js","./src/js/controllers.js","./src/js/routes.js"])
        .pipe(sourcemap.init())
        .pipe(concat('script.min.js'))
        .pipe(sourcemap.write())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});

gulp.task('connect', function () {
    connect.server({
        root: './dist',
        livereload: true
    });
});


gulp.task('watch', function () {
    watch(['src/js/**/*.js','dist/index.html'], batch(function (events, done) {
        gulp.start('script', done);
    }));





});

gulp.task('default', ['script', 'connect', 'watch']);