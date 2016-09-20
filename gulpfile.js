'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

var htmlmin = require('gulp-htmlmin');
var extname = require('gulp-extname');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pump = require('pump');
var assemble = require('assemble');
var helpers = require('handlebars-helpers');
var app = assemble();
var src = 'src';

gulp.task('sass', function () {
  return gulp.src(['src/sass/**/*.scss', '!src/sass/vendor/bootstrap/**'])
  	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
   .pipe(gulp.dest('www/css'));
});

gulp.task('sass:dist', function () {
  return gulp.src(['src/sass/**/*.scss', '!src/sass/vendor/bootstrap/**'])
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest('dist/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch(['sass/**/*.scss','!sass/vendor/bootstrap/**.scss'], {cwd: src}, ['sass']);
});

gulp.task('assemble:watch', function () {
  gulp.watch('**/*.hbs', {cwd: src}, ['assemble']);
});

gulp.task('uglify', function (cb) {
  pump([
        gulp.src([
          'www/js/main.js',
          'www/js/vendor/gasp.js'
        ], {base:'www'}),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});
gulp.task('dist-copy', function (cb) {
  gulp.src([
    'www/js/vendor/*.js',
    '!www/js/vendor/gasp.js',
    'www/js/vendor/**/dist/*.js',
    'www/js/vendor/**/dist/*.js.map',
    'www/fonts/**',
    'www/*.ico'
  ], {base: "www"})
  .pipe(gulp.dest('dist'));
});

gulp.task('dist-imagemin', function (cb) {
  gulp.src(['img/**'], {cwd:'www'})
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});


gulp.task('watch', ['sass:watch','assemble:watch']);

gulp.task('default', ['sass','assemble']);

gulp.task('dist', ['sass:dist','assemble:dist', 'uglify', 'dist-copy', 'dist-imagemin']);

//Load the assemble config
gulp.task('load', function(cb) {
  app.partials('src/partials/*.hbs');
  app.layouts('src/layouts/*.hbs');
  app.pages('src/pages/**/*.hbs');
  app.create('docs');
  app.docs('src/style-guide/**/*.hbs');
  cb();
});

//Assemble Tasks
app.task('pages', function() {
  return app.toStream('pages')
    .pipe(app.renderFile(helpers()))
    .pipe(htmlmin())
    .pipe(extname())
    .pipe(app.dest('www'));
});
app.task('docs', function() {
  return app.toStream('docs')
    .pipe(app.renderFile(helpers()))
    .pipe(htmlmin())
    .pipe(extname())
    .pipe(app.dest('www/style-guide/'));
});
app.task('pages-dist', function() {
  return app.toStream('pages')
    .pipe(app.renderFile(helpers()))
    .pipe(htmlmin())
    .pipe(extname())
    .pipe(app.dest('dist'));
});

gulp.task('assemble', ['load'], function() {
  app.build(['pages','docs'], function(err) {
    if (err) throw err;
    console.log('done!');
    // cb();
  });
});

gulp.task('assemble:dist', ['load'], function() {
  app.build(['pages-dist'], function(err) {
    if (err) throw err;
    console.log('done with build!');
    // cb();
  });
});

