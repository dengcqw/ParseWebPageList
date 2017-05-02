
export const menusActions = {
  updateMenus: 'UPDATE_MENUS'
}

export default function menusReducer(state = [], action = {}) {
  switch (action.type) {
    case menusActions.updateMenus:
      return action.menus.slice(0)
    default:
      return state
  }
}

export function createMenusAction(menus) {
  return {
    type: menusActions.updateMenus,
    menus
  }
}
