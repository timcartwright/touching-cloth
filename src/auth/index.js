import auth0 from 'auth0-js';
import history from '../history';

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: 'teasea.eu.auth0.com',
        clientID: 'yJPbykkPBe6QJM-Us_k0IBlgwK9lQqpe',
        redirectUri: 'http://localhost:3000/callback',
        audience: 'https://touchingclothapi.com',
        responseType: 'token id_token',
        scope: 'openid profile'
    });

    constructor() {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    }
    
    async handleAuthentication() {
        return new Promise((resolve, reject) => {
            this.auth0.parseHash((err, authResult) => {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
                        localStorage.setItem('user_id', user.sub);
                    });
                    this.setSession(authResult);
                    resolve(authResult);
                } else if (err) {
                    console.log(err);
                    resolve(err);
                }
            });
        });
    }

    setSession(authResult) {
        // Set the time that the access token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        // navigate to the home route
    }

    login() {
        this.auth0.authorize();
    }

    logout() {
        // Clear access token and ID token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // navigate to the home route
        history.replace('/');
    }

    isAuthenticated() {
        // Check whether the current time is past the 
        // access token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}
