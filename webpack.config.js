/*global
    __DEV__
    __dirname
    process
*/
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'babel-polyfill',
        path.join(__dirname, 'app/index.jsx'),
    ],
    output: {
        path: path.join(__dirname, 'dev'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.css'],
        alias: {
            components: path.join(__dirname, 'app/components/'),
            containers: path.join(__dirname, 'app/containers/'),
            constants: path.join(__dirname, 'app/constants/'),
            actions: path.join(__dirname, 'app/actions/'),
            reducers: path.join(__dirname, 'app/reducers/'),
            util: path.join(__dirname, 'app/util/'),
            fetch: path.join(__dirname, 'app/fetch/'),
            config: path.join(__dirname, 'app/config/'),
            static: path.join(__dirname, 'app/static/')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'react-hot-loader',
                    'babel-loader'
                ]
            },
            {
                test: /\.(jpg|jpeg|png|svg|gif|bmp)/i,
                use: [
                    'url-loader?limit=5000'
                ]
            },
            {
                test: /\.(png|woff|woff2|svg|ttf|eot)($|\?)/i,
                use: [
                    'url-loader?limit=5000'
                ]
            },
            {
                test: /\.(css|scss)$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })

            }
        ]
    },
    plugins: [
        // Scope hosting
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
            filename: 'main.css',
            disable: true
        }),
        // html ????????????
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.html'
        }),
        // ???????????????
        new webpack.HotModuleReplacementPlugin(),
        // ???????????? js ??????????????? __DEV__ ???????????????dev?????????dev?????????????????????????????????????????????, production??????????????????
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        })
    ],
    devServer: {
        proxy: {
            // ?????? `/api` ????????? http ??????????????????????????? localhost:7777 ????????? koa ?????? mock ?????????
            // koa ????????? ./mock ??????????????????????????? npm run mock
            '/api': {
                target: 'http://localhost:7777',
                secure: false
            }
        },
        host: '0.0.0.0',
        port: '9999',
        disableHostCheck: true, // ????????????????????????
        contentBase: './dev', // ????????????????????????????????????????????????
        historyApiFallback: true, // ??????SPA????????????
        inline: true, //????????????
        hot: true  // ????????????????????? HotModuleReplacementPlugin
    }
}