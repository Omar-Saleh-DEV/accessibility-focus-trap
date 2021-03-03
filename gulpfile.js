const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');
const gulpif = require('gulp-if');
const path = require('path');
//
//
const buildPath = './'; // DEV
const distPath = './dist/'; // PROD

const jsInput = 'scripts/**/*.js';
const cssInput = 'scss/**/*.scss';
const cssOutputBuild = buildPath + 'build/css';
const cssOutputDist = distPath + 'css';


////////////////////////////////////////////////////////////////////////////////////
// TWIG TASKS
////////////////////////////////////////////////////////////////////////////////////
const twig = require('gulp-twig');
const viewsIndexInput = './views/pages/*.twig';

gulp.task('views', function () {
  return gulp
    .src(viewsIndexInput)
    .pipe(
      twig({
        data: {
          imagePath: argv.prod ? '../../assets' : '../assets',
          datas: {},
          direction: 'ltr' ,
          jsfiles: JSON.parse(fs.readFileSync(argv.prod ?'./dist/scripts/entrypoints.json':'./build/scripts/entrypoints.json'))
        },
        extend: function (Twig) {
          Twig.exports.extendFilter("t", function (value) {
            return value;
          });
          Twig.exports.extendFilter("raw", function (value) {
            return value;
          });
          Twig.exports.extendFunction("is_mobile", function (value, times) {
            return argv.mobile ? true : false;
          });
          Twig.exports.extendFunction("is_tablet", function (value, times) {
            return argv.tablet ? true : false;
          });
        }
      })
    )
    .pipe(
      gulpif(argv.prod, gulp.dest(distPath), gulp.dest(buildPath + 'build/'))
    )
    .on('end', function () {
      console.log(
        'views for ' + (argv.prod ? 'production' : 'development')
      );
    })
    .pipe(
      browsersync.reload({
        stream: true
      })
    );
});


////////////////////////////////////////////////////////////////////////////////////
// SASS TASKS
////////////////////////////////////////////////////////////////////////////////////
const argv = require('yargs').argv;
const sassVariables = require('gulp-sass-variables');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  return gulp
    .src('scss/style.scss')
    .pipe(
      sassVariables({
        $env: argv.prod ? 'production' : 'development',
        $dir: argv.rtl ? 'rtl' : 'ltr',
        $noerror: argv.noerror ? true : false,
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'expanded' // minifies style.min.css
      })
    )
    .pipe(autoprefixer({
      browsers: ['> 0%', 'IE 9'],
      cascade: false
    }))
    .pipe(
      gulpif(
        argv.prod,
        gulp.dest(cssOutputDist),
        gulp.dest(cssOutputBuild)
      )
    )
    .pipe(gulpif(!argv.prod, sourcemaps.write('./')))
    .pipe(
      gulpif(
        argv.prod,
        gulp.dest(cssOutputDist),
        gulp.dest(cssOutputBuild)
      )
    )
    .on('end', function () {
      console.log(
        'sass for ' + (argv.prod ? 'production' : 'development')
      );
    })
    .pipe(
      browsersync.reload({
        stream: true
      })
    );
});


////////////////////////////////////////////////////////////////////////////////////
// JAVASCRIPT TASK
////////////////////////////////////////////////////////////////////////////////////
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('scripts', function () {
  return gulp.src(path.resolve(__dirname, '/scripts/pages/*.js'))
    .pipe(webpackStream(webpackConfig.init(argv.prod)))
    .pipe(gulpif(argv.prod, gulp.dest(distPath + 'scripts'), gulp.dest(buildPath + 'build/scripts')))
    .pipe(
      browsersync.reload({
        stream: true
      })
    );
});




////////////////////////////////////////////////////////////////////////////////////
// COPY FOLDERS TASKS
////////////////////////////////////////////////////////////////////////////////////
gulp.task('copyfonts', function () {
  return gulp
    .src(['fonts/**'])
    .pipe(gulp.dest(distPath + 'fonts'))
    .on('end', function () {
      console.log(
        'copyfonts for ' + (argv.prod ? 'production' : 'development')
      );
    });
});

gulp.task('copyassets', function () {
  return gulp
    .src(['assets/**'])
    .pipe(gulp.dest(distPath + 'assets'))
    .on('end', function () {
      console.log(
        'copyassets for ' + (argv.prod ? 'production' : 'development')
      );
    });
});

gulp.task('copyjsvendor', function () {
  return gulp
    .src(['scripts/vendor/**/**.js'])
    .pipe(gulpif(argv.prod, gulp.dest(distPath + 'scripts/vendor/'), gulp.dest(buildPath + 'build/scripts/vendor/')))
    .on('end', function () {
      console.log(
        'copyjsvendor for ' + (argv.prod ? 'production' : 'development')
      );
    });
});

////////////////////////////////////////////////////////////////////////////////////
// BROWSERSYNC TASKS
////////////////////////////////////////////////////////////////////////////////////
const browsersync = require('browser-sync');
gulp.task('browser-sync', function () {
  browsersync.init({
    startPath: buildPath + 'build',
    server: {
      baseDir: buildPath
    }
  });
});

gulp.task('browsersync-reload', function () {
  browsersync.reload();
});

////////////////////////////////////////////////////////////////////////////////////
// IMAGE MIN TASK
////////////////////////////////////////////////////////////////////////////////////
const imagemin = require('gulp-imagemin');

gulp.task('imagemin', function () {
  gulp
    .src('assets/test/**')
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true
        }),
        imagemin.jpegtran({
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 7
        }),
        imagemin.svgo({
          plugins: [{
              removeViewBox: true
            },
            {
              cleanupIDs: false
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest('assets/test/opti'));
});

////////////////////////////////////////////////////////////////////////////////////
// GULP TASKS
////////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', ['browser-sync', 'sass', 'views'], function () {
  gulp.watch(cssInput, ['sass']);
  gulp.watch(jsInput, ['scripts']);
  gulp.watch('./datas/**/*.json', ['views']);
  gulp.watch('./views/**/*.twig', ['views']);
});

gulp.task('default', ['watch']);
gulp.task('copy', ['copyfonts', 'copyassets']);

gulp.task('compile', ['scripts', 'sass', 'copyassets', 'views']);
