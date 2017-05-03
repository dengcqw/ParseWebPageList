

import { put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {updateMenusAction} from '../reducers/menus.js'
import Api from '../services'

function* updateMenusAsync() {
  let menus = []
  let infos = yield Api.getCaptureInfo()
  if (infos && infos.length) {
    menus = infos.map(info => info.date)
  }
  yield put(updateMenusAction(menus))
}

export default function* watchUpdateMenus() {
  console.log("----> watch UPDATE_MENU_ASYNC")
  yield takeLatest('UPDATE_MENU_ASYNC', updateMenusAsync)
}

export function updateMenuActionCreator() {
  return {
    type: "UPDATE_MENU_ASYNC"
  }
}
