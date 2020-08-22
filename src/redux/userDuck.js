import {logginWithGoogle, singOutGoogle} from '../firebase'
import {retriveFavouritesAction} from './charsDuck'

//constanst
let initialData = {
    loggedIn: false,
    fetching: false
}
let LOGIN = "LOGIN"
let LOGIN_SUCCESS = "LOGIN_SUCCESS"
let LOGIN_ERROR = "LOGIN_ERROR"

let LOG_OUT = "LOG_OUT"
//reducer
export default function reducer(state = initialData, action){
    switch(action.type){
        case LOGIN:
            return{...state, fetching: true}

        case LOGIN_SUCCESS:
            return{...state, fetching: false, ...action.payload, loggedIn: true}

        case LOGIN_ERROR:
            return{...state, fetching: false, error: action.payload}
        
        case LOG_OUT:
            return{...initialData}

        default:
        return state   
    }
}

// aux

function saveStorage(storage){
    localStorage.storage = JSON.stringify(storage)
}

// action
export let logOutAction = () => (dispatch, getState) => {
    singOutGoogle()
    dispatch({
        type: LOG_OUT
    })
    localStorage.removeItem('storage')
}

export let restoreSessionAction = () => (dispatch) => {
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
    if(storage && storage.user){
        dispatch({
            type: LOGIN_SUCCESS,
            payload: storage.user
        })
    }
}

export let doGoogleLoginAction = () => (dispatch, getState) => {
    dispatch({
        type : LOGIN
    })
    return logginWithGoogle()
        .then(user => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }
            })
            saveStorage(getState())
            retriveFavouritesAction()(dispatch, getState)
        })
        .catch(err =>{
            console.log(err)
            dispatch({
                type: LOGIN_ERROR,
                payload: err.message
            })
        })
}