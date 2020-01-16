/* eslint-disable global-require */
if (process.env.NEW_RELIC_ENV) require("newrelic");

const isDev = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";

if (isDev) {
  require("../src/utils/requireHook");
}

const express = require("express");
const bodyParser = require("body-parser");
const cluster = require("express-cluster");
const morgan = require("morgan");
const os = require("os");

const appLogger = require("./appLogger");

const PORT = process.env.PORT || 4000;
const NODE_WORKERS = process.env.NODE_WORKERS || os.cpus().length;
const KEEP_ALIVE_TIMEOUT =
  parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10) || 120 * 1000;

const handleRender = require("./renderer.js").default;

const app = express();
app.use(morgan("combined", { stream: appLogger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Only necessary in dev...
// In prod, we don't need all this webpack stuff,
// since we're pre-compiling our bundle
const chokidar = require("chokidar");
const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const config = require("../config/webpack.config.dev.js");
const compiler = webpack(config);

app.use(
  hotMiddleware(compiler, {
    log: console.log,
    heartbeat: 10 * 1000
  })
);
app.use(
  webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    serverSideRender: true
  })
);

// Do 'hot-reloading' of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
const watcher = chokidar.watch("./");

watcher.on("ready", () => {
  watcher.on("all", () => {
    console.log("Clearing /server/ module cache from server");
    Object.keys(require.cache).forEach(id => {
      if (/[/\\]server[/\\]/.test(id)) delete require.cache[id];
    });
  });
});

// Do 'hot-reloading' of react stuff on the server
// Throw away the cached client modules and let them be re-required next time
compiler.plugin("done", () => {
  console.log("Clearing /src/ module cache from server");
  Object.keys(require.cache).forEach(id => {
    if (/[/\\]src[/\\]/.test(id)) delete require.cache[id];
  });
});

// --> /server/renderer.js
app.use("*", (req, res) => {
  res.append("Content-Type", "text/html; charset=utf-8");
  res.append("Cache-Control", "max-age=3600, public");
  handleRender(req, res);
});

const listeningMessage = ` ⚙️  ${process.env.NODE_ENV.toUpperCase()} listening @ ${PORT} ⚙️ \n`;
const logListeningMessage = msg => {
  console.log(msg);
  console.log(` --  launched @ ${Date()}  --`);
  console.log(
    "-------------------------------------------------------------------------------------\n\n"
  );
};

if (isDev) {
  app.listen(PORT, logListeningMessage(listeningMessage));
} else {
  cluster(
    worker => {
      const server = app.listen(
        PORT,
        logListeningMessage(`${listeningMessage} with worker #${worker.id}`)
      );

      server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT;
      return server;
    },
    { count: NODE_WORKERS }
  );
}
