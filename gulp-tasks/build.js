

// Requis
var gulp = require('gulp');
// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// init de browser synchronisation
var browserSync = require('browser-sync').create();
// init gulpSequence
var gulpSequence = require('gulp-sequence')
