const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const sass = require('sass');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');
const PacktrackerPlugin = require('@packtracker/webpack-plugin')

const ENV = 'production';

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  // devtool: 'source-map', // Enable source maps. Please note that this will slow down the build
  mode: ENV,
  entry: {
    main: './src/main/webapp/app/index'
  },
  output: {
    path: utils.root('target/classes/static/'),
    filename: 'app/[name].[hash].bundle.js',
    chunkFilename: 'app/[name].[hash].chunk.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.s?css$/,
        loader: 'stripcomment-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: { implementation: sass }
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: false,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        // sourceMap: true, // Enable source maps. Please note that this will slow down the build
        terserOptions: {
          ecma: 6,
          toplevel: true,
          module: true,
          beautify: false,
          comments: false,
          compress: {
            warnings: false,
            ecma: 6,
            module: true,
            toplevel: true
          },
          output: {
              comments: false,
              beautify: false,
              indent_level: 2,
              ecma: 6
          },
          mangle: {
            keep_fnames: true,
            module: true,
            toplevel: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // new PacktrackerPlugin({
    //   project_token: '48f37371-7794-4def-8d6c-a29a79dfdb3e',
    //   upload: true,
    //   branch: process.env.GITHUB_REF,
    //   fail_build: true
    // }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      filename: 'content/[name].[hash].css',
      chunkFilename: 'content/[name].[hash].css'
    }),
    new MomentLocalesPlugin({
      localesToKeep: [
        'tr',
        'en'
        // jhipster-needle-i18n-language-moment-webpack - JHipster will add/remove languages in this array
      ]
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/swagger-ui/],
      runtimeCaching: [{
        urlPattern: /\.(?:css|js|html)$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'myCache',
          expiration: {
            maxAgeSeconds: 60*60*24
          },
          broadcastUpdate: {
            channelName: 'update-myCache'
          }
        }
      },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|eot|ttf|woff|woff2)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'assetCache',
            broadcastUpdate: {
              channelName: 'update-assetCache'
            }
          }
        }]
    }),
  ]
});
