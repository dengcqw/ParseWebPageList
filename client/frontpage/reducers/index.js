
import { combineReducers } from 'redux'
import albums from './albums.js'
import content from './content.js'
import menus from './menus.js'
import uistate from './uistate.js'

export default combineReducers({
  albums,
  content,
  menus,
  uistate
})

