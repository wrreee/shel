const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {resolve} = require("path");

module.exports = {
    entry: './src/index.js',
    resolve: {
        extensions: ['.js'],
        symlinks: true,
    },
    output: {
        filename: 'main.js',
        path: resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: [/node_modules/],
            loader: "babel-loader"
        }, {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /\.s[ac]ss$/i,
            use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
            ],
        }, {
            test: /\.html$/,
            use: {loader: 'html-loader'}
        }]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
    ],
};

const a = {
    devtool: 'source-map',
    entry: './src/index.js',
    resolve: {
        extensions: ['.js'],
        symlinks: true,
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/node_modules/, /\.paper.js$/],
            loader: "babel-loader"
        }, {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /phaser\.js$/,
            loader: 'expose-loader?Phaser'
        }, {
            test: /\.html$/,
            exclude: [/node_modules/, /\.paper.js$/],
            use: {loader: 'html-loader'}
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            })
        }, {
            test: /\.paper.js$/,
            use: ["babel-loader", "paper-loader"]
        }]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new ExtractTextPlugin('style.css')
    ],
    devServer: {},
};