
import { put, takeLatest } from 'redux-saga/effects'

import {updateCategoryAction} from '../reducers/content.js'
import Api from '../services'

function* fetchCatetoryAsync(action) {
  let content = yield Api.fetchCatetory(action.params)
  if (content) {
    yield put(updateCategoryAction(content))
  } else {
    // error notif
  }
}

export default function* watchFetchCategory() {
  console.log("----> watch FETCH_CATEGORY_ASYNC")
  yield takeLatest('FETCH_CATEGORY_ASYNC', fetchCatetoryAsync)
}

export function fetchCategoryActionCreator(params) {
  return {
    type: "FETCH_CATEGORY_ASYNC",
    params
  }
}

