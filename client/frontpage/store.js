
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
const rootTask = sagaMiddleware.run(rootSaga)
rootTask.done.catch(function (err) {
    console.log("Error in Sagas", err)
})

export default store

