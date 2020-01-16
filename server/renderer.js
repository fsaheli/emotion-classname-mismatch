/*
  renderer.js

  Responsible for server-side rendering and fetching
  appropriate assets for a given route

  Starts at `Function handleRender()`, called by the server
*/
import React from "react";
import ReactDOMServer from "react-dom/server";
import serialize from "serialize-javascript";
import url from "url";
import { CacheProvider } from "@emotion/core";
import { matchRoutes } from "react-router-config";
import createEmotionServer from "create-emotion-server";
import createCache from "@emotion/cache";

import routes from "../src/routing/routes.js";
import pageWrapper from "../src/routing/pageWrapper.js";

import globalStyles from "./globalStyles";
import configureStore from "../src/redux/store.js";
import HtmlTemplate from "./htmlTemplate";

const normalizeAssets = assets =>
  assets.reduce((acc, chunk) => {
    if (Array.isArray(chunk)) {
      chunk.forEach(chunklet => {
        // need to drill down one level, since
        // HMR injects itself into the `client` chunk
        acc.push(chunklet);
      });
    } else {
      acc.push(chunk);
    }
    return acc;
  }, []);

const getEmotionTag = (css, ids) => {
  return `<style data-emotion-css="${ids.join(" ")}">${css}</style>`;
};

const concatDevBundle = (assetsByChunkName, activeApp) =>
  normalizeAssets([assetsByChunkName.client])
    .filter(path => path.endsWith(".js"))
    .map(path => `<script defer src="/${path}"></script>`)
    .join("\n");

const loadRouteDependencies = ({
  matchRoutesArray,
  store,
  urlObject,
  mupParams,
  app
}) => {
  const requiredRoutePromises = matchRoutesArray.map(({ route, match }) => {
    // once the route is matched, iterate through each component
    // looking for a `static loadData()` method
    // (you'll find these in the data-dependent `/src/views/` components)
    if (route.component) {
      return route.component.loadData
        ? // the following will be passed into each component's `loadData` method:
          route.component.loadData({
            store,
            match,
            urlObject,
            queryParams,
            mupParams,
            app
          })
        : Promise.resolve(null);
    }
    return Promise.resolve(null);
  });

  return Promise.all(requiredRoutePromises);
};

// eslint-disable-next-line consistent-return
const handleRender = (req, res) => {
  const { store, history } = configureStore({}, "fromServer");
  const urlObject = url.parse(req.originalUrl);
  const { pathname } = urlObject;
  const matchRoutesArray = matchRoutes(routes, pathname);

  // now that the route is in the redux state tree,
  // routing itself is taken care of...
  // however, in order to render the page, we need to check
  // if there are any data dependencies, and if so, load them
  loadRouteDependencies({ matchRoutesArray, store, urlObject })
    .then(data => {
      let bundle;
      const preloadedState = store.getState();
      const activeApp = "blah";

      bundle = concatDevBundle(
        res.locals.webpackStats.toJson().assetsByChunkName,
        activeApp
      );

      const cache = createCache();
      const { extractCritical } = createEmotionServer(cache);

      const { html, css, ids } = extractCritical(
        ReactDOMServer.renderToString(
          <CacheProvider value={cache}>
            {pageWrapper(
              store,
              history,
              data,
              globalStyles({
                activeApp
              })
            )}
          </CacheProvider>
        )
      );
      const htmlTemplate = new HtmlTemplate({
        html,
        emotionTag: getEmotionTag(css, ids),
        preloadedState: serialize(preloadedState),
        bundle
      });

      res.status(200).send(htmlTemplate.full());
    })
    .catch(err => {
      console.error("Error in renderer.js", err);
      res
        .status(500)
        .send('<h1 align="center">🤷  Something broke in the server 😢<h1>');
    });
};

export default handleRender;
