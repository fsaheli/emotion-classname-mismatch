import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import { Global } from '@emotion/core';

import routes from './routes.js';

// This jsx wraps the page html. It's used in client and server side routing
const pageWrapper = (store, history, data, globalStyles) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        {renderRoutes(routes, { ...data })}
        <Global styles={globalStyles} />
      </div>
    </ConnectedRouter>
  </Provider>
);

export default pageWrapper;
