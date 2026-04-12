const path = require("path");

module.exports = (_, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/register.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: "auto",
      clean: true
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@micro/contracts": path.resolve(__dirname, "../../packages/contracts/src")
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                noEmit: false
              }
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"]
        }
      ]
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, "public")
      },
      port: 3001,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      hot: true
    },
    devtool: isProduction ? "source-map" : "eval-source-map"
  };
};
