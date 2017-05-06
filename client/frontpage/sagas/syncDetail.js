
import { put, takeLatest } from 'redux-saga/effects'

import {syncDetailStateAction} from '../reducers/uistate.js'
import {getContentActionCreator} from './content.js'
import Api from '../services'

function* syncDetailAsync(action) {
  yield put(syncDetailStateAction(true))
  yield Api.syncDetail(action.date)
  yield put(syncDetailStateAction(false))
}

export default function* watchSyncDetailAsync() {
  console.log("----> watch SYNC_DETAIL_ASYNC")
  yield takeLatest('SYNC_DETAIL_ASYNC', syncDetailAsync)
}

export function syncDetailActionCreator(date) {
  return {
    type: "SYNC_DETAIL_ASYNC",
    date
  }
}

