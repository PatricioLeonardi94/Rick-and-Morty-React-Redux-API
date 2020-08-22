import React, { useState, useEffect } from 'react'
import Card from '../card/Card'
import styles from './home.module.css'
import {connect} from 'react-redux'
import {removeCharacterAction, addToFavouriteAction} from '../../redux/charsDuck'

function Home({chars, removeCharacterAction, addToFavouriteAction}) {

    function renderCharacter() {
        let char = chars[0]
        return (
            <Card
            leftClick={nextCharacter} 
            rightClick={addFav} 
            {...char} 
            />
        )
    }

    function addFav(){
        addToFavouriteAction()
    }

    //Podria obviarse y pasarle a leftclick removecharacter, pero genera la posibilidad de devolver mas cosas 
    function nextCharacter(){
        removeCharacterAction()
    }

    return (
        <div className={styles.container}>
            <h2>Personajes de Rick y Morty</h2>
            <div>
                {renderCharacter()}
            </div>
        </div>
    )
}

//del state traido por el reducer, se selecciona solo la parte de los personajes
function mapState(state){
    return {
        chars : state.characters.array
    }
}

//coloca el mapstate y el removeCharacterAction(como una accion) en los props del home
export default connect(mapState, {removeCharacterAction, addToFavouriteAction})(Home)