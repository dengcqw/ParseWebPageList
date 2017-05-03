
      //let urlids = []
      //Object.keys(categoryNames).forEach(categoryID => {
        //Object.values(siteIds).forEach(siteID => {
          //if (content[siteID] && content[siteID][categoryID]) {
            //urlids = urlids.concat(content[siteID][categoryID])
          //}
        //})
      //})
      //this.getAlbums(urlids)

import { put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {updateContentAction} from '../reducers/content.js'
import Api from '../services'

function* getContentAsync(action) {
  let content = {}
  content = yield Api.getContent(action.dateString)
  yield put(updateContentAction({[action.dateString]:content}))
}

export default function* watchGetContentAsync() {
  console.log("----> start update menus")
  yield takeLatest('GET_CONTENT_ASYNC', getContentAsync)
}

export function getContentActionCreator(dateString) {
  return {
    type: "GET_CONTENT_ASYNC",
    dateString
  }
}

