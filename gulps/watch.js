
// TACHE WATCH

// DEPENDENCIES
var gulp = require('gulp');


// init de browser synchronisation
var browserSync = require('browser-sync').create();



// lancements automatiques
gulp.task('watch', ['browserSync' ] , function(){
  gulp.watch('src/_assets/css/**/*.scss', ['scss']);
  // Other watchers
  gulp.watch('src/{,_includes/}*.html',{cwd:'./'}, ['html'] , browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);

  gulp.watch('tmp/**/*.html' , browserSync.reload);
})


// Synchronisation du navigateur
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'tmp'
    },
  })
})
