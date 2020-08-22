import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import userReducer, {restoreSessionAction} from './userDuck'
import charsReducer, {getCharacterAction, restoreFavouritesAction} from './charsDuck'

let rootReducer = combineReducers({
    user:userReducer,
    characters: charsReducer,

})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export default function generateStore(){
    let store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk))
        )

    //consiguiendo los personajes por primera vez
    getCharacterAction()(store.dispatch, store.getState)
    restoreSessionAction()(store.dispatch)
    restoreFavouritesAction()(store.dispatch, store.getState)
    return store
}