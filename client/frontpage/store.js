
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import sagaMonitor from './sagaMonitor'

import rootReducer from './reducers'
import rootSaga from './sagas'

let sagaOptions =  {}
if (process.env.NODE_ENV !== 'production') {
  sagaOptions = {sagaMonitor}
}

const sagaMiddleware = createSagaMiddleware(sagaOptions)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware
    )
  )
)
sagaMiddleware.run(rootSaga)

export default store

