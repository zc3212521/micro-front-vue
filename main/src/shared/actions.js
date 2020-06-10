import { initGlobalState, MicroAppStateActions } from 'qiankun' // eslint-disable-line

const initialState = {
  login: false
}
const actions = initGlobalState(initialState)

export default actions
