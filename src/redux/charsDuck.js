import axios from 'axios'
import {updateDB, getFavs} from '../firebase'
import ApolloClient, {gql} from 'apollo-boost'
import { database } from 'firebase'

//constant 
let initialData = {
    fetching:false,
    array:[],
    current:{},
    favourites: [],
    nextPage:1
}
let URL = "https://rickandmortyapi.com/api/character"

let client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql"
})

let UPDATE_PAGE = "UPDATE_PAGE"

let GET_CHARACTERS = "GET_CHARACTERS"
let GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCES"
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"

let REMOVE_CHARACTER = "REMOVE_CHARACTER"
let ADD_TO_FAVOURITES = "ADD_TO_FAVOURITES"

let GET_FAVOURITES = "GET_FAVOURITES"
let GET_FAVOURITES_SUCCESS = "GET_FAVOURITES_SUCCESS"
let GET_FAVOURITES_ERROR = "GET_FAVOURITES_ERROR"

//reducer
export default function reducer(state = initialData, action){
    switch(action.type){
        //Agrega a favoritos el character si se elige el corazon
        case ADD_TO_FAVOURITES:
            return {...state, ...action.payload}

        //Remueve un character del arryay de personajes del store
        case REMOVE_CHARACTER:
            return {...state, array: action.payload}

        //Retorna el estado true en el fetching para demostrar que se esta intentando traer la info de la API
        case GET_CHARACTERS:
            return {...state, fetching : true}

        //Retorna el error que ocurrio y el fetching a falso porque se termino de traer
        case GET_CHARACTERS_ERROR:
            return {...state, error: action.payload, fetching : false}

        //Se retorna el array con la informacion traida de la API y se pasa el fetch a false porque se termino de traer
        //Tambien aclarar que no se esta trayendo los personajes, sino toda la informacion de la API, que despues 
        //oportunamente se va a seleccionar solo la parte de los personajes
        case GET_CHARACTERS_SUCCESS:
            return {...state, array:action.payload, fetching: false}

        case GET_FAVOURITES:
            return {...state, fetching : true}

        case GET_FAVOURITES_SUCCESS:
            return {...state, favourites:action.payload, fetching: false}

        case GET_FAVOURITES_ERROR:
            return {...state, error: action.payload, fetching : false}

        case UPDATE_PAGE:
            return {...state, nextPage: action.payload}

        default:
            return state
    }
}

// aux

function saveStorage(storage){
    localStorage.storage = JSON.stringify(storage)
}

//actions (thunks)

//Restaura del localstorage los datos de los favoritos en caso de refresh de pagina al igual que se hace en el caso del usuario
export let restoreFavouritesAction = () => (dispatch) => {
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
    if(storage && storage.characters){
        dispatch({
            type: GET_FAVOURITES_SUCCESS,
            payload: storage.characters.favourites
        })
    }
}

export let retriveFavouritesAction = () => (dispatch, getState) => {
    dispatch({
        type: GET_FAVOURITES
    })
    let {uid} = getState().user
    return getFavs(uid)
        .then(array =>{
            dispatch({
                type: GET_FAVOURITES_SUCCESS,
                payload: [...array]
            })
            saveStorage(getState())
        })
        .catch(err =>{
            console.log(err)
            dispatch({
                type: GET_FAVOURITES_ERROR,
                payload: err.message
            })
        })
}

export let addToFavouriteAction = () => (dispatch, getState) => {
    let {array, favourites} = getState().characters
    let {uid} = getState().user
    let character = array.shift()
    if(!array.length){
        getCharacterAction()(dispatch, getState)
        return
    }
    favourites.push(character)

    updateDB(favourites, uid)

    dispatch({
        type: ADD_TO_FAVOURITES,
        //Dejandolo asi redux no logra comprender el objeto anterior del nuevo porque no los estoy deconstruyendo como hicimos en removeCharacterAction
        //payload: {array, favourites}
        //En el case del reducer si lo decostruimos, al action.payload pero no habiamos decostruido previamente array y favourites (mandamos el mismo objeto)
        payload: {array: [...array], favourites: [...favourites]}
    })
}

export let removeCharacterAction = () => (dispatch, getState) =>{
    //retronamos del state los characters, despesues shifteamos y eliminamos el indice 0, devolvemos el nuevo array en el dispatch REMOVE_CHARACTER
    //en el reducer se selecciona el case remove y devuelve este nuevo array al state.
    let {array} = getState().characters
    array.shift()
    dispatch({
        type : REMOVE_CHARACTER,
        payload: [...array]
    })
}

//With Apollo and GQL
export let getCharacterAction = () => (dispatch, getState) => {
    let query = gql`
       query ($page:Int){
           characters(page:$page){
               info{
                   pages
                   next
                   prev
               }
               results{
                   name
                   image
               }
           }
       }
    `
    dispatch({
        type: GET_CHARACTERS,
    })

    let{nextPage} = getState().characters
    return client.query({
        query,
        variables: {page:nextPage}
    })
    .then(( {data, error} ) => {
        if(error){
            dispatch({
                type: GET_CHARACTERS_ERROR,
                payload: error
            })
            return
        }
        dispatch({
            type: GET_CHARACTERS_SUCCESS,
            payload: data.characters.results
        })
        dispatch({
            type: UPDATE_PAGE,
            payload: data.characters.info.next ?  data.characters.info.next : 1
        })
    })
    
}



//Con AXIOS

// export let getCharacterAction = () => (dispatch, getState) => {
//     //primero para devolver un estado verdadero del fetching para despues generar una accion de carga visible de manera mas facil
//     dispatch({
//         type: GET_CHARACTERS,
//     })
//     //usamos axios para devolver los elementos de la API de Rick and Morty con el URL de la pagina
//     //Despues especificamos el caso error, para cuando no es posible devolver esta informacion
//     //Devolvemos el caso success cuando se puedo traer la informacion que se carga en el payload.
//     return axios.get(URL)
//     .then(res => {
//             dispatch({
//                 type: GET_CHARACTERS_SUCCESS,
//                 payload: res.data.results
//             })
//         })
//         .catch(err=>{
//             console.log(err)
//             dispatch({
//                 type : GET_CHARACTERS_ERROR,
//                 payload : err.response.message 
//             })
//         })
// }




