/*
  routes.js

  Used instead of <Route> in `react-router-config`.
  Compatible with `react-router-redux`'s `<ConnectedRouter>`
*/
import BasePage from "../components/Base.js";

// React-router-config routes object, used in client and server routing
const routes = [
  {
    component: BasePage,
    exact: true
  }
];

export default routes;
