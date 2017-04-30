// required plugins
var gulp =              require('gulp'),
    sass =              require('gulp-sass'),
    uglify =            require('gulp-uglify'),
    cssnano =           require('gulp-cssnano'),
    imagemin =          require('gulp-imagemin'),
    rename =            require('gulp-rename'),
    del =               require('del'),
    concat =            require('gulp-concat'),
    autoprefixer =      require('gulp-autoprefixer'),
    browserSync =       require('browser-sync').create(),
    nunjucksRender =    require('gulp-nunjucks-render');


var manageEnvironment = function(environment) {
    environment.addFilter('slug', function(str) {
        return str && str.replace(/\s/g, '-', str).toLowerCase();
    });

    var d = new Date();
    var n = d.getFullYear();

    environment.addGlobal('timestamp', Math.floor(Date.now() / 1000));
    environment.addGlobal('currentYear', n);
};

// generate markup from templates
gulp.task('nunjucks', function() {
    return gulp.src('source/pages/**/*.nunjucks')
    .pipe(nunjucksRender({
        path: ['source/templates'],
        manageEnv: manageEnvironment
    }))
    .on('error', onError)
    // output files in app folder
    .pipe(gulp.dest(''));
});

// concatenate and minify js
gulp.task('js', function(){
    return gulp.src(['source/js/jquery-3.0.0.js', 'source/js/quiz.js', 'source/js/frontend.js'])
        .pipe(concat('concat.js'))
        .on('error', onError)
        .pipe(gulp.dest('js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'))
        .on('end', function() {
            del(['js/concat.js']);
        })
        .pipe(browserSync.stream())
    ;
});

// sass compile to css and minify (while also reporting errors)
gulp.task('sass', function() {
    gulp.src('source/scss/**/*.scss')
        .pipe(sass())
        .on('error', onError)
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cssnano())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.stream())
    ;
});

// compress and move images to final location
gulp.task('images', function(){
  return gulp.src('source/images/**/*.+(png|jpg|gif|svg|ico)')
             .pipe(imagemin())
             .pipe(gulp.dest('images'));
});

// move fonts from src to bundle
gulp.task('fonts', function() {
  return gulp.src('source/fonts/**/*')
             .pipe(gulp.dest('fonts'));
});


// default task / watcher
gulp.task('default', ['sass', 'js'], function () {
    gulp.watch("source/scss/**/*.scss", ['sass']);
    gulp.watch("source/js/**/*.js", ['js']);
});

// default with serve on localhost:3000
gulp.task('serve', ['sass', 'nunjucks', 'js'], function() {
    browserSync.init({
        server: "./"
    });
    gulp.watch('source/**/*.nunjucks', ['nunjucks']);
    gulp.watch("source/js/**/*.js", ['js']);
    gulp.watch("source/scss/**/*.scss", ['sass']);
    gulp.watch("source/scss/**/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

/**
 * Methods
 */

// error handling
function onError(err) {
    console.log(err);
    this.emit('end');
}
