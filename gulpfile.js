var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
  sass: {
    src: ['app/scss/**/*.scss', 'app/components/**/*.scss'],
    dest: 'app/css',
    name: 'app.css'
  },
  js: {
    src: ['app/components/**/*.js'],
    dest: 'app/js',
    name: 'components.js'
  },
  html: {
    src: ['app/index.html', 'app/components/**/*.html']
  }
};

gulp.task('sass', function () {
  gulp.src(paths.sass.src)
    .pipe(sass())
    .pipe(concat(paths.sass.name))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9'],
    }))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function() {
  gulp.src(paths.js.src)
    .pipe(concat(paths.js.name))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function() {
  gulp.src(paths.html.src)
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass.src, ['sass']);
  gulp.watch(paths.js.src, ['js']);
  gulp.watch(paths.html.src, ['html']);
});

gulp.task('autoprefix', ['sass'], function () {
  return gulp.src(paths.sass.dest + '/' + paths.sass.name)
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('browser-sync', function() {
  browserSync({
    open: false,
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('lint', function() {
  return gulp.src(paths.js.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['sass', 'autoprefix', 'js', 'watch', 'browser-sync']);