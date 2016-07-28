'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

var htmlmin = require('gulp-htmlmin');
var extname = require('gulp-extname');
var assemble = require('assemble');
var helpers = require('handlebars-helpers');
var app = assemble();
var src = 'src';

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
  	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
   .pipe(gulp.dest('./www/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('sass/**/*.scss', {cwd: src}, ['sass']);
});

gulp.task('assemble:watch', function () {
  gulp.watch('**/*.hbs', {cwd: src}, ['assemble']);
});


gulp.task('watch', ['sass:watch','assemble:watch']);

gulp.task('default', ['sass','assemble']);

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

gulp.task('assemble', ['load'], function() {
  app.build(['pages','docs'], function(err) {
    if (err) throw err;
    console.log('done!');
    // cb();
  });

});
