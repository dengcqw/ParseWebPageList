
import { put, takeEvery, call, takeLatest, take, select, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'


// Our worker Saga: 将异步执行 increment 任务
export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}

// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export function* watchIncrementAsync() {
  console.log("----> "+"button async create")
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

export function* watchAndLog() {
  while(true) {
    const action = yield take('*')
    console.log('action', action)
    console.log('state after', yield select())
  }
}

export default function* rootSaga() {
  yield [
    fork(watchAndLog),
    fork(watchIncrementAsync)
  ]
}
