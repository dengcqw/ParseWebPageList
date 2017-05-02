
import { combineReducers } from 'redux'

// action types
export const uiStateActions = {
  updateFetchAllState: 'UPDATE_FETCHALL_STATE', // ture or false to control loading
  updateDisplayType: 'UPDATE_DISPLAY_TYPE', // string 'Tabs' or 'Tables' to control content display
  updateSelectedTab: 'UPDATE_SELECTED_TAB', // {menuName: siteID} to record selected Site for each menu
  updateSelectedMenu:'UPDATE_SELECTED_MENU' // [menuKey] to save selected menus
}

function fetchAllStateReducer(state = false, action = {}) {
  switch (action.type) {
    case uiStateActions.updateFetchAllState:
      return action.isFetching
    default:
      return state;
  }
}

function displayTypeReducer(state = 'Tabs', action = {}) {
  switch (action.type) {
    case uiStateActions.updateDisplayType:
      return action.displayType
    default:
      return state
  }
}

function selectedTabReducer(state = {}, action = {}) {
  switch (action.type) {
    case uiStateActions.updateSelectedTab:
      return Object.assign({}, state, action.selectedTab)
    default:
      return state
  }
}

function selectedMenuReducer(state = [], action = {}) {
  switch (action.type) {
    case uiStateActions.updateSelectedMenu:
      return [].concat(action.selectedMenu)
    default:
      return state
  }
}

export default combineReducers({
  fetchAllState: fetchAllStateReducer,
  displayType: displayTypeReducer,
  selectedTabs: selectedTabReducer,
  selectedMenu: selectedMenuReducer
})

// action creator

export function updatefetchAllStateAction(isFetching) {
  return {
    type: uiStateActions.updateFetchAllState,
    isFetching
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

