/* eslint-disable global-require */
import { createStore, applyMiddleware } from "redux";
import { routerMiddleware } from "react-router-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import createBrowserHistory from "history/createBrowserHistory";
import createMemoryHistory from "history/createMemoryHistory";

const rootReducer = () => ({});

export default function configureStore(initialState = {}, fromServer) {
  // initialState will always be Object{} on the server...
  // this will pass to the client so that it will be able to
  // initialize with what the server originally rendered

  let history;

  if (fromServer) {
    // since the server has no HTML5 push states,
    // history must be temporarily created in memory
    history = createMemoryHistory();
  } else {
    // on the client, we can go ahead and make a standard
    // `history` state
    history = createBrowserHistory();
  }

  // once we init the routerMiddleware with this `history`,
  // compose with devtools (dev) or just apply it (prod)
  const initializedRouterMW = routerMiddleware(history);
  let middleware;

  middleware = composeWithDevTools(applyMiddleware(initializedRouterMW, thunk));

  const store = createStore(rootReducer, initialState, middleware);

  return { history, store };
}
