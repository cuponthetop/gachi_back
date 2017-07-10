const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const apidoc = require('gulp-apidoc');
const babel = require('gulp-babel');
const path = require('path');


gulp.task('api', (done) => {
  var apidocOpts = {
    src: "lib/routes/",
    dest: "doc/apidoc/"
  };

  apidoc(apidocOpts, done);
});

gulp.task('babel', () => {
  return gulp.src('lib/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('compile', (done) => {
  runSequence('babel', done);
});
