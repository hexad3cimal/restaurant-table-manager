import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history';
import rootReducer from './reducers'

const history = createMemoryHistory()
const reducer = combineReducers({ ...rootReducer })

function render(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Router navigator={{createHref: ()=>{}, push: ()=>{}, replace: ()=> {}, block:()=>{}, go : ()=>{}}} location={{app:'/login'}} history={history}><Provider store={store}>{children}</Provider></Router>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { render }