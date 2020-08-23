 import React, {useEffect, useState}  from 'react'
 import Card from '../card/Card'
 import {gql} from 'apollo-boost'
 import {useQuery} from 'react-apollo'

 export default function GraphHome(){
    let[chars, setChars] = useState([])
     //ojo no es ' normal es el q esta al lado del 1 `
    let query =  gql`
        {
            characters{
                results{
                    name
                    image
                }
            }
        }
    `

    let {data, loading, error} = useQuery(query)
    
    //NO ES ALGO Q SE HAGA NORMALMENTE, PORQUE ES PARA LEER DE MANERA DIRECTA DE LA API DE GRAPHQL
    useEffect(()=>{
        if(data && !loading && !error){
            setChars([...data.characters.results])
        }
    }, [data])

    function nextCharacter(){
        chars.shift()
        setChars([...chars])
    }

    if(loading) return <h2>Cargando...</h2>
   
    return (
        <Card
        leftClick={nextCharacter} 
        // rightClick={addFav} 
        {...chars[0]} 
        />
    )
 }