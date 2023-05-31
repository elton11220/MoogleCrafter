const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.ts",
  output: {
    filename: "[name].[contenthash:8].bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
      scriptLoading: "defer",
    }),
  ],
  devServer: {
    port: 8080,
    compress: true,
  },
  optimization: {
    usedExports: true,
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        exclude: /node_modules/,
        parallel: true,
      }),
    ],
  },
};
