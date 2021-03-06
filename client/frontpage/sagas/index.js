
import { take, select, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import watchUpdateMenus from './menus.js'
import watchGetContent from './content.js'
import watchFetchAll from './fetchAll.js'
import watchFetchCategory from './fetchCategory.js'
import watchGetAlbums from './albums.js'
import watchSyncDetailAsync from './syncDetail.js'
import watchUploadJsonAsync from './uploadJson.js'
import watchDownloadJsonAsync from './downloadJson.js'

export function* watchAndLog() {
  while(true) {
    const action = yield take('*')
    console.log('action', action)
    if (!action.type.includes('ASYNC')) {
      console.log('state after', yield select())
    }
  }
}

export default function* rootSaga() {
  yield [
    fork(watchAndLog),
    fork(watchUpdateMenus),
    fork(watchGetContent),
    fork(watchFetchAll),
    fork(watchGetAlbums),
    fork(watchFetchCategory),
    fork(watchSyncDetailAsync),
    fork(watchUploadJsonAsync),
    fork(watchDownloadJsonAsync),
  ]
}
