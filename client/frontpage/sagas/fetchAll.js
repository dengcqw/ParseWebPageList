
import { put, takeLatest } from 'redux-saga/effects'

import {updatefetchAllStateAction} from '../reducers/uistate.js'
import {updateMenuActionCreator} from './menus.js'
import Api from '../services'

function* fetchAllAsync(action) {
  yield put(updatefetchAllStateAction(true))
  yield Api.fetchAll()
  yield put(updatefetchAllStateAction(false))
  yield put(updateMenuActionCreator())
}

export default function* watchfetchAllAsync() {
  yield takeLatest('FETCH_ALL_ASYNC', fetchAllAsync)
}

export function fetchAllActionCreator() {
  return {
    type: "FETCH_ALL_ASYNC"
  }
}

