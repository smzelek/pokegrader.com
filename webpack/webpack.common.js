const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:
    {
        app: './src/app.tsx',
    },
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            "src": path.resolve(__dirname, '../src'),
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
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            filename: 'index.html',
            inject: 'body',
            chunks: ['app'],
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../assets'), to: 'assets' },
            ],
        })
    ]
}
