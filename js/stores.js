
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import promiseMiddleware from 'redux-promise';

const initialState = {};

export default function configureStore() { /*initialState) { */
    return createStore(
       rootReducer,
       initialState,
       applyMiddleware(
           promiseMiddleware
       )
   )
}
