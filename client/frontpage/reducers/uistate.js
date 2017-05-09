
//import { combineReducers } from 'redux'

// action types
export const uiStateActions = {
  updateFetchAllState: 'UPDATE_FETCHALL_STATE', // ture or false to control loading
  updateDisplayType: 'UPDATE_DISPLAY_TYPE', // string 'Tabs' or 'Tables' to control content display
  updateSelectedTab: 'UPDATE_SELECTED_TAB', // {menuName: siteID} to record selected Site for each menu
  updateSelectedMenu:'UPDATE_SELECTED_MENU', // [menuKey] to save selected menus
  syncDetailState: 'SYNC_DETAIL_STATE',
  uploadJsonState: 'UPLOAD_JSON_STATE',
  downloadJsonState: 'DOWNLOAD_JSON_STATE'
}

const initialState = {
  fetchAllState: false,
  displayType: 'Tabs',
  selectedTabs: {},
  selectedMenu: '',
  syncDetailState: false,
  uploadJsonState: false,
  downloadJsonState: false,
}

// FIXED: merge uiState Reducers into one
export default function uiStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case uiStateActions.updateFetchAllState:
      return Object.assign({}, state, {fetchAllState:action.isFetching})
    case uiStateActions.updateDisplayType:
      return Object.assign({}, state, {displayType:action.displayType})
    case uiStateActions.updateSelectedTab:
      let selectedTabs = Object.assign({}, state.selectedTabs, action.selectedTab)
      return Object.assign({}, state, {selectedTabs})
    case uiStateActions.updateSelectedMenu:
      return Object.assign({}, state, {selectedMenu:action.selectedMenu})
    case uiStateActions.syncDetailState:
      return Object.assign({}, state, {syncDetailState:action.isSync})
      return action.isSync
    case uiStateActions.uploadJsonState:
      return Object.assign({}, state, {uploadJsonState:action.isUploadJson})
      return action.isUpload
    case uiStateActions.downloadJsonState:
      return Object.assign({}, state, {downloadJsonState:action.isDownloadJson})
      return action.isUpload
    default:
      return state
  }
}

// action creator

export function updatefetchAllStateAction(isFetching) {
  return {
    type: uiStateActions.updateFetchAllState,
    isFetching
  }
}

export function syncDetailStateAction(isSync) {
  return {
    type: uiStateActions.syncDetailState,
    isSync
  }
}

export function updateDisplayTypeAction(displayType) {
  return {
    type: uiStateActions.updateDisplayType,
    displayType
  }
}

export function updateSelectedTabAction(selectedTab) {
  return {
    type: uiStateActions.updateSelectedTab,
    selectedTab
  }
}

export function updateSelectedMenuAction(selectedMenu) {
  return {
    type: uiStateActions.updateSelectedMenu,
    selectedMenu
  }
}

export function uploadJsonStateAction(isUploadJson) {
  return {
    type: uiStateActions.uploadJsonState,
    isUploadJson
  }
}

export function downloadJsonStateAction(isDownloadJson) {
  return {
    type: uiStateActions.downloadJsonState,
    isDownloadJson
  }
}

