import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './components/home/HomePage'
import FavPage from './components/favs/FavPage'
import LoginPage from './components/login/LoginPage'
import { compose } from 'redux'

function PrivateRoute({path, component, ...rest}){
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
    if(storage && storage.user){
        return <Route path={path} component={component} {...rest}/>
    } 
    else{
        return <Redirect to="/login" {...rest} />
    }
}

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/favs" component={FavPage} />
            <Route path="/login" component={LoginPage} />
        </Switch>
    )
}

//With APOLLO

// export default function Routes() {
//     return (
//         <Switch>
//             <Route exact path="/" component={GraphHome} />
//             <PrivateRoute path="/favs" component={FavPage} />
//             <Route path="/login" component={LoginPage} />
//         </Switch>
//     )
// }