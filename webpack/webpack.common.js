const path = require('path');
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

module.exports = {
    entry:
    {
        app: './src/app.tsx',
    },
    output: {
        path: path.resolve(__dirname, '../www'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            src: path.resolve(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: ['babel-loader'], exclude: /node_modules/ },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
        ],
    },
    plugins: [
        new DefinePlugin({
            'process.env': {
                COMMIT_HASH: JSON.stringify(commitHash),
            },
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            filename: 'index.html',
            inject: 'body',
            chunks: ['app'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../assets'), to: 'assets' },
            ],
        })
    ]
}
