const path = require('path');
const webpack = require('webpack');

const PATHS = {
    build: path.join(__dirname, 'js-built'),
    node: path.join(__dirname, 'node_module')
};

module.exports = {
    entry: {
        vendor1: [
            "react",
            "react-dom",
            "eventemitter2",
            "flux",
            "jquery",
            "tablefilter"
        ],
        vendor2: [
            "d3",
            "c3"
        ],
        vendor3:[
            "leaflet",
            "esri-leaflet",
            "leaflet-draw",
            "proj4leaflet",
        ],
        vendor4:[
            "react-masonry-component",
            "react-popupbox",
            'fancybox',
            "react-addons-css-transition-group",
            "react-addons-transition-group",
            "perfect-scrollbar",
        ],
        vendor5:[
            "semantic-ui-react"            
        ],
        vendor6:[
            "datejs"
        ]
    },
    output: {
        filename: '[name].dll.js',
        path: PATHS.build,
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(PATHS.build, "[name]-manifest.json")
        }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            // Don't beautify output (enable for neater output)
            beautify: false,

            // Eliminate comments
            comments: true,

            // Compression specific options
            compress: {
                warnings: false,

                // Drop `console` statements
                drop_console: true
            },

            // Mangling specific options
            mangle: false,

            // Don't include source map
            sourcemap: false
        })
    ]
};
