const webpack = require("webpack");
const path = require("path");
const commonConfig = require("./common.config");

console.log("Preparing dev server...\n\n");

const client = ["./src/index.js"];
client.push("./server/renderer.js");
client.unshift("webpack-hot-middleware/client");

const jsLoader = {
  test: /\.js$/,
  loader: "babel-loader",
  include: [
    path.join(__dirname, "..", "src"),
    path.join(__dirname, "..", "server/renderer.js")
  ],
  query: {
    env: {
      development: {
        presets: [],
        plugins: []
      }
    }
  }
};

const { COMMON_ENVIRONMENT_VARIABLES } = commonConfig;
const DEV_ENVIRONMENT_VARIABLES = {
  ...COMMON_ENVIRONMENT_VARIABLES
};
DEV_ENVIRONMENT_VARIABLES.__DEV__ = true; // eslint-disable-line no-underscore-dangle
DEV_ENVIRONMENT_VARIABLES["process.env.NODE_ENV"] = JSON.stringify(
  "development"
);
// add dev plugins
const devPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin(DEV_ENVIRONMENT_VARIABLES)
];

const { imageLoader, fontLoader } = commonConfig.loaders;

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    client
  },
  module: {
    rules: [jsLoader, imageLoader, fontLoader]
  },
  plugins: devPlugins,
  output: {
    path: path.join(__dirname, "..", "dist"),
    publicPath: `/`,
    filename: "[name].js"
  }
};
