import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

let firebaseConfig = {
  apiKey: "AIzaSyCIJJa94N0M5mQuXA0XCi_jhRf7FclzqZA",
  authDomain: "react-redux-authenticator.firebaseapp.com",
  databaseURL: "https://react-redux-authenticator.firebaseio.com",
  projectId: "react-redux-authenticator",
  storageBucket: "react-redux-authenticator.appspot.com",
  messagingSenderId: "227343810132",
  appId: "1:227343810132:web:964291c66a09c6cb27b7c1",
  measurementId: "G-6L9H6K5YLL"
};
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore().collection('favs')

export function getFavs(uid){
  db.doc(uid).get()
  .then(snap=>{
    return snap.data().array
  })
}

export function updateDB(array, uid){
  return db.doc(uid).set({array})
}

export function logginWithGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider)
      .then(snap=> snap.user)
}

export function singOutGoogle(){
  firebase.auth().signOut()
}

