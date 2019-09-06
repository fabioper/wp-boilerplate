const path = require('path');
const fs = require('fs');
const slug = require('slug');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const templatesPath = path.resolve(__dirname, 'src', 'templates', 'pages');
const InjectPlugin = require('webpack-inject-plugin').default;

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const appConfig = require('./config.json');

const templatesPages = fs.readdirSync(
    path.resolve(__dirname, 'src', 'templates', 'pages'),
    'utf-8'
);

const convertTemplatesTo = extension => templates =>
    templates.map(
        template =>
            new HtmlWebpackPlugin({
                filename: template.replace(/\.(.*)/, extension),
                template: path.resolve(templatesPath, template),
                meta: {
                    description: appConfig.description,
                    author: appConfig.author
                }
            })
    );

const filterBy = (extension, templates) =>
    templates.filter(template => path.extname(template) === extension);

const transformHandlebarsToHTML = templates =>
    convertTemplatesTo('.html')(filterBy('.hbs', templates));

const transformPHP = templates =>
    convertTemplatesTo('.php')(filterBy('.php', templates));

const config = {
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
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('postcss-fixes')(),
                                require('autoprefixer')(),
                                require('cssnano')({ safe: true, calc: false })
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            data: `
/*!
    Theme Name: ${appConfig.theme.name}
    Theme URI: ${appConfig.theme.uri}
    Author: ${appConfig.theme.author}
    Author URI: ${appConfig.theme.author_uri}
    Description: ${appConfig.theme.description}
    Version: ${appConfig.theme.version}
    License: ${appConfig.theme.license}
    License URI: ${appConfig.theme.license_uri}
    Text Domain: ${appConfig.theme.text_domain}
    Tags: ${appConfig.theme.tags}
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
                test: /\.(hbs|php)$/,
                use: [
                    {
                        loader: 'handlebars-loader',
                        options: { inlineRequires: '/assets/images' }
                    },
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
        new InjectPlugin(() => "import 'styles/main.scss';"),
        new MiniCssExtractPlugin({
            filename: 'style.css',
            chunkFilename: '[id].css',
            ignoreOrder: false
        }),
        ...transformHandlebarsToHTML(templatesPages),
        ...transformPHP(templatesPages),
        new FaviconsWebpackPlugin({
            devMode: 'webapp',
            logo: path.resolve(__dirname, appConfig.logo),
            favicons: {
                appName: appConfig.name,
                appDescription: appConfig.description,
                background: appConfig.background,
                theme_color: appConfig.theme_color,
                icons: {
                    ...appConfig.favicons
                }
            }
        })
    ],
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'],
        alias: {
            assets: path.resolve(__dirname, 'src/assets/'),
            styles: path.resolve(__dirname, 'src/styles/'),
            scripts: path.resolve(__dirname, 'src/scripts/')
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
};

config.devServer = {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    watchContentBase: true,
    open: true,
    historyApiFallback: true
};

if (appConfig.apache) {
    config.output.publicPath = 'localhost/' + path.basename(__dirname);

    config.devServer = {
        ...config.devServer,
        writeToDisk: true,
        proxy: {
            '/': 'http://localhost/' + path.basename(__dirname) + '/dist',
            changeOrigin: true
        }
    };
}

if (appConfig.wordpress) {
    config.output.publicPath = 'localhost/wordpress/' + path.basename(__dirname);
    config.output.path = path.resolve(__dirname, '..', 'wp-content', 'themes', slug(appConfig.theme.name, { lower: true }));
    config.devServer.contentBase = config.output.path;
    config.output.filename = 'scripts/[name].js';
    config.devServer.proxy = {
        '/': 'http://localhost/wordpress/' + path.basename(__dirname) + '/dist',
        changeOrigin: true
    }
}

module.exports = config;
