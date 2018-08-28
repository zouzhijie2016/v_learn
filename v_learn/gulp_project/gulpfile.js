var gulp = require("gulp");
var minifyCss = require("gulp-minify-css");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var del = require('del');
var rename = require('gulp-rename');

gulp.task("gulp-js",function () {
		gulp
			.src('js/**/*.js')
			.pipe(rename({ suffix : ".min" }))
			.pipe(uglify())
			.pipe(rev())
			.pipe(gulp.dest('dist-js'));
			//.pipe(rev.manifest())
	        //.pipe(gulp.dest('./dist-rev-js'));
});

gulp.task("gulp-css",function () {
	gulp
			.src('css/**/*.css')
			.pipe(rename({ suffix : ".min" }))
			.pipe(minifyCss())
			.pipe(rev())
			.pipe(gulp.dest('dist-css'));
			//.pipe(rev.manifest())
			//.pipe(gulp.dest('dist-rev-css'));
});

gulp.task('revC', function() {
	gulp.src(['dist-rev-css', 'dist-rev-js'])
	.pipe(revCollector())
	.pipe(gulp.dest('dist-revC'));
});


gulp.task('clean', function (cb) {
	return del(['dist-css','dist-js'],cb);
});

gulp.task('default',["clean"],function () {
	gulp.start('gulp-js','gulp-css');
});

gulp.watch('js/*.js',['gulp-js']);
gulp.watch('js/*.js',['gulp-css']);