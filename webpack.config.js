const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
    mode: 'development',
    target: 'web',
    entry: path.resolve(__dirname, 'src', 'scripts', 'app.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                use: {
                    loader: 'handlebars-loader',
                    options: { inlineRequires: '/assets/img' }
                }
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                if (process.env.NODE_ENV !== 'production') {
                                    return 'assets/img/[name].[ext]';
                                }

                                return 'assets/img/[contenthash].[ext]';
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            webp: {
                                quality: 75
                            },
                            svgo: {
                                removeTitle: true,
                                convertColors: { shorthex: false },
                                convertPathData: false
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
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
    devtool: 'source-map',
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
