const path = require('path')
const fs = require('fs')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InjectPlugin = require('webpack-inject-plugin').default
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const appConfig = require('./config.json')

const rootFolderName = path.basename(path.resolve(__dirname, '..', '..', '..'))

const phpFilesPath = path.resolve(__dirname, 'src', 'pages')

const phpFiles = fs.readdirSync(phpFilesPath, 'utf-8').filter(content => {
    return path.extname(content).includes('php')
})

const config = {
    entry: path.resolve(__dirname, 'src', 'scripts', 'main.js'),
    output: {
        path: __dirname,
        filename: 'assets/scripts/[name].js',
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
                test: /\.php$/,
                use: [
                    { loader: 'html-loader' },
                    {
                        loader: 'markup-inline-loader',
                        options: {
                            svgo: {
                                plugins: [
                                    { removeTitle: true },
                                    { removeUselessStrokeAndFill: false },
                                    { removeUnknownsAndDefaults: false }
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
                            name: 'assets/img/[name].[ext]'
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
                            gifsicle: { interlaced: false },
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
        new InjectPlugin(() => 'import \'Styles/main.scss\';'),
        new MiniCssExtractPlugin({
            filename: 'style.css',
            chunkFilename: '[id].css',
            ignoreOrder: false
        }),
        ...handlePhp(phpFiles),
        new BrowserSyncPlugin({
            port: 3000,
            // host: 'localhost',
            files: '*.php',
            // injectChanges: true,
            // server: { baseDir: ['public'] }
            proxy: `http://localhost/${rootFolderName}/`
        })
    ],
    resolve: {
        alias: { Styles: path.resolve(__dirname, 'src', 'styles') },
        extensions: ['.js', '.json'],
    },
    optimization: {
        minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin({})]
    },
    devtool: 'inline-source-map',
    watch: true,
    devServer: { writeToDisk: true },
    target: 'web'
}

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
