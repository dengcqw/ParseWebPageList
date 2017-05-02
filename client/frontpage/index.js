
require('es6-promise').polyfill();
require('isomorphic-fetch');

import App from './app.js'
import store from './store.js'
import {Provider} from 'react-redux'

const wrapApp = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(wrapApp, document.getElementById("app"));
