import React, {Component} from 'react';
import Section from './Section';
import Button from './Button';
import firebase from 'firebase';

class Login extends Component {

    componentWillMount() {
        this.provider = new firebase.auth.GoogleAuthProvider();
    }

    signInWithGoogle() {
        firebase.auth().signInWithPopup(this.provider).then(result => {
            // const token = result.credential.accessToken;
            // const user = result.user;
        }).catch(error => {
            const {code, message, email, credential} = error;
            console.log(code, message, email, credential);
        });
    }

    render() {
        return (
            <Section>
                <Button onClick={this.signInWithGoogle.bind(this)}>
                    Login
                </Button>
            </Section>
        );
    }
}

export default Login;
