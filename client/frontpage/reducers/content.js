
export const contentActions = {
  updateContent: 'UPDATE_CONTENT' // delete with setting property undefined
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
