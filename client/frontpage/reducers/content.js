
export const contentActions = {
  updateContent: 'UPDATE_CONTENT', // delete with setting property undefined
  updateCategory: 'UPDATE_CATEGORY'
}

/* content structure
   {
     menuName: {
       siteID: {
         categoryID: [urlids]
       }
     }
   }
 */
export default function contentReducer(state = {}, action = {}) {
  switch (action.type) {
    case contentActions.updateContent:
      return Object.assign({}, state, action.content)
    case contentActions.updateCategory:
      let today = new Date().toISOString().slice(0, 10)
      if (!state[today]) throw Error('can only update today category content')
      let newstate = Object.assign({}, state)

      /* Tip: deep clone use `JSON.parse(JSON.stringify(obj))` */
      let todayState = Object.assign({}, newstate[today]) /* clone it to trigger react render and avoid deep-copy */
      newstate[today] = todayState
      try {
        let content = action.content
        let siteID = content.siteID
        let categoryID = content.categoryID
        let urlIds = content.urlIds
        if (siteID && categoryID) {
          if (!todayState[siteID]) {
            todayState[siteID] = {}
          } else {
            todayState[siteID] = Object.assign({}, todayState[siteID]) /* clone it to trigger render */
          }
          todayState[siteID][categoryID] = urlIds || []
        }
      } catch(e) {
        console.log("----> read update category content error: ", e)
        return state
      }
      return newstate
    default:
      return state
  }
}

export function updateContentAction(content) {
  return {
    type: contentActions.updateContent,
    content
  }
}

/* NOTE: only update today content */
export function updateCategoryAction(content) {
  return {
    type: contentActions.updateCategory,
    content
  }
}
