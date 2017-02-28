const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'js/app3.0'),
    build: path.join(__dirname, 'js-built'),
    node: path.join(__dirname, 'node_module')
};

const common = {
    cache: true,
    // Entry accepts a path or an object of entries. We'll be using the
    // latter form given it's convenient with more complex configurations.
    resolve: {
        modulesDirectories: ['', 'node_modules'],
        extensions: ['', '.js', '.jsx']
    },
    entry: {
        app: path.join(PATHS.app, 'main.js'),
        //vendor: ["react", "react-dom", "eventemitter2", "flux", "jquery", "jquery-ui", "d3", "c3", "leaflet", "esri-leaflet", "leaflet-draw", "proj4", "proj4leaflet", "turf", "datejs", "perfect-scrollbar"],
    },
    output: {
        path: PATHS.build,
        filename: 'main-built.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader?cacheDirectory',
            include: PATHS.app,
            exclude: /node_modules/
        }]
    },
    externals: {
        "esri": "esri-leaflet"
    },
    plugins: [
        //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"common.bundle.js"),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(PATHS.build, "vendor1-manifest.json"))
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(PATHS.build, "vendor2-manifest.json"))
        }),
        new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production'),
            }
        })
    ]
};


// Default configuration
if (TARGET === 'start') {
    console.log("START Configuration");
    module.exports = merge(common, {
        devServer: {
            contentBase: PATHS.build,

            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: false,
            hot: true,
            inline: false,
            progress: false,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            // Parse host and port from env so this is easy to customize.
            //
            // If you use Vagrant or Cloud9, set
            // host: process.env.HOST || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices unlike default
            // localhost
            host: process.env.HOST,
            port: process.env.PORT
        },
        devtool: 'cheap-module-source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
} else if (TARGET === 'dev' || !TARGET) {
    console.log("DEV Configuration");
    module.exports = merge(common, {
        devtool: '#cheap-module-source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                test: /\.css$/,
                loader: 'style!css?-minize'
            })
        ]
    });
} else {
    console.log("PRD Configuration");
    module.exports = merge(common, {
        devtool: '#cheap-module-source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                // Don't beautify output (enable for neater output)
                beautify: false,

                // Eliminate comments
                comments: false,

                // Compression specific options
                compress: {
                    warnings: false,

                    // Drop `console` statements
                    drop_console: true
                },

                // Mangling specific options
                mangle: {
                    // Don't mangle $
                    except: ['$'],

                    // Don't care about IE8
                    screw_ie8 : true,

                    // Don't mangle function names
                    keep_fnames: true
                },

                // Don't include source map
                sourceMap: true,

                test: /\.css$/,
                loader: 'style!css?-minize'
            })
        ]
    });
}
