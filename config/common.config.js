const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const jsLoader = {
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true
    }
  }
};
const imageLoader = {
  test: /\.(png|svg|jpg|gif)$/,
  use: {
    loader: "file-loader",
    options: {
      name: "[name]-[hash].[ext]"
    }
  }
};
const fontLoader = {
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: {
    loader: "file-loader",
    options: {
      name: "[name]-[hash].[ext]"
    }
  }
};
const COMMON_ENVIRONMENT_VARIABLES = {
  "process.env.PORT": process.env.PORT || 4000
};

const PROD_ENVIRONMENT_VARIABLES = {
  ...COMMON_ENVIRONMENT_VARIABLES
};

PROD_ENVIRONMENT_VARIABLES.__DEV__ = false; // eslint-disable-line no-underscore-dangle
PROD_ENVIRONMENT_VARIABLES["process.env.NODE_ENV"] = JSON.stringify(
  "production"
);

const prodPlugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin(PROD_ENVIRONMENT_VARIABLES),
  new webpack.optimize.AggressiveMergingPlugin()
];

if (process.env.ANALYZE_BUNDLE) {
  prodPlugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  loaders: { jsLoader, imageLoader, fontLoader },
  prodPlugins,
  COMMON_ENVIRONMENT_VARIABLES
};
