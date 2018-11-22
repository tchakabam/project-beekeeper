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
            extensions: ['.js', '.ts', '.tsx']
        },
        externals: target === 'node' ? [nodeExternals()] : ['request'],
        module: {
            rules: [
                //{ test: /\.js$/, exclude: [/node_modules/], loader: 'ts-loader' },
                { test: /\.ts$/, exclude: [/node_modules/], loader: 'ts-loader' },
                { test: /\.tsx$/, exclude: [/node_modules/], loader: 'ts-loader' },
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
    makeConfig({libName: 'BeekeeprMonitoring', entry: './lib/monitoring/index', mode: 'development'}),
    makeConfig({libName: 'BeekeeprHeadlessAgent', entry: './lib/headless-agent/index', mode: 'development'}),
    makeConfig({libName: 'BeekeeprHlsjsLoader', entry: './lib/hlsjs-loader/index', mode: 'development'}),
    makeConfig({libName: 'BeekeeprHeadlessAgentNode', entry: './lib/headless-agent/index', mode: 'development', target: 'node'})
];
