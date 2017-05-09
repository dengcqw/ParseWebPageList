
import { put, takeLatest } from 'redux-saga/effects'

import {uploadJsonStateAction} from '../reducers/uistate.js'
import Api from '../services'

function* uploadJsonAsync(action) {
  yield put(uploadJsonStateAction(true))
  yield Api.uploadJson()
  yield put(uploadJsonStateAction(false))
}

export default function* watchUploadJsonAsync() {
  console.log("----> watch UPLOAD_JSON_ASYNC")
  yield takeLatest('UPLOAD_JSON_ASYNC', uploadJsonAsync)
}

export function uploadJsonActionCreator() {
  return {
    type: "UPLOAD_JSON_ASYNC"
  }
}

