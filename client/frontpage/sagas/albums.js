
import { put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {addAlbumsAction} from '../reducers/albums.js'
import Api from '../services'

function* getAlbumsAsync(action) {
  let albums = []
  albums = yield Api.getAlbums(action.urlids)
  yield put(addAlbumsAction(albums))
}

export default function* watchGetAlbumsAsync() {
  console.log("----> watch GET_ALBUMS_ASYNC")
  yield takeLatest('GET_ALBUMS_ASYNC', getAlbumsAsync)
}

export function getAlbumsActionCreator(urlids) {
  return {
    type: "GET_ALBUMS_ASYNC",
    urlids
  }
}

