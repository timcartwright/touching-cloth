import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from '../App';
import Callback from '../callback';
import Auth from '../auth';
import history from '../history';
import utils from '../helpers';
import http from '../http';

const auth = new Auth();

const handleAuthentication = async (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        const authResponse = await auth.handleAuthentication();
        const players = await http.getPlayers();
        const currentPlayer = utils.currentPlayer(localStorage.getItem('user_id'), players);
        console.log(currentPlayer);
        history.replace({pathname: '/', state: {currentPlayer, players}});
        
        if (!currentPlayer) {

        }
    }
}

export const makeMainRoutes = () => {
    return (
        <Router history={history} component={App}>
            <div>
                <Route path="/" render={props => <App auth={auth} {...props} />} />
                {/* <Route path="/home" render={(props) => <Home auth={auth} {...props} />} /> */}
                <Route path="/callback" render={props => {
                    handleAuthentication(props);
                    return <Callback {...props} /> 
                }}/>
            </div>
        </Router>
    );
}
