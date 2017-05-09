
// action types
export const albumsActions = {
  addAlbum: 'ADD_ALBUM',
  deleteAlbum: 'DELETE_ALBUM'
}

const initialState = {}

export default function albumsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case albumsActions.addAlbum:
      return Object.assign({}, state, action.albums)
    case albumsActions.deleteAlbum:
      if (!action.urlIds) {
        return initialState
      }
      let mergeState = action.urlIds.reduce((reduced, urlID) => {
        reduced[urlID] = undefined // set deleted item to undefined
        return reduced
      }, {})
      return Object.assign({} , state, mergeState)
    default:
      return state;
  }
}

export function addAlbumsAction(albums) {
  return {
    type: albumsActions.addAlbum,
    albums
  }
}

// urlIds undefied will delete all
export function deleteAlbumsAction(urlIds) {
  return {
    type: albumsActions.deleteAlbum,
    urlIds
  }
}

