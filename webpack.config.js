/* eslint-disable no-unused-vars */
/* eslint-disable id-length */
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const appConfig = require('./config.json');
const templatesPath = path.resolve(__dirname, 'src', 'templates', 'pages');
const InjectPlugin = require('webpack-inject-plugin').default;

const templatesPages = fs.readdirSync(
    path.resolve(__dirname, 'src', 'templates', 'pages'),
    'utf-8'
);

const generateTemplates = templates =>
    templates.map(
        template =>
            new HtmlWebpackPlugin({
                filename: template.replace(/\.(.*)/, '.html'),
                template: path.resolve(templatesPath, template),
                meta: {
                    description: appConfig.description,
                    author: appConfig.author
                }
            })
    );

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
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')()]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [
                    {
                        loader: 'handlebars-loader',
                        options: { inlineRequires: '/assets/images' }
                    },
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '.hbs',
                            replace: '.html',
                            flags: ''
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
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
                                convertPathData: true
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new InjectPlugin(() => 'import \'styles/main.scss\';'),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false
        }),
        ...generateTemplates(templatesPages),
        new FaviconsWebpackPlugin({
            devMode: 'webapp',
            logo: path.resolve(__dirname, appConfig.logo),
            favicons: {
                appName: appConfig.name,
                appDescription: appConfig.description,
                background: appConfig.background,
                theme_color: appConfig.theme_color
            }
        })
    ],
    resolve: {
        extensions: [
            '.wasm',
            '.mjs',
            '.js',
            '.jsx',
            '.json'
        ],
        alias: {
            assets: path.resolve(__dirname, 'src/assets/'),
            styles: path.resolve(__dirname, 'src/styles/'),
            scripts: path.resolve(__dirname, 'src/scripts/')
        }
    },
    devtool: 'inline-source-map',
    optimization: {
        minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin({})]
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
