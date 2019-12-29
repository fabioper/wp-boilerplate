/* eslint-disable func-style */
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const InjectPlugin = require('webpack-inject-plugin').default
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const appConfig = require('./config.json')
const rootFolderName = path.basename(path.resolve(__dirname, '..', '..'))

const phpFilesPath = path.resolve(__dirname, 'src', 'pages')
const phpFiles = fs.readdirSync(phpFilesPath, 'utf-8')
    .filter(content => path.extname(content).includes('php'))

const config = {
    target: 'web',
    entry: path.resolve(__dirname, 'src', 'scripts', 'app.js'),
    output: {
        path: __dirname,
        filename: '[name].js',
        publicPath: path.join('wp-content', 'themes', path.basename(__dirname))
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('postcss-fixes')(), require('autoprefixer')(), require('cssnano')({ safe: true, calc: false })]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            data: `
/*!
    Theme Name: ${appConfig.name}
    Theme URI: ${appConfig.uri}
    Author: ${appConfig.author}
    Author URI: ${appConfig.authorUri}
    Description: ${appConfig.description}
    Version: ${appConfig.version}
    Tags: ${appConfig.tags}
*/
`
                        }
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
                test: /\.php$/,
                use: [
                    { loader: 'html-loader' },
                    {
                        loader: 'markup-inline-loader',
                        options: {
                            svgo: {
                                plugins: [
                                    {
                                        removeTitle: true
                                    },
                                    {
                                        removeUselessStrokeAndFill: false
                                    },
                                    {
                                        removeUnknownsAndDefaults: false
                                    }
                                ]
                            }
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
                            name() {
                                if (process.env.NODE_ENV !== 'production') {
                                    return 'assets/img/[name].[ext]'
                                }

                                return 'assets/img/[contenthash].[ext]'
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
                            webp: { quality: 75 },
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
        new InjectPlugin(() => 'import \'Styles/main.scss\';'),
        new MiniCssExtractPlugin({
            filename: 'style.css',
            chunkFilename: '[id].css',
            ignoreOrder: false
        }),
        ...handlePhp(phpFiles)
    ],
    resolve: {
        extensions: [
            '.wasm',
            '.mjs',
            '.js',
            '.jsx',
            '.json',
            '.ts',
            '.tsx'
        ],
        alias: {
            Styles: path.resolve(__dirname, 'src', 'styles')
        }
    },
    stats: {
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        moduleTrace: true,
        assetsSort: 'field',
        cached: true,
        colors: true,
        logging: 'info',
        modulesSort: 'field',
        outputPath: true,
        source: true,
        publicPath: true,
        entrypoints: true,
        builtAt: true,
        errorDetails: true,
        assets: true
    },
    devtool: 'inline-source-map',
    optimization: {
        minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin({})]
    }
}

config.devServer = {
    compress: true,
    port: 8080,
    watchContentBase: true,
    open: true,
    historyApiFallback: true,
    writeToDisk: true,
    proxy: {
        '/': {
            target: `http://localhost/${rootFolderName}/`,
            changeOrigin: true
        }
    },
    publicPath: `http://localhost/${rootFolderName}/`,
    contentBase: config.output.path
}

console.log(`http://localhost/${rootFolderName}/`)

function handlePhp(templates) {
    return templates.map(template =>
        new HtmlWebpackPlugin({
            filename: template.replace(/\.(.*)/, '.php'),
            template: path.resolve(phpFilesPath, template),
            meta: {
                description: appConfig.description,
                author: appConfig.author
            },
            inject: false
        })
    )
}

module.exports = config
