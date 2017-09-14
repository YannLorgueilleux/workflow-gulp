// acces à la console
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && gulp watch
// cd C:\wamp64\www\yann-lorgueilleux.info\workflow-gulp && npm install

// Requis
var gulp = require('gulp');

// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json


var requireDir = require('require-dir');
requireDir('./gulps/', { recurse: true });


// init de browser synchronisation
var browserSync = require('browser-sync').create();



// Variables de chemins
var src = './src'; // dossier de travail
var tmp = './tmp'; // dossier temporaire
var dist = './dist'; // dossier à livrer





// Taches sur CSS
gulp.task('scss', function () {

 console.log('----------------------------- Building files');

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


// Tâche "minify" = minification CSS (destination -> destination)
gulp.task('minify', function () {
  return gulp.src('tmp/_assets/css/styles.css')
    .pipe(plugins.plumber())
    .pipe(plugins.csso())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/_assets/css/'));
});



// develppement HTML
var extender = require('gulp-html-extend')

gulp.task('html', function () {
  return gulp.src(
    'src/{,_includes/}/{,livres/}*.html'
  //  ['src/*.html'] , //select all files html du niveau 1



  )

  // Generates HTML includes
     .pipe(extender({
       annotations: false,
       verbose: false
     })) // default options

    .pipe(gulp.dest(tmp))


    // Synchronisation du navigateur
    .pipe(browserSync.reload({
      stream: true
    }))




});




var del = require('del');

gulp.task('clean', function () {
  del(['tmp', 'dist']);
});









// Tâche "build"
gulp.task('build', ['scss', 'html']);


// Tâche "prod" = Build + minify
gulp.task('prod', ['build',  'minify' ]);


// Tâche par défaut
gulp.task('default', ['build', 'watch']);
