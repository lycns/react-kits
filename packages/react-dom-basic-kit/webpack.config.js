// 引入css 单独打包插件
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// 设置生成css 的路径和文件名，会自动将对应entry入口js文件中引入的CSS抽出成单独的文件
var packCSS = new ExtractTextPlugin('./css/[name].min.css')
var nodeExternals = require('webpack-node-externals')
var fs = require('fs')
var path = require('path')
var getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
var { CheckerPlugin } = require('awesome-typescript-loader')
var { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/lib',
    libraryTarget: 'umd',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['scss', 'css', '.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
              importLoaders: 1,
            },
          },
        }),
      },
      {
        test: /\.module.scss$/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]),
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]),
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: [nodeExternals()],
  plugins: [new ExtractTextPlugin('./[name].css'), new CleanWebpackPlugin()],
}
