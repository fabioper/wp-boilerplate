const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    mode: 'development',
    target: 'web',
    entry: path.resolve(__dirname, 'src', 'scripts', 'app.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Static Website Boilerplate',
            template: path.resolve(
                __dirname,
                'src',
                'templates',
                'pages',
                'index.hbs'
            )
        })
    ],
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'],
        alias: {
            Assets: path.resolve(__dirname, 'src/assets/'),
            Scripts: path.resolve(__dirname, 'src/scripts/')
        }
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        watchContentBase: true,
        open: true,
        historyApiFallback: true
        // writeToDisk: true
    }
};

module.exports = config;
