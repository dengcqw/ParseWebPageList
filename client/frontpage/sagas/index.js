
import { take, select, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import watchUpdateMenus from './menus.js'
import watchGetContent from './content.js'
import watchFetchAll from './fetchAll.js'
import watchGetAlbums from './albums.js'

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
    fork(watchUpdateMenus),
    fork(watchGetContent),
    fork(watchFetchAll),
    fork(watchGetAlbums),
  ]
}
