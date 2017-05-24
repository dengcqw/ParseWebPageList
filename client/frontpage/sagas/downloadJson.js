

import { put, takeLatest } from 'redux-saga/effects'

import {downloadJsonStateAction} from '../reducers/uistate.js'
import Api from '../services'

function* downloadJsonAsync(action) {
  yield put(downloadJsonStateAction(true))
  yield Api.downloadJson(action.contentType, action.fileName)
  yield put(downloadJsonStateAction(false))
}

export default function* watchDownloadJsonAsync() {
  console.log("----> watch DOWNLOAD_JSON_ASYNC")
  yield takeLatest('DOWNLOAD_JSON_ASYNC', downloadJsonAsync)
}

export function downloadJsonActionCreator(contentType, fileName) {
  console.log("----> downloadJsonActionCreator")
  return {
    type: "DOWNLOAD_JSON_ASYNC",
    contentType,
    fileName
  }
}

