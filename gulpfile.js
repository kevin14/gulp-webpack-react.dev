var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync('./package.json'));
var EMPTY = "empty:";
var glob = require("glob")
var path = require("path");
var gulp = require('gulp');
var pack = require('gulp-webpack');
var webpack = require('webpack');
var runSequence = require('run-sequence');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var nodeModulesPath = path.resolve(__dirname, "node_modules");
var clean = require('gulp-clean');
//dev entries
var devEntryArray = glob.sync("./dev/pages/*/entry.js");
var devEntries = {}
devEntryArray.forEach(function(entry) {
    var name = entry.split('pages/')[1].split('/entry.js')[0];
    devEntries[name] = path.join(__dirname, entry);
})

var webpackConfig = {
    //devtool: "source-map",    //生成sourcemap,便于开发调试
    entry: devEntries,
    watch: true,
    keepalive: true,
    stats: {
        timings: true
    },
    failOnError: false,
    output: {
        path: path.join(__dirname, "dev/pages/"),
        filename: "[name]/bundle.js"
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loader: "style!css!less"
        }, {
            test: /\.jsx?$/,
            exclude: [nodeModulesPath],
            loader: 'babel',
            query: {
                presets: ['es2015', 'react'],
            }
        }, {
            test: /\.(png|jpg|gif|woff)$/,
            loader: 'url'
        }, {
            test: /\.svg$/,
            loader: 'raw-loader'
        }]
    },
    resolve: {
        alias: {
            common: path.join(__dirname, "dev/common"),
            commonStyles: path.join(__dirname, "dev/common/styles"),
            commonModules: path.join(__dirname, "dev/common/modules"),
            commonMixins: path.join(__dirname, "dev/common/mixins")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
}

function getWebpackProductionConfig() {
    //production entries
    var entryArray = glob.sync("./dist/" + pkg.version + "/pages/*/entry.js");
    var entries = {};
    entryArray.forEach(function(entry) {
        var name = entry.split('pages/')[1].split('/entry.js')[0];
        entries[name] = path.join(__dirname, entry)
    })
    entries.commons = ['jquery', 'react', 'react-dom', 'commonModules/header/header.js'];
    return {
        entry: entries,
        cache: false,
        output: {
            path: path.join(__dirname, "dist/" + pkg.version + "/pages/"),
            filename: "[name]/bundle.js"
        },
        module: {
            loaders: [{
                test: /\.less$/,
                loader: "style!css!less"
            }, {
                test: /\.jsx?$/,
                exclude: [nodeModulesPath],
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react'],
                }
            }, {
                test: /\.(png|jpg|gif|woff)$/,
                loader: 'url'
            }, {
                test: /\.svg$/,
                loader: 'raw-loader'
            }]
        },
        resolve: {
            alias: {
                common: path.join(__dirname, "dist/" + pkg.version + "/common"),
                commonStyles: path.join(__dirname, "dist/" + pkg.version + "/common/styles"),
                commonModules: path.join(__dirname, "dist/" + pkg.version + "/common/modules"),
                commonMixins: path.join(__dirname, "dist/" + pkg.version + "/common/mixins")
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            }),
            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                compress: {
                    warnings: false
                }
            }),
            new CommonsChunkPlugin({
                name: "commons",
                filename: "commons.js",
                minChuncks: Infinity
            })
        ]
    }

}

//gulp tasks
gulp.task('dev', function() {
    return gulp.src('dev/**/entry.js')
        .pipe(pack(webpackConfig))
        .pipe(gulp.dest('dev/pages/'))
})

gulp.task('copy', function() {
    return gulp.src('dev/**/*')
        .pipe(gulp.dest('dist/' + pkg.version + '/'))
})

gulp.task('clean',function(){
    return gulp.src('dist/' + pkg.version + '/*')
        .pipe(clean())
})

gulp.task('publish',function(){
    return gulp.src('dist/' + pkg.version + '/**/entry.js')
        .pipe(pack(getWebpackProductionConfig()))
        .pipe(gulp.dest('dist/' + pkg.version + '/pages/'))
})

gulp.task('pack',function(){
    runSequence('clean','copy','publish')
});