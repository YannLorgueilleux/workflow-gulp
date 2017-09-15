// acces à la console
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && npm install
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp watch


// Requis
var gulp = require('gulp');
// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json
// inclus les autres fichiers Tâche
//var requireDir = require('require-dir');
//var tasks = requireDir('./gulp-tasks');


// init de browser synchronisation
var browserSync = require('browser-sync').create();

// init run Sequence
var runSequence = require('run-sequence');




// Variables de chemins
var src = './src'; // dossier de travail
var tmp = './tmp'; // dossier temporaire
var dist = './dist'; // dossier à livrer



//=====BUILD ==================================

// tâche de nettoyage
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp clean
var del = require('del');

gulp.task('clean', function () {
  console.log('===================== TACHES : CLEAN =======================');
  return del(['tmp', 'dist']);
});




// Taches sur CSS
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp scss
gulp.task('scss', function () {
 console.log('BUIL ===================== TACHES : SCSS =======================');
  return gulp.src('src/_assets/css/styles.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.scss())

    //.pipe(plugins.csscomb())
    //.pipe(plugins.cssbeautify({indent: '  '}))
    .pipe(plugins.autoprefixer())

    .pipe(gulp.dest('tmp/_assets/css/'))

    // Synchronisation du navigateur
    .pipe(browserSync.reload({
      stream: true
    }))
    ;
});


// INSERTION de blocs  HTML
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp inserthtml
var extender = require('gulp-html-extend')
gulp.task('inserthtml', function () {
  console.log('BUILD ===================== TACHES : INSERT HTML =======================');
  return gulp.src(
    'src/{,_includes/}/{,livres/}*.html'
    //  ['src/*.html'] , //select all files html du niveau 1
    )
    .pipe(plugins.plumber())
    // Generates HTML includes
     .pipe(extender({
       annotations: false,
       verbose: false
     })) // default options

    .pipe(gulp.dest('tmp'))

    // Synchronisation du navigateur
    .pipe(browserSync.reload({
      stream: true
    }))
});

// PROD==========================================================================


// Tâche "minify" = minification CSS (destination -> destination)
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp minifycss
gulp.task('minifycss', function () {
  console.log('===================== TACHES : MINIFY CSS =======================');
  return gulp.src('tmp/_assets/css/styles.css')
    .pipe(plugins.plumber())
    .pipe(plugins.csso())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/_assets/css/'));
});



// Tâche "critical" = inline css supérieur à la ligne de flotaison
// from : https://www.fourkitchens.com/blog/article/use-gulp-automate-your-critical-path-css/
// from : https://github.com/addyosmani/critical
//
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp critical
//
var gutil = require('gulp-util');
var critical = require('critical').stream;

// Generate & Inline Critical-path CSS
gulp.task('critical', function () {
    console.log('===================== TACHES : CRITICAL =======================');
    return gulp.src('tmp/*.html')
        .pipe(critical({
          base: 'tmp/',
          inline: true,
          minify:true,
          extract: true,
          css: ['dist/_assets/css/styles.min.css']}))
        .on('error', function(err) {
          gutil.log(gutil.colors.red(err.message));
        })
        .pipe(gulp.dest('dist'))

        // Synchronisation du navigateur
        // .pipe(browserSync.reload({
        //   stream: true
        // }))
        ;
});

// ================================================


// lancements automatiques
gulp.task('watch', ['browserSync' ] , function(){
  gulp.watch('src/_assets/css/**/*.scss', ['scss']);
  // Other watchers
  gulp.watch('src/{,_includes/}*.html',{cwd:'./'}, ['inserthtml'] , browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);

  gulp.watch('tmp/**/*.html' , browserSync.reload);
})


// Synchronisation du navigateur
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir:[ 'tmp', 'dist']
    },
  })
})

// Synchronisation du navigateur
gulp.task('browserSyncProd', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

// ===========================================

// Tâche "build"
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp build
//gulp.task('build', ['scss', 'inserthtml' , 'browserSync'] );


gulp.task('build', function(callback) {
  runSequence( ['scss', 'inserthtml'],

              callback);
});



// Tâche "prod" = Build + minify
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp prod
//gulp.task('prod', [ 'minifycss' , 'critical' , 'browserSyncProd']);


gulp.task('prod', function(callback) {
  runSequence('build',
              'minifycss',
              ['critical'],
              'browserSyncProd',
              callback);
});

// Tâche par défaut
 // cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp
gulp.task('default', ['build', 'watch']);
