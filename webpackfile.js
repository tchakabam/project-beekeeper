const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const OUTPUT_PATH = 'build';

function makeConfig({libName, entry, mode, target}) {
    return {
        mode: mode || 'development',
        target: target || 'web',
        entry,
        resolve: {
            // Add `.ts` as a resolvable extension.
            extensions: ['.ts', '.js']
        },
        externals: target === 'node' ? [nodeExternals()] : [/* put web externals here */],
        module: {
            rules: [
                // all files with a `.ts` extension will be handled by `ts-loader`
                { test: /\.ts?$/, exclude: [/node_modules/], loader: 'ts-loader' },
            ]
        },
        output: {
            filename: libName + '.umd.js',
            path: path.resolve(__dirname, OUTPUT_PATH),
            publicPath: '/' + OUTPUT_PATH + '/',
            library: libName,
            libraryTarget: 'umd',
        },
        devtool: 'source-map',
        plugins: [
            new webpack.DefinePlugin({
                __VERSION__: JSON.stringify(require('./package.json').version)
            })
        ]
    };
}

module.exports = [
    makeConfig({libName: 'BeekeeprCore', entry: './lib/core/index', mode: 'development'}),
    makeConfig({libName: 'BeekeeprUniversalEngine', entry: './lib/universal-engine/index', mode: 'development'}),
    makeConfig({libName: 'BeekeeprHlsjsLoader', entry: './lib/hlsjs-loader/index', mode: 'development'}),
    makeConfig({libName: 'BeekeeprUniversalEngineNode', entry: './lib/universal-engine/index', mode: 'development', target: 'node'})
];
