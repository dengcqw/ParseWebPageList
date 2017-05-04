
import { put, takeLatest } from 'redux-saga/effects'

import {updateCategoryAction} from '../reducers/content.js'
import Api from '../services'

function* fetchCatetoryAsync(action) {
  let content = yield Api.fetchCatetory(action.params)
  yield put(updateCategoryAction(content))
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

